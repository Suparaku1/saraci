// node_modules/.nitro/vite/services/ssr/assets/slots.server-BpzP47ii.js
var BOOKING_TIME_ZONE = "Europe/Tirane";
var CLINIC_ADMIN_EMAILS = ["orarishpe@gmail.com"];
function zonedTimeToUtc(localIso, timeZone) {
	const date = /* @__PURE__ */ new Date(`${localIso}Z`);
	const asLocal = new Date(date.toLocaleString("en-US", { timeZone }));
	return new Date(date.getTime() + date.getTime() - asLocal.getTime());
}
function normalizeVerification(value) {
	return value.trim().toLowerCase().replace(/\s/g, "");
}
var SLOT_MS = 36e5;
function localParts(d) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: BOOKING_TIME_ZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(d);
	const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
	return {
		y: get("year"),
		mo: get("month"),
		d: get("day")
	};
}
function isSunday(d) {
	return d.toLocaleString("en-US", {
		timeZone: BOOKING_TIME_ZONE,
		weekday: "short"
	}) === "Sun";
}
function localHour(d) {
	return Number(new Intl.DateTimeFormat("en-CA", {
		timeZone: BOOKING_TIME_ZONE,
		hour: "2-digit",
		hour12: false
	}).format(d));
}
/** Whole-hour, inside Mon-Sat 09:00-19:00 Europe/Tirane. */
function isValidClinicSlot(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return false;
	if (d.getUTCMinutes() !== 0 || d.getUTCSeconds() !== 0 || d.getUTCMilliseconds() !== 0) return false;
	if (isSunday(d)) return false;
	const h = localHour(d);
	return h >= 9 && h <= 18;
}
/** Enumerate every clinic slot between two instants (inclusive). */
function enumerateSlots(opts) {
	const start = new Date(opts.from);
	const end = new Date(opts.to);
	const booked = new Set(Array.from(opts.bookedIsos ?? []).map((s) => new Date(s).toISOString()));
	const ranges = (opts.blocks ?? []).map((b) => [new Date(b.start_ts).getTime(), new Date(b.end_ts).getTime()]);
	const blockedAt = (t) => ranges.some(([s, e]) => t < e && t + 36e5 > s);
	const out = [];
	const cur = new Date(start);
	while (cur <= end) {
		const { y, mo, d } = localParts(cur);
		for (let h = Math.max(opts.minHour ?? 9, 9); h <= 18; h++) {
			const utcDate = zonedTimeToUtc(`${y}-${mo}-${d}T${String(h).padStart(2, "0")}:00:00`, BOOKING_TIME_ZONE);
			if (utcDate < start || utcDate > end) continue;
			if (isSunday(utcDate)) continue;
			const iso = utcDate.toISOString();
			out.push({
				iso,
				label: `${d}/${mo} ${String(h).padStart(2, "0")}:00`,
				taken: booked.has(iso) || blockedAt(utcDate.getTime())
			});
		}
		cur.setUTCDate(cur.getUTCDate() + 1);
	}
	return out;
}
/** Read booked slots + external calendar blocks and return the slot grid. */
async function loadSlots(supabase, from, to, minHour) {
	const start = new Date(from);
	const end = new Date(to);
	const { data: booked, error } = await supabase.from("appointments").select("slot_start").eq("status", "booked").gte("slot_start", start.toISOString()).lte("slot_start", end.toISOString());
	if (error) throw new Error(error.message);
	const { data: blocks, error: blockError } = await supabase.rpc("get_calendar_block_ranges", {
		range_start: start.toISOString(),
		range_end: end.toISOString()
	});
	if (blockError) throw new Error(blockError.message);
	return enumerateSlots({
		from: start,
		to: end,
		minHour,
		bookedIsos: (booked ?? []).map((b) => b.slot_start),
		blocks: blocks ?? []
	});
}
function formatSlotLocal(iso) {
	return new Date(iso).toLocaleString("sq-AL", {
		timeZone: BOOKING_TIME_ZONE,
		dateStyle: "medium",
		timeStyle: "short"
	});
}
export { SLOT_MS, formatSlotLocal, isValidClinicSlot, loadSlots, normalizeVerification as n, CLINIC_ADMIN_EMAILS as t };
