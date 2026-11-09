// Shared notification + calendar side-effects for every booking path
// (web form, chat agent, MCP tools) so nothing gets lost.
import { CLINIC_ADMIN_EMAILS } from "@/lib/booking-support.server";
import {
  tplBookingConfirm,
  tplBookingCancel,
  tplAdminNewBooking,
  tplBookingReschedule,
  tplAdminChange,
} from "@/lib/email-templates";

type Appt = {
  id: string;
  booking_code: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  service: string | null;
  notes: string | null;
  slot_start: string;
  gcal_event_id?: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = any;

async function queue(supabase: SB, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const { error } = await supabase.from("email_log").insert(rows);
  if (error) console.error("email_log insert failed:", error.message, `rows=${rows.length}`);
}

export async function notifyBookingCreated(supabase: SB, appt: Appt) {
  const rows: Record<string, unknown>[] = [];
  if (appt.patient_email) {
    const t = tplBookingConfirm({ name: appt.patient_name, code: appt.booking_code, slotIso: appt.slot_start, service: appt.service });
    rows.push({
      to_email: appt.patient_email, subject: t.subject, body: `Rezervim ${appt.booking_code}`,
      html: t.html, template: "booking_confirm", related_appointment: appt.id,
    });
  }
  const ta = tplAdminNewBooking({ code: appt.booking_code, name: appt.patient_name, phone: appt.patient_phone, slotIso: appt.slot_start, service: appt.service, notes: appt.notes });
  for (const to of CLINIC_ADMIN_EMAILS) {
    rows.push({
      to_email: to, subject: ta.subject, body: `Rezervim i ri ${appt.booking_code}`,
      html: ta.html, template: "admin_new_booking", related_appointment: appt.id,
    });
  }
  await queue(supabase, rows);
}

export async function notifyBookingCancelled(supabase: SB, appt: Appt, reason: string | null) {
  const rows: Record<string, unknown>[] = [];
  if (appt.patient_email) {
    const t = tplBookingCancel({ name: appt.patient_name, code: appt.booking_code, slotIso: appt.slot_start, reason });
    rows.push({
      to_email: appt.patient_email, subject: t.subject, body: `Anulim ${appt.booking_code}`,
      html: t.html, template: "booking_cancel", related_appointment: appt.id,
    });
  }
  const ta = tplAdminChange({ kind: "cancel", code: appt.booking_code, name: appt.patient_name, phone: appt.patient_phone, slotIso: appt.slot_start, extra: reason });
  for (const to of CLINIC_ADMIN_EMAILS) {
    rows.push({
      to_email: to, subject: ta.subject, body: `Anulim ${appt.booking_code}`,
      html: ta.html, template: "admin_cancel", related_appointment: appt.id,
    });
  }
  await queue(supabase, rows);
}

export async function notifyBookingRescheduled(supabase: SB, oldAppt: Appt, newAppt: Appt) {
  const rows: Record<string, unknown>[] = [];
  if (newAppt.patient_email) {
    const t = tplBookingReschedule({ name: newAppt.patient_name, oldCode: oldAppt.booking_code, newCode: newAppt.booking_code, oldSlotIso: oldAppt.slot_start, newSlotIso: newAppt.slot_start });
    rows.push({
      to_email: newAppt.patient_email, subject: t.subject, body: `Shtyrje ${newAppt.booking_code}`,
      html: t.html, template: "booking_reschedule", related_appointment: newAppt.id,
    });
  }
  const ta = tplAdminChange({ kind: "reschedule", code: newAppt.booking_code, name: newAppt.patient_name, phone: newAppt.patient_phone, slotIso: newAppt.slot_start, extra: `Kodi i vjetër: ${oldAppt.booking_code}` });
  for (const to of CLINIC_ADMIN_EMAILS) {
    rows.push({
      to_email: to, subject: ta.subject, body: `Shtyrje ${newAppt.booking_code}`,
      html: ta.html, template: "admin_reschedule", related_appointment: newAppt.id,
    });
  }
  await queue(supabase, rows);
}

export async function pushCalendarCreate(supabase: SB, appt: Appt) {
  try {
    const cal = await import("@/lib/calendar.server");
    if (!cal.calendarConfigured()) return;
    const eventId = await cal.pushCreateEvent(appt as never);
    await supabase.from("appointments").update({ gcal_event_id: eventId }).eq("id", appt.id);
  } catch (e) {
    console.error("calendar push failed:", e);
  }
}

export async function pushCalendarDelete(supabase: SB, appt: Appt) {
  try {
    const cal = await import("@/lib/calendar.server");
    if (!cal.calendarConfigured()) return;
    const eventId = appt.gcal_event_id ?? (await cal.findEventIdForAppointment(appt.id));
    if (!eventId) return;
    await cal.pushDeleteEvent(eventId);
    await supabase.from("appointments").update({ gcal_event_id: null }).eq("id", appt.id);
  } catch (e) {
    console.error("calendar delete failed:", e);
  }
}

export async function pushCalendarMove(supabase: SB, oldAppt: Appt, newAppt: Appt) {
  try {
    const cal = await import("@/lib/calendar.server");
    if (!cal.calendarConfigured()) return;
    const oldEventId = oldAppt.gcal_event_id ?? (await cal.findEventIdForAppointment(oldAppt.id));
    if (oldEventId) {
      // Move the old event to the new slot and hand it over to the new appointment row.
      await cal.pushUpdateEvent(oldEventId, newAppt as never);
      await supabase.from("appointments").update({ gcal_event_id: null }).eq("id", oldAppt.id);
      await supabase.from("appointments").update({ gcal_event_id: oldEventId }).eq("id", newAppt.id);
    } else {
      await pushCalendarCreate(supabase, newAppt);
    }
  } catch (e) {
    console.error("calendar move failed:", e);
  }
}
