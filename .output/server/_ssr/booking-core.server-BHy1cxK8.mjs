import { SLOT_MS, isValidClinicSlot, n as normalizeVerification } from "./slots.server-BpzP47ii.mjs";
import { c as isValidPhone, i as SERVICE_RULE, n as NAME_RULE, r as PHONE_RULE, s as isValidEmail, t as EMAIL_RULE } from "./booking-validation-Ch97K_k5.mjs";
// node_modules/.nitro/vite/services/ssr/assets/booking-core.server-BHy1cxK8.js
var SLOT_RULE = "Orari duhet të jetë orë e plotë, Hën–Sht midis 09:00 dhe 19:00.";
async function loadAppointment(sb, bookingCode) {
	const { data, error } = await sb.from("appointments").select("*").eq("booking_code", bookingCode.trim().toUpperCase()).maybeSingle();
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Rezervimi nuk u gjet.");
	return data;
}
function assertOwnership(appt, userId, verify) {
	if (verify) {
		const v = normalizeVerification(verify);
		if (normalizeVerification(appt.patient_phone) !== v && normalizeVerification(appt.patient_email ?? "") !== v) throw new Error("Verifikimi nuk përputhet. Provoni telefonin ose emailin e rezervimit.");
		return;
	}
	if (appt.user_id !== userId) throw new Error("Ky rezervim nuk i përket llogarisë tuaj.");
}
async function assertFreeSlot(sb, slotIso) {
	if (!isValidClinicSlot(slotIso)) throw new Error(SLOT_RULE);
	const start = new Date(slotIso);
	if (start <= /* @__PURE__ */ new Date()) throw new Error("Zgjidhni një orar të ardhshëm.");
	const end = new Date(start.getTime() + SLOT_MS);
	const { data: blocks, error } = await sb.rpc("get_calendar_block_ranges", {
		range_start: start.toISOString(),
		range_end: end.toISOString()
	});
	if (error) throw new Error(error.message);
	if (blocks?.length) throw new Error("Ky orar është bllokuar në kalendarin e klinikës. Zgjidhni një orar tjetër.");
}
async function createBookingCore(sb, userId, input, source) {
	if (input.firstName.trim().length < 2 || input.lastName.trim().length < 2) throw new Error(NAME_RULE);
	if (!isValidPhone(input.patientPhone)) throw new Error(PHONE_RULE);
	if (!isValidEmail(input.patientEmail)) throw new Error(EMAIL_RULE);
	if (input.service.trim().length < 3) throw new Error(SERVICE_RULE);
	await assertFreeSlot(sb, input.slotIso);
	const { data: appt, error } = await sb.from("appointments").insert({
		user_id: userId,
		patient_name: `${input.firstName.trim()} ${input.lastName.trim()}`,
		patient_phone: input.patientPhone.replace(/[\s\-()]/g, ""),
		patient_email: input.patientEmail.trim().toLowerCase(),
		service: input.service.trim(),
		notes: input.notes ?? null,
		slot_start: new Date(input.slotIso).toISOString()
	}).select().single();
	if (error) {
		if (error.code === "23505" || error.code === "23P01") throw new Error("Ky orar është zënë tashmë. Zgjidhni një orar tjetër.");
		throw new Error(error.message);
	}
	await sb.from("appointment_events").insert({
		appointment_id: appt.id,
		user_id: userId,
		event_type: "created",
		payload: { source }
	});
	const notify = await import("./booking-notify.server-L3bNfz_A.mjs");
	await notify.notifyBookingCreated(sb, appt);
	await notify.pushCalendarCreate(sb, appt);
	await sb.from("audit_log").insert({
		user_id: userId,
		action: "booking.created",
		entity: "appointment",
		entity_id: appt.id,
		payload: {
			booking_code: appt.booking_code,
			source
		}
	});
	return appt;
}
async function cancelBookingCore(sb, userId, input, source) {
	const appt = await loadAppointment(sb, input.bookingCode);
	assertOwnership(appt, userId, input.verify);
	if (appt.status !== "booked") throw new Error("Ky rezervim nuk është aktiv.");
	const { error } = await sb.from("appointments").update({
		status: "cancelled",
		cancelled_reason: input.reason ?? source
	}).eq("id", appt.id);
	if (error) throw new Error(error.message);
	await sb.from("appointment_events").insert({
		appointment_id: appt.id,
		user_id: userId,
		event_type: "cancelled",
		payload: {
			reason: input.reason ?? null,
			source
		}
	});
	const notify = await import("./booking-notify.server-L3bNfz_A.mjs");
	await notify.pushCalendarDelete(sb, appt);
	await notify.notifyBookingCancelled(sb, appt, input.reason ?? null);
	await sb.from("audit_log").insert({
		user_id: userId,
		action: "booking.cancelled",
		entity: "appointment",
		entity_id: appt.id,
		payload: {
			booking_code: appt.booking_code,
			source
		}
	});
	return appt;
}
async function rescheduleBookingCore(sb, userId, input, source) {
	const appt = await loadAppointment(sb, input.bookingCode);
	assertOwnership(appt, userId, input.verify);
	if (appt.status !== "booked") throw new Error("Ky rezervim nuk është aktiv.");
	await assertFreeSlot(sb, input.newSlotIso);
	const { data: newAppt, error: ierr } = await sb.from("appointments").insert({
		user_id: appt.user_id,
		patient_name: appt.patient_name,
		patient_phone: appt.patient_phone,
		patient_email: appt.patient_email,
		service: appt.service,
		notes: appt.notes,
		slot_start: new Date(input.newSlotIso).toISOString()
	}).select().single();
	if (ierr) {
		if (ierr.code === "23505" || ierr.code === "23P01") throw new Error("Ky orar sapo u rezervua nga dikush tjetër. Zgjidhni një orar të ri.");
		throw new Error(ierr.message);
	}
	await sb.from("appointments").update({
		status: "rescheduled",
		rescheduled_to: newAppt.id
	}).eq("id", appt.id);
	await sb.from("appointment_events").insert([{
		appointment_id: appt.id,
		user_id: userId,
		event_type: "rescheduled_out",
		payload: {
			to: newAppt.id,
			source
		}
	}, {
		appointment_id: newAppt.id,
		user_id: userId,
		event_type: "rescheduled_in",
		payload: {
			from: appt.id,
			source
		}
	}]);
	const notify = await import("./booking-notify.server-L3bNfz_A.mjs");
	await notify.pushCalendarMove(sb, appt, newAppt);
	await notify.notifyBookingRescheduled(sb, appt, newAppt);
	await sb.from("audit_log").insert({
		user_id: userId,
		action: "booking.rescheduled",
		entity: "appointment",
		entity_id: newAppt.id,
		payload: {
			from_code: appt.booking_code,
			to_code: newAppt.booking_code,
			source
		}
	});
	return {
		oldAppointment: appt,
		newAppointment: newAppt
	};
}
export { cancelBookingCore, createBookingCore, rescheduleBookingCore };
