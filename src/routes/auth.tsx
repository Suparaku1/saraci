import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { verifyStaffCode, claimStaffRole } from "@/lib/staff.functions";

type Search = { mode?: "login" | "register"; next?: string };
const PENDING_KEY = "saraci_pending_staff";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    mode: s.mode === "register" ? "register" : "login",
    next: typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//") ? s.next : undefined,
  }),
  head: () => ({ meta: [
    { title: "Hyr me email — Saraci Dental Clinic" },
    { name: "description", content: "Hyni ose regjistrohuni me email dhe fjalëkalim në Saraci Dental Clinic." },
    { property: "og:title", content: "Hyr me email — Saraci Dental Clinic" },
    { property: "og:description", content: "Hyrja e pacientëve dhe stafit në Saraci Dental Clinic." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const search = Route.useSearch();
  const [tab, setTab] = useState<"login" | "register" | "staf">(search.mode ?? "login");
  const [loading, setLoading] = useState(false);
  const [codeOk, setCodeOk] = useState(false);
  const [staffCode, setStaffCode] = useState("");
  const [staffToken, setStaffToken] = useState("");
  const verifyCode = useServerFn(verifyStaffCode);
  const claimRole = useServerFn(claimStaffRole);

  async function onVerifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyCode({ data: { code: staffCode } });
      if (!res.ok) return toast.error("Kodi është i pasaktë.");
      setStaffToken(res.token);
      setStaffCode("");
      setCodeOk(true);
      toast.success("Kodi u verifikua. Plotësoni të dhënat.");
    } finally {
      setLoading(false);
    }
  }

  async function onStaffRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const full_name = String(f.get("full_name") ?? "");
    const phone = String(f.get("phone") ?? "");
    const companyRole = String(f.get("company_role") ?? "");
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: String(f.get("email")).trim().toLowerCase(),
      password: String(f.get("password")),
      options: {
        emailRedirectTo: window.location.origin + "/auth",
        data: { full_name, phone, city: "Elbasan" },
      },
    });
    if (error) {
      setLoading(false);
      return toast.error("Regjistrimi dështoi: " + error.message);
    }
    if (!signUpData.session) {
      localStorage.setItem(PENDING_KEY, JSON.stringify({ token: staffToken, companyRole, full_name, phone }));
      setLoading(false);
      return toast.success("Konfirmoni emailin, pastaj hyni — roli admin aktivizohet automatikisht.");
    }
    try {
      await claimRole({ data: { token: staffToken, companyRole, fullName: full_name, phone } });
      toast.success("Llogaria admin u krijua!");
      nav({ to: "/admin" });
    } catch (err) {
      toast.error("Llogaria u krijua, por roli admin dështoi: " + (err as Error).message);
      goNext();
    } finally {
      setLoading(false);
    }
  }

  async function claimPendingStaff() {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return false;
    try {
      const p = JSON.parse(raw) as { token: string; companyRole: string; full_name?: string; phone?: string };
      await claimRole({ data: { token: p.token, companyRole: p.companyRole, fullName: p.full_name, phone: p.phone } });
      localStorage.removeItem(PENDING_KEY);
      toast.success("Roli admin u aktivizua.");
      return true;
    } catch {
      return false;
    }
  }

  const goNext = () => {
    if (search.next) window.location.href = search.next;
    else nav({ to: "/dashboard" });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) goNext();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(f.get("email")).trim().toLowerCase(),
      password: String(f.get("password")),
    });
    if (error) {
      setLoading(false);
      return toast.error("Hyrja dështoi: " + error.message);
    }
    const becameStaff = await claimPendingStaff();
    setLoading(false);
    toast.success("Mirë se erdhe!");
    if (becameStaff) return nav({ to: "/admin" });
    goNext();
  }

  async function onRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const redirectBack = window.location.origin + "/auth";
    const { data, error } = await supabase.auth.signUp({
      email: String(f.get("email")).trim().toLowerCase(),
      password: String(f.get("password")),
      options: {
        emailRedirectTo: redirectBack,
        data: {
          full_name: String(f.get("full_name") ?? ""),
          phone: String(f.get("phone") ?? ""),
          city: String(f.get("city") ?? "Elbasan"),
        },
      },
    });
    setLoading(false);
    if (error) return toast.error("Regjistrimi dështoi: " + error.message);
    if (!data.session) {
      toast.success("Konfirmoni emailin përpara se të hyni në llogari.");
      setTab("login");
      return;
    }
    toast.success("Llogaria u krijua!");
    goNext();
  }


  return (
    <div className="min-h-screen bg-hero-gradient grid place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold">S</div>
          <span className="font-display text-xl font-semibold">Saraci Dental</span>
        </Link>
        <Card className="p-6 shadow-xl">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register" | "staf")}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="login">Hyr</TabsTrigger>
              <TabsTrigger value="register">Regjistrohu</TabsTrigger>
              <TabsTrigger value="staf">Staf</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={onLogin} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="password">Fjalëkalimi</Label>
                  <Input id="password" name="password" type="password" required autoComplete="current-password" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Duke hyrë..." : "Hyr në llogari"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={onRegister} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="r_full_name">Emri i plotë</Label>
                  <Input id="r_full_name" name="full_name" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="r_phone">Telefoni</Label>
                    <Input id="r_phone" name="phone" required placeholder="069..." />
                  </div>
                  <div>
                    <Label htmlFor="r_city">Qyteti</Label>
                    <Input id="r_city" name="city" defaultValue="Elbasan" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="r_email">Email</Label>
                  <Input id="r_email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="r_password">Fjalëkalimi</Label>
                  <Input id="r_password" name="password" type="password" required minLength={8} autoComplete="new-password" />
                  <p className="text-xs text-muted-foreground mt-1">Të paktën 8 karaktere.</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Duke krijuar..." : "Krijo llogari"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="staf">
              {!codeOk ? (
                <form onSubmit={onVerifyCode} className="space-y-4 pt-4">
                  <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
                    <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Regjistrimi i stafit është i mbrojtur. Shkruani kodin e klinikës për të hapur formën.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="s_code">Kodi i klinikës</Label>
                    <Input
                      id="s_code"
                      value={staffCode}
                      onChange={(e) => setStaffCode(e.target.value)}
                      inputMode="numeric"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Duke verifikuar..." : "Vazhdo"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={onStaffRegister} className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="s_full_name">Emër Mbiemër</Label>
                    <Input id="s_full_name" name="full_name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="s_phone">Telefoni</Label>
                      <Input id="s_phone" name="phone" required placeholder="069..." />
                    </div>
                    <div>
                      <Label htmlFor="s_role">Roli në kompani</Label>
                      <Input id="s_role" name="company_role" required placeholder="Dentist / Recepsion" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="s_email">Email</Label>
                    <Input id="s_email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="s_password">Fjalëkalimi</Label>
                    <Input id="s_password" name="password" type="password" required minLength={8} autoComplete="new-password" />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Duke krijuar..." : "Krijo llogari administratori"}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Duke vazhduar, pranoni kushtet e klinikës Saraci Dental.
        </p>
      </div>
    </div>
  );
}
