import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listMyAppointments, cancelBooking, getAvailability, rescheduleBooking } from "@/lib/booking.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarClock, History } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export const Route = createFileRoute("/_authenticated/historia")({
  head: () => ({ meta: [{ title: "Historia ime — Saraci Dental" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const list = useServerFn(listMyAppointments);
  const cancel = useServerFn(cancelBooking);
  const reschedule = useServerFn(rescheduleBooking);
  const getAvailabilityForDate = useServerFn(getAvailability);
  const [items, setItems] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    list({ data: undefined }).then((r) => setItems(r.appointments)).catch((e) => toast.error(String(e.message ?? e)));
  }, [list, refreshKey]);

  const upcoming = items.filter((a) => a.status === "booked" && new Date(a.slot_start) >= new Date());
  const past = items.filter((a) => !(a.status === "booked" && new Date(a.slot_start) >= new Date()));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="font-display text-3xl flex items-center gap-2"><History className="w-7 h-7 text-primary" /> Historia ime</h1>

      <div>
        <h2 className="font-semibold mb-2">Termine aktive</h2>
        {upcoming.length === 0 ? <p className="text-sm text-muted-foreground">Nuk keni termine aktive.</p> : (
           <div className="space-y-3">{upcoming.map((a) => <ApptCard key={a.id} a={a} onChanged={() => setRefreshKey((k) => k + 1)} cancel={cancel} reschedule={reschedule} getAvailabilityForDate={getAvailabilityForDate} />)}</div>
        )}
      </div>

      <div>
        <h2 className="font-semibold mb-2">Historia e vizitave</h2>
        {past.length === 0 ? <p className="text-sm text-muted-foreground">Nuk ka rekorde të mëparshme.</p> : (
           <div className="space-y-3">{past.map((a) => <ApptCard key={a.id} a={a} readOnly cancel={cancel} reschedule={reschedule} getAvailabilityForDate={getAvailabilityForDate} onChanged={() => {}} />)}</div>
        )}
      </div>
    </div>
  );
}

function statusBadge(s: string) {
  const map: Record<string, { label: string; variant: any }> = {
    booked: { label: "Aktiv", variant: "default" },
    cancelled: { label: "Anuluar", variant: "destructive" },
    rescheduled: { label: "Rishënuar", variant: "secondary" },
    completed: { label: "Përfunduar", variant: "outline" },
    no_show: { label: "Mungoi", variant: "destructive" },
  };
  const it = map[s] ?? { label: s, variant: "outline" };
  return <Badge variant={it.variant}>{it.label}</Badge>;
}

function ApptCard({ a, readOnly, cancel, reschedule, getAvailabilityForDate, onChanged }: any) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [verify, setVerify] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [date, setDate] = useState<Date>(() => new Date());
  const [slots, setSlots] = useState<Array<{ iso: string; label: string; taken: boolean }>>([]);
  const [slot, setSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!rescheduleOpen) return;
    const from = new Date(date); from.setHours(0, 0, 0, 0);
    const to = new Date(date); to.setHours(23, 59, 59, 999);
    setLoadingSlots(true);
    setSlot("");
    getAvailabilityForDate({ data: { from: from.toISOString(), to: to.toISOString() } })
      .then((result: { slots: Array<{ iso: string; label: string; taken: boolean }> }) => setSlots(result.slots))
      .catch((error: Error) => toast.error(error.message))
      .finally(() => setLoadingSlots(false));
  }, [date, getAvailabilityForDate, rescheduleOpen]);

  async function doCancel() {
    setBusy(true);
    try {
      await cancel({ data: { bookingCode: a.booking_code, verify, reason } });
      toast.success("Rezervimi u anulua");
      setCancelOpen(false); onChanged();
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }

  async function doReschedule() {
    if (!slot) return toast.error("Zgjidhni orarin e ri.");
    setBusy(true);
    try {
      await reschedule({ data: { bookingCode: a.booking_code, verify, newSlotIso: slot } });
      toast.success("Termini u zhvendos dhe njoftimet u aktivizuan.");
      setRescheduleOpen(false);
      onChanged();
    } catch (e: any) {
      toast.error(e.message ?? "Zhvendosja dështoi.");
      const from = new Date(date); from.setHours(0, 0, 0, 0);
      const to = new Date(date); to.setHours(23, 59, 59, 999);
      getAvailabilityForDate({ data: { from: from.toISOString(), to: to.toISOString() } })
        .then((result: { slots: Array<{ iso: string; label: string; taken: boolean }> }) => setSlots(result.slots));
    } finally { setBusy(false); }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{new Date(a.slot_start).toLocaleString("sq-AL", { timeZone: "Europe/Tirane", dateStyle: "medium", timeStyle: "short" })}</span>
            {statusBadge(a.status)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Kodi: <span className="font-mono">{a.booking_code}</span> · {a.service ?? "—"}</div>
          {a.notes && <div className="text-sm mt-2">{a.notes}</div>}
        </div>
        {!readOnly && a.status === "booked" && <div className="flex gap-2">
          <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
            <DialogTrigger asChild><Button size="sm" variant="outline"><CalendarClock className="mr-2 h-4 w-4" /> Zhvendos</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Zhvendos terminin</DialogTitle></DialogHeader>
              <div className="grid gap-5 md:grid-cols-[auto,1fr]">
                <Calendar mode="single" selected={date} onSelect={(nextDate) => nextDate && setDate(nextDate)} disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0)) || day.getDay() === 0} weekStartsOn={1} />
                <div>
                  <Label>Ora e re</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {loadingSlots ? <p className="col-span-full text-sm text-muted-foreground">Po kontrollohen oraret…</p> : slots.filter((item) => !item.taken).map((item) => (
                      <Button key={item.iso} type="button" size="sm" variant={slot === item.iso ? "default" : "outline"} onClick={() => setSlot(item.iso)}>{item.label.split(" ")[1]}</Button>
                    ))}
                    {!loadingSlots && slots.every((item) => item.taken) && <p className="col-span-full text-sm text-muted-foreground">Nuk ka orare të lira në këtë datë.</p>}
                  </div>
                  <div className="mt-4"><Label htmlFor={`rv-${a.id}`}>Telefoni ose emaili i rezervimit</Label><Input id={`rv-${a.id}`} value={verify} onChange={(event) => setVerify(event.target.value)} /></div>
                </div>
              </div>
              <DialogFooter><Button variant="ghost" onClick={() => setRescheduleOpen(false)}>Mbyll</Button><Button disabled={busy || !verify || !slot} onClick={doReschedule}>{busy ? "Po zhvendoset…" : "Konfirmo orarin e ri"}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogTrigger asChild><Button size="sm" variant="destructive">Anulo termin</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Anulo rezervimin</DialogTitle></DialogHeader>
              <p className="text-sm text-muted-foreground">Për siguri, konfirmoni me telefonin ose emailin që përdorët gjatë rezervimit.</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="v">Telefoni ose emaili</Label>
                  <Input id="v" value={verify} onChange={(e) => setVerify(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="r">Arsyeja (opsionale)</Label>
                  <Input id="r" value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                 <Button variant="ghost" onClick={() => setCancelOpen(false)}>Mbyll</Button>
                <Button variant="destructive" disabled={busy || !verify} onClick={doCancel}>Konfirmo anulimin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>}
      </div>
    </Card>
  );
}
