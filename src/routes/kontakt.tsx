import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { PublicHeader, PublicFooter, CLINIC } from "./index";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt — Saraci Dental Clinic Elbasan" },
      { name: "description", content: `Kontaktoni ${CLINIC.name} në ${CLINIC.street}, ${CLINIC.city}. Tel/WhatsApp ${CLINIC.phoneDisplay}, email ${CLINIC.email}.` },
      { property: "og:title", content: "Kontakt — Saraci Dental Elbasan" },
      { property: "og:description", content: `Na gjeni në ${CLINIC.street}. Hën–Sht 09–19.` },
      { property: "og:type", content: "website" },
      { property: "og:image", content: CLINIC.photos.hero },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl">Na kontaktoni</h1>
        <p className="mt-3 text-muted-foreground">Zgjidhni mënyrën më të përshtatshme për ju.</p>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <a href={`tel:${CLINIC.phone}`}>
            <Card className="p-5 hover:shadow-md transition-shadow h-full">
              <Phone className="w-6 h-6 text-primary" />
              <div className="mt-3 font-semibold">Telefon</div>
              <div className="text-sm text-muted-foreground">{CLINIC.phoneDisplay}</div>
            </Card>
          </a>
          <a href={`https://wa.me/${CLINIC.whatsapp}`} target="_blank" rel="noopener">
            <Card className="p-5 hover:shadow-md transition-shadow h-full border-emerald-200">
              <MessageCircle className="w-6 h-6 text-emerald-600" />
              <div className="mt-3 font-semibold">WhatsApp</div>
              <div className="text-sm text-muted-foreground">{CLINIC.phoneDisplay}</div>
            </Card>
          </a>
          <a href={`mailto:${CLINIC.email}`}>
            <Card className="p-5 hover:shadow-md transition-shadow h-full">
              <Mail className="w-6 h-6 text-primary" />
              <div className="mt-3 font-semibold">Email</div>
              <div className="text-sm text-muted-foreground break-all">{CLINIC.email}</div>
            </Card>
          </a>
          <Card className="p-5">
            <MapPin className="w-6 h-6 text-primary" />
            <div className="mt-3 font-semibold">Adresa</div>
            <div className="text-sm text-muted-foreground">{CLINIC.street}<br />{CLINIC.city}</div>
          </Card>
          <Card className="p-5 sm:col-span-2">
            <Clock className="w-6 h-6 text-primary" />
            <div className="mt-3 font-semibold">Orari</div>
            <div className="text-sm text-muted-foreground">E hënë – E shtunë · 09:00 – 19:00 · E diela e mbyllur</div>
          </Card>
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden shadow-md aspect-[16/9]">
          <iframe
            title={`Harta ${CLINIC.name}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(CLINIC.street + ", " + CLINIC.city)}&z=16&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </section>
      <PublicFooter />
    </div>
  ),
});
