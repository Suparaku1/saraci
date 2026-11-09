// Single implementation of booking create / cancel / reschedule.
// Every channel (web form, chat agent, MCP tools) goes through here so that
// validation, events, audit log, email and Google Calendar stay identical.
import { normalizeVerification } from "@/lib/booking-support.server";
import { isValidClinicSlot, SLOT_MS } from "@/lib/slots.server";
import {
  isValidEmail,
  isValidPhone,
  EMAIL_RULE,
  PHONE_RULE,
  SERVICE_RULE,
  NAME_RULE,
} from "@/lib/booking-validation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = any;
export type BookingSource = "web" | "chat" | "mcp" | "voice";

const SLOT_RULE = "Orari duhet të jetë orë e plotë, Hën–Sht midis 09:00 dhe 19:00.";

export type CreateInput = {
  slotIso: string;
  firstName: string;
  lastName: string;
  patientPhone: string;
  patientEmail: string;
  service: string;
  notes?: string | null;
};

async function loadAppointment(sb: SB, bookingCode: string) {
  const { data, error } = await sb
    .from("appointments")
    .select("*")
    .eq("booking_code", bookingCode.trim().toUpperCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Rezervimi nuk u gjet.");
  return data;
}

function assertOwnership(appt: { user_id: string; patient_phone: string; patient_email: string | null }, userId: string, verify?: string | null) {
  if (verify) {
    const v = normalizeVerification(verify);
    if (normalizeVerification(appt.patient_phone) !== v && normalizeVerification(appt.patient_email ?? "") !== v) {
      throw new Error("Verifikimi nuk përputhet. Provoni telefonin ose emailin e rezervimit.");
    }
    return;
  }
  if (appt.user_id !== userId) throw new Error("Ky rezervim nuk i përket llogarisë tuaj.");
}

async function assertFreeSlot(sb: SB, slotIso: string) {
  if (!isValidClinicSlot(slotIso)) throw new Error(SLOT_RULE);
  const start = new Date(slotIso);
  if (start <= new Date()) throw new Error("Zgjidhni një orar të ardhshëm.");
  const end = new Date(start.getTime() + SLOT_MS);
  const { data: blocks, error } = await sb.rpc("get_calendar_block_ranges", {
    range_start: start.toISOString(),
    range_end: end.toISOString(),
  });
  if (error) throw new Error(error.message);
  if (blocks?.length) throw new Error("Ky orar është bllokuar në kalendarin e klinikës. Zgjidhni një orar tjetër.");
}

export async function createBookingCore(sb: SB, userId: string, input: CreateInput, source: BookingSource) {
  if (input.firstName.trim().length < 2 || input.lastName.trim().length < 2) throw new Error(NAME_RULE);
  if (!isValidPhone(input.patientPhone)) throw new Error(PHONE_RULE);
  if (!isValidEmail(input.patientEmail)) throw new Error(EMAIL_RULE);
  if (input.service.trim().length < 3) throw new Error(SERVICE_RULE);
  await assertFreeSlot(sb, input.slotIso);

  const { data: appt, error } = await sb
    .from("appointments")
    .insert({
      user_id: userId,
      patient_name: `${input.firstName.trim()} ${input.lastName.trim()}`,
      patient_phone: input.patientPhone.replace(/[\s\-()]/g, ""),
      patient_email: input.patientEmail.trim().toLowerCase(),
      service: input.service.trim(),
      notes: input.notes ?? null,
      slot_start: new Date(input.slotIso).toISOString(),
    })
    .select()
    .single();
  if (error) {
    if (error.code === "23505" || error.code === "23P01")
      throw new Error("Ky orar është zënë tashmë. Zgjidhni një orar tjetër.");
    throw new Error(error.message);
  }

  await sb.from("appointment_events").insert({
    appointment_id: appt.id,
    user_id: userId,
    event_type: "created",
    payload: { source },
  });

  const notify = await import("@/lib/booking-notify.server");
  await notify.notifyBookingCreated(sb, appt as never);
  await notify.pushCalendarCreate(sb, appt as never);

  await sb.from("audit_log").insert({
    user_id: userId,
    action: "booking.created",
    entity: "appointment",
    entity_id: appt.id,
    payload: { booking_code: appt.booking_code, source },
  });
  return appt;
}

export async function cancelBookingCore(
  sb: SB,
  userId: string,
  input: { bookingCode: string; verify?: string | null; reason?: string | null },
  source: BookingSource,
) {
  const appt = await loadAppointment(sb, input.bookingCode);
  assertOwnership(appt, userId, input.verify);
  if (appt.status !== "booked") throw new Error("Ky rezervim nuk është aktiv.");

  const { error } = await sb
    .from("appointments")
    .update({ status: "cancelled", cancelled_reason: input.reason ?? source })
    .eq("id", appt.id);
  if (error) throw new Error(error.message);

  await sb.from("appointment_events").insert({
    appointment_id: appt.id,
    user_id: userId,
    event_type: "cancelled",
    payload: { reason: input.reason ?? null, source },
  });

  const notify = await import("@/lib/booking-notify.server");
  await notify.pushCalendarDelete(sb, appt as never);
  await notify.notifyBookingCancelled(sb, appt as never, input.reason ?? null);

  await sb.from("audit_log").insert({
    user_id: userId,
    action: "booking.cancelled",
    entity: "appointment",
    entity_id: appt.id,
    payload: { booking_code: appt.booking_code, source },
  });
  return appt;
}

export async function rescheduleBookingCore(
  sb: SB,
  userId: string,
  input: { bookingCode: string; verify?: string | null; newSlotIso: string },
  source: BookingSource,
) {
  const appt = await loadAppointment(sb, input.bookingCode);
  assertOwnership(appt, userId, input.verify);
  if (appt.status !== "booked") throw new Error("Ky rezervim nuk është aktiv.");
  await assertFreeSlot(sb, input.newSlotIso);

  const { data: newAppt, error: ierr } = await sb
    .from("appointments")
    .insert({
      user_id: appt.user_id,
      patient_name: appt.patient_name,
      patient_phone: appt.patient_phone,
      patient_email: appt.patient_email,
      service: appt.service,
      notes: appt.notes,
      slot_start: new Date(input.newSlotIso).toISOString(),
    })
    .select()
    .single();
  if (ierr) {
    if (ierr.code === "23505" || ierr.code === "23P01")
      throw new Error("Ky orar sapo u rezervua nga dikush tjetër. Zgjidhni një orar të ri.");
    throw new Error(ierr.message);
  }

  await sb.from("appointments").update({ status: "rescheduled", rescheduled_to: newAppt.id }).eq("id", appt.id);
  await sb.from("appointment_events").insert([
    { appointment_id: appt.id, user_id: userId, event_type: "rescheduled_out", payload: { to: newAppt.id, source } },
    { appointment_id: newAppt.id, user_id: userId, event_type: "rescheduled_in", payload: { from: appt.id, source } },
  ]);

  const notify = await import("@/lib/booking-notify.server");
  await notify.pushCalendarMove(sb, appt as never, newAppt as never);
  await notify.notifyBookingRescheduled(sb, appt as never, newAppt as never);

  await sb.from("audit_log").insert({
    user_id: userId,
    action: "booking.rescheduled",
    entity: "appointment",
    entity_id: newAppt.id,
    payload: { from_code: appt.booking_code, to_code: newAppt.booking_code, source },
  });
  return { oldAppointment: appt, newAppointment: newAppt };
}
