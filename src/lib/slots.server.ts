// Single source of truth for clinic slot / timezone logic.
// Used by the web booking form, the chat agent and the MCP tools.
import { BOOKING_TIME_ZONE, zonedTimeToUtc } from "@/lib/booking-support.server";

export const SLOT_MINUTES = 60;
export const SLOT_MS = SLOT_MINUTES * 60 * 1000;
export const FIRST_HOUR = 9;
export const LAST_HOUR = 18; // last slot starts 18:00, ends 19:00

export type Slot = { iso: string; label: string; taken: boolean };
export type BlockRange = { start_ts: string; end_ts: string };

function localParts(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { y: get("year"), mo: get("month"), d: get("day") };
}

export function isSunday(d: Date) {
  return d.toLocaleString("en-US", { timeZone: BOOKING_TIME_ZONE, weekday: "short" }) === "Sun";
}

export function localHour(d: Date) {
  return Number(
    new Intl.DateTimeFormat("en-CA", { timeZone: BOOKING_TIME_ZONE, hour: "2-digit", hour12: false }).format(d),
  );
}

/** Whole-hour, inside Mon-Sat 09:00-19:00 Europe/Tirane. */
export function isValidClinicSlot(iso: string): boolean {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  if (d.getUTCMinutes() !== 0 || d.getUTCSeconds() !== 0 || d.getUTCMilliseconds() !== 0) return false;
  if (isSunday(d)) return false;
  const h = localHour(d);
  return h >= FIRST_HOUR && h <= LAST_HOUR;
}

/** Enumerate every clinic slot between two instants (inclusive). */
export function enumerateSlots(opts: {
  from: Date | string;
  to: Date | string;
  minHour?: number;
  bookedIsos?: Iterable<string>;
  blocks?: BlockRange[];
}): Slot[] {
  const start = new Date(opts.from);
  const end = new Date(opts.to);
  const booked = new Set(Array.from(opts.bookedIsos ?? []).map((s) => new Date(s).toISOString()));
  const ranges = (opts.blocks ?? []).map(
    (b) => [new Date(b.start_ts).getTime(), new Date(b.end_ts).getTime()] as const,
  );
  const blockedAt = (t: number) => ranges.some(([s, e]) => t < e && t + SLOT_MS > s);

  const out: Slot[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    const { y, mo, d } = localParts(cur);
    for (let h = Math.max(opts.minHour ?? FIRST_HOUR, FIRST_HOUR); h <= LAST_HOUR; h++) {
      const utcDate = zonedTimeToUtc(`${y}-${mo}-${d}T${String(h).padStart(2, "0")}:00:00`, BOOKING_TIME_ZONE);
      if (utcDate < start || utcDate > end) continue;
      if (isSunday(utcDate)) continue;
      const iso = utcDate.toISOString();
      out.push({
        iso,
        label: `${d}/${mo} ${String(h).padStart(2, "0")}:00`,
        taken: booked.has(iso) || blockedAt(utcDate.getTime()),
      });
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

/** Read booked slots + external calendar blocks and return the slot grid. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadSlots(supabase: any, from: Date | string, to: Date | string, minHour?: number) {
  const start = new Date(from);
  const end = new Date(to);
  const { data: booked, error } = await supabase
    .from("appointments")
    .select("slot_start")
    .eq("status", "booked")
    .gte("slot_start", start.toISOString())
    .lte("slot_start", end.toISOString());
  if (error) throw new Error(error.message);
  const { data: blocks, error: blockError } = await supabase.rpc("get_calendar_block_ranges", {
    range_start: start.toISOString(),
    range_end: end.toISOString(),
  });
  if (blockError) throw new Error(blockError.message);
  return enumerateSlots({
    from: start,
    to: end,
    minHour,
    bookedIsos: (booked ?? []).map((b: { slot_start: string }) => b.slot_start),
    blocks: blocks ?? [],
  });
}

export function formatSlotLocal(iso: string) {
  return new Date(iso).toLocaleString("sq-AL", {
    timeZone: BOOKING_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  });
}
