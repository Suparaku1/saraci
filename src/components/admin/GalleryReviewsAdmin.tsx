import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";

type BA = { id: string; title: string; before_path: string; after_path: string; created_at: string };
type Rv = { id: string; display_name: string; rating: number; comment: string; approved: boolean; created_at: string };

export function GalleryAdmin() {
  const [items, setItems] = useState<BA[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [before, setBefore] = useState<File | null>(null);
  const [after, setAfter] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await supabase.from("before_after").select("id, title, before_path, after_path, created_at").order("created_at", { ascending: false });
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function upload(f: File) {
    const ext = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("gallery").upload(path, f, { contentType: f.type });
    if (error) throw error;
    return path;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !before || !after) return toast.error("Plotësoni titullin dhe të dyja fotot.");
    if (!consent) return toast.error("Duhet të konfirmoni pëlqimin e pacientit.");
    setBusy(true);
    try {
      const [b, a] = await Promise.all([upload(before), upload(after)]);
      const { error } = await supabase.from("before_after").insert({ title: title.trim(), description: desc.trim() || null, before_path: b, after_path: a, consent_confirmed: true });
      if (error) throw error;
      toast.success("U publikua në galeri.");
      setTitle(""); setDesc(""); setBefore(null); setAfter(null); setConsent(false);
      (e.target as HTMLFormElement).reset();
      load();
    } catch {
      toast.error("Ngarkimi dështoi.");
    } finally { setBusy(false); }
  }

  async function remove(it: BA) {
    if (!confirm("Ta fshij këtë rast nga galeria?")) return;
    await supabase.from("before_after").delete().eq("id", it.id);
    await supabase.storage.from("gallery").remove([it.before_path, it.after_path]);
    load();
  }

  return (
    <Card className="p-4 space-y-4">
      <form onSubmit={save} className="grid gap-3 md:grid-cols-2">
        <div><Label>Titulli</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="p.sh. Zbardhim profesional" /></div>
        <div><Label>Përshkrim (opsional)</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
        <div><Label>Foto para</Label><Input type="file" accept="image/*" onChange={(e) => setBefore(e.target.files?.[0] ?? null)} /></div>
        <div><Label>Foto pas</Label><Input type="file" accept="image/*" onChange={(e) => setAfter(e.target.files?.[0] ?? null)} /></div>
        <label className="md:col-span-2 flex items-start gap-2 text-sm">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
          Konfirmoj që pacienti ka dhënë pëlqim me shkrim për publikimin e këtyre fotove.
        </label>
        <div className="md:col-span-2"><Button type="submit" disabled={busy}>{busy ? "Duke ngarkuar…" : "Publiko"}</Button></div>
      </form>
      <div className="divide-y divide-border">
        {items.map((it) => (
          <div key={it.id} className="py-2 flex items-center justify-between text-sm">
            <span>{it.title} <span className="text-muted-foreground">· {new Date(it.created_at).toLocaleDateString("sq-AL")}</span></span>
            <Button size="sm" variant="ghost" onClick={() => remove(it)}><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
        {items.length === 0 && <p className="py-2 text-sm text-muted-foreground">Asnjë rast ende.</p>}
      </div>
    </Card>
  );
}

export function ReviewsAdmin() {
  const [items, setItems] = useState<Rv[]>([]);
  async function load() {
    const { data } = await supabase.from("reviews").select("id, display_name, rating, comment, approved, created_at").order("created_at", { ascending: false }).limit(200);
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);
  async function setApproved(id: string, approved: boolean) {
    const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
    if (error) toast.error("Nuk u ruajt."); else load();
  }
  async function remove(id: string) {
    if (!confirm("Ta fshij këtë vlerësim?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    load();
  }
  return (
    <Card className="p-4 divide-y divide-border">
      {items.length === 0 && <p className="text-sm text-muted-foreground">Asnjë vlerësim ende.</p>}
      {items.map((r) => (
        <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-start gap-2">
          <div className="flex-1">
            <div className="font-medium">{r.display_name} · {"★".repeat(r.rating)} {r.approved ? <Badge className="ml-2">Publikuar</Badge> : <Badge variant="secondary" className="ml-2">Në pritje</Badge>}</div>
            <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
          </div>
          <div className="flex gap-1">
            {r.approved
              ? <Button size="sm" variant="outline" onClick={() => setApproved(r.id, false)}><XCircle className="w-4 h-4 mr-1" /> Fshih</Button>
              : <Button size="sm" onClick={() => setApproved(r.id, true)}><CheckCircle2 className="w-4 h-4 mr-1" /> Mirato</Button>}
            <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4" /></Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
