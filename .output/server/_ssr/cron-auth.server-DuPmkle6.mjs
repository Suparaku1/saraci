// node_modules/.nitro/vite/services/ssr/assets/cron-auth.server-DuPmkle6.js
async function assertCronRequest(request) {
	const provided = request.headers.get("x-cron-secret") ?? "";
	if (!provided) return new Response("Unauthorized", { status: 401 });
	const { supabaseAdmin } = await import("./client.server-DP5_l0A2.mjs");
	const { data } = await supabaseAdmin.from("private_job_config").select("value").eq("key", "cron_secret").maybeSingle();
	const expected = data?.value;
	if (!expected) return new Response("Cron secret not configured", { status: 503 });
	if (!timingSafeEqualStr(provided, expected)) return new Response("Unauthorized", { status: 401 });
	return null;
}
function timingSafeEqualStr(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}
export { assertCronRequest };
