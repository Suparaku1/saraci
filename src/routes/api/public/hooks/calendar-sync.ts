// Cron endpoint: 2-way Google Calendar sync.
// PUSH: appointments without a gcal event -> create; cancelled ones -> delete event.
// PULL: external Google Calendar events (not created by this app) -> calendar_blocks,
//       so those hours disappear from online availability.
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/api/public/hooks/calendar-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { assertCronRequest } = await import("@/lib/cron-auth.server");
        const denied = assertCronRequest(request);
        if (denied) return denied;

        const cal = await import("@/lib/calendar.server");
        if (!cal.calendarConfigured()) {
          return Response.json({ ok: false, reason: "google_calendar_not_configured" }, { status: 200 });
        }

        const admin = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
        });

        const log = async (direction: string, action: string, ok: boolean, opts: { appointment_id?: string; gcal_event_id?: string; error?: string } = {}) => {
          await admin.from("calendar_sync_log").insert({
            direction, action, ok,
            appointment_id: opts.appointment_id ?? null,
            gcal_event_id: opts.gcal_event_id ?? null,
            error: opts.error ?? null,
          } as never);
        };

        const now = new Date();
        const from = new Date(now.getTime() - 2 * 3600 * 1000);
        const to = new Date(now.getTime() + 60 * 24 * 3600 * 1000);

        let created = 0, deleted = 0, blocks = 0, unblocked = 0;

        // ---- PUSH: booked appointments missing a calendar event
        const { data: toCreate } = await admin.from("appointments")
          .select("id, booking_code, patient_name, patient_phone, patient_email, service, notes, slot_start")
          .eq("status", "booked")
          .is("gcal_event_id", null)
          .gte("slot_start", from.toISOString())
          .limit(100);
        for (const a of toCreate ?? []) {
          try {
            const eventId = await cal.pushCreateEvent(a as never);
            await admin.from("appointments").update({ gcal_event_id: eventId } as never).eq("id", a.id);
            await log("push", "create_event", true, { appointment_id: a.id, gcal_event_id: eventId });
            created++;
          } catch (e: unknown) {
            await log("push", "create_event", false, { appointment_id: a.id, error: String((e as Error).message ?? e) });
          }
        }

        // ---- PUSH: cancelled/rescheduled appointments that still hold an event
        const { data: toDelete } = await admin.from("appointments")
          .select("id, gcal_event_id")
          .not("gcal_event_id", "is", null)
          .in("status", ["cancelled", "rescheduled"])
          .gte("slot_start", from.toISOString())
          .limit(100);
        for (const a of toDelete ?? []) {
          if (!a.gcal_event_id) continue;
          try {
            await cal.pushDeleteEvent(a.gcal_event_id);
            await admin.from("appointments").update({ gcal_event_id: null } as never).eq("id", a.id);
            await log("push", "delete_event", true, { appointment_id: a.id, gcal_event_id: a.gcal_event_id });
            deleted++;
          } catch (e: unknown) {
            await log("push", "delete_event", false, { appointment_id: a.id, gcal_event_id: a.gcal_event_id, error: String((e as Error).message ?? e) });
          }
        }

        // ---- PULL: external events become availability blocks
        try {
          const events = await cal.listEvents(from.toISOString(), to.toISOString());
          const keep = new Set<string>();
          for (const ev of events) {
            const ourApptId = ev.extendedProperties?.private?.saraci_appointment_id;
            if (ourApptId) {
              // Reconcile our own events: remove events of cancelled/rescheduled
              // appointments and fix events whose time drifted from the DB.
              if (ev.status === "cancelled") continue;
              const { data: appt } = await admin.from("appointments")
                .select("id, booking_code, patient_name, patient_phone, patient_email, service, notes, slot_start, status, gcal_event_id")
                .eq("id", ourApptId)
                .maybeSingle();
              try {
                if (!appt || appt.status !== "booked") {
                  await cal.pushDeleteEvent(ev.id);
                  if (appt) await admin.from("appointments").update({ gcal_event_id: null } as never).eq("id", appt.id);
                  await log("reconcile", "delete_event", true, { appointment_id: appt?.id, gcal_event_id: ev.id });
                  deleted++;
                } else {
                  const evStart = ev.start?.dateTime ? new Date(ev.start.dateTime).getTime() : null;
                  const dbStart = new Date(appt.slot_start).getTime();
                  if (evStart !== dbStart) {
                    await cal.pushUpdateEvent(ev.id, appt as never);
                    await log("reconcile", "update_event", true, { appointment_id: appt.id, gcal_event_id: ev.id });
                  }
                  if (appt.gcal_event_id !== ev.id) {
                    await admin.from("appointments").update({ gcal_event_id: ev.id } as never).eq("id", appt.id);
                  }
                }
              } catch (e: unknown) {
                await log("reconcile", "fix_event", false, { appointment_id: ourApptId, gcal_event_id: ev.id, error: String((e as Error).message ?? e) });
              }
              continue;
            }
            const startIso = ev.start?.dateTime ?? (ev.start?.date ? `${ev.start.date}T00:00:00Z` : null);
            const endIso = ev.end?.dateTime ?? (ev.end?.date ? `${ev.end.date}T23:59:59Z` : null);
            if (ev.status === "cancelled" || !startIso || !endIso) {
              await admin.from("calendar_blocks").delete().eq("gcal_event_id", ev.id);
              continue;
            }
            keep.add(ev.id);
            await admin.from("calendar_blocks").upsert({
              gcal_event_id: ev.id,
              summary: ev.summary ?? null,
              start_ts: new Date(startIso).toISOString(),
              end_ts: new Date(endIso).toISOString(),
              updated_at: new Date().toISOString(),
            } as never, { onConflict: "gcal_event_id" });
            blocks++;
          }
          // Drop stale blocks in the window that no longer exist in Google
          const { data: existing } = await admin.from("calendar_blocks")
            .select("id, gcal_event_id")
            .gte("start_ts", from.toISOString())
            .lte("start_ts", to.toISOString());
          for (const b of existing ?? []) {
            if (!keep.has(b.gcal_event_id)) {
              await admin.from("calendar_blocks").delete().eq("id", b.id);
              unblocked++;
            }
          }
          await log("pull", "sync_blocks", true);
        } catch (e: unknown) {
          await log("pull", "sync_blocks", false, { error: String((e as Error).message ?? e) });
        }

        return Response.json({ ok: true, created, deleted, blocks, unblocked });
      },
    },
  },
});
