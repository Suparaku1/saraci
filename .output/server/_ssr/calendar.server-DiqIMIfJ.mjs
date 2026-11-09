import processModule from "node:process";
// node_modules/.nitro/vite/services/ssr/assets/calendar.server-DiqIMIfJ.js
var GATEWAY = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";
var TZ = "Europe/Tirane";
var CAL_ID = "primary";
function headers() {
	const lovableKey = processModule.env.LOVABLE_API_KEY;
	const connKey = processModule.env.GOOGLE_CALENDAR_API_KEY;
	if (!lovableKey || !connKey) return null;
	return {
		Authorization: `Bearer ${lovableKey}`,
		"X-Connection-Api-Key": connKey,
		"Content-Type": "application/json"
	};
}
function calendarConfigured() {
	return headers() !== null;
}
async function gcal(path, init) {
	const h = headers();
	if (!h) throw new Error("Google Calendar nuk është i konfiguruar.");
	const res = await fetch(`${GATEWAY}${path}`, {
		...init,
		headers: {
			...h,
			...init?.headers ?? {}
		}
	});
	const text = await res.text();
	if (!res.ok) throw new Error(`Google Calendar ${res.status}: ${text.slice(0, 400)}`);
	return text ? JSON.parse(text) : null;
}
function eventBody(a) {
	const start = new Date(a.slot_start);
	const end = new Date(start.getTime() + 36e5);
	return {
		summary: `${a.service ?? "Termin"} — ${a.patient_name} (${a.booking_code})`,
		description: [
			`Pacient: ${a.patient_name}`,
			`Telefon: ${a.patient_phone}`,
			a.patient_email ? `Email: ${a.patient_email}` : null,
			a.service ? `Shërbim: ${a.service}` : null,
			a.notes ? `Shënime: ${a.notes}` : null,
			`Kod: ${a.booking_code}`
		].filter(Boolean).join("\n"),
		start: {
			dateTime: start.toISOString(),
			timeZone: TZ
		},
		end: {
			dateTime: end.toISOString(),
			timeZone: TZ
		},
		extendedProperties: { private: {
			saraci_appointment_id: a.id,
			saraci_code: a.booking_code
		} }
	};
}
async function pushCreateEvent(a) {
	return (await gcal(`/calendars/${encodeURIComponent(CAL_ID)}/events`, {
		method: "POST",
		body: JSON.stringify(eventBody(a))
	})).id;
}
async function pushUpdateEvent(eventId, a) {
	await gcal(`/calendars/${encodeURIComponent(CAL_ID)}/events/${encodeURIComponent(eventId)}`, {
		method: "PATCH",
		body: JSON.stringify(eventBody(a))
	});
}
async function pushDeleteEvent(eventId) {
	try {
		await gcal(`/calendars/${encodeURIComponent(CAL_ID)}/events/${encodeURIComponent(eventId)}`, { method: "DELETE" });
	} catch (e) {
		const msg = String(e.message ?? e);
		if (!/ 404| 410/.test(msg)) throw e;
	}
}
async function findEventIdForAppointment(appointmentId) {
	const params = new URLSearchParams({
		privateExtendedProperty: `saraci_appointment_id=${appointmentId}`,
		singleEvents: "true",
		maxResults: "5"
	});
	const items = (await gcal(`/calendars/${encodeURIComponent(CAL_ID)}/events?${params}`))?.items ?? [];
	return (items.find((i) => i.status !== "cancelled") ?? items[0])?.id ?? null;
}
async function listEvents(fromIso, toIso) {
	const params = new URLSearchParams({
		timeMin: fromIso,
		timeMax: toIso,
		singleEvents: "true",
		orderBy: "startTime",
		maxResults: "250",
		showDeleted: "true"
	});
	return (await gcal(`/calendars/${encodeURIComponent(CAL_ID)}/events?${params}`))?.items ?? [];
}
export { calendarConfigured, findEventIdForAppointment, listEvents, pushCreateEvent, pushDeleteEvent, pushUpdateEvent };
