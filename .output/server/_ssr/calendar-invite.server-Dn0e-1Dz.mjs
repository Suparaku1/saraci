// node_modules/.nitro/vite/services/ssr/assets/calendar-invite.server-Dn0e-1Dz.js
var escapeIcs = (value) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
var utc = (value) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
function buildCalendarInvite(appointment, method, inviteUid, sequence = 0) {
	const start = new Date(appointment.slot_start);
	const end = new Date(start.getTime() + 36e5);
	const status = method === "CANCEL" ? "CANCELLED" : "CONFIRMED";
	const description = [
		`Kodi i rezervimit: ${appointment.booking_code}`,
		appointment.service ? `Shërbimi: ${appointment.service}` : null,
		appointment.notes ? `Shënime: ${appointment.notes}` : null,
		"Telefon/WhatsApp: +355 67 540 2044"
	].filter(Boolean).join("\n");
	return [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Saraci Dental Clinic//Termine//SQ",
		`METHOD:${method}`,
		"BEGIN:VEVENT",
		`UID:${inviteUid ?? appointment.booking_code}@saraciclinic.lovable.app`,
		`DTSTAMP:${utc(/* @__PURE__ */ new Date())}`,
		`DTSTART:${utc(start)}`,
		`DTEND:${utc(end)}`,
		`SUMMARY:${escapeIcs(`Termin — Saraci Dental Clinic${appointment.service ? ` (${appointment.service})` : ""}`)}`,
		`DESCRIPTION:${escapeIcs(description)}`,
		"LOCATION:Rruga Ptoleme Xhuvani, Elbasan 3001",
		"ORGANIZER;CN=Saraci Dental Clinic:mailto:orarishpe@gmail.com",
		appointment.patient_email ? `ATTENDEE;CN=${escapeIcs(appointment.patient_name)};RSVP=TRUE:mailto:${appointment.patient_email}` : null,
		`STATUS:${status}`,
		`SEQUENCE:${sequence}`,
		"END:VEVENT",
		"END:VCALENDAR"
	].filter(Boolean).join("\r\n");
}
export { buildCalendarInvite };
