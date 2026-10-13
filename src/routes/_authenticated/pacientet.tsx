import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Users, Phone, Mail, X, Tag as TagIcon, Plus, Shield } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/pacientet")({
  head: () => ({ meta: [{ title: "CRM Pacientë — Saraci Dental" }] }),
  component: PatientsPage,
});

function PatientsPage() {
  const { user } = Route.useRouteContext();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [selectedAppts, setSelectedAppts] = useState<any[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user.id]);

  async function load() {
    const { data: p } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
    setPatients(p ?? []);
    const { data: a } = await supabase.from("appointments").select("id, user_id, patient_name, slot_start, service, status, booking_code").order("slot_start", { ascending: false }).limit(1000);
    setAppointments(a ?? []);
  }
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    if (!ql) return patients;
    return patients.filter((p) => [p.full_name, p.email, p.phone, p.city, ...(p.tags ?? [])].filter(Boolean).some((v: string) => String(v).toLowerCase().includes(ql)));
  }, [patients, q]);

  async function openPatient(id: string) {
    setSelectedId(id);
    const p = patients.find((x) => x.id === id);
    setSelected(p);
    setSelectedAppts(appointments.filter((a) => a.user_id === id));
  }

  async function updatePatient(patch: any) {
    if (!selected) return;
    const { error } = await supabase.from("profiles").update(patch).eq("id", selected.id);
    if (error) { toast.error(error.message); return; }
    const updated = { ...selected, ...patch };
    setSelected(updated);
    setPatients((list) => list.map((p) => (p.id === selected.id ? updated : p)));
    toast.success("U ruajt");
  }

  async function addTag() {
    const t = newTag.trim();
    if (!t || !selected) return;
    const next = Array.from(new Set([...(selected.tags ?? []), t]));
    await updatePatient({ tags: next });
    setNewTag("");
  }
  async function removeTag(tag: string) {
    if (!selected) return;
    await updatePatient({ tags: (selected.tags ?? []).filter((t: string) => t !== tag) });
  }

  if (isAdmin === null) return <div className="p-6">Duke ngarkuar...</div>;
  if (!isAdmin) return (
    <div className="p-6"><Card className="p-6 max-w-md"><h2 className="font-semibold flex items-center gap-2"><Shield className="w-5 h-5" /> Akses i kufizuar</h2><p className="text-sm text-muted-foreground mt-1">CRM është vetëm për personelin e klinikës.</p></Card></div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-3xl flex items-center gap-2"><Users className="w-7 h-7 text-primary" /> CRM Pacientë</h1>
        <Badge variant="secondary">{patients.length} pacientë</Badge>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kërko emër, email, telefon, tag…" className="pl-9" />
      </div>

      <div className="grid gap-2">
        {filtered.map((p) => {
          const apptCount = appointments.filter((a) => a.user_id === p.id).length;
          return (
            <Card key={p.id} className="p-4 hover:shadow-md transition cursor-pointer" onClick={() => openPatient(p.id)}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{p.full_name || "(pa emër)"}</div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {p.email}</span>}
                    {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {p.phone}</span>}
                    {p.city && <span>· {p.city}</span>}
                  </div>
                  {(p.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(p.tags ?? []).map((t: string) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="outline">{apptCount} termine</Badge>
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">S'ka rezultate.</p>}
      </div>

      <Sheet open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>{selected?.full_name || "Pacienti"}</SheetTitle></SheetHeader>
          {selected && (
            <div className="mt-4 space-y-5 text-sm">
              <div className="space-y-1 text-muted-foreground">
                {selected.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {selected.email}</div>}
                {selected.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> <a href={`tel:${selected.phone}`} className="text-primary hover:underline">{selected.phone}</a></div>}
                {selected.city && <div>Qyteti: {selected.city}</div>}
              </div>

              <div>
                <div className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-1"><TagIcon className="w-3 h-3" /> Tagje</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(selected.tags ?? []).map((t: string) => (
                    <Badge key={t} variant="secondary" className="gap-1">
                      {t}
                      <button onClick={() => removeTag(t)} aria-label="hiq"><X className="w-3 h-3" /></button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="VIP, alergji, kariozë…" onKeyDown={(e) => e.key === "Enter" && addTag()} />
                  <Button size="icon" variant="outline" onClick={addTag}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase text-muted-foreground mb-1">Historia mjekësore</div>
                <Textarea defaultValue={selected.medical_history ?? ""} rows={3} placeholder="Alergji, sëmundje kronike, ilaçe…" onBlur={(e) => e.target.value !== (selected.medical_history ?? "") && updatePatient({ medical_history: e.target.value })} />
              </div>

              <div>
                <div className="text-xs uppercase text-muted-foreground mb-1">Shënime klinike</div>
                <Textarea defaultValue={selected.clinical_notes ?? ""} rows={4} placeholder="Shënime private të mjekes…" onBlur={(e) => e.target.value !== (selected.clinical_notes ?? "") && updatePatient({ clinical_notes: e.target.value })} />
              </div>

              <div>
                <div className="text-xs uppercase text-muted-foreground mb-2">Historia e termineve ({selectedAppts.length})</div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {selectedAppts.map((a) => (
                    <div key={a.id} className="border rounded-md p-2 text-xs flex items-center justify-between gap-2">
                      <div>
                        <div className="font-medium">{new Date(a.slot_start).toLocaleString("sq-AL", { timeZone: "Europe/Tirane", dateStyle: "short", timeStyle: "short" })}</div>
                        <div className="text-muted-foreground">{a.service ?? "—"} · <span className="font-mono">{a.booking_code}</span></div>
                      </div>
                      <Badge variant={a.status === "booked" ? "default" : "outline"}>{a.status}</Badge>
                    </div>
                  ))}
                  {selectedAppts.length === 0 && <p className="text-xs text-muted-foreground">S'ka termine.</p>}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
