import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CN0ofe5e.mjs";
import { f as Route$29, v as Button } from "./router-DA3D-5Pv.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as Link, g as Outlet, p as useRouterState, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { B as History, D as Package, I as LogOut, M as MessageCircle, N as Menu, R as LayoutDashboard, _ as Shield, et as Calendar, i as Wallet, k as Mic, s as Users, t as X, z as Info } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/route-DzbahHNf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthedLayout() {
	const { user } = Route$29.useRouteContext();
	const nav = useNavigate();
	const qc = useQueryClient();
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle().then(({ data }) => setIsAdmin(!!data));
	}, [user.id]);
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [pathname]);
	async function signOut() {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		nav({
			to: "/auth",
			replace: true
		});
	}
	const nav_items = [
		{
			to: "/dashboard",
			label: "Paneli",
			icon: LayoutDashboard
		},
		{
			to: "/booking",
			label: "Rezervo termin",
			icon: Calendar
		},
		{
			to: "/historia",
			label: "Historia ime",
			icon: History
		},
		{
			to: "/chat",
			label: "Chat & Zë",
			icon: MessageCircle
		},
		{
			to: "/info",
			label: "Info klinika",
			icon: Info
		}
	];
	if (isAdmin) {
		nav_items.push({
			to: "/pacientet",
			label: "Pacientët (CRM)",
			icon: Users
		});
		nav_items.push({
			to: "/inventari",
			label: "Inventari",
			icon: Package
		});
		nav_items.push({
			to: "/financat",
			label: "Financat",
			icon: Wallet
		});
		nav_items.push({
			to: "/admin",
			label: "Admin",
			icon: Shield
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex bg-muted/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: `${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-16 flex items-center px-4 border-b border-sidebar-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold",
							children: "S"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-semibold",
							children: "Saraci Dental"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 p-3 space-y-1 overflow-y-auto",
					children: nav_items.map((it) => {
						const Icon = it.icon;
						const active = pathname === it.to || pathname.startsWith(it.to + "/");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: it.to,
							className: `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/60"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" }),
								" ",
								it.label
							]
						}, it.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 border-t border-sidebar-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground px-2 mb-2 truncate",
						children: user.email
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: signOut,
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4 mr-2" }), " Dil"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "h-16 flex items-center justify-between px-4 border-b border-border bg-background md:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen((o) => !o),
						className: "p-2 rounded-md hover:bg-muted",
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-semibold",
						children: "Saraci Dental"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/chat",
						className: "p-2 rounded-md hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-5 h-5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	});
}
export { AuthedLayout as component };
