import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Shield, Users, Calendar, Mail, Settings2, Search, Download, RefreshCw, CheckCircle2, XCircle, MessageSquareWarning, Stethoscope, Plug, Trash2, Plus, Send, CalendarSync } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { integrationsStatus, sendTestEmail, syncCalendarNow } from "@/lib/integrations.functions";
import {
  adminUpdateAppointmentStatus,
  adminUpdateComplaint,
  adminSaveSetting,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Saraci Dental" }] }),
  component: AdminPage,
});

const APPT_STATUSES = ["all", "booked", "cancelled", "completed", "no_show"] as const;

function toCSV(rows: any[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: any) => {
    if (v == null) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
function download(name: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

function AdminPage() {
  const { user } = Route.useRouteContext();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [appts, setAppts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newSvc, setNewSvc] = useState({ name: "", price_hint: "", duration_minutes: 60, description: "" });
  const [conn, setConn] = useState<any>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const getStatus = useServerFn(integrationsStatus);
  const testEmail = useServerFn(sendTestEmail);
  const runSync = useServerFn(syncCalendarNow);
  const setApptStatus = useServerFn(adminUpdateAppointmentStatus);
  const saveComplaint = useServerFn(adminUpdateComplaint);
  const saveSettingFn = useServerFn(adminSaveSetting);
  const createService = useServerFn(adminCreateService);
  const editService = useServerFn(adminUpdateService);
  const removeService = useServerFn(adminDeleteService);
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0, cancelled: 0, openComplaints: 0 });
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week">("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user.id]);

  async function reload() {
    setRefreshing(true);
    const [a, u, e, c, s, sv] = await Promise.all([
      supabase.from("appointments").select("*").order("slot_start", { ascending: false }).limit(500),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("email_log").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("complaints").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("clinic_settings").select("*").order("key"),
      supabase.from("service_catalog").select("*").order("name"),
    ]);
    setAppts(a.data ?? []);
    setUsers(u.data ?? []);
    setEmails(e.data ?? []);
    setComplaints(c.data ?? []);
    setSettings(s.data ?? []);
    setServices(sv.data ?? []);

    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
    const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);
    const list = a.data ?? [];
    setStats({
      total: list.length,
      today: list.filter((x: any) => { const t = new Date(x.slot_start); return t >= todayStart && t <= todayEnd && x.status === "booked"; }).length,
      week: list.filter((x: any) => { const t = new Date(x.slot_start); return t >= todayStart && t <= weekEnd && x.status === "booked"; }).length,
      cancelled: list.filter((x: any) => x.status === "cancelled").length,
      openComplaints: (c.data ?? []).filter((x: any) => x.status !== "resolved" && x.status !== "closed").length,
    });
    setRefreshing(false);
  }

  useEffect(() => { if (isAdmin) reload(); }, [isAdmin]);

  // Real-time updates
  useEffect(() => {
    if (!isAdmin) return;
    const ch = supabase.channel("admin-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => reload())
      .on("postgres_changes", { event: "*", schema: "public", table: "complaints" }, () => reload())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [isAdmin]);

  const filteredAppts = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
    const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);
    const ql = q.toLowerCase().trim();
    return appts.filter((a: any) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (dateFilter === "today") { const t = new Date(a.slot_start); if (t < todayStart || t > todayEnd) return false; }
      if (dateFilter === "week") { const t = new Date(a.slot_start); if (t < todayStart || t > weekEnd) return false; }
      if (ql) {
        return [a.patient_name, a.patient_phone, a.patient_email, a.booking_code, a.service]
          .filter(Boolean).some((v: string) => v.toLowerCase().includes(ql));
      }
      return true;
    });
  }, [appts, q, statusFilter, dateFilter]);

  async function run(fn: () => Promise<unknown>, okMsg: string, refresh = true) {
    try {
      await fn();
      toast.success(okMsg);
      if (refresh) reload();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function updateApptStatus(id: string, status: string) {
    await run(() => setApptStatus({ data: { id, status: status as any } }), "U përditësua");
  }

  async function updateComplaint(id: string, patch: any) {
    await run(() => saveComplaint({ data: { id, ...patch } }), "U ruajt");
  }

  async function saveSetting(key: string, value: string) {
    await run(() => saveSettingFn({ data: { key, value } }), "U ruajt", false);
  }

  // ---- Shërbimet (CRUD)
  async function addService() {
    if (newSvc.name.trim().length < 2) return toast.error("Shkruani emrin e shërbimit.");
    await run(async () => {
      await createService({ data: {
        name: newSvc.name.trim(),
        price_hint: newSvc.price_hint || null,
        duration_minutes: Number(newSvc.duration_minutes) || 60,
        description: newSvc.description || null,
      } });
      setNewSvc({ name: "", price_hint: "", duration_minutes: 60, description: "" });
    }, "Shërbimi u shtua");
  }
  async function updateService(id: string, patch: any) {
    await run(() => editService({ data: { id, ...patch } }), "U ruajt");
  }
  async function deleteService(id: string) {
    if (!confirm("Të fshihet përfundimisht ky shërbim?")) return;
    await run(() => removeService({ data: { id } }), "U fshi");
  }

  // ---- Lidhjet (Gmail / Google Calendar)
  async function loadConn() {
    setBusy("status");
    try { setConn(await getStatus({ data: undefined })); }
    catch (e) { toast.error((e as Error).message); }
    finally { setBusy(null); }
  }
  async function doTestEmail() {
    setBusy("email");
    try {
      await testEmail({ data: { to: user.email as string } });
      toast.success("Email-i test u dërgua në " + user.email);
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(null); }
  }
  async function doSync() {
    setBusy("sync");
    try {
      const r = await runSync({ data: undefined });
      toast.success(`Sinkronizim: ${r.created} event të krijuar, ${r.deleted} të fshirë, ${r.blocks} bllokime.`);
      reload();
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(null); }
  }



  if (isAdmin === null) return <div className="p-6">Duke ngarkuar...</div>;
  if (!isAdmin) return (
    <div className="p-6"><Card className="p-6 max-w-md"><h2 className="font-semibold">Akses i kufizuar</h2><p className="text-sm text-muted-foreground mt-1">Kjo faqe është vetëm për administratorët.</p></Card></div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="font-display text-3xl flex items-center gap-2"><Shield className="w-7 h-7 text-primary" /> Paneli i administratorit</h1>
        <div className="flex gap-2">
          <Link to="/pacientet"><Button variant="outline" size="sm"><Users className="w-4 h-4 mr-1" /> CRM Pacientë</Button></Link>
          <Button variant="outline" size="sm" onClick={reload} disabled={refreshing}><RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`} /> Rifresko</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total</div><div className="text-2xl font-display">{stats.total}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Sot (aktive)</div><div className="text-2xl font-display text-primary">{stats.today}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">7 ditë</div><div className="text-2xl font-display">{stats.week}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Anuluar</div><div className="text-2xl font-display text-muted-foreground">{stats.cancelled}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Ankesa hapur</div><div className="text-2xl font-display text-amber-600">{stats.openComplaints}</div></Card>
      </div>

      <Tabs defaultValue="appts">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="appts"><Calendar className="w-4 h-4 mr-1" /> Termine</TabsTrigger>
          <TabsTrigger value="complaints"><MessageSquareWarning className="w-4 h-4 mr-1" /> Ankesa</TabsTrigger>
          <TabsTrigger value="users"><Users className="w-4 h-4 mr-1" /> Pacientë</TabsTrigger>
          <TabsTrigger value="emails"><Mail className="w-4 h-4 mr-1" /> Email</TabsTrigger>
          <TabsTrigger value="services"><Stethoscope className="w-4 h-4 mr-1" /> Shërbimet</TabsTrigger>
          <TabsTrigger value="conn" onClick={() => !conn && loadConn()}><Plug className="w-4 h-4 mr-1" /> Lidhjet</TabsTrigger>
          <TabsTrigger value="settings"><Settings2 className="w-4 h-4 mr-1" /> Cilësimet</TabsTrigger>
        </TabsList>

        <TabsContent value="appts">
          <Card className="p-4 space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kërko emër, telefon, kod…" className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>{APPT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s === "all" ? "Të gjitha statuset" : s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Të gjitha datat</SelectItem>
                  <SelectItem value="today">Sot</SelectItem>
                  <SelectItem value="week">7 ditë</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => download(`termine-${Date.now()}.csv`, toCSV(filteredAppts))}>
                <Download className="w-4 h-4 mr-1" /> CSV ({filteredAppts.length})
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b">
                  <tr>
                    <th className="text-left p-2">Data</th><th className="text-left p-2">Pacienti</th><th className="text-left p-2">Telefoni</th>
                    <th className="text-left p-2">Shërbimi</th><th className="text-left p-2">Kodi</th><th className="text-left p-2">Statusi</th><th className="p-2">Veprime</th>
                  </tr>
                </thead>
                <tbody>{filteredAppts.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-muted/40">
                    <td className="p-2 whitespace-nowrap">{new Date(a.slot_start).toLocaleString("sq-AL", { timeZone: "Europe/Tirane", dateStyle: "short", timeStyle: "short" })}</td>
                    <td className="p-2">{a.patient_name}</td>
                    <td className="p-2"><a href={`tel:${a.patient_phone}`} className="text-primary hover:underline">{a.patient_phone}</a></td>
                    <td className="p-2">{a.service ?? "—"}</td>
                    <td className="p-2 font-mono text-xs">{a.booking_code}</td>
                    <td className="p-2"><Badge variant={a.status === "booked" ? "default" : a.status === "cancelled" ? "outline" : "secondary"}>{a.status}</Badge></td>
                    <td className="p-2">
                      <div className="flex gap-1 justify-end">
                        {a.status === "booked" && (
                          <>
                            <Button size="sm" variant="ghost" title="Shëno të kryer" onClick={() => updateApptStatus(a.id, "completed")}><CheckCircle2 className="w-4 h-4 text-emerald-600" /></Button>
                            <Button size="sm" variant="ghost" title="Anulo" onClick={() => updateApptStatus(a.id, "cancelled")}><XCircle className="w-4 h-4 text-destructive" /></Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAppts.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground text-sm">S'ka rezultate.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="complaints">
          <Card className="p-4 space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{c.subject}</div>
                    <div className="text-xs text-muted-foreground">{c.contact ?? "—"} · {new Date(c.created_at).toLocaleString("sq-AL")}</div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={c.status} onValueChange={(v) => updateComplaint(c.id, { status: v })}>
                      <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Hapur</SelectItem>
                        <SelectItem value="in_progress">Në proces</SelectItem>
                        <SelectItem value="resolved">Zgjidhur</SelectItem>
                        <SelectItem value="closed">Mbyllur</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={c.priority ?? "normal"} onValueChange={(v) => updateComplaint(c.id, { priority: v })}>
                      <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">E ulët</SelectItem>
                        <SelectItem value="normal">Normale</SelectItem>
                        <SelectItem value="high">E lartë</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{c.body}</p>
                <Input defaultValue={c.admin_notes ?? ""} placeholder="Shënime të admin-it…" onBlur={(e) => e.target.value !== (c.admin_notes ?? "") && updateComplaint(c.id, { admin_notes: e.target.value })} />
              </div>
            ))}
            {complaints.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">S'ka ankesa.</p>}
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{users.length} pacientë të regjistruar</p>
              <Button variant="outline" size="sm" onClick={() => download(`pacientet-${Date.now()}.csv`, toCSV(users))}><Download className="w-4 h-4 mr-1" /> CSV</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b"><tr><th className="text-left p-2">Emri</th><th className="text-left p-2">Email</th><th className="text-left p-2">Telefoni</th><th className="text-left p-2">Qyteti</th></tr></thead>
                <tbody>{users.map((u) => (
                  <tr key={u.id} className="border-b"><td className="p-2">{u.full_name}</td><td className="p-2">{u.email}</td><td className="p-2">{u.phone}</td><td className="p-2">{u.city}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <Card className="p-4 space-y-2">
            {emails.map((e) => (
              <div key={e.id} className="border rounded p-3 text-sm">
                <div className="flex justify-between gap-2 flex-wrap">
                  <span className="font-medium">{e.subject}</span>
                  <Badge variant={e.status === "sent" ? "default" : e.status === "failed" ? "destructive" : "outline"}>{e.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Për: {e.to_email} · {new Date(e.created_at).toLocaleString("sq-AL")} {e.sent_at && `· dërguar ${new Date(e.sent_at).toLocaleTimeString("sq-AL")}`}</div>
                {e.error && <div className="text-xs text-destructive mt-1">{e.error}</div>}
              </div>
            ))}
            {emails.length === 0 && <p className="text-sm text-muted-foreground">Nuk ka email të dërguar akoma.</p>}
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-4 space-y-3">
            {settings.map((s) => (
              <div key={s.key} className="grid sm:grid-cols-[220px_1fr_auto] gap-2 items-end border-b pb-3">
                <div>
                  <Label>{s.key}</Label>
                  <div className="text-xs text-muted-foreground">{s.description} {!s.is_public && <Badge variant="secondary" className="ml-1">privat</Badge>}</div>
                </div>
                <Input defaultValue={s.value} onBlur={(e) => e.target.value !== s.value && saveSetting(s.key, e.target.value)} />
                <Button variant="outline" size="sm" onClick={(e) => {
                  const input = (e.currentTarget.parentElement!.querySelector("input") as HTMLInputElement);
                  saveSetting(s.key, input.value);
                }}>Ruaj</Button>
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card className="p-4 space-y-4">
            <div className="grid sm:grid-cols-[1fr_130px_110px_auto] gap-2 items-end border rounded-lg p-3 bg-muted/30">
              <div>
                <Label>Shërbim i ri</Label>
                <Input value={newSvc.name} onChange={(e) => setNewSvc({ ...newSvc, name: e.target.value })} placeholder="Emri i shërbimit" />
              </div>
              <div>
                <Label>Çmimi</Label>
                <Input value={newSvc.price_hint} onChange={(e) => setNewSvc({ ...newSvc, price_hint: e.target.value })} placeholder="2000 Lekë" />
              </div>
              <div>
                <Label>Minuta</Label>
                <Input type="number" value={newSvc.duration_minutes} onChange={(e) => setNewSvc({ ...newSvc, duration_minutes: Number(e.target.value) })} />
              </div>
              <Button onClick={addService}><Plus className="w-4 h-4 mr-1" /> Shto</Button>
            </div>

            <div className="space-y-2">
              {services.map((s) => (
                <div key={s.id} className="grid sm:grid-cols-[1fr_130px_100px_110px_auto] gap-2 items-center border-b pb-2">
                  <Input defaultValue={s.name} onBlur={(e) => e.target.value !== s.name && updateService(s.id, { name: e.target.value })} />
                  <Input defaultValue={s.price_hint ?? ""} placeholder="Çmimi" onBlur={(e) => e.target.value !== (s.price_hint ?? "") && updateService(s.id, { price_hint: e.target.value || null })} />
                  <Input type="number" defaultValue={s.duration_minutes} onBlur={(e) => Number(e.target.value) !== s.duration_minutes && updateService(s.id, { duration_minutes: Number(e.target.value) })} />
                  <Button variant={s.active ? "default" : "outline"} size="sm" onClick={() => updateService(s.id, { active: !s.active })}>
                    {s.active ? "Aktiv" : "Jo aktiv"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteService(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              ))}
              {services.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">S'ka shërbime.</p>}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="conn">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-sm text-muted-foreground">Lidhjet me llogarinë Google të klinikës (Gmail + Calendar).</p>
              <Button variant="outline" size="sm" onClick={loadConn} disabled={busy === "status"}>
                <RefreshCw className={`w-4 h-4 mr-1 ${busy === "status" ? "animate-spin" : ""}`} /> Kontrollo lidhjet
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Gmail</div>
                  {conn && <Badge variant={conn.gmail.verified ? "default" : "destructive"}>{conn.gmail.verified ? "Lidhur" : conn.gmail.configured ? "Problem" : "Jo lidhur"}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  Dërgon dhe pranon email-et e rezervimeve, anulimeve dhe shtyrjeve — tek admini dhe tek pacienti.
                </p>
                {conn?.gmail?.error && <p className="text-xs text-destructive">{conn.gmail.error}</p>}
                <Button size="sm" onClick={doTestEmail} disabled={busy === "email"}>
                  <Send className="w-4 h-4 mr-1" /> Dërgo email test
                </Button>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Google Calendar</div>
                  {conn && <Badge variant={conn.calendar.verified ? "default" : "destructive"}>{conn.calendar.verified ? "Lidhur" : conn.calendar.configured ? "Problem" : "Jo lidhur"}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  Çdo rezervim, anulim dhe shtyrje shfaqet në kalendarin e klinikës; event-et tuaja bllokojnë oraret online.
                </p>
                {conn?.calendar?.error && <p className="text-xs text-destructive">{conn.calendar.error}</p>}
                <Button size="sm" onClick={doSync} disabled={busy === "sync"}>
                  <CalendarSync className={`w-4 h-4 mr-1 ${busy === "sync" ? "animate-spin" : ""}`} /> Sinkronizo tani
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
