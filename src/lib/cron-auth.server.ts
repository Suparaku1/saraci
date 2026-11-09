// Autentikimi i endpoint-eve cron (/api/public/hooks/*).
// Çelësi ruhet vetëm në databazë (private_job_config, pa akses klienti) — kurrë në kod.
export async function assertCronRequest(request: Request): Promise<Response | null> {
  const provided = request.headers.get("x-cron-secret") ?? "";
  if (!provided) return new Response("Unauthorized", { status: 401 });
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("private_job_config")
    .select("value")
    .eq("key", "cron_secret")
    .maybeSingle();
  const expected = data?.value;
  if (!expected) return new Response("Cron secret not configured", { status: 503 });
  if (!timingSafeEqualStr(provided, expected)) return new Response("Unauthorized", { status: 401 });
  return null;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
