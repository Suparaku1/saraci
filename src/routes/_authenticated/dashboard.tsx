import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageCircle, MapPin, Phone, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Paneli — Saraci Dental" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const [profile, setProfile] = useState<{ full_name: string | null; phone: string | null } | null>(null);
  const [next, setNext] = useState<any>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle();
      setProfile(p as any);
      const { data: appts } = await supabase.from("appointments")
        .select("*").eq("user_id", user.id).eq("status", "booked")
        .gte("slot_start", new Date().toISOString())
        .order("slot_start", { ascending: true }).limit(1);
      setNext(appts?.[0] ?? null);
      const { count: c } = await supabase.from("appointments").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      setCount(c ?? 0);
    })();
  }, [user.id]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="font-display text-3xl">Mirë se erdhët{profile?.full_name ? `, ${profile.full_name}` : ""}!</h1>
        <p className="text-muted-foreground mt-1">Menaxhoni terminet dhe bisedoni me recepsionistin virtual të klinikës.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 bg-card-gradient">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Calendar className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Termini juaj i radhës</div>
              {next ? (
                <div className="font-medium">{new Date(next.slot_start).toLocaleString("sq-AL", { timeZone: "Europe/Tirane", dateStyle: "medium", timeStyle: "short" })}</div>
              ) : (
                <div className="text-sm">Nuk keni termin të planifikuar</div>
              )}
            </div>
          </div>
          {next && <div className="mt-3 text-xs text-muted-foreground">Kodi: <span className="font-mono">{next.booking_code}</span></div>}
        </Card>

        <Card className="p-5 bg-card-gradient">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 text-accent-foreground grid place-items-center"><Clock className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Total termine</div>
              <div className="text-2xl font-display">{count}</div>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card-gradient">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Stethoscope className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Dentisti</div>
              <div className="font-medium">Dr. Xhensila Saraci</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 bg-card-gradient">
          <h3 className="font-display text-xl">Rezervo shpejt</h3>
          <p className="text-sm text-muted-foreground mt-1">Zgjidhni datën dhe orën për terminin tuaj.</p>
          <Link to="/booking"><Button className="mt-4">Rezervo termin</Button></Link>
        </Card>
        <Card className="p-6 bg-card-gradient">
          <h3 className="font-display text-xl">Bisedo me recepsionistin</h3>
          <p className="text-sm text-muted-foreground mt-1">Chat ose zë — në shqip, 24/7.</p>
          <Link to="/chat"><Button variant="outline" className="mt-4"><MessageCircle className="w-4 h-4 mr-2" /> Hap bisedën</Button></Link>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-display text-lg">Kontakt</h3>
        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +355 67 540 2044</div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Rr. Ptoleme Xhuvani, Elbasan</div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Hën–Sht 09:00–19:00</div>
          <div className="flex items-center gap-2 text-destructive font-medium">🚨 Urgjenca: 127</div>
        </div>
      </Card>
    </div>
  );
}
