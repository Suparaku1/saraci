import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAvailability, createBooking, listServices } from "@/lib/booking.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarDays, CheckCircle2, Clock, Sun, Moon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { isValidPhone, isValidEmail, splitFullName, PHONE_RULE, EMAIL_RULE, SERVICE_RULE } from "@/lib/booking-validation";


export const Route = createFileRoute("/_authenticated/booking")({
  head: () => ({ meta: [{ title: "Rezervo termin — Saraci Dental" }] }),
  component: BookingBody,
});

type Slot = { iso: string; label: string; taken: boolean };
type Service = { id: string; name: string; description: string | null; price_hint: string | null; duration_minutes: number };

function BookingBody() {
  const { user } = Route.useRouteContext();
  const nav = useNavigate();
  const getAvail = useServerFn(getAvailability);
  const create = useServerFn(createBooking);
  const getServices = useServerFn(listServices);

  const [date, setDate] = useState<Date>(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d;
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [service, setService] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState(user.email ?? "");
  const [consent, setConsent] = useState(false);
  const [confirmation, setConfirmation] = useState<null | { code: string; slot: string; service: string | null }>(null);


  useEffect(() => {
    supabase.from("profiles").select("full_name, phone, email").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        const { firstName: f, lastName: l } = splitFullName(data?.full_name ?? "");
        setFirstName(f);
        setLastName(l);
        setPatientPhone(data?.phone ?? "");
        setPatientEmail(data?.email ?? user.email ?? "");
      });
    getServices({ data: undefined }).then((r) => {
      setServices(r.services as Service[]);
      if (r.services[0]) setService(r.services[0].name);
    }).catch((e) => toast.error(String(e.message ?? e)));
  }, [user.id, getServices]);

  useEffect(() => {
    const from = new Date(date); from.setHours(0, 0, 0, 0);
    const to = new Date(date); to.setHours(23, 59, 59, 999);
    setLoadingSlots(true);
    setPick(null);
    getAvail({ data: { from: from.toISOString(), to: to.toISOString() } })
      .then((r) => setSlots(r.slots))
      .catch((e) => toast.error(String(e.message ?? e)))
      .finally(() => setLoadingSlots(false));
  }, [date, getAvail]);

  const { morning, afternoon } = useMemo(() => {
    const morning: Slot[] = [], afternoon: Slot[] = [];
    for (const s of slots) {
      const h = parseInt(s.label.split(" ")[1]?.split(":")[0] ?? "0", 10);
      if (h < 13) morning.push(s); else afternoon.push(s);
    }
    return { morning, afternoon };
  }, [slots]);

  const isSunday = date.getDay() === 0;
  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

  const errors = {
    firstName: firstName.trim().length < 2 ? "Shkruani emrin." : null,
    lastName: lastName.trim().length < 2 ? "Shkruani mbiemrin." : null,
    phone: isValidPhone(patientPhone) ? null : PHONE_RULE,
    email: isValidEmail(patientEmail) ? null : EMAIL_RULE,
    service: service.trim().length < 3 ? SERVICE_RULE : null,
    consent: consent ? null : "Duhet të pranoni përpunimin e të dhënave për të rezervuar.",
  };

  const formValid = Object.values(errors).every((e) => e === null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pick) return toast.error("Zgjidhni një orar");
    const firstError = Object.values(errors).find((x) => x !== null);
    if (firstError) return toast.error(firstError);
    const f = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await create({ data: {
        slotIso: pick,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        patientPhone: patientPhone.replace(/[\s\-()]/g, ""),
        patientEmail: patientEmail.trim().toLowerCase(),
        service,
        notes: String(f.get("notes") ?? ""),
      } });
      setConfirmation({
        code: res.appointment.booking_code,
        slot: res.appointment.slot_start,
        service,
      });
    } catch (e: any) {
      toast.error(e.message ?? "Diçka shkoi keq");
    } finally { setLoading(false); }
  }


  const selectedService = services.find((s) => s.name === service);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="font-display text-3xl flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-primary" /> Rezervo termin
        </h1>
        <p className="text-muted-foreground mt-1">Zgjidh datën, orarin dhe shërbimin. Çdo termin zgjat 1 orë. Klinika është e mbyllur të dielën.</p>
      </div>

      <div className="grid lg:grid-cols-[auto,1fr] gap-6">
        <Card className="p-4 h-fit">
          <div className="text-sm font-medium mb-2 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Zgjidh datën</div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0)) || d.getDay() === 0}
            className="pointer-events-auto"
            weekStartsOn={1}
          />
          <p className="text-xs text-muted-foreground mt-2">E hënë – E shtunë · 09:00 – 19:00</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">
              {date.toLocaleDateString("sq-AL", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
            </div>
            {slots.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {slots.filter((s) => !s.taken).length} të lira
              </Badge>
            )}
          </div>

          {isSunday || isPast ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              {isSunday ? "Klinika është e mbyllur të dielën." : "Zgjidhni një datë të vlefshme."}
            </div>
          ) : loadingSlots ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">Nuk ka orare të disponueshme.</div>
          ) : (
            <div className="space-y-4">
              <SlotGroup icon={<Sun className="w-4 h-4" />} title="Paradite" slots={morning} pick={pick} onPick={setPick} />
              <SlotGroup icon={<Moon className="w-4 h-4" />} title="Pasdite" slots={afternoon} pick={pick} onPick={setPick} />
            </div>
          )}

          {pick && (
            <div className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/20 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Ora e zgjedhur: <span className="font-semibold">{new Date(pick).toLocaleString("sq-AL", { timeZone: "Europe/Tirane", dateStyle: "medium", timeStyle: "short" })}</span>
            </div>
          )}
        </Card>
      </div>

      <form onSubmit={submit}>
        <Card className="p-5 space-y-4">
          <h3 className="font-display text-lg">Të dhënat e pacientit</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Emri *</Label>
              <Input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Filan" />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Mbiemri *</Label>
              <Input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Fisteku" />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <Label htmlFor="patientPhone">Telefoni *</Label>
              <Input id="patientPhone" required inputMode="numeric" maxLength={14} value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="0691234567" />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="patientEmail">Email *</Label>
              <Input id="patientEmail" type="email" required value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} placeholder="emri@gmail.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="service">Shërbimi *</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger><SelectValue placeholder="Zgjidh shërbimin (pastrim, mbushje, ortodonci, implant...)" /></SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      <div className="flex flex-col">
                        <span>{s.name}</span>
                        {s.price_hint && <span className="text-xs text-muted-foreground">{s.price_hint}</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service && <p className="text-xs text-destructive mt-1">{errors.service}</p>}
              {selectedService?.description && (
                <p className="text-xs text-muted-foreground mt-1">{selectedService.description}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Shënime (opsionale)</Label>
            <Textarea id="notes" name="notes" placeholder="P.sh. dhimbje në dhëmballën poshtë..." />
          </div>
          <div className="flex items-start gap-3 rounded-md border border-border p-3">
            <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
            <Label htmlFor="consent" className="text-sm font-normal leading-relaxed text-muted-foreground">
              Pranoj që Saraci Dental Clinic të përpunojë të dhënat e mia personale dhe shëndetësore për terminin dhe
              kujdesin dentar, sipas{" "}
              <Link to="/privatesia" className="underline text-foreground">Politikës së privatësisë</Link> dhe{" "}
              <Link to="/kushtet" className="underline text-foreground">Kushteve të shërbimit</Link>. *
            </Label>
          </div>
          {!formValid && (
            <p className="text-sm text-muted-foreground">Plotësoni të gjitha fushat e detyrueshme për të vazhduar.</p>
          )}
          <Button type="submit" disabled={!pick || loading || !formValid} className="w-full sm:w-auto" size="lg">
            {loading ? "Duke rezervuar..." : "Konfirmo rezervimin"}
          </Button>


        </Card>
      </form>

      <Dialog open={!!confirmation} onOpenChange={(o) => { if (!o) { setConfirmation(null); nav({ to: "/historia" }); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-6 h-6" /> Rezervimi u konfirmua!
            </DialogTitle>
          </DialogHeader>
          {confirmation && (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-white rounded-lg border">
                <QRCodeSVG value={`SDC:${confirmation.code}`} size={180} />
              </div>
              <div className="text-center space-y-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Kodi i rezervimit</div>
                <div className="font-mono text-2xl font-bold text-primary">{confirmation.code}</div>
              </div>
              <div className="border rounded-md p-3 text-sm space-y-1">
                <div><span className="text-muted-foreground">Data:</span> <span className="font-medium">{new Date(confirmation.slot).toLocaleString("sq-AL", { timeZone: "Europe/Tirane", dateStyle: "full", timeStyle: "short" })}</span></div>
                {confirmation.service && <div><span className="text-muted-foreground">Shërbimi:</span> <span className="font-medium">{confirmation.service}</span></div>}
                <div><span className="text-muted-foreground">Adresa:</span> Rruga Ptoleme Xhuvani, Elbasan 3001</div>
              </div>
              <p className="text-xs text-muted-foreground text-center">Ruani këtë kod për të anuluar ose ripërcaktuar terminin.</p>
            </div>
          )}
          <DialogFooter className="gap-2">
            {confirmation && (
              <a
                href={`https://wa.me/355675402044?text=${encodeURIComponent(
                  `Përshëndetje Saraci Dental! Kam rezervuar një termin.\nKodi: ${confirmation.code}\nData: ${new Date(confirmation.slot).toLocaleString("sq-AL", { timeZone: "Europe/Tirane", dateStyle: "full", timeStyle: "short" })}${confirmation.service ? `\nShërbimi: ${confirmation.service}` : ""}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">Njofto në WhatsApp</Button>
              </a>
            )}
            <Button variant="outline" onClick={() => window.print()}>Printo</Button>
            <Button onClick={() => { setConfirmation(null); nav({ to: "/historia" }); }}>Shko te Historia</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SlotGroup({ icon, title, slots, pick, onPick }: { icon: React.ReactNode; title: string; slots: Slot[]; pick: string | null; onPick: (iso: string) => void }) {
  if (slots.length === 0) return null;
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
        {icon} {title}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {slots.map((s) => (
          <button key={s.iso} type="button" disabled={s.taken}
            onClick={() => onPick(s.iso)}
            className={`px-3 py-2 rounded-md text-sm border transition ${
              s.taken ? "bg-muted text-muted-foreground line-through cursor-not-allowed" :
              pick === s.iso ? "bg-primary text-primary-foreground border-primary shadow-sm" :
              "hover:bg-accent hover:border-primary/50 border-border"
            }`}>
            {s.label.split(" ")[1]}
          </button>
        ))}
      </div>
    </div>
  );
}
