import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

// Beta types for supabase.auth.oauth
type OAuthDetails = {
  client?: { name?: string; client_name?: string; redirect_uris?: string[] };
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthNs = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthDetails | null; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: any }>;
};
const oauth = (supabase.auth as unknown as { oauth: OAuthNs }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { mode: "login", next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="min-h-screen grid place-items-center p-6">
      <Card className="p-6 max-w-md">
        <h1 className="font-display text-lg mb-2">Kërkesa nuk u ngarkua</h1>
        <p className="text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
      </Card>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? details?.client?.client_name ?? "Aplikacioni";
  const scopes = (details?.scope ?? "").split(/\s+/).filter(Boolean);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorization_id)
      : await oauth.denyAuthorization(authorization_id);
    if (error) { setBusy(false); setError(error.message ?? String(error)); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("Serveri nuk ktheu një URL kthyese."); return; }
    window.location.href = target;
  }

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-hero-gradient">
      <Card className="p-6 max-w-md w-full space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary grid place-items-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-lg">Lidh {clientName} me Saraci Dental</h1>
            <p className="text-xs text-muted-foreground">Kërkohet leje për të përdorur llogarinë tuaj.</p>
          </div>
        </div>
        <div className="text-sm space-y-2">
          <p>Kjo lejon <b>{clientName}</b> të veprojë si ju në Saraci Dental Clinic:</p>
          <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1">
            <li>Të shohë shërbimet dhe oraret e lira</li>
            <li>Të bëjë ose të anulojë termine në emrin tuaj</li>
            <li>Të shohë historikun e termineve tuaja</li>
          </ul>
          {scopes.length > 0 && (
            <p className="text-xs text-muted-foreground">Fusha të kërkuara: {scopes.join(", ")}</p>
          )}
          <p className="text-xs text-muted-foreground">Rregullat e privatësisë dhe RLS të klinikës vlejnë gjithmonë.</p>
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <div className="flex gap-2 pt-2">
          <Button disabled={busy} onClick={() => decide(true)} className="flex-1">Aprovo</Button>
          <Button disabled={busy} variant="outline" onClick={() => decide(false)} className="flex-1">Anulo</Button>
        </div>
      </Card>
    </main>
  );
}
