import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicHeader, PublicFooter, CLINIC } from "./index";
import { Award, Heart, Sparkles } from "lucide-react";

export const Route = createFileRoute("/rreth")({
  head: () => ({
    meta: [
      { title: `Rreth ${CLINIC.dentist} — Saraci Dental Clinic Elbasan` },
      { name: "description", content: `Njihuni me ${CLINIC.dentist} dhe klinikën dentare Saraci në Elbasan. Kujdes i personalizuar, teknologji moderne, ekip profesional.` },
      { property: "og:title", content: `Rreth ${CLINIC.name}` },
      { property: "og:description", content: `Historia, misioni dhe ekipi i klinikës dentare Saraci në Elbasan.` },
      { property: "og:type", content: "website" },
      { property: "og:image", content: CLINIC.photos.team },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: CLINIC.photos.team },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">Rreth Saraci Dental</h1>
            <p className="mt-4 text-lg text-foreground/80">
              Klinika Saraci Dental ndodhet në <strong>{CLINIC.street}, {CLINIC.city}</strong>, dhe drejtohet nga <strong>{CLINIC.dentist}</strong>.
              Misioni ynë: kujdes dentar modern, i butë dhe i përballueshëm për çdo pacient.
            </p>
          </div>
          <img src={CLINIC.photos.team} alt={`${CLINIC.dentist} me ekipin`} className="rounded-2xl shadow-xl aspect-[4/5] object-cover w-full" loading="lazy" />
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            [Heart, "Kujdes njerëzor", "Çdo pacient trajtohet si familjar. Dëgjojmë, shpjegojmë, kujdesemi."],
            [Award, "Ekspertizë", `${CLINIC.dentist} — mjek stomatolog me përvojë të gjatë klinike.`],
            [Sparkles, "Teknologji", "Pajisje moderne, materiale të certifikuara europiane."],
          ].map(([Icon, t, d]) => (
            <Card key={t as string} className="p-5">
              <Icon className="w-8 h-8 text-primary" />
              <h3 className="mt-3 font-semibold">{t as string}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d as string}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-3">
          {[CLINIC.photos.treatment, CLINIC.photos.whitening, CLINIC.photos.team2].map((src) => (
            <img key={src} src={src} alt="Klinika Saraci Dental gjatë punës" loading="lazy" className="rounded-xl aspect-square object-cover w-full" />
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-hero-gradient">
          <h2 className="font-display text-2xl">{CLINIC.dentist}</h2>
          <p className="mt-3 text-foreground/80">
            E diplomuar në Fakultetin e Mjekësisë Dentare, me trajnime të vazhdueshme në estetikë, endodonci dhe implantologji.
            E përkushtuar për të krijuar një përvojë të qetë dhe pa stres për çdo pacient.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link to="/auth" search={{ mode: "register" } as never}><Button size="lg">Rezervo konsultën</Button></Link>
        </div>
      </section>
      <PublicFooter />
    </div>
  ),
});
