import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, History, MessageCircle, Info, Shield, LogOut, Menu, X, Mic, Users, Package, Wallet } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const { user } = Route.useRouteContext();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user.id]);

  useEffect(() => { setOpen(false); }, [pathname]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }

  const nav_items = [
    { to: "/dashboard", label: "Paneli", icon: LayoutDashboard },
    { to: "/booking", label: "Rezervo termin", icon: Calendar },
    { to: "/historia", label: "Historia ime", icon: History },
    { to: "/chat", label: "Chat & Zë", icon: MessageCircle },
    { to: "/info", label: "Info klinika", icon: Info },
  ];
  if (isAdmin) {
    nav_items.push({ to: "/pacientet", label: "Pacientët (CRM)", icon: Users });
    nav_items.push({ to: "/inventari", label: "Inventari", icon: Package });
    nav_items.push({ to: "/financat", label: "Financat", icon: Wallet });
    nav_items.push({ to: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform`}>
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold">S</div>
            <span className="font-display font-semibold">Saraci Dental</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav_items.map((it) => {
            const Icon = it.icon;
            const active = pathname === it.to || pathname.startsWith(it.to + "/");
            return (
              <Link key={it.to} to={it.to} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/60"}`}>
                <Icon className="w-4 h-4" /> {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground px-2 mb-2 truncate">{user.email}</div>
          <Button variant="outline" size="sm" onClick={signOut} className="w-full">
            <LogOut className="w-4 h-4 mr-2" /> Dil
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 border-b border-border bg-background md:hidden">
          <button onClick={() => setOpen((o) => !o)} className="p-2 rounded-md hover:bg-muted">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-display font-semibold">Saraci Dental</span>
          <Link to="/chat" className="p-2 rounded-md hover:bg-muted"><Mic className="w-5 h-5" /></Link>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
