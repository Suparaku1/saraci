import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { PublicHeader, PublicFooter } from "./index";

const SERVICES = [
  { t: "Kontroll & konsultë", d: "Vlerësim i plotë i shëndetit oral, plan trajtimi i personalizuar.", price: "1.500 – 2.500 L", duration: "30–60 min" },
  { t: "Pastrim profesional", d: "Heqje e gurëzës dhe pllakës me ultratinguj, lustrim.", price: "3.000 – 5.000 L", duration: "45 min" },
  { t: "Zbardhim profesional", d: "Zbardhim me llambë LED, rezultat i menjëhershëm.", price: "15.000 – 25.000 L", duration: "60–90 min" },
  { t: "Mbushje estetike", d: "Kompozit ngjyrë natyrale për dhëmbët e prishur.", price: "3.500 – 6.000 L", duration: "30–45 min" },
  { t: "Endodonci (kanal)", d: "Trajtim i kanaleve rrënjore me teknologji moderne.", price: "8.000 – 15.000 L", duration: "60–90 min" },
  { t: "Implantologji", d: "Implante titani, zgjidhje afatgjata për dhëmbët e munguar.", price: "45.000 – 90.000 L", duration: "60–120 min" },
  { t: "Ortodonci", d: "Aparate fikse dhe të lëvizshme, alignerë transparentë.", price: "Sipas planit", duration: "Konsultë" },
  { t: "Kirurgji orale", d: "Nxjerrje dhëmbësh, dhëmbë të mençurisë, kirurgji e vogël.", price: "3.000 – 12.000 L", duration: "30–60 min" },
];

export const Route = createFileRoute("/sherbimet")({
  head: () => ({
    meta: [
      { title: "Shërbimet — Saraci Dental Clinic Elbasan" },
      { name: "description", content: "Lista e plotë e shërbimeve dentare në Saraci Dental: kontroll, pastrim, zbardhim, mbushje, endodonci, implante, ortodonci." },
      { property: "og:title", content: "Shërbimet dentare — Saraci Dental Elbasan" },
      { property: "og:description", content: "Kujdes dentar i plotë në Elbasan. Çmime transparente, kohëzgjatje e qartë." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl">Shërbimet tona</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Çmimet janë orientuese — konfirmohen pas konsultës. Çdo termin zgjat minimalisht 1 orë.</p>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {SERVICES.map((s) => (
            <Card key={s.t} className="p-5 bg-card-gradient">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0"><CheckCircle2 className="w-5 h-5" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold">{s.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/70">
                    <span><b className="text-foreground">{s.price}</b></span>
                    <span>· {s.duration}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/auth" search={{ mode: "register" } as never}><Button size="lg">Rezervo tani</Button></Link>
        </div>
      </section>
      <PublicFooter />
    </div>
  ),
});
