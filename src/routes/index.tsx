import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar, MessageCircle, Mic, Shield, Clock, MapPin, Phone,
  Stethoscope, Menu, X, Star, CheckCircle2, ArrowRight, Mail,
} from "lucide-react";
import heroAsset from "@/assets/clinic-front.jpg";
import galleryRoom from "@/assets/clinic-room.jpg";
import galleryTeam from "@/assets/clinic-team.jpg";
import galleryTeam2 from "@/assets/clinic-team2.jpg";
import galleryTreatment from "@/assets/clinic-treatment.jpg";
import galleryWhitening from "@/assets/clinic-whitening.jpg";
import galleryOffice from "@/assets/clinic-office.jpg";

const SITE_URL = "https://saracidental.al";
const CLINIC = {
  name: "Saraci Dental Clinic",
  phone: "+355675402044",
  phoneDisplay: "+355 67 540 2044",
  whatsapp: "355675402044",
  street: "Rruga Ptoleme Xhuvani",
  city: "Elbasan 3001",
  country: "AL",
  lat: 41.1125,
  lng: 20.0822,
  email: "xhensilasaraci@gmail.com",
  dentist: "Dr. Xhensila Saraci",
  photos: {
    hero: heroAsset,
    room: galleryRoom,
    team: galleryTeam,
    team2: galleryTeam2,
    treatment: galleryTreatment,
    whitening: galleryWhitening,
    office: galleryOffice,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: CLINIC.name,
  image: heroAsset,
  url: SITE_URL,
  telephone: CLINIC.phone,
  email: CLINIC.email,
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: CLINIC.street,
    addressLocality: "Elbasan",
    postalCode: "3001",
    addressCountry: CLINIC.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: CLINIC.lat, longitude: CLINIC.lng },
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00", closes: "19:00",
  }],
  areaServed: "Elbasan, Shqipëri",
  medicalSpecialty: "Dentistry",
  founder: { "@type": "Person", name: "Xhensila Saraci" },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saraci Dental Clinic — Klinika dentare në Elbasan | Rezervo online" },
      { name: "description", content: "Klinikë dentare profesionale në Elbasan, drejtuar nga Dr. Xhensila Saraci. Rezervo terminin online 24/7, bisedo me recepsionistin virtual në shqip." },
      { name: "keywords", content: "dentist elbasan, klinike dentare elbasan, saraci dental, xhensila saraci, rezervim online dentist, implante dhembesh elbasan" },
      { property: "og:title", content: "Saraci Dental Clinic — Elbasan" },
      { property: "og:description", content: "Rezervo terminin online. Chat & voice agjent në shqip. Hën–Sht 09–19." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: heroAsset },
      { property: "og:locale", content: "sq_AL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Saraci Dental Clinic — Elbasan" },
      { name: "twitter:description", content: "Klinika juaj dentare në Elbasan. Rezervo online." },
      { name: "twitter:image", content: heroAsset },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Landing,
});

function PublicHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    ["/sherbimet", "Shërbimet"],
    ["/cmimet", "Çmimet"],
    ["/galeria", "Para/pas"],
    ["/recensionet", "Recensionet"],
    ["/rreth", "Rreth nesh"],
    ["/faq", "Pyetje"],
    ["/kontakt", "Kontakt"],
  ] as const;
  return (
    <header className="border-b border-border/60 bg-background/85 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold">S</div>
          <span className="font-display text-lg font-semibold">Saraci Dental</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground rounded-md hover:bg-accent">{label}</Link>
          ))}
          <Link to="/auth"><Button variant="ghost">Hyr</Button></Link>
          <Link to="/auth" search={{ mode: "register" } as never}><Button>Rezervo</Button></Link>
        </nav>
        <button className="md:hidden p-2 -mr-2" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm rounded-md hover:bg-accent">{label}</Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link to="/auth" onClick={() => setOpen(false)}><Button variant="ghost" className="w-full justify-start">Hyr</Button></Link>
            <Link to="/auth" search={{ mode: "register" } as never} onClick={() => setOpen(false)}><Button className="w-full">Rezervo terminin</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-display font-bold">S</div>
            <span className="font-display font-semibold">Saraci Dental</span>
          </div>
          <p className="mt-3 text-muted-foreground">Klinikë dentare në Elbasan, drejtuar nga {CLINIC.dentist}. Kujdes profesional, teknologji moderne.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Klinika</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li><Link to="/sherbimet" className="hover:text-foreground">Shërbimet</Link></li>
            <li><Link to="/rreth" className="hover:text-foreground">Rreth nesh</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">Pyetje të shpeshta</Link></li>
            <li><Link to="/kontakt" className="hover:text-foreground">Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Kontakt</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> <a href={`tel:${CLINIC.phone}`} className="hover:text-foreground">{CLINIC.phoneDisplay}</a></li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> <a href={`mailto:${CLINIC.email}`} className="hover:text-foreground break-all">{CLINIC.email}</a></li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {CLINIC.street}, {CLINIC.city}</li>
            <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> Hën–Sht 09:00–19:00</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Rezervo tani</div>
          <p className="text-muted-foreground mb-2">Sistemi ynë online punon 24/7.</p>
          <Link to="/auth" search={{ mode: "register" } as never}><Button size="sm">Rezervo online</Button></Link>
          <a href={`https://wa.me/${CLINIC.whatsapp}`} target="_blank" rel="noopener" className="block mt-2 text-xs text-emerald-600 hover:underline">WhatsApp {CLINIC.phoneDisplay}</a>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground space-y-2">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link to="/privatesia" className="hover:text-foreground">Politika e privatësisë</Link>
          <Link to="/kushtet" className="hover:text-foreground">Kushtet e shërbimit</Link>
        </div>
        <div>© {new Date().getFullYear()} Saraci Dental Clinic — {CLINIC.street}, {CLINIC.city}</div>
      </div>

    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="bg-hero-gradient">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary">
              <Stethoscope className="w-3.5 h-3.5" /> Elbasan · Shqipëri
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Buzëqeshja juaj,<br /><span className="text-primary">prioriteti ynë</span>
            </h1>
            <p className="mt-5 text-lg text-foreground/80 max-w-lg">
              Klinika e {CLINIC.dentist} në zemër të Elbasanit. Rezervo terminin online, ose bisedo me recepsionistin virtual në shqip — 24/7.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/auth" search={{ mode: "register" } as never}>
                <Button size="lg" className="gap-2">Rezervo terminin <ArrowRight className="w-4 h-4" /></Button>
              </Link>
              <a href={`tel:${CLINIC.phone}`}>
                <Button size="lg" variant="outline" className="gap-2"><Phone className="w-4 h-4" /> Telefono</Button>
              </a>
              <a href={`https://wa.me/${CLINIC.whatsapp}`} target="_blank" rel="noopener">
                <Button size="lg" variant="outline" className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50">WhatsApp</Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/70">
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Hën–Sht 09–19</div>
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {CLINIC.street}</div>
              <div className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 · 200+ pacientë</div>
            </div>
          </div>
          <div className="relative">
            <img
              src={CLINIC.photos.hero}
              alt={`${CLINIC.name} — klinika në ${CLINIC.street}, Elbasan`}
              width={1080} height={720}
              className="rounded-2xl shadow-2xl w-full h-auto aspect-[3/2] object-cover"
            />
            <Card className="hidden sm:block absolute -bottom-6 -left-6 p-4 bg-background/95 backdrop-blur shadow-xl max-w-[240px]">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Recepsionisti online</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Përgjigjet në pak sekonda, në shqip.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery of real photos */}
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            [CLINIC.photos.room, "Ambienti i klinikës"],
            [CLINIC.photos.team, "Ekipi ynë në punë"],
            [CLINIC.photos.whitening, "Zbardhim profesional"],
            [CLINIC.photos.treatment, "Trajtim me kujdes"],
            [CLINIC.photos.team2, "Bashkëpunim mes dentistëve"],
            [CLINIC.photos.office, "Salloni kryesor"],
          ].map(([src, alt]) => (
            <div key={src} className="aspect-[4/5] rounded-xl overflow-hidden bg-muted">
              <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl">Shërbimet tona</h2>
          <p className="mt-3 text-muted-foreground">Nga kontrolli rutinë deri te implantologjia — gjithçka nën një kulm.</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["Kontroll & konsultë", "Vlerësim i plotë dhe plan trajtimi personal."],
            ["Pastrim profesional", "Heqje e gurëzës me ultratinguj, pa dhimbje."],
            ["Zbardhim profesional", "Buzëqeshje më e ndritshme me llambë LED."],
            ["Mbushje estetike", "Kompozit i cilësisë së lartë, ngjyrë natyrale."],
            ["Endodonci", "Trajtim modern i kanaleve rrënjore."],
            ["Implantologji", "Zgjidhje afatgjata për dhëmbë të munguar."],
          ].map(([t, d]) => (
            <Card key={t} className="p-5 bg-card-gradient hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/sherbimet"><Button variant="outline">Shiko të gjitha shërbimet</Button></Link>
        </div>
      </section>

      <section className="bg-muted/30 py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {[
            [Shield, "Higjienë europiane", "Sterilizim i çertifikuar dhe protokolle strikte."],
            [Calendar, "Rezervim 24/7", "Online në pak sekonda, sloti fiks 1 orë."],
            [MessageCircle, "Recepsionist virtual", "Chat dhe zë në shqip — natë e ditë."],
          ].map(([Icon, t, d]) => (
            <div key={t as string} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center mx-auto shadow-lg">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="mt-4 font-display text-xl">{t as string}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">{d as string}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Besueshmëria: vlerësime Google + kredencialet e mjekes */}
      <section className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-1 text-primary">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <h2 className="mt-3 font-display text-2xl">Vlerësimet e pacientëve</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Lexoni përvojat e pacientëve tanë ose lini vlerësimin tuaj pas vizitës.
              Ne nuk publikojmë dëshmi pa pëlqimin e pacientit.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/recensionet"><Button className="gap-2">Lexo recensionet <ArrowRight className="w-4 h-4" /></Button></Link>
              <Link to="/galeria"><Button variant="outline">Para / pas</Button></Link>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Saraci+Dental+Clinic+Elbasan"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex"
            >
              <Button variant="outline" className="gap-2">Shiko vlerësimet në Google <ArrowRight className="w-4 h-4" /></Button>
            </a>
          </Card>
          <Card className="p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h2 className="mt-3 font-display text-2xl">{CLINIC.dentist}</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Mjeke stomatologe, pronare e klinikës në Elbasan</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Trajtime estetike, endodonci dhe implantologji</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Protokolle sterilizimi sipas standardeve europiane</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Konsultë e shpjeguar me plan trajtimi dhe kosto paraprake</li>
            </ul>
            <Link to="/rreth" className="mt-4 inline-flex"><Button variant="ghost" className="gap-2">Më shumë për klinikën <ArrowRight className="w-4 h-4" /></Button></Link>
          </Card>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14 md:py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl">Gati për buzëqeshjen tuaj?</h2>
        <p className="mt-3 text-muted-foreground">Rezervo online tani ose bisedo me recepsionistin tonë virtual — përgjigjemi menjëherë.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/auth" search={{ mode: "register" } as never}>
            <Button size="lg" className="gap-2">Rezervo terminin <ArrowRight className="w-4 h-4" /></Button>
          </Link>
          <Link to="/kontakt"><Button size="lg" variant="outline"><Mic className="w-4 h-4 mr-2" /> Na kontaktoni</Button></Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

export { PublicHeader, PublicFooter, CLINIC };

