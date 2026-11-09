import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader, PublicFooter } from "./index";
import { fetchReviews } from "@/lib/public-content";

export const Route = createFileRoute("/recensionet")({
  head: () => ({
    meta: [
      { title: "Recensionet e pacientëve — Saraci Dental Clinic" },
      { name: "description", content: "Lexoni vlerësimet e pacientëve të Saraci Dental Clinic në Elbasan dhe lini vlerësimin tuaj." },
      { property: "og:title", content: "Recensionet — Saraci Dental Elbasan" },
      { property: "og:description", content: "Përvojat reale të pacientëve tanë." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewsPage,
});

function Stars({ n, onPick }: { n: number; onPick?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5 text-primary">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" disabled={!onPick} onClick={() => onPick?.(i)} aria-label={`${i} yje`}>
          <Star className={`w-5 h-5 ${i <= n ? "fill-current" : "opacity-30"}`} />
        </button>
      ))}
    </div>
  );
}

function ReviewsPage() {
  const { data = [], isLoading } = useQuery({ queryKey: ["public-reviews"], queryFn: fetchReviews });
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, []);

  const avg = data.length ? (data.reduce((a, r) => a + r.rating, 0) / data.length).toFixed(1) : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Shkruani emrin tuaj.");
    if (comment.trim().length < 5) return toast.error("Komenti duhet të ketë së paku 5 shkronja.");
    setBusy(true);
    const { error } = await supabase.from("reviews").insert({ user_id: userId!, display_name: name.trim().slice(0, 80), rating, comment: comment.trim().slice(0, 1500) });
    setBusy(false);
    if (error) return toast.error("Nuk u dërgua. Provoni përsëri.");
    toast.success("Faleminderit! Vlerësimi shfaqet pasi të miratohet nga klinika.");
    setComment("");
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl">Recensionet</h1>
        <p className="mt-3 text-muted-foreground">{avg ? `Mesatarja ${avg} / 5 nga ${data.length} vlerësime.` : "Vlerësimet e pacientëve tanë."}</p>

        <div className="mt-8 space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Duke ngarkuar…</p>}
          {!isLoading && data.length === 0 && <p className="text-sm text-muted-foreground">Ende nuk ka vlerësime të publikuara. Bëhuni i pari!</p>}
          {data.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">{r.display_name}</div>
                <Stars n={r.rating} />
              </div>
              <p className="mt-2 text-sm text-foreground/80 whitespace-pre-line">{r.comment}</p>
              <div className="mt-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("sq-AL")}</div>
            </Card>
          ))}
        </div>

        <Card className="mt-10 p-6">
          <h2 className="font-display text-2xl">Lini vlerësimin tuaj</h2>
          {userId ? (
            <form onSubmit={submit} className="mt-4 space-y-3">
              <Stars n={rating} onPick={setRating} />
              <Input placeholder="Emri juaj (p.sh. Arta K.)" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
              <Textarea placeholder="Si ishte përvoja juaj?" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1500} rows={4} />
              <Button type="submit" disabled={busy}>{busy ? "Duke dërguar…" : "Dërgo vlerësimin"}</Button>
            </form>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Hyni në llogarinë tuaj për të lënë një vlerësim.</p>
              <Link to="/auth" className="mt-3 inline-flex"><Button>Hyr për të vlerësuar</Button></Link>
            </div>
          )}
        </Card>
      </section>
      <PublicFooter />
    </div>
  );
}
