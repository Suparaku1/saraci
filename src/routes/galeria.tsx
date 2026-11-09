import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { PublicHeader, PublicFooter } from "./index";
import { fetchGallery } from "@/lib/public-content";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria para/pas — Saraci Dental Clinic" },
      { name: "description", content: "Rezultate reale para dhe pas trajtimit në Saraci Dental, të publikuara me pëlqimin e pacientëve." },
      { property: "og:title", content: "Para / pas — Saraci Dental Elbasan" },
      { property: "og:description", content: "Rezultate reale, me pëlqimin e pacientëve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  // Signed image links are created in the browser so they stay fresh.
  const { data = [], isLoading } = useQuery({ queryKey: ["public-gallery"], queryFn: fetchGallery });
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl">Para / pas</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Çdo foto publikohet vetëm me pëlqimin me shkrim të pacientit.</p>
        {isLoading && <p className="mt-8 text-sm text-muted-foreground">Duke ngarkuar…</p>}
        {!isLoading && data.length === 0 && <p className="mt-8 text-sm text-muted-foreground">Galeria do pasurohet së shpejti.</p>}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {data.map((g) => (
            <Card key={g.id} className="overflow-hidden">
              <div className="grid grid-cols-2">
                {[["Para", g.before], ["Pas", g.after]].map(([label, src]) => (
                  <div key={label} className="relative aspect-square bg-muted">
                    <img src={src} alt={`${g.title} — ${label}`} loading="lazy" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 rounded bg-background/90 px-2 py-0.5 text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{g.title}</h3>
                {g.description && <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>}
              </div>
            </Card>
          ))}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
