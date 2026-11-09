import { Ht as object, Kt as string, Ot as _enum } from "../_libs/@ai-sdk/gateway+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/admin-validation-UjjRHp_U.js
var complaintUpdateSchema = object({
	id: string().uuid(),
	status: _enum([
		"open",
		"in_progress",
		"resolved",
		"closed"
	]).optional(),
	priority: _enum([
		"low",
		"normal",
		"high",
		"urgent"
	]).optional(),
	admin_notes: string().max(4e3).optional()
});
export { complaintUpdateSchema as t };
