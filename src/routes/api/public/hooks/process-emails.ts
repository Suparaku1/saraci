// Cron endpoint: drains queued emails from email_log and sends via Gmail.
// Called by pg_cron every minute. Auth: Supabase publishable apikey header.
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { sendGmail } from "@/lib/email.server";

export const Route = createFileRoute("/api/public/hooks/process-emails")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { assertCronRequest } = await import("@/lib/cron-auth.server");
        const denied = await assertCronRequest(request);
        if (denied) return denied;

        const url = process.env.SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const admin = createClient<Database>(url, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
        });

        const { data: queued, error } = await admin
          .from("email_log")
          .select("id, to_email, subject, body, html, attempts, template, related_appointment")
          .eq("status", "queued")
          .lt("attempts", 5)
          .order("created_at", { ascending: true })
          .limit(20);
        if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

        const results: any[] = [];
        for (const row of queued ?? []) {
          const html = row.html && row.html.trim().length > 0
            ? row.html
            : `<pre style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap">${row.body}</pre>`;
          let invite: { content: string; method: "REQUEST" | "CANCEL" } | undefined;
          if (row.related_appointment && ["booking_confirm", "booking_cancel", "booking_reschedule"].includes(row.template ?? "")) {
            const { data: appointment } = await admin.from("appointments")
              .select("booking_code, patient_name, patient_email, service, notes, slot_start")
              .eq("id", row.related_appointment)
              .maybeSingle();
            if (appointment) {
              const method = row.template === "booking_cancel" ? "CANCEL" : "REQUEST";
              // Walk back the reschedule chain so every email about the same visit
              // reuses one iCalendar UID — the patient's calendar then moves/removes
              // the existing event instead of piling up duplicates.
              let currentId: string = row.related_appointment;
              let rootCode = appointment.booking_code;
              let sequence = 0;
              for (let hop = 0; hop < 10; hop++) {
                const { data: event } = await admin.from("appointment_events")
                  .select("payload")
                  .eq("appointment_id", currentId)
                  .eq("event_type", "rescheduled_in")
                  .maybeSingle();
                const payload = event?.payload;
                const sourceId = payload && typeof payload === "object" && !Array.isArray(payload) && typeof (payload as Record<string, unknown>)["from"] === "string"
                  ? String((payload as Record<string, unknown>)["from"])
                  : undefined;
                if (!sourceId) break;
                const { data: source } = await admin.from("appointments").select("id, booking_code").eq("id", sourceId).maybeSingle();
                if (!source) break;
                rootCode = source.booking_code;
                currentId = source.id;
                sequence++;
              }
              if (row.template === "booking_cancel") sequence++;
              const { buildCalendarInvite } = await import("@/lib/calendar-invite.server");
              invite = { content: buildCalendarInvite(appointment, method, rootCode, sequence), method };
            }
          }
          const r = await sendGmail(row.to_email, row.subject, html, invite);
          if (r.ok) {
            await admin.from("email_log").update({
              status: "sent", sent_at: new Date().toISOString(), error: null,
              attempts: (row.attempts ?? 0) + 1,
            }).eq("id", row.id);
            results.push({ id: row.id, ok: true });
          } else {
            const nextAttempts = (row.attempts ?? 0) + 1;
            await admin.from("email_log").update({
              status: nextAttempts >= 5 ? "failed" : "queued",
              error: r.error, attempts: nextAttempts,
            }).eq("id", row.id);
            results.push({ id: row.id, ok: false, error: r.error });
          }
        }
        return Response.json({ ok: true, processed: results.length, results });
      },
    },
  },
});
