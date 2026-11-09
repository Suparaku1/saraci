import { Ht as object, Kt as string } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-BWRng4-H.mjs";
import { r as createServerFn } from "./server-CkpSkju-.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DTualNdl.mjs";
import processModule from "node:process";
// node_modules/.nitro/vite/services/ssr/assets/integrations.functions-F9XCW6Vn.js
async function assertAdmin(supabase, userId) {
	const { data } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (data !== true) throw new Error("Vetëm administratorët.");
}
var integrationsStatus_createServerFn_handler = createServerRpc({
	id: "2ad190f6a85eb4644fff6c4872594614bd30b587e1427061f778c57322caec4b",
	name: "integrationsStatus",
	filename: "src/lib/integrations.functions.ts"
}, (opts) => integrationsStatus.__executeServer(opts));
var integrationsStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(integrationsStatus_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.supabase, context.userId);
	const lovableKey = processModule.env["LOVABLE_API_KEY"];
	const gmailKey = processModule.env["GOOGLE_MAIL_API_KEY"];
	const calKey = processModule.env["GOOGLE_CALENDAR_API_KEY"];
	async function verify(key) {
		if (!lovableKey || !key) return {
			configured: false,
			verified: false,
			error: "Nuk është lidhur"
		};
		try {
			const res = await fetch("https://connector-gateway.lovable.dev/api/v1/verify_credentials", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${lovableKey}`,
					"X-Connection-Api-Key": key
				}
			});
			const body = await res.text();
			if (!res.ok) return {
				configured: true,
				verified: false,
				error: `${res.status}: ${body.slice(0, 200)}`
			};
			const json = JSON.parse(body || "{}");
			return {
				configured: true,
				verified: json.outcome === "verified" || json.outcome === "skipped",
				error: json.error ?? null
			};
		} catch (e) {
			return {
				configured: true,
				verified: false,
				error: String(e.message ?? e)
			};
		}
	}
	const [gmail, calendar] = await Promise.all([verify(gmailKey), verify(calKey)]);
	return {
		gmail,
		calendar
	};
});
var sendTestEmail_createServerFn_handler = createServerRpc({
	id: "d31054e2d114e8d4a71ab6b220d6726fdaeda00bdfdeff0f2fa47d746b366cb8",
	name: "sendTestEmail",
	filename: "src/lib/integrations.functions.ts"
}, (opts) => sendTestEmail.__executeServer(opts));
var sendTestEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({ to: string().email() }).parse(raw)).handler(sendTestEmail_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { sendGmail } = await import("./email.server-yxKyM8V_.mjs").then((n) => n.t);
	const html = `<p>Test nga Saraci Dental Clinic — lidhja me Gmail funksionon.</p><p>${(/* @__PURE__ */ new Date()).toLocaleString("sq-AL", { timeZone: "Europe/Tirane" })}</p>`;
	const res = await sendGmail(data.to, "Test — lidhja Gmail funksionon", html);
	if (!res.ok) throw new Error(res.error);
	return {
		ok: true,
		id: res.id
	};
});
var syncCalendarNow_createServerFn_handler = createServerRpc({
	id: "00e08a380a4231f02cfb40d9593a586744266ef61e452e08a6f934d712c12cd8",
	name: "syncCalendarNow",
	filename: "src/lib/integrations.functions.ts"
}, (opts) => syncCalendarNow.__executeServer(opts));
var syncCalendarNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(syncCalendarNow_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.supabase, context.userId);
	const cal = await import("./calendar.server-DiqIMIfJ.mjs");
	if (!cal.calendarConfigured()) throw new Error("Google Calendar nuk është i lidhur.");
	const { supabaseAdmin } = await import("./client.server-DP5_l0A2.mjs");
	const now = /* @__PURE__ */ new Date();
	const from = /* @__PURE__ */ new Date(now.getTime() - 72e5);
	const to = new Date(now.getTime() + 5184e6);
	let created = 0, deleted = 0, blocks = 0;
	const { data: toCreate } = await supabaseAdmin.from("appointments").select("id, booking_code, patient_name, patient_phone, patient_email, service, notes, slot_start").eq("status", "booked").is("gcal_event_id", null).gte("slot_start", from.toISOString()).limit(100);
	for (const a of toCreate ?? []) try {
		const eventId = await cal.pushCreateEvent(a);
		await supabaseAdmin.from("appointments").update({ gcal_event_id: eventId }).eq("id", a.id);
		created++;
	} catch {}
	const { data: toDelete } = await supabaseAdmin.from("appointments").select("id, gcal_event_id").not("gcal_event_id", "is", null).in("status", ["cancelled", "rescheduled"]).gte("slot_start", from.toISOString()).limit(100);
	for (const a of toDelete ?? []) {
		if (!a.gcal_event_id) continue;
		try {
			await cal.pushDeleteEvent(a.gcal_event_id);
			await supabaseAdmin.from("appointments").update({ gcal_event_id: null }).eq("id", a.id);
			deleted++;
		} catch {}
	}
	const events = await cal.listEvents(from.toISOString(), to.toISOString());
	for (const ev of events) {
		if (ev.extendedProperties?.private?.saraci_appointment_id) continue;
		const startIso = ev.start?.dateTime ?? (ev.start?.date ? `${ev.start.date}T00:00:00Z` : null);
		const endIso = ev.end?.dateTime ?? (ev.end?.date ? `${ev.end.date}T23:59:59Z` : null);
		if (ev.status === "cancelled" || !startIso || !endIso) {
			await supabaseAdmin.from("calendar_blocks").delete().eq("gcal_event_id", ev.id);
			continue;
		}
		await supabaseAdmin.from("calendar_blocks").upsert({
			gcal_event_id: ev.id,
			summary: ev.summary ?? null,
			start_ts: new Date(startIso).toISOString(),
			end_ts: new Date(endIso).toISOString(),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "gcal_event_id" });
		blocks++;
	}
	return {
		created,
		deleted,
		blocks
	};
});
export { integrationsStatus_createServerFn_handler, sendTestEmail_createServerFn_handler, syncCalendarNow_createServerFn_handler };
