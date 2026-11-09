import processModule from "node:process";
// node_modules/.nitro/vite/services/ssr/assets/staff-token.server-TnNWoa7h.js
var TTL_MS = 864e5;
function secret() {
	const s = processModule.env.STAFF_INVITE_CODE;
	if (!s) throw new Error("STAFF_INVITE_CODE nuk është konfiguruar.");
	return s;
}
function inviteCodeMatches(code) {
	return code.trim() === secret().trim();
}
async function sign(payload) {
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode("staff-invite:" + secret()), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["sign"]);
	const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
	return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function issueStaffToken() {
	const exp = String(Date.now() + TTL_MS);
	return `${exp}.${await sign(exp)}`;
}
async function verifyStaffToken(token) {
	const [exp, sig] = token.split(".");
	if (!exp || !sig) return false;
	if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
	const expected = await sign(exp);
	if (expected.length !== sig.length) return false;
	let diff = 0;
	for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
	return diff === 0;
}
export { inviteCodeMatches, issueStaffToken, verifyStaffToken };
