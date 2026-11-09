import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CN0ofe5e.mjs";
import { t as Card } from "./card-CRTTy5Dx.mjs";
import { t as Badge } from "./badge-CRSM8iyI.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DJmpbwhv.mjs";
import { Ht as object, Kt as string, Nt as boolean, Ot as _enum, Vt as number } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as Input } from "./input-CqV36rr2.mjs";
import { t as Label } from "./label-BYIfJH-v.mjs";
import { c as Route$15, v as Button } from "./router-DA3D-5Pv.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BdJfjbEJ.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-4g10N4ls.mjs";
import { r as createServerFn } from "./server-CkpSkju-.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DTualNdl.mjs";
import { t as complaintUpdateSchema } from "./admin-validation-UjjRHp_U.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Plus, F as Mail, H as Download, K as CircleCheck, S as RefreshCw, W as CircleX, _ as Shield, b as Send, et as Calendar, j as MessageSquareWarning, p as Stethoscope, s as Users, tt as CalendarSync, u as Trash2, w as Plug, x as Search, y as Settings2 } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/admin-YZ9QfrYf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var integrationsStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("2ad190f6a85eb4644fff6c4872594614bd30b587e1427061f778c57322caec4b"));
var sendTestEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({ to: string().email() }).parse(raw)).handler(createSsrRpc("d31054e2d114e8d4a71ab6b220d6726fdaeda00bdfdeff0f2fa47d746b366cb8"));
var syncCalendarNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("00e08a380a4231f02cfb40d9593a586744266ef61e452e08a6f934d712c12cd8"));
var adminUpdateAppointmentStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	id: string().uuid(),
	status: _enum([
		"booked",
		"cancelled",
		"completed",
		"no_show",
		"rescheduled"
	])
}).parse(raw)).handler(createSsrRpc("dc125c7c7f21e971ebd72aea33e04cf05d36ec2ee1e95cf32cd8952498a4b376"));
var adminUpdateComplaint = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => complaintUpdateSchema.parse(raw)).handler(createSsrRpc("d0a2d78a96fc3efc7c1f68634811966969fa4dd579c319030b19fda8ab7dc5cd"));
var adminSaveSetting = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	key: string().min(1),
	value: string().max(8e3)
}).parse(raw)).handler(createSsrRpc("c2c526c707cf481071c97ddaf02c0c7e23f36004349429694c8f2a7bf7802d62"));
var adminCreateService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	name: string().min(2),
	price_hint: string().max(120).optional().nullable(),
	duration_minutes: number().int().min(15).max(480),
	description: string().max(2e3).optional().nullable()
}).parse(raw)).handler(createSsrRpc("a96732af91e49271394dbf171353fe3f70475d95757c32f557dc435945d1c962"));
var adminUpdateService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	id: string().uuid(),
	name: string().min(2).optional(),
	price_hint: string().max(120).optional().nullable(),
	duration_minutes: number().int().min(15).max(480).optional(),
	description: string().max(2e3).optional().nullable(),
	active: boolean().optional()
}).parse(raw)).handler(createSsrRpc("f0468b8a0cf90af1088daa6c73491b92ddf5028f4877270263a84066f2beb2aa"));
var adminDeleteService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({ id: string().uuid() }).parse(raw)).handler(createSsrRpc("19845694d48681068f886029b5bbceed2c680eaaf3c6c0ca2ca8481d71cb30b6"));
function GalleryAdmin() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [desc, setDesc] = (0, import_react.useState)("");
	const [before, setBefore] = (0, import_react.useState)(null);
	const [after, setAfter] = (0, import_react.useState)(null);
	const [consent, setConsent] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function load() {
		const { data } = await supabase.from("before_after").select("id, title, before_path, after_path, created_at").order("created_at", { ascending: false });
		setItems(data ?? []);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function upload(f) {
		const ext = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
		const path = `${crypto.randomUUID()}.${ext}`;
		const { error } = await supabase.storage.from("gallery").upload(path, f, { contentType: f.type });
		if (error) throw error;
		return path;
	}
	async function save(e) {
		e.preventDefault();
		if (!title.trim() || !before || !after) return toast.error("Plotësoni titullin dhe të dyja fotot.");
		if (!consent) return toast.error("Duhet të konfirmoni pëlqimin e pacientit.");
		setBusy(true);
		try {
			const [b, a] = await Promise.all([upload(before), upload(after)]);
			const { error } = await supabase.from("before_after").insert({
				title: title.trim(),
				description: desc.trim() || null,
				before_path: b,
				after_path: a,
				consent_confirmed: true
			});
			if (error) throw error;
			toast.success("U publikua në galeri.");
			setTitle("");
			setDesc("");
			setBefore(null);
			setAfter(null);
			setConsent(false);
			e.target.reset();
			load();
		} catch {
			toast.error("Ngarkimi dështoi.");
		} finally {
			setBusy(false);
		}
	}
	async function remove(it) {
		if (!confirm("Ta fshij këtë rast nga galeria?")) return;
		await supabase.from("before_after").delete().eq("id", it.id);
		await supabase.storage.from("gallery").remove([it.before_path, it.after_path]);
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "grid gap-3 md:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Titulli" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "p.sh. Zbardhim profesional"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Përshkrim (opsional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: desc,
					onChange: (e) => setDesc(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Foto para" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "file",
					accept: "image/*",
					onChange: (e) => setBefore(e.target.files?.[0] ?? null)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Foto pas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "file",
					accept: "image/*",
					onChange: (e) => setAfter(e.target.files?.[0] ?? null)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "md:col-span-2 flex items-start gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: consent,
						onChange: (e) => setConsent(e.target.checked),
						className: "mt-1"
					}), "Konfirmoj që pacienti ka dhënë pëlqim me shkrim për publikimin e këtyre fotove."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Duke ngarkuar…" : "Publiko"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "divide-y divide-border",
			children: [items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-2 flex items-center justify-between text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					it.title,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: ["· ", new Date(it.created_at).toLocaleDateString("sq-AL")]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => remove(it),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
				})]
			}, it.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-2 text-sm text-muted-foreground",
				children: "Asnjë rast ende."
			})]
		})]
	});
}
function ReviewsAdmin() {
	const [items, setItems] = (0, import_react.useState)([]);
	async function load() {
		const { data } = await supabase.from("reviews").select("id, display_name, rating, comment, approved, created_at").order("created_at", { ascending: false }).limit(200);
		setItems(data ?? []);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function setApproved(id, approved) {
		const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
		if (error) toast.error("Nuk u ruajt.");
		else load();
	}
	async function remove(id) {
		if (!confirm("Ta fshij këtë vlerësim?")) return;
		await supabase.from("reviews").delete().eq("id", id);
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4 divide-y divide-border",
		children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Asnjë vlerësim ende."
		}), items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-3 flex flex-col sm:flex-row sm:items-start gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-medium",
					children: [
						r.display_name,
						" · ",
						"★".repeat(r.rating),
						" ",
						r.approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "ml-2",
							children: "Publikuar"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "ml-2",
							children: "Në pritje"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: r.comment
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [r.approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => setApproved(r.id, false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-4 h-4 mr-1" }), " Fshih"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setApproved(r.id, true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 mr-1" }), " Mirato"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => remove(r.id),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
				})]
			})]
		}, r.id))]
	});
}
var APPT_STATUSES = [
	"all",
	"booked",
	"cancelled",
	"completed",
	"no_show"
];
function toCSV(rows) {
	if (rows.length === 0) return "";
	const headers = Object.keys(rows[0]);
	const esc = (v) => {
		if (v == null) return "";
		let s = String(v);
		if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
		s = s.replace(/"/g, "\"\"");
		return /[",\n]/.test(s) ? `"${s}"` : s;
	};
	return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
function download(name, csv) {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	URL.revokeObjectURL(url);
}
function AdminPage() {
	const { user } = Route$15.useRouteContext();
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(null);
	const [appts, setAppts] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [emails, setEmails] = (0, import_react.useState)([]);
	const [complaints, setComplaints] = (0, import_react.useState)([]);
	const [settings, setSettings] = (0, import_react.useState)([]);
	const [services, setServices] = (0, import_react.useState)([]);
	const [newSvc, setNewSvc] = (0, import_react.useState)({
		name: "",
		price_hint: "",
		duration_minutes: 60,
		description: ""
	});
	const [conn, setConn] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const getStatus = useServerFn(integrationsStatus);
	const testEmail = useServerFn(sendTestEmail);
	const runSync = useServerFn(syncCalendarNow);
	const setApptStatus = useServerFn(adminUpdateAppointmentStatus);
	const saveComplaint = useServerFn(adminUpdateComplaint);
	const saveSettingFn = useServerFn(adminSaveSetting);
	const createService = useServerFn(adminCreateService);
	const editService = useServerFn(adminUpdateService);
	const removeService = useServerFn(adminDeleteService);
	const [stats, setStats] = (0, import_react.useState)({
		total: 0,
		today: 0,
		week: 0,
		cancelled: 0,
		openComplaints: 0
	});
	const [q, setQ] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [dateFilter, setDateFilter] = (0, import_react.useState)("all");
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle().then(({ data }) => setIsAdmin(!!data));
	}, [user.id]);
	async function reload() {
		setRefreshing(true);
		const [a, u, e, c, s, sv] = await Promise.all([
			supabase.from("appointments").select("*").order("slot_start", { ascending: false }).limit(500),
			supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500),
			supabase.from("email_log").select("*").order("created_at", { ascending: false }).limit(100),
			supabase.from("complaints").select("*").order("created_at", { ascending: false }).limit(100),
			supabase.from("clinic_settings").select("*").order("key"),
			supabase.from("service_catalog").select("*").order("name")
		]);
		setAppts(a.data ?? []);
		setUsers(u.data ?? []);
		setEmails(e.data ?? []);
		setComplaints(c.data ?? []);
		setSettings(s.data ?? []);
		setServices(sv.data ?? []);
		const now = /* @__PURE__ */ new Date();
		const todayStart = new Date(now);
		todayStart.setHours(0, 0, 0, 0);
		const todayEnd = new Date(now);
		todayEnd.setHours(23, 59, 59, 999);
		const weekEnd = new Date(now);
		weekEnd.setDate(weekEnd.getDate() + 7);
		const list = a.data ?? [];
		setStats({
			total: list.length,
			today: list.filter((x) => {
				const t = new Date(x.slot_start);
				return t >= todayStart && t <= todayEnd && x.status === "booked";
			}).length,
			week: list.filter((x) => {
				const t = new Date(x.slot_start);
				return t >= todayStart && t <= weekEnd && x.status === "booked";
			}).length,
			cancelled: list.filter((x) => x.status === "cancelled").length,
			openComplaints: (c.data ?? []).filter((x) => x.status !== "resolved" && x.status !== "closed").length
		});
		setRefreshing(false);
	}
	(0, import_react.useEffect)(() => {
		if (isAdmin) reload();
	}, [isAdmin]);
	(0, import_react.useEffect)(() => {
		if (!isAdmin) return;
		const ch = supabase.channel("admin-live").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "appointments"
		}, () => reload()).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "complaints"
		}, () => reload()).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [isAdmin]);
	const filteredAppts = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		const todayStart = new Date(now);
		todayStart.setHours(0, 0, 0, 0);
		const todayEnd = new Date(now);
		todayEnd.setHours(23, 59, 59, 999);
		const weekEnd = new Date(now);
		weekEnd.setDate(weekEnd.getDate() + 7);
		const ql = q.toLowerCase().trim();
		return appts.filter((a) => {
			if (statusFilter !== "all" && a.status !== statusFilter) return false;
			if (dateFilter === "today") {
				const t = new Date(a.slot_start);
				if (t < todayStart || t > todayEnd) return false;
			}
			if (dateFilter === "week") {
				const t = new Date(a.slot_start);
				if (t < todayStart || t > weekEnd) return false;
			}
			if (ql) return [
				a.patient_name,
				a.patient_phone,
				a.patient_email,
				a.booking_code,
				a.service
			].filter(Boolean).some((v) => v.toLowerCase().includes(ql));
			return true;
		});
	}, [
		appts,
		q,
		statusFilter,
		dateFilter
	]);
	async function run(fn, okMsg, refresh = true) {
		try {
			await fn();
			toast.success(okMsg);
			if (refresh) reload();
		} catch (e) {
			toast.error(e.message);
		}
	}
	async function updateApptStatus(id, status) {
		await run(() => setApptStatus({ data: {
			id,
			status
		} }), "U përditësua");
	}
	async function updateComplaint(id, patch) {
		await run(() => saveComplaint({ data: {
			id,
			...patch
		} }), "U ruajt");
	}
	async function saveSetting(key, value) {
		await run(() => saveSettingFn({ data: {
			key,
			value
		} }), "U ruajt", false);
	}
	async function addService() {
		if (newSvc.name.trim().length < 2) return toast.error("Shkruani emrin e shërbimit.");
		await run(async () => {
			await createService({ data: {
				name: newSvc.name.trim(),
				price_hint: newSvc.price_hint || null,
				duration_minutes: Number(newSvc.duration_minutes) || 60,
				description: newSvc.description || null
			} });
			setNewSvc({
				name: "",
				price_hint: "",
				duration_minutes: 60,
				description: ""
			});
		}, "Shërbimi u shtua");
	}
	async function updateService(id, patch) {
		await run(() => editService({ data: {
			id,
			...patch
		} }), "U ruajt");
	}
	async function deleteService(id) {
		if (!confirm("Të fshihet përfundimisht ky shërbim?")) return;
		await run(() => removeService({ data: { id } }), "U fshi");
	}
	async function loadConn() {
		setBusy("status");
		try {
			setConn(await getStatus({ data: void 0 }));
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(null);
		}
	}
	async function doTestEmail() {
		setBusy("email");
		try {
			await testEmail({ data: { to: user.email } });
			toast.success("Email-i test u dërgua në " + user.email);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(null);
		}
	}
	async function doSync() {
		setBusy("sync");
		try {
			const r = await runSync({ data: void 0 });
			toast.success(`Sinkronizim: ${r.created} event të krijuar, ${r.deleted} të fshirë, ${r.blocks} bllokime.`);
			reload();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(null);
		}
	}
	if (isAdmin === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children: "Duke ngarkuar..."
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6 max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: "Akses i kufizuar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Kjo faqe është vetëm për administratorët."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-7xl mx-auto p-4 sm:p-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-3xl flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-7 h-7 text-primary" }), " Paneli i administratorit"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/pacientet",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 mr-1" }), " CRM Pacientë"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: reload,
						disabled: refreshing,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}` }), " Rifresko"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-5 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Total"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-display",
							children: stats.total
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Sot (aktive)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-display text-primary",
							children: stats.today
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "7 ditë"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-display",
							children: stats.week
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Anuluar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-display text-muted-foreground",
							children: stats.cancelled
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Ankesa hapur"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-display text-amber-600",
							children: stats.openComplaints
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "appts",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex-wrap h-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "appts",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 mr-1" }), " Termine"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "complaints",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquareWarning, { className: "w-4 h-4 mr-1" }), " Ankesa"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "users",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 mr-1" }), " Pacientë"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "emails",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4 mr-1" }), " Email"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "services",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "w-4 h-4 mr-1" }), " Shërbimet"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "conn",
								onClick: () => !conn && loadConn(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plug, { className: "w-4 h-4 mr-1" }), " Lidhjet"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "gallery",
								children: "Para/pas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "reviews",
								children: "Recensionet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "settings",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "w-4 h-4 mr-1" }), " Cilësimet"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "appts",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex-1 min-w-[200px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: q,
											onChange: (e) => setQ(e.target.value),
											placeholder: "Kërko emër, telefon, kod…",
											className: "pl-9"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: statusFilter,
										onValueChange: setStatusFilter,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-[160px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: APPT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: s,
											children: s === "all" ? "Të gjitha statuset" : s
										}, s)) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: dateFilter,
										onValueChange: (v) => setDateFilter(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-[140px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "Të gjitha datat"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "today",
												children: "Sot"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "week",
												children: "7 ditë"
											})
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => download(`termine-${Date.now()}.csv`, toCSV(filteredAppts)),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 mr-1" }),
											" CSV (",
											filteredAppts.length,
											")"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "text-xs text-muted-foreground border-b",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left p-2",
												children: "Data"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left p-2",
												children: "Pacienti"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left p-2",
												children: "Telefoni"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left p-2",
												children: "Shërbimi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left p-2",
												children: "Kodi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left p-2",
												children: "Statusi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2",
												children: "Veprime"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filteredAppts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b hover:bg-muted/40",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 whitespace-nowrap",
												children: new Date(a.slot_start).toLocaleString("sq-AL", {
													timeZone: "Europe/Tirane",
													dateStyle: "short",
													timeStyle: "short"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: a.patient_name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: `tel:${a.patient_phone}`,
													className: "text-primary hover:underline",
													children: a.patient_phone
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: a.service ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-mono text-xs",
												children: a.booking_code
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: a.status === "booked" ? "default" : a.status === "cancelled" ? "outline" : "secondary",
													children: a.status
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex gap-1 justify-end",
													children: a.status === "booked" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "ghost",
														title: "Shëno të kryer",
														onClick: () => updateApptStatus(a.id, "completed"),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "ghost",
														title: "Anulo",
														onClick: () => updateApptStatus(a.id, "cancelled"),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-4 h-4 text-destructive" })
													})] })
												})
											})
										]
									}, a.id)), filteredAppts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 7,
										className: "p-6 text-center text-muted-foreground text-sm",
										children: "S'ka rezultate."
									}) })] })]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "complaints",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 space-y-3",
							children: [complaints.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border rounded-lg p-3 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: c.subject
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												c.contact ?? "—",
												" · ",
												new Date(c.created_at).toLocaleString("sq-AL")
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: c.status,
												onValueChange: (v) => updateComplaint(c.id, { status: v }),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-[130px] h-8 text-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "open",
														children: "Hapur"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "in_progress",
														children: "Në proces"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "resolved",
														children: "Zgjidhur"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "closed",
														children: "Mbyllur"
													})
												] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: c.priority ?? "normal",
												onValueChange: (v) => updateComplaint(c.id, { priority: v }),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-[110px] h-8 text-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "low",
														children: "E ulët"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "normal",
														children: "Normale"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "high",
														children: "E lartë"
													})
												] })]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-foreground/90 whitespace-pre-wrap",
										children: c.body
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										defaultValue: c.admin_notes ?? "",
										placeholder: "Shënime të admin-it…",
										onBlur: (e) => e.target.value !== (c.admin_notes ?? "") && updateComplaint(c.id, { admin_notes: e.target.value })
									})
								]
							}, c.id)), complaints.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground text-center py-6",
								children: "S'ka ankesa."
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "users",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [users.length, " pacientë të regjistruar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => download(`pacientet-${Date.now()}.csv`, toCSV(users)),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 mr-1" }), " CSV"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "text-xs text-muted-foreground border-b",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left p-2",
												children: "Emri"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left p-2",
												children: "Email"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left p-2",
												children: "Telefoni"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "text-left p-2",
												children: "Qyteti"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: u.full_name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: u.email
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: u.phone
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: u.city
											})
										]
									}, u.id)) })]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "emails",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 space-y-2",
							children: [emails.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border rounded p-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between gap-2 flex-wrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: e.subject
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: e.status === "sent" ? "default" : e.status === "failed" ? "destructive" : "outline",
											children: e.status
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											"Për: ",
											e.to_email,
											" · ",
											new Date(e.created_at).toLocaleString("sq-AL"),
											" ",
											e.sent_at && `· dërguar ${new Date(e.sent_at).toLocaleTimeString("sq-AL")}`
										]
									}),
									e.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-destructive mt-1",
										children: e.error
									})
								]
							}, e.id)), emails.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Nuk ka email të dërguar akoma."
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "gallery",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryAdmin, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "reviews",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsAdmin, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "settings",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "p-4 space-y-3",
							children: settings.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-[220px_1fr_auto] gap-2 items-end border-b pb-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: s.key }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											s.description,
											" ",
											!s.is_public && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "ml-1",
												children: "privat"
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										defaultValue: s.value,
										onBlur: (e) => e.target.value !== s.value && saveSetting(s.key, e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: (e) => {
											const input = e.currentTarget.parentElement.querySelector("input");
											saveSetting(s.key, input.value);
										},
										children: "Ruaj"
									})
								]
							}, s.key))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "services",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-[1fr_130px_110px_auto] gap-2 items-end border rounded-lg p-3 bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Shërbim i ri" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newSvc.name,
										onChange: (e) => setNewSvc({
											...newSvc,
											name: e.target.value
										}),
										placeholder: "Emri i shërbimit"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Çmimi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newSvc.price_hint,
										onChange: (e) => setNewSvc({
											...newSvc,
											price_hint: e.target.value
										}),
										placeholder: "2000 Lekë"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Minuta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: newSvc.duration_minutes,
										onChange: (e) => setNewSvc({
											...newSvc,
											duration_minutes: Number(e.target.value)
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: addService,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-1" }), " Shto"]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-[1fr_130px_100px_110px_auto] gap-2 items-center border-b pb-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											defaultValue: s.name,
											onBlur: (e) => e.target.value !== s.name && updateService(s.id, { name: e.target.value })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											defaultValue: s.price_hint ?? "",
											placeholder: "Çmimi",
											onBlur: (e) => e.target.value !== (s.price_hint ?? "") && updateService(s.id, { price_hint: e.target.value || null })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											defaultValue: s.duration_minutes,
											onBlur: (e) => Number(e.target.value) !== s.duration_minutes && updateService(s.id, { duration_minutes: Number(e.target.value) })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: s.active ? "default" : "outline",
											size: "sm",
											onClick: () => updateService(s.id, { active: !s.active }),
											children: s.active ? "Aktiv" : "Jo aktiv"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => deleteService(s.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-destructive" })
										})
									]
								}, s.id)), services.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground text-center py-6",
									children: "S'ka shërbime."
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "conn",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Lidhjet me llogarinë Google të klinikës (Gmail + Calendar)."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: loadConn,
									disabled: busy === "status",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 mr-1 ${busy === "status" ? "animate-spin" : ""}` }), " Kontrollo lidhjet"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid md:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border rounded-lg p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-medium flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4 text-primary" }), " Gmail"]
											}), conn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: conn.gmail.verified ? "default" : "destructive",
												children: conn.gmail.verified ? "Lidhur" : conn.gmail.configured ? "Problem" : "Jo lidhur"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Dërgon dhe pranon email-et e rezervimeve, anulimeve dhe shtyrjeve — tek admini dhe tek pacienti."
										}),
										conn?.gmail?.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive",
											children: conn.gmail.error
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: doTestEmail,
											disabled: busy === "email",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4 mr-1" }), " Dërgo email test"]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border rounded-lg p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-medium flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-primary" }), " Google Calendar"]
											}), conn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: conn.calendar.verified ? "default" : "destructive",
												children: conn.calendar.verified ? "Lidhur" : conn.calendar.configured ? "Problem" : "Jo lidhur"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Çdo rezervim, anulim dhe shtyrje shfaqet në kalendarin e klinikës; event-et tuaja bllokojnë oraret online."
										}),
										conn?.calendar?.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive",
											children: conn.calendar.error
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: doSync,
											disabled: busy === "sync",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarSync, { className: `w-4 h-4 mr-1 ${busy === "sync" ? "animate-spin" : ""}` }), " Sinkronizo tani"]
										})
									]
								})]
							})]
						})
					})
				]
			})
		]
	});
}
export { AdminPage as component };
