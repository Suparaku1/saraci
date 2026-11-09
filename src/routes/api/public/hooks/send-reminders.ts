// Cron endpoint: enqueues reminder emails 24h and ~2h before appointments.
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { tplReminder } from "@/lib/email-templates";

export const Route = createFileRoute("/api/public/hooks/send-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { assertCronRequest } = await import("@/lib/cron-auth.server");
        const denied = await assertCronRequest(request);
        if (denied) return denied;

        const admin = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
        });

        const now = new Date();
        const in23h = new Date(now.getTime() + 23 * 3600 * 1000);
        const in25h = new Date(now.getTime() + 25 * 3600 * 1000);
        const in90m = new Date(now.getTime() + 90 * 60 * 1000);
        const in150m = new Date(now.getTime() + 150 * 60 * 1000);

        // 24h reminders
        const { data: r24 } = await admin.from("appointments")
          .select("id, booking_code, patient_name, patient_email, slot_start")
          .eq("status", "booked")
          .is("reminder_24h_sent_at", null)
          .not("patient_email", "is", null)
          .gte("slot_start", in23h.toISOString())
          .lte("slot_start", in25h.toISOString());

        // 2h reminders
        const { data: r2 } = await admin.from("appointments")
          .select("id, booking_code, patient_name, patient_email, slot_start")
          .eq("status", "booked")
          .is("reminder_2h_sent_at", null)
          .not("patient_email", "is", null)
          .gte("slot_start", in90m.toISOString())
          .lte("slot_start", in150m.toISOString());

        let queued = 0;
        for (const a of r24 ?? []) {
          if (!a.patient_email) continue;
          const t = tplReminder({ name: a.patient_name, code: a.booking_code, slotIso: a.slot_start, hoursBefore: 24 });
          const { error: queueError } = await admin.from("email_log").insert({
            to_email: a.patient_email, subject: t.subject, body: `Kujtesë 24h · ${a.booking_code}`,
            html: t.html, template: "reminder_24h", related_appointment: a.id,
          });
          if (queueError) {
            console.error("Reminder enqueue failed:", queueError.message);
            continue;
          }
          await admin.from("appointments").update({ reminder_24h_sent_at: new Date().toISOString() }).eq("id", a.id);
          queued++;
        }
        for (const a of r2 ?? []) {
          if (!a.patient_email) continue;
          const t = tplReminder({ name: a.patient_name, code: a.booking_code, slotIso: a.slot_start, hoursBefore: 2 });
          const { error: queueError } = await admin.from("email_log").insert({
            to_email: a.patient_email, subject: t.subject, body: `Kujtesë 2h · ${a.booking_code}`,
            html: t.html, template: "reminder_2h", related_appointment: a.id,
          });
          if (queueError) {
            console.error("Reminder enqueue failed:", queueError.message);
            continue;
          }
          await admin.from("appointments").update({ reminder_2h_sent_at: new Date().toISOString() }).eq("id", a.id);
          queued++;
        }

        return Response.json({ ok: true, queued_24h: r24?.length ?? 0, queued_2h: r2?.length ?? 0, queued });
      },
    },
  },
});
