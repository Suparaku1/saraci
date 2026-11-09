import { Ht as object, Kt as string, Nt as boolean, Ot as _enum, Vt as number } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-BWRng4-H.mjs";
import { r as createServerFn } from "./server-CkpSkju-.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DTualNdl.mjs";
import { t as complaintUpdateSchema } from "./admin-validation-UjjRHp_U.mjs";
// node_modules/.nitro/vite/services/ssr/assets/admin.functions-1fkwyk1d.js
async function assertAdmin(supabase, userId) {
	const { data } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!data) throw new Error("Vetëm administratorët mund të kryejnë këtë veprim.");
	return true;
}
async function audit(supabase, userId, action, entity, entityId, payload = {}) {
	await supabase.from("audit_log").insert({
		user_id: userId,
		action,
		entity,
		entity_id: entityId,
		payload
	});
}
var adminUpdateAppointmentStatus_createServerFn_handler = createServerRpc({
	id: "dc125c7c7f21e971ebd72aea33e04cf05d36ec2ee1e95cf32cd8952498a4b376",
	name: "adminUpdateAppointmentStatus",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpdateAppointmentStatus.__executeServer(opts));
var adminUpdateAppointmentStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	id: string().uuid(),
	status: _enum([
		"booked",
		"cancelled",
		"completed",
		"no_show",
		"rescheduled"
	])
}).parse(raw)).handler(adminUpdateAppointmentStatus_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	if (data.status === "cancelled") {
		const { data: appointment, error: readError } = await supabase.from("appointments").select("*").eq("id", data.id).single();
		if (readError) throw new Error(readError.message);
		if (appointment.status !== "booked") throw new Error("Ky rezervim nuk është aktiv.");
		const { cancelBookingCore } = await import("./booking-core.server-BHy1cxK8.mjs");
		await cancelBookingCore(supabase, appointment.user_id ?? userId, {
			bookingCode: appointment.booking_code,
			verify: appointment.patient_email ?? appointment.patient_phone,
			reason: "Anuluar nga administratori"
		}, "web");
		await audit(supabase, userId, "admin.appointment.status", "appointment", data.id, { status: data.status });
		return { ok: true };
	}
	const { error } = await supabase.from("appointments").update({ status: data.status }).eq("id", data.id);
	if (error) throw new Error(error.message);
	await audit(supabase, userId, "admin.appointment.status", "appointment", data.id, { status: data.status });
	return { ok: true };
});
var adminUpdateComplaint_createServerFn_handler = createServerRpc({
	id: "d0a2d78a96fc3efc7c1f68634811966969fa4dd579c319030b19fda8ab7dc5cd",
	name: "adminUpdateComplaint",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpdateComplaint.__executeServer(opts));
var adminUpdateComplaint = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => complaintUpdateSchema.parse(raw)).handler(adminUpdateComplaint_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { id, ...patch } = data;
	const { error } = await supabase.from("complaints").update(patch).eq("id", id);
	if (error) throw new Error(error.message);
	await audit(supabase, userId, "admin.complaint.update", "complaint", data.id, patch);
	return { ok: true };
});
var adminSaveSetting_createServerFn_handler = createServerRpc({
	id: "c2c526c707cf481071c97ddaf02c0c7e23f36004349429694c8f2a7bf7802d62",
	name: "adminSaveSetting",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminSaveSetting.__executeServer(opts));
var adminSaveSetting = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	key: string().min(1),
	value: string().max(8e3)
}).parse(raw)).handler(adminSaveSetting_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { error } = await supabase.from("clinic_settings").update({ value: data.value }).eq("key", data.key);
	if (error) throw new Error(error.message);
	await audit(supabase, userId, "admin.setting.update", "clinic_settings", null, { key: data.key });
	return { ok: true };
});
var adminCreateService_createServerFn_handler = createServerRpc({
	id: "a96732af91e49271394dbf171353fe3f70475d95757c32f557dc435945d1c962",
	name: "adminCreateService",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminCreateService.__executeServer(opts));
var adminCreateService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	name: string().min(2),
	price_hint: string().max(120).optional().nullable(),
	duration_minutes: number().int().min(15).max(480),
	description: string().max(2e3).optional().nullable()
}).parse(raw)).handler(adminCreateService_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { data: row, error } = await supabase.from("service_catalog").insert({
		name: data.name.trim(),
		price_hint: data.price_hint || null,
		duration_minutes: data.duration_minutes,
		description: data.description || null,
		active: true
	}).select().single();
	if (error) throw new Error(error.message);
	await audit(supabase, userId, "admin.service.create", "service_catalog", row.id, { name: row.name });
	return { service: row };
});
var adminUpdateService_createServerFn_handler = createServerRpc({
	id: "f0468b8a0cf90af1088daa6c73491b92ddf5028f4877270263a84066f2beb2aa",
	name: "adminUpdateService",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpdateService.__executeServer(opts));
var adminUpdateService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	id: string().uuid(),
	name: string().min(2).optional(),
	price_hint: string().max(120).optional().nullable(),
	duration_minutes: number().int().min(15).max(480).optional(),
	description: string().max(2e3).optional().nullable(),
	active: boolean().optional()
}).parse(raw)).handler(adminUpdateService_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { id, ...patch } = data;
	const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== void 0));
	const { error } = await supabase.from("service_catalog").update(clean).eq("id", id);
	if (error) throw new Error(error.message);
	await audit(supabase, userId, "admin.service.update", "service_catalog", id, clean);
	return { ok: true };
});
var adminDeleteService_createServerFn_handler = createServerRpc({
	id: "19845694d48681068f886029b5bbceed2c680eaaf3c6c0ca2ca8481d71cb30b6",
	name: "adminDeleteService",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteService.__executeServer(opts));
var adminDeleteService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({ id: string().uuid() }).parse(raw)).handler(adminDeleteService_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	await assertAdmin(supabase, userId);
	const { error } = await supabase.from("service_catalog").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	await audit(supabase, userId, "admin.service.delete", "service_catalog", data.id, {});
	return { ok: true };
});
export { adminCreateService_createServerFn_handler, adminDeleteService_createServerFn_handler, adminSaveSetting_createServerFn_handler, adminUpdateAppointmentStatus_createServerFn_handler, adminUpdateComplaint_createServerFn_handler, adminUpdateService_createServerFn_handler };
