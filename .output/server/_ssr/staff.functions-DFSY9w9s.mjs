import { Ht as object, Kt as string } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-BWRng4-H.mjs";
import { r as createServerFn } from "./server-CkpSkju-.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DTualNdl.mjs";
// node_modules/.nitro/vite/services/ssr/assets/staff.functions-DFSY9w9s.js
var verifyStaffCode_createServerFn_handler = createServerRpc({
	id: "7238c8c495c0f7211ccc86e52f8e7cbf3b5255f07bf3b0c015a0ea569b926833",
	name: "verifyStaffCode",
	filename: "src/lib/staff.functions.ts"
}, (opts) => verifyStaffCode.__executeServer(opts));
var verifyStaffCode = createServerFn({ method: "POST" }).inputValidator((raw) => object({ code: string().min(1).max(32) }).parse(raw)).handler(verifyStaffCode_createServerFn_handler, async ({ data }) => {
	const { inviteCodeMatches, issueStaffToken } = await import("./staff-token.server-TnNWoa7h.mjs");
	if (!inviteCodeMatches(data.code)) return { ok: false };
	return {
		ok: true,
		token: await issueStaffToken()
	};
});
var claimStaffRole_createServerFn_handler = createServerRpc({
	id: "1f465d1dd28b21eadb3f8ed70b9a1d59487798157650db2e53845e0880652650",
	name: "claimStaffRole",
	filename: "src/lib/staff.functions.ts"
}, (opts) => claimStaffRole.__executeServer(opts));
var claimStaffRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	token: string().min(10).max(300),
	companyRole: string().min(2).max(80),
	fullName: string().min(2).max(120).optional(),
	phone: string().min(5).max(40).optional()
}).parse(raw)).handler(claimStaffRole_createServerFn_handler, async ({ data, context }) => {
	const { verifyStaffToken } = await import("./staff-token.server-TnNWoa7h.mjs");
	if (!await verifyStaffToken(data.token)) throw new Error("Verifikimi i kodit ka skaduar. Provoni përsëri.");
	const { supabaseAdmin } = await import("./client.server-DP5_l0A2.mjs");
	const userId = context.userId;
	const { error: rErr } = await supabaseAdmin.from("user_roles").upsert({
		user_id: userId,
		role: "admin"
	}, { onConflict: "user_id,role" });
	if (rErr) throw new Error(rErr.message);
	const patch = { company_role: data.companyRole };
	if (data.fullName) patch.full_name = data.fullName;
	if (data.phone) patch.phone = data.phone;
	await supabaseAdmin.from("profiles").update(patch).eq("id", userId);
	await supabaseAdmin.from("audit_log").insert({
		user_id: userId,
		action: "staff.role_claimed",
		entity: "user_roles",
		entity_id: userId,
		payload: { company_role: data.companyRole }
	});
	return { ok: true };
});
export { claimStaffRole_createServerFn_handler, verifyStaffCode_createServerFn_handler };
