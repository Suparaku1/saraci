import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Stethoscope, ParkingCircle, Wifi } from "lucide-react";

export const Route = createFileRoute("/_authenticated/info")({
  head: () => ({ meta: [{ title: "Info klinika — Saraci Dental" }] }),
  component: InfoPage,
});

function InfoPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [faq, setFaq] = useState<{ id: string; question: string; answer: string }[]>([]);

  useEffect(() => {
    supabase.from("clinic_settings").select("key, value").eq("is_public", true).then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => (map[r.key] = r.value));
      setSettings(map);
    });
    supabase.from("clinic_faq").select("*").order("sort_order").then(({ data }) => setFaq(data as any ?? []));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="font-display text-3xl">Info klinika</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3">
          <div className="flex items-start gap-3"><Stethoscope className="w-5 h-5 text-primary mt-0.5" /><div><div className="text-xs text-muted-foreground">Dentisti / Pronari</div><div className="font-medium">{settings.dentist}</div></div></div>
          <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5" /><div><div className="text-xs text-muted-foreground">Adresa</div><div>{settings.address}</div></div></div>
          <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-primary mt-0.5" /><div><div className="text-xs text-muted-foreground">Telefoni</div><div>{settings.phone}</div></div></div>
          <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-primary mt-0.5" /><div><div className="text-xs text-muted-foreground">Email</div><div>{settings.email}</div></div></div>
          <div className="flex items-start gap-3"><Clock className="w-5 h-5 text-primary mt-0.5" /><div><div className="text-xs text-muted-foreground">Orari</div><div>{settings.working_hours}</div></div></div>
        </Card>
        <Card className="p-5 space-y-3">
          <div className="flex items-start gap-3"><ParkingCircle className="w-5 h-5 text-primary mt-0.5" /><div><div className="text-xs text-muted-foreground">Parking</div><div>{settings.parking}</div></div></div>
          <div className="flex items-start gap-3"><Wifi className="w-5 h-5 text-primary mt-0.5" /><div><div className="text-xs text-muted-foreground">Aksesueshmëri</div><div>{settings.accessibility}</div></div></div>
          <div className="flex items-start gap-3 text-destructive"><span className="text-lg">🚨</span><div><div className="text-xs">Urgjenca</div><div className="font-semibold">Telefononi {settings.emergency_number}</div></div></div>
          <div><div className="text-xs text-muted-foreground">Mënyra pagese</div><div>{settings.payment_methods}</div></div>
          <div><div className="text-xs text-muted-foreground">Tualet</div><div>{settings.toilet}</div></div>
        </Card>
      </div>

      <div>
        <h2 className="font-display text-2xl mb-3">Pyetjet më të shpeshta</h2>
        <div className="space-y-3">
          {faq.map((f) => (
            <Card key={f.id} className="p-4">
              <div className="font-medium">{f.question}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.answer}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
