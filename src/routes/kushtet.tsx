import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader, PublicFooter, CLINIC } from "./index";

const TITLE = "Kushtet e shërbimit — Saraci Dental Clinic";
const DESC = "Kushtet e rezervimit online, anulimit, zhvendosjes dhe mosparaqitjes në Saraci Dental Clinic, Elbasan.";

export const Route = createFileRoute("/kushtet")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl md:text-4xl">Kushtet e shërbimit</h1>
        <p className="mt-2 text-sm text-muted-foreground">Përditësuar më 4 shtator 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl mb-2">1. Rezervimi</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>Orari i klinikës: e hënë–e shtunë, 09:00–19:00. E dielë e mbyllur.</li>
              <li>Çdo termin zë një slot fiks prej 1 ore.</li>
              <li>Rezervimi konfirmohet me një kod unik që dërgohet me email bashkë me ftesën për kalendar.</li>
              <li>Të dhënat e detyrueshme: emër, mbiemër, numër telefoni shqiptar, email i vlefshëm dhe shërbimi.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">2. Zhvendosja dhe anulimi</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>Terminin mund t'ia zhvendosni ose anulloni vetë nga faqja "Historia ime".</li>
              <li>Ju kërkojmë të njoftoni së paku 24 orë përpara, që sloti t'i shërbejë një pacienti tjetër.</li>
              <li>Pas anulimit, sloti i vjetër lirohet dhe ngjarja hiqet nga kalendari.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">3. Mosparaqitja</h2>
            <p className="text-muted-foreground">
              Mosparaqitja pa njoftim shënohet në kartelën tuaj. Pas mosparaqitjeve të përsëritura, klinika mund të
              kërkojë konfirmim me telefon përpara rezervimeve të mëtejshme.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">4. Çmimet dhe pagesa</h2>
            <p className="text-muted-foreground">
              Çmimet e shfaqura online janë orientuese. Çmimi përfundimtar përcaktohet pas kontrollit dhe planit të
              trajtimit, dhe ju komunikohet përpara nisjes së punës. Pagesa bëhet në klinikë.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">5. Recepsionisti virtual</h2>
            <p className="text-muted-foreground">
              Chat-i dhe asistenti me zë ndihmojnë me rezervimet dhe informacione të përgjithshme. Ato nuk zëvendësojnë
              diagnozën ose konsultën mjekësore. Në urgjencë, telefononi direkt në{" "}
              <a className="underline" href={`tel:${CLINIC.phone}`}>{CLINIC.phoneDisplay}</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl mb-2">6. Të dhënat personale</h2>
            <p className="text-muted-foreground">
              Përpunimi i të dhënave përshkruhet në{" "}
              <Link to="/privatesia" className="underline">Politikën e privatësisë</Link>.
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
