import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { PublicHeader, PublicFooter } from "./index";
import { fetchPrices } from "@/lib/public-content";

const pricesQuery = queryOptions({ queryKey: ["public-prices"], queryFn: fetchPrices, staleTime: 60_000 });

export const Route = createFileRoute("/cmimet")({
  head: () => ({
    meta: [
      { title: "Çmimet — Saraci Dental Clinic Elbasan" },
      { name: "description", content: "Lista e përditësuar e çmimeve të shërbimeve dentare në Saraci Dental Clinic, Elbasan." },
      { property: "og:title", content: "Çmimet e shërbimeve — Saraci Dental" },
      { property: "og:description", content: "Çmime transparente për çdo shërbim dentar në Elbasan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => (context as any).queryClient.ensureQueryData(pricesQuery),
  component: PricesPage,
});

function PricesPage() {
  const { data } = useSuspenseQuery(pricesQuery);
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl">Çmimet</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Çmimet përditësohen nga klinika dhe janë orientuese — konfirmohen pas konsultës.</p>
        <Card className="mt-8 divide-y divide-border">
          {data.length === 0 && <div className="p-5 text-sm text-muted-foreground">Çmimet do publikohen së shpejti.</div>}
          {data.map((s) => (
            <div key={s.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex-1">
                <h3 className="font-semibold">{s.name}</h3>
                {s.description && <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>}
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.duration_minutes} min</div>
              </div>
              <div className="font-display text-lg text-primary whitespace-nowrap">{s.price_hint || "Sipas konsultës"}</div>
            </div>
          ))}
        </Card>
        <div className="mt-10 text-center">
          <Link to="/auth" search={{ mode: "register" } as never}><Button size="lg">Rezervo tani</Button></Link>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
