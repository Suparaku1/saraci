import { t as __exportAll } from "./rolldown-runtime-D8jQpDG7.mjs";
import processModule from "node:process";
// node_modules/.nitro/vite/services/ssr/assets/email.server-yxKyM8V_.js
var email_server_exports = /* @__PURE__ */ __exportAll({ sendGmail: () => sendGmail });
var FROM = "Saraci Dental Clinic <orarishpe@gmail.com>";
var GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
function base64UrlEncode(s) {
	const bytes = new TextEncoder().encode(s);
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function buildRawEmail(to, subject, html, invite) {
	const subjectEnc = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
	const boundary = `saraci-${crypto.randomUUID()}`;
	if (invite) return base64UrlEncode([
		`From: ${FROM}`,
		`To: ${to}`,
		`Subject: ${subjectEnc}`,
		"MIME-Version: 1.0",
		`Content-Type: multipart/mixed; boundary="${boundary}"`,
		"",
		`--${boundary}`,
		"Content-Type: text/html; charset=\"UTF-8\"",
		"Content-Transfer-Encoding: 8bit",
		"",
		html,
		`--${boundary}`,
		`Content-Type: text/calendar; charset="UTF-8"; method=${invite.method}; name="termin.ics"`,
		"Content-Transfer-Encoding: 8bit",
		"Content-Disposition: attachment; filename=\"termin.ics\"",
		"",
		invite.content,
		`--${boundary}--`
	].join("\r\n"));
	return base64UrlEncode([
		`From: ${FROM}`,
		`To: ${to}`,
		`Subject: ${subjectEnc}`,
		"MIME-Version: 1.0",
		"Content-Type: text/html; charset=\"UTF-8\"",
		"Content-Transfer-Encoding: 8bit",
		"",
		html
	].join("\r\n"));
}
async function sendGmail(to, subject, html, invite) {
	const lovableKey = processModule.env.LOVABLE_API_KEY;
	const gmailKey = processModule.env.GOOGLE_MAIL_API_KEY;
	if (!lovableKey || !gmailKey) return {
		ok: false,
		error: "Missing Gmail connector credentials"
	};
	const raw = buildRawEmail(to, subject, html, invite);
	const res = await fetch(`${GATEWAY}/users/me/messages/send`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${lovableKey}`,
			"X-Connection-Api-Key": gmailKey,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ raw })
	});
	if (!res.ok) {
		const body = await res.text().catch(() => "");
		return {
			ok: false,
			error: `Gmail ${res.status}: ${body.slice(0, 300)}`
		};
	}
	return {
		ok: true,
		id: (await res.json().catch(() => ({}))).id ?? "unknown"
	};
}
export { sendGmail as n, email_server_exports as t };
