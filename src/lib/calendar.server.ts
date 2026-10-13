const GATEWAY = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";
const TZ = "Europe/Tirane";
const CAL_ID = "primary";

function headers() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const connKey = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!lovableKey || !connKey) return null;
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": connKey,
    "Content-Type": "application/json",
  };
}

export function calendarConfigured() {
  return headers() !== null;
}

async function gcal(path: string, init?: RequestInit) {
  const h = headers();
  if (!h) throw new Error("Google Calendar nuk është i konfiguruar.");
  const res = await fetch(`${GATEWAY}${path}`, { ...init, headers: { ...h, ...(init?.headers ?? {}) } });
  const text = await res.text();
  if (!res.ok) throw new Error(`Google Calendar ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

export type ApptForCalendar = {
  id: string;
  booking_code: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  service: string | null;
  notes: string | null;
  slot_start: string;
};

function eventBody(a: ApptForCalendar) {
  const start = new Date(a.slot_start);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return {
    summary: `${a.service ?? "Termin"} — ${a.patient_name} (${a.booking_code})`,
    description: [
      `Pacient: ${a.patient_name}`,
      `Telefon: ${a.patient_phone}`,
      a.patient_email ? `Email: ${a.patient_email}` : null,
      a.service ? `Shërbim: ${a.service}` : null,
      a.notes ? `Shënime: ${a.notes}` : null,
      `Kod: ${a.booking_code}`,
    ].filter(Boolean).join("\n"),
    start: { dateTime: start.toISOString(), timeZone: TZ },
    end: { dateTime: end.toISOString(), timeZone: TZ },
    extendedProperties: { private: { saraci_appointment_id: a.id, saraci_code: a.booking_code } },
  };
}

export async function pushCreateEvent(a: ApptForCalendar): Promise<string> {
  const ev = await gcal(`/calendars/${encodeURIComponent(CAL_ID)}/events`, {
    method: "POST",
    body: JSON.stringify(eventBody(a)),
  });
  return ev.id as string;
}

export async function pushUpdateEvent(eventId: string, a: ApptForCalendar) {
  await gcal(`/calendars/${encodeURIComponent(CAL_ID)}/events/${encodeURIComponent(eventId)}`, {
    method: "PATCH",
    body: JSON.stringify(eventBody(a)),
  });
}

export async function pushDeleteEvent(eventId: string) {
  try {
    await gcal(`/calendars/${encodeURIComponent(CAL_ID)}/events/${encodeURIComponent(eventId)}`, {
      method: "DELETE",
    });
  } catch (e) {
    // 404/410 = already gone in Google; treat as success
    const msg = String((e as Error).message ?? e);
    if (!/ 404| 410/.test(msg)) throw e;
  }
}

// Find the calendar event we created for an appointment, even if the DB lost the id.
export async function findEventIdForAppointment(appointmentId: string): Promise<string | null> {
  const params = new URLSearchParams({
    privateExtendedProperty: `saraci_appointment_id=${appointmentId}`,
    singleEvents: "true",
    maxResults: "5",
  });
  const data = await gcal(`/calendars/${encodeURIComponent(CAL_ID)}/events?${params}`);
  const items = (data?.items ?? []) as { id: string; status?: string }[];
  const live = items.find((i) => i.status !== "cancelled") ?? items[0];
  return live?.id ?? null;
}

export type GcalEvent = {
  id: string;
  status?: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  extendedProperties?: { private?: Record<string, string> };
};

export async function listEvents(fromIso: string, toIso: string): Promise<GcalEvent[]> {
  const params = new URLSearchParams({
    timeMin: fromIso,
    timeMax: toIso,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
    showDeleted: "true",
  });
  const data = await gcal(`/calendars/${encodeURIComponent(CAL_ID)}/events?${params}`);
  return (data?.items ?? []) as GcalEvent[];
}
