import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertTriangle, Package, Plus, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/inventari")({
  head: () => ({
    meta: [
      { title: "Inventari — Saraci Dental Clinic" },
      { name: "description", content: "Menaxhimi i materialeve dhe stokut të klinikës Saraci Dental në Elbasan." },
      { property: "og:title", content: "Inventari — Saraci Dental Clinic" },
      { property: "og:description", content: "Ndiqni sasitë, furnitorët dhe lëvizjet e stokut të klinikës." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InventoryPage,
});

type Item = {
  id: string;
  name: string;
  category: string | null;
  unit: string;
  quantity: number;
  min_quantity: number;
  unit_cost: number | null;
  supplier: string | null;
  notes: string | null;
  active: boolean;
};

type Movement = {
  id: string;
  item_id: string;
  movement_type: string;
  quantity: number;
  reason: string | null;
  created_at: string;
};

function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [moves, setMoves] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    name: "", category: "", unit: "copë", quantity: "0", min_quantity: "0", unit_cost: "", supplier: "", notes: "",
  });

  async function load() {
    const [{ data: it }, { data: mv }] = await Promise.all([
      supabase.from("inventory_items").select("*").order("name"),
      supabase.from("stock_movements").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    setItems((it ?? []) as Item[]);
    setMoves((mv ?? []) as Movement[]);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: role } = await supabase
        .from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!role);
      if (role) load();
      else setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) =>
      [i.name, i.category, i.supplier].filter(Boolean).some((v) => v!.toLowerCase().includes(s)));
  }, [items, q]);

  const lowStock = items.filter((i) => Number(i.quantity) <= Number(i.min_quantity));
  const totalValue = items.reduce((s, i) => s + Number(i.quantity) * Number(i.unit_cost ?? 0), 0);

  async function createItem() {
    if (!form.name.trim()) return toast.error("Emri i artikullit është i detyrueshëm.");
    const { error } = await supabase.from("inventory_items").insert({
      name: form.name.trim(),
      category: form.category.trim() || null,
      unit: form.unit.trim() || "copë",
      quantity: Number(form.quantity) || 0,
      min_quantity: Number(form.min_quantity) || 0,
      unit_cost: form.unit_cost ? Number(form.unit_cost) : null,
      supplier: form.supplier.trim() || null,
      notes: form.notes.trim() || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Artikulli u shtua.");
    setForm({ name: "", category: "", unit: "copë", quantity: "0", min_quantity: "0", unit_cost: "", supplier: "", notes: "" });
    load();
  }

  async function move(item: Item, type: "in" | "out") {
    const raw = window.prompt(type === "in" ? `Sa ${item.unit} të shtohen?` : `Sa ${item.unit} të hiqen?`, "1");
    if (!raw) return;
    const qty = Number(raw);
    if (!qty || qty <= 0) return toast.error("Sasi e pavlefshme.");
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("stock_movements").insert({
      item_id: item.id, movement_type: type, quantity: qty,
      reason: type === "in" ? "Furnizim" : "Konsum", created_by: u.user?.id ?? null,
    });
    if (error) return toast.error(error.message);
    toast.success("Stoku u përditësua.");
    load();
  }

  if (isAdmin === false) {
    return <div className="p-8 text-sm text-muted-foreground">Kjo faqe është vetëm për administratorët.</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-semibold">Inventari</h1>
          <p className="text-sm text-muted-foreground">Materialet, stoku dhe furnitorët e klinikës.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Artikull i ri</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Shto artikull</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5"><Label>Emri</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5"><Label>Kategoria</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Njësia</Label>
                  <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1.5"><Label>Sasia</Label>
                  <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Minimum</Label>
                  <Input type="number" value={form.min_quantity} onChange={(e) => setForm({ ...form, min_quantity: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Çmim/njësi</Label>
                  <Input type="number" value={form.unit_cost} onChange={(e) => setForm({ ...form, unit_cost: e.target.value })} /></div>
              </div>
              <div className="grid gap-1.5"><Label>Furnitori</Label>
                <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label>Shënime</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={createItem}>Ruaj</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Artikuj</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold flex items-center gap-2"><Package className="w-5 h-5 text-primary" />{items.length}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Nën minimum</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" />{lowStock.length}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Vlera e stokut</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{totalValue.toLocaleString("sq-AL")} LEK</CardContent></Card>
      </div>

      <Input placeholder="Kërko artikull, kategori, furnitor…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">Duke ngarkuar…</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Nuk ka artikuj.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Artikulli</th><th className="p-3">Kategoria</th>
                  <th className="p-3">Sasia</th><th className="p-3">Min</th>
                  <th className="p-3">Furnitori</th><th className="p-3 text-right">Veprime</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => {
                  const low = Number(i.quantity) <= Number(i.min_quantity);
                  return (
                    <tr key={i.id} className="border-t border-border">
                      <td className="p-3 font-medium">{i.name}</td>
                      <td className="p-3 text-muted-foreground">{i.category ?? "—"}</td>
                      <td className="p-3">
                        <Badge variant={low ? "destructive" : "secondary"}>{Number(i.quantity)} {i.unit}</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{Number(i.min_quantity)}</td>
                      <td className="p-3 text-muted-foreground">{i.supplier ?? "—"}</td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <Button size="sm" variant="outline" onClick={() => move(i, "in")}>
                          <ArrowDownCircle className="w-4 h-4 mr-1" /> Hyrje
                        </Button>{" "}
                        <Button size="sm" variant="outline" onClick={() => move(i, "out")}>
                          <ArrowUpCircle className="w-4 h-4 mr-1" /> Dalje
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Lëvizjet e fundit të stokut</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {moves.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nuk ka lëvizje.</p>
          ) : moves.map((m) => {
            const item = items.find((i) => i.id === m.item_id);
            return (
              <div key={m.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                <span>{item?.name ?? "Artikull"} — <span className="text-muted-foreground">{m.reason ?? m.movement_type}</span></span>
                <span className={m.movement_type === "out" ? "text-destructive" : "text-primary"}>
                  {m.movement_type === "out" ? "−" : "+"}{Number(m.quantity)}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
