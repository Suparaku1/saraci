import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> }, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (data !== true) throw new Error("Vetëm administratorët.");
}

// Statusi i lidhjeve Gmail / Google Calendar të klinikës
export const integrationsStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];
    const calKey = process.env["GOOGLE_CALENDAR_API_KEY"];

    async function verify(key?: string) {
      if (!lovableKey || !key) return { configured: false, verified: false, error: "Nuk është lidhur" };
      try {
        const res = await fetch("https://connector-gateway.lovable.dev/api/v1/verify_credentials", {
          method: "POST",
          headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": key },
        });
        const body = await res.text();
        if (!res.ok) return { configured: true, verified: false, error: `${res.status}: ${body.slice(0, 200)}` };
        const json = JSON.parse(body || "{}") as { outcome?: string; error?: string };
        return {
          configured: true,
          verified: json.outcome === "verified" || json.outcome === "skipped",
          error: json.error ?? null,
        };
      } catch (e) {
        return { configured: true, verified: false, error: String((e as Error).message ?? e) };
      }
    }

    const [gmail, calendar] = await Promise.all([verify(gmailKey), verify(calKey)]);
    return { gmail, calendar };
  });

// Provë: dërgon një email test përmes Gmail-it të lidhur
export const sendTestEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ to: z.string().email() }).parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { sendGmail } = await import("@/lib/email.server");
    const html = `<p>Test nga Saraci Dental Clinic — lidhja me Gmail funksionon.</p><p>${new Date().toLocaleString("sq-AL", { timeZone: "Europe/Tirane" })}</p>`;
    const res = await sendGmail(data.to, "Test — lidhja Gmail funksionon", html);
    if (!res.ok) throw new Error(res.error);
    return { ok: true, id: res.id };
  });

// Sinkronizim manual me Google Calendar (push + pull)
export const syncCalendarNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const cal = await import("@/lib/calendar.server");
    if (!cal.calendarConfigured()) throw new Error("Google Calendar nuk është i lidhur.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const now = new Date();
    const from = new Date(now.getTime() - 2 * 3600_000);
    const to = new Date(now.getTime() + 60 * 24 * 3600_000);
    let created = 0, deleted = 0, blocks = 0;

    const { data: toCreate } = await supabaseAdmin.from("appointments")
      .select("id, booking_code, patient_name, patient_phone, patient_email, service, notes, slot_start")
      .eq("status", "booked").is("gcal_event_id", null).gte("slot_start", from.toISOString()).limit(100);
    for (const a of toCreate ?? []) {
      try {
        const eventId = await cal.pushCreateEvent(a as never);
        await supabaseAdmin.from("appointments").update({ gcal_event_id: eventId } as never).eq("id", a.id);
        created++;
      } catch { /* raporton më vonë */ }
    }

    const { data: toDelete } = await supabaseAdmin.from("appointments")
      .select("id, gcal_event_id").not("gcal_event_id", "is", null)
      .in("status", ["cancelled", "rescheduled"]).gte("slot_start", from.toISOString()).limit(100);
    for (const a of toDelete ?? []) {
      if (!a.gcal_event_id) continue;
      try {
        await cal.pushDeleteEvent(a.gcal_event_id);
        await supabaseAdmin.from("appointments").update({ gcal_event_id: null } as never).eq("id", a.id);
        deleted++;
      } catch { /* raporton më vonë */ }
    }

    const events = await cal.listEvents(from.toISOString(), to.toISOString());
    for (const ev of events) {
      if (ev.extendedProperties?.private?.saraci_appointment_id) continue;
      const startIso = ev.start?.dateTime ?? (ev.start?.date ? `${ev.start.date}T00:00:00Z` : null);
      const endIso = ev.end?.dateTime ?? (ev.end?.date ? `${ev.end.date}T23:59:59Z` : null);
      if (ev.status === "cancelled" || !startIso || !endIso) {
        await supabaseAdmin.from("calendar_blocks").delete().eq("gcal_event_id", ev.id);
        continue;
      }
      await supabaseAdmin.from("calendar_blocks").upsert({
        gcal_event_id: ev.id, summary: ev.summary ?? null,
        start_ts: new Date(startIso).toISOString(), end_ts: new Date(endIso).toISOString(),
        updated_at: new Date().toISOString(),
      } as never, { onConflict: "gcal_event_id" });
      blocks++;
    }
    return { created, deleted, blocks };
  });
