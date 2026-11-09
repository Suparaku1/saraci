import { Ht as object, Kt as string, Vt as number } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-BWRng4-H.mjs";
import { r as createServerFn } from "./server-CkpSkju-.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DTualNdl.mjs";
import { a as emailSchema, d as serviceSchema, l as lastNameSchema, o as firstNameSchema, u as phoneSchema } from "./booking-validation-Ch97K_k5.mjs";
// node_modules/.nitro/vite/services/ssr/assets/booking.functions-Ck6pt_nE.js
var getAvailability_createServerFn_handler = createServerRpc({
	id: "ddb3ba47df6973e14d27dd86680e82d2faa97e3879cd48473a53b63858644d70",
	name: "getAvailability",
	filename: "src/lib/booking.functions.ts"
}, (opts) => getAvailability.__executeServer(opts));
var getAvailability = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	from: string(),
	to: string(),
	minHour: number().int().min(9).max(18).optional()
}).parse(raw)).handler(getAvailability_createServerFn_handler, async ({ data, context }) => {
	const { loadSlots } = await import("./slots.server-BpzP47ii.mjs");
	return { slots: await loadSlots(context.supabase, data.from, data.to, data.minHour) };
});
var createBooking_createServerFn_handler = createServerRpc({
	id: "d5d1516df3b15f9b01e23ed40cda22b58728aafe46e1ea4dd526f9df75ede78c",
	name: "createBooking",
	filename: "src/lib/booking.functions.ts"
}, (opts) => createBooking.__executeServer(opts));
var createBooking = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	slotIso: string(),
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	patientPhone: phoneSchema,
	patientEmail: emailSchema,
	service: serviceSchema,
	notes: string().optional()
}).parse(raw)).handler(createBooking_createServerFn_handler, async ({ data, context }) => {
	const { createBookingCore } = await import("./booking-core.server-BHy1cxK8.mjs");
	return { appointment: await createBookingCore(context.supabase, context.userId, data, "web") };
});
var cancelBooking_createServerFn_handler = createServerRpc({
	id: "c3ef9dc95b0fe94e43f696dd3fd8dcc5ab0f1498218db060436dff51ea0febe1",
	name: "cancelBooking",
	filename: "src/lib/booking.functions.ts"
}, (opts) => cancelBooking.__executeServer(opts));
var cancelBooking = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	bookingCode: string().min(3),
	verify: string().min(3),
	reason: string().optional()
}).parse(raw)).handler(cancelBooking_createServerFn_handler, async ({ data, context }) => {
	const { cancelBookingCore } = await import("./booking-core.server-BHy1cxK8.mjs");
	await cancelBookingCore(context.supabase, context.userId, data, "web");
	return { ok: true };
});
var rescheduleBooking_createServerFn_handler = createServerRpc({
	id: "a87d434f4e8043a41ac79e707a10eb9741372c69ab4b7195861b8ec5b081a4f9",
	name: "rescheduleBooking",
	filename: "src/lib/booking.functions.ts"
}, (opts) => rescheduleBooking.__executeServer(opts));
var rescheduleBooking = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	bookingCode: string(),
	verify: string(),
	newSlotIso: string()
}).parse(raw)).handler(rescheduleBooking_createServerFn_handler, async ({ data, context }) => {
	const { rescheduleBookingCore } = await import("./booking-core.server-BHy1cxK8.mjs");
	const { newAppointment } = await rescheduleBookingCore(context.supabase, context.userId, data, "web");
	return { newAppointment };
});
var listMyAppointments_createServerFn_handler = createServerRpc({
	id: "ddd807fc8c08a322b38434363021393a08bd2818144189ac1e3675e1eec642dd",
	name: "listMyAppointments",
	filename: "src/lib/booking.functions.ts"
}, (opts) => listMyAppointments.__executeServer(opts));
var listMyAppointments = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listMyAppointments_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data, error } = await supabase.from("appointments").select("*").eq("user_id", userId).order("slot_start", { ascending: false });
	if (error) throw new Error(error.message);
	return { appointments: data ?? [] };
});
var listServices_createServerFn_handler = createServerRpc({
	id: "c92b73bcd2767ad1e042fc33edea9da958b0287bf5677b590afddabb7fc5cfa1",
	name: "listServices",
	filename: "src/lib/booking.functions.ts"
}, (opts) => listServices.__executeServer(opts));
var listServices = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listServices_createServerFn_handler, async ({ context }) => {
	const { supabase } = context;
	const { data, error } = await supabase.from("service_catalog").select("id, name, description, price_hint, duration_minutes").eq("active", true).order("name");
	if (error) throw new Error(error.message);
	return { services: data ?? [] };
});
export { cancelBooking_createServerFn_handler, createBooking_createServerFn_handler, getAvailability_createServerFn_handler, listMyAppointments_createServerFn_handler, listServices_createServerFn_handler, rescheduleBooking_createServerFn_handler };
