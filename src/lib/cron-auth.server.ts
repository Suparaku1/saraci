// Autentikimi i endpoint-eve cron (/api/public/hooks/*).
// Përdoret një secret i dedikuar CRON_SECRET — jo apikey publike e klientit.
export function assertCronRequest(request: Request): Response | null {
  const expected = process.env.CRON_SECRET;
  if (!expected) return new Response("Cron secret not configured", { status: 503 });
  const provided = request.headers.get("x-cron-secret") ?? "";
  if (!timingSafeEqualStr(provided, expected)) return new Response("Unauthorized", { status: 401 });
  return null;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
