// Token i shkurtër që dëshmon se kodi i ftesës u verifikua në server.
// Klienti ruan tokenin (jo kodin) derisa të konfirmohet emaili.
const TTL_MS = 24 * 60 * 60 * 1000;

function secret(): string {
  const s = process.env.STAFF_INVITE_CODE;
  if (!s) throw new Error("STAFF_INVITE_CODE nuk është konfiguruar.");
  return s;
}

export function inviteCodeMatches(code: string): boolean {
  return code.trim() === secret().trim();
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("staff-invite:" + secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function issueStaffToken(): Promise<string> {
  const exp = String(Date.now() + TTL_MS);
  return `${exp}.${await sign(exp)}`;
}

export async function verifyStaffToken(token: string): Promise<boolean> {
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = await sign(exp);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
