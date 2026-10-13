import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader, PublicFooter, CLINIC } from "./index";

const TITLE = "Politika e privatësisë — Saraci Dental Clinic";
const DESC = "Si Saraci Dental Clinic në Elbasan mbledh, përdor dhe mbron të dhënat tuaja personale dhe shëndetësore, sipas legjislacionit shqiptar dhe GDPR.";

export const Route = createFileRoute("/privatesia")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl md:text-4xl">Politika e privatësisë</h1>
        <p className="mt-2 text-sm text-muted-foreground">Përditësuar më 4 shtator 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl mb-2">1. Kush është kontrolluesi i të dhënave</h2>
            <p className="text-muted-foreground">
              {CLINIC.name}, {CLINIC.street}, {CLINIC.city}, Shqipëri. Përgjegjëse: {CLINIC.dentist}.
              Kontakt: <a className="underline" href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a> ·{" "}
              <a className="underline" href={`tel:${CLINIC.phone}`}>{CLINIC.phoneDisplay}</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">2. Çfarë të dhëna mbledhim</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li><strong className="text-foreground">Të dhëna identifikuese:</strong> emër, mbiemër, numër telefoni, email, qytet.</li>
              <li><strong className="text-foreground">Të dhëna të terminit:</strong> data dhe ora, shërbimi i zgjedhur, shënimet që shkruani vetë.</li>
              <li><strong className="text-foreground">Të dhëna shëndetësore:</strong> historiku mjekësor dhe shënimet klinike të vizitës — kategori e veçantë sipas Nenit 9 të GDPR.</li>
              <li><strong className="text-foreground">Komunikime:</strong> bisedat me recepsionistin virtual (chat/zë), emailet e konfirmimit dhe kujtesat.</li>
              <li><strong className="text-foreground">Të dhëna teknike:</strong> regjistrime gabimesh të nevojshme për sigurinë e platformës.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">3. Pse i përdorim dhe mbi çfarë bazë</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>Për të menaxhuar terminin tuaj dhe për të ofruar kujdes dentar — kontrata dhe kujdesi shëndetësor.</li>
              <li>Për të dhënat shëndetësore — pëlqimi juaj i shprehur dhe kujdesi shëndetësor (Neni 9(2)(a) dhe (h) GDPR).</li>
              <li>Për të dërguar konfirmime dhe kujtesa 24 orë e 2 orë përpara terminit.</li>
              <li>Për detyrime ligjore të dokumentacionit mjekësor dhe financiar.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">4. Me kë ndajmë të dhënat</h2>
            <p className="text-muted-foreground">
              Vetëm me ofruesin e hostimit dhe bazës së të dhënave, shërbimin e emailit dhe kalendarit të klinikës, dhe
              modelin e inteligjencës artificiale që fuqizon recepsionistin virtual. Nuk shesim dhe nuk ndajmë të dhëna
              për reklama. Të dhënat e terminit ruhen brenda infrastrukturës së siguruar me kontroll aksesi.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">5. Sa kohë i ruajmë</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>Kartela mjekësore dhe terminet: sipas afateve ligjore për dokumentacionin shëndetësor.</li>
              <li>Emailet e dërguara: 90 ditë.</li>
              <li>Regjistrimet teknike të gabimeve: 60 ditë. Regjistrimet e kalendarit: 14 ditë.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">6. Të drejtat tuaja</h2>
            <p className="text-muted-foreground">
              Keni të drejtë të kërkoni akses, korrigjim, fshirje, kufizim, kundërshtim dhe transferim të të dhënave,
              si edhe të tërheqni pëlqimin në çdo moment. Shkruani në{" "}
              <a className="underline" href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a> dhe përgjigjemi brenda 30 ditëve.
              Mund t'i ankoheni edhe Komisionerit për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave Personale (IDP), Tiranë.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">7. Cookies</h2>
            <p className="text-muted-foreground">
              Përdorim vetëm cookies të nevojshme për hyrjen dhe sigurinë e sesionit. Nuk ka cookies reklamimi
              apo gjurmimi të palëve të treta.
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
