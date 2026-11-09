import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, Plus, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/financat")({
  head: () => ({
    meta: [
      { title: "Financat — Saraci Dental Clinic" },
      { name: "description", content: "Raporte të ardhurash, pagesa dhe statistika mujore për Saraci Dental Clinic në Elbasan." },
      { property: "og:title", content: "Financat — Saraci Dental Clinic" },
      { property: "og:description", content: "Ndiqni pagesat dhe të ardhurat mujore të klinikës." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FinancePage,
});

type Payment = {
  id: string;
  appointment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  notes: string | null;
  created_at: string;
};

type Appt = { id: string; booking_code: string; patient_name: string; slot_start: string; service: string | null };

const STATUS_LABEL: Record<string, string> = { pending: "Në pritje", paid: "Paguar", refunded: "Rimbursuar", cancelled: "Anuluar" };




function FinancePage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [appts, setAppts] = useState<Appt[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ appointment_id: "", amount: "", provider: "cash", status: "paid", notes: "" });

  async function load() {
    const [{ data: p }, { data: a }] = await Promise.all([
      supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("appointments").select("id, booking_code, patient_name, slot_start, service").order("slot_start", { ascending: false }).limit(200),
    ]);
    setPayments((p ?? []) as Payment[]);
    setAppts((a ?? []) as Appt[]);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: role } = await supabase
        .from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!role);
      if (role) load(); else setLoading(false);
    })();
  }, []);

  const paid = payments.filter((p) => p.status === "paid");
  const now = new Date();
  const thisMonth = paid.filter((p) => {
    const d = new Date(p.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const total = paid.reduce((s, p) => s + Number(p.amount), 0);
  const monthTotal = thisMonth.reduce((s, p) => s + Number(p.amount), 0);
  const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);

  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of paid) {
      const d = new Date(p.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) ?? 0) + Number(p.amount));
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 12);
  }, [paid]);

  const max = Math.max(1, ...monthly.map(([, v]) => v));

  async function addPayment() {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) return toast.error("Vendos një shumë të vlefshme.");
    const appt = appts.find((a) => a.id === form.appointment_id);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("payments").insert({
      appointment_id: form.appointment_id || null,
      user_id: u.user?.id ?? null,
      amount,
      currency: "ALL",
      status: form.status,
      provider: form.provider,
      notes: form.notes.trim() || (appt ? `${appt.patient_name} — ${appt.service ?? "Termin"}` : null),
    });
    if (error) return toast.error(error.message);
    toast.success("Pagesa u regjistrua.");
    setForm({ appointment_id: "", amount: "", provider: "cash", status: "paid", notes: "" });
    load();
  }

  function exportCsv() {
    const rows = [
      ["Data", "Shuma", "Monedha", "Statusi", "Mënyra", "Shënime"],
      ...payments.map((p) => [
        new Date(p.created_at).toLocaleString("sq-AL"),
        String(p.amount), p.currency, STATUS_LABEL[p.status] ?? p.status, p.provider, p.notes ?? "",
      ]),
    ];
    const cell = (c: unknown) => { let s = String(c); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
    const csv = rows.map((r) => r.map(cell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `pagesat-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  if (isAdmin === false) {
    return <div className="p-8 text-sm text-muted-foreground">Kjo faqe është vetëm për administratorët.</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-semibold">Financat</h1>
          <p className="text-sm text-muted-foreground">Pagesat e pacientëve dhe të ardhurat mujore.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}><Download className="w-4 h-4 mr-2" /> CSV</Button>
          <Dialog>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Pagesë e re</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Regjistro pagesë</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5"><Label>Termini (opsional)</Label>
                  <select className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.appointment_id} onChange={(e) => setForm({ ...form, appointment_id: e.target.value })}>
                    <option value="">— Pa termin —</option>
                    {appts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.booking_code} · {a.patient_name} · {new Date(a.slot_start).toLocaleDateString("sq-AL")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5"><Label>Shuma (LEK)</Label>
                    <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
                  <div className="grid gap-1.5"><Label>Mënyra</Label>
                    <select className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}>
                      <option value="cash">Kesh</option>
                      <option value="card">Kartë</option>
                      <option value="bank">Bankë</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-1.5"><Label>Statusi</Label>
                  <select className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="paid">Paguar</option>
                    <option value="pending">Në pritje</option>
                    <option value="refunded">Rimbursuar</option>
                  </select>
                </div>
                <div className="grid gap-1.5"><Label>Shënime</Label>
                  <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                <Button onClick={addPayment}>Ruaj</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Këtë muaj</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />{monthTotal.toLocaleString("sq-AL")} LEK</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Totali i paguar</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{total.toLocaleString("sq-AL")} LEK</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Në pritje</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{pending.toLocaleString("sq-AL")} LEK</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Të ardhurat sipas muajit</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {monthly.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nuk ka pagesa të regjistruara.</p>
          ) : monthly.map(([key, val]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{key}</span>
                <span className="font-medium">{val.toLocaleString("sq-AL")} LEK</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(val / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Pagesat</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">Duke ngarkuar…</div>
          ) : payments.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Nuk ka pagesa.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr><th className="p-3">Data</th><th className="p-3">Shuma</th><th className="p-3">Statusi</th><th className="p-3">Mënyra</th><th className="p-3">Shënime</th></tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3 whitespace-nowrap">{new Date(p.created_at).toLocaleDateString("sq-AL")}</td>
                    <td className="p-3 font-medium">{Number(p.amount).toLocaleString("sq-AL")} {p.currency}</td>
                    <td className="p-3"><Badge variant={p.status === "paid" ? "secondary" : "outline"}>{STATUS_LABEL[p.status] ?? p.status}</Badge></td>
                    <td className="p-3 text-muted-foreground">{p.provider}</td>
                    <td className="p-3 text-muted-foreground">{p.notes ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
