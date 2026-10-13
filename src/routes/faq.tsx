import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicHeader, PublicFooter } from "./index";

const FAQS = [
  { q: "Si mund të rezervoj një termin?", a: "Regjistroheni në faqen tonë dhe zgjidhni datën/orarin e lirë. Sistemi konfirmon menjëherë me një kod rezervimi." },
  { q: "Sa zgjat një vizitë?", a: "Çdo termin është 1 orë fiks. Kjo na lejon të kushtojmë kohën e nevojshme për çdo pacient pa nxitim." },
  { q: "A mund të anuloj ose të shtyj terminin?", a: "Po, nga faqja 'Historia' me kodin e rezervimit dhe telefonin/email-in tuaj. Ju lutemi lajmëroni së paku 24 orë përpara." },
  { q: "Cili është orari i klinikës?", a: "E hënë deri të shtunë, 09:00 – 19:00. Të dielën jemi mbyllur." },
  { q: "A pranohet pagesa me kartë?", a: "Po, pranojmë para në dorë dhe kartë (Visa, Mastercard)." },
  { q: "A ofroni plane pagese për trajtime të mëdha?", a: "Për trajtime si implantologji apo ortodonci ofrojmë plane pagese me këste. Konsultohuni në telefon ose gjatë vizitës." },
  { q: "Si funksionon recepsionisti virtual?", a: "Është një asistent me AI në shqip që ju ndihmon të rezervoni, të anuloni ose të merrni informacion 24/7 — me chat ose me zë." },
  { q: "A janë të sigurta të dhënat e mia?", a: "Absolutisht. Të dhënat ruhen të enkriptuara dhe përdoren vetëm për menaxhimin e termineve tuaja." },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Pyetjet e shpeshta — Saraci Dental Clinic" },
      { name: "description", content: "Përgjigje për pyetjet më të shpeshta rreth rezervimit, orarit, pagesave dhe shërbimeve në Saraci Dental Elbasan." },
      { property: "og:title", content: "Pyetje të shpeshta — Saraci Dental" },
      { property: "og:description", content: "Gjeni përgjigjen tuaj shpejt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqLd) }],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl">Pyetje të shpeshta</h1>
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`i-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <PublicFooter />
    </div>
  ),
});
