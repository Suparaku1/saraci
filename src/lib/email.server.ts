// Send email via Gmail API (through Lovable connector gateway)
// Uses the developer's connected Gmail account.

const FROM = "Saraci Dental Clinic <orarishpe@gmail.com>";
const GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function base64UrlEncode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildRawEmail(to: string, subject: string, html: string, invite?: { content: string; method: "REQUEST" | "CANCEL" }): string {
  const subjectEnc = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const boundary = `saraci-${crypto.randomUUID()}`;
  if (invite) {
    const mime = [
      `From: ${FROM}`,
      `To: ${to}`,
      `Subject: ${subjectEnc}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      "Content-Transfer-Encoding: 8bit",
      "",
      html,
      `--${boundary}`,
      `Content-Type: text/calendar; charset="UTF-8"; method=${invite.method}; name="termin.ics"`,
      "Content-Transfer-Encoding: 8bit",
      'Content-Disposition: attachment; filename="termin.ics"',
      "",
      invite.content,
      `--${boundary}--`,
    ].join("\r\n");
    return base64UrlEncode(mime);
  }
  const mime = [
    `From: ${FROM}`,
    `To: ${to}`,
    `Subject: ${subjectEnc}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
  ].join("\r\n");
  return base64UrlEncode(mime);
}

export async function sendGmail(to: string, subject: string, html: string, invite?: { content: string; method: "REQUEST" | "CANCEL" }): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) return { ok: false, error: "Missing Gmail connector credentials" };

  const raw = buildRawEmail(to, subject, html, invite);
  const res = await fetch(`${GATEWAY}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gmailKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `Gmail ${res.status}: ${body.slice(0, 300)}` };
  }
  const json = await res.json().catch(() => ({} as any));
  return { ok: true, id: json.id ?? "unknown" };
}
