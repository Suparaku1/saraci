import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CN0ofe5e.mjs";
import { t as Card } from "./card-CRTTy5Dx.mjs";
import { t as Input } from "./input-CqV36rr2.mjs";
import { i as Route$7, v as Button } from "./router-DA3D-5Pv.mjs";
import { t as Badge } from "./badge-CRSM8iyI.mjs";
import { t as Textarea } from "./textarea-DvN15-gJ.mjs";
import { i as SheetTitle, n as SheetContent, r as SheetHeader, t as Sheet } from "./sheet-0dKAHe_K.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Plus, E as Phone, F as Mail, _ as Shield, d as Tag, s as Users, t as X, x as Search } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/pacientet-eNshDnJP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PatientsPage() {
	const { user } = Route$7.useRouteContext();
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(null);
	const [patients, setPatients] = (0, import_react.useState)([]);
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [selectedAppts, setSelectedAppts] = (0, import_react.useState)([]);
	const [newTag, setNewTag] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle().then(({ data }) => setIsAdmin(!!data));
	}, [user.id]);
	async function load() {
		const { data: p } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
		setPatients(p ?? []);
		const { data: a } = await supabase.from("appointments").select("id, user_id, patient_name, slot_start, service, status, booking_code").order("slot_start", { ascending: false }).limit(1e3);
		setAppointments(a ?? []);
	}
	(0, import_react.useEffect)(() => {
		if (isAdmin) load();
	}, [isAdmin]);
	const filtered = (0, import_react.useMemo)(() => {
		const ql = q.toLowerCase().trim();
		if (!ql) return patients;
		return patients.filter((p) => [
			p.full_name,
			p.email,
			p.phone,
			p.city,
			...p.tags ?? []
		].filter(Boolean).some((v) => String(v).toLowerCase().includes(ql)));
	}, [patients, q]);
	async function openPatient(id) {
		setSelectedId(id);
		const p = patients.find((x) => x.id === id);
		setSelected(p);
		setSelectedAppts(appointments.filter((a) => a.user_id === id));
	}
	async function updatePatient(patch) {
		if (!selected) return;
		const { error } = await supabase.from("profiles").update(patch).eq("id", selected.id);
		if (error) {
			toast.error(error.message);
			return;
		}
		const updated = {
			...selected,
			...patch
		};
		setSelected(updated);
		setPatients((list) => list.map((p) => p.id === selected.id ? updated : p));
		toast.success("U ruajt");
	}
	async function addTag() {
		const t = newTag.trim();
		if (!t || !selected) return;
		await updatePatient({ tags: Array.from(/* @__PURE__ */ new Set([...selected.tags ?? [], t])) });
		setNewTag("");
	}
	async function removeTag(tag) {
		if (!selected) return;
		await updatePatient({ tags: (selected.tags ?? []).filter((t) => t !== tag) });
	}
	if (isAdmin === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children: "Duke ngarkuar..."
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6 max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-semibold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-5 h-5" }), " Akses i kufizuar"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "CRM është vetëm për personelin e klinikës."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-6xl mx-auto p-4 sm:p-6 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-3xl flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-7 h-7 text-primary" }), " CRM Pacientë"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "secondary",
					children: [patients.length, " pacientë"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Kërko emër, email, telefon, tag…",
					className: "pl-9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [filtered.map((p) => {
					const apptCount = appointments.filter((a) => a.user_id === p.id).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "p-4 hover:shadow-md transition cursor-pointer",
						onClick: () => openPatient(p.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: p.full_name || "(pa emër)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5",
										children: [
											p.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3 h-3" }),
													" ",
													p.email
												]
											}),
											p.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3 h-3" }),
													" ",
													p.phone
												]
											}),
											p.city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", p.city] })
										]
									}),
									(p.tags ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1 mt-2",
										children: (p.tags ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-xs",
											children: t
										}, t))
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-right shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									children: [apptCount, " termine"]
								})
							})]
						})
					}, p.id);
				}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm text-muted-foreground py-8",
					children: "S'ka rezultate."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!selectedId,
				onOpenChange: (o) => !o && setSelectedId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "right",
					className: "w-full sm:max-w-lg overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: selected?.full_name || "Pacienti" }) }), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-muted-foreground",
								children: [
									selected.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4" }),
											" ",
											selected.email
										]
									}),
									selected.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `tel:${selected.phone}`,
												className: "text-primary hover:underline",
												children: selected.phone
											})
										]
									}),
									selected.city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Qyteti: ", selected.city] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs uppercase text-muted-foreground mb-2 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-3 h-3" }), " Tagje"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1 mb-2",
									children: (selected.tags ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "secondary",
										className: "gap-1",
										children: [t, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => removeTag(t),
											"aria-label": "hiq",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" })
										})]
									}, t))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newTag,
										onChange: (e) => setNewTag(e.target.value),
										placeholder: "VIP, alergji, kariozë…",
										onKeyDown: (e) => e.key === "Enter" && addTag()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "outline",
										onClick: addTag,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" })
									})]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase text-muted-foreground mb-1",
								children: "Historia mjekësore"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								defaultValue: selected.medical_history ?? "",
								rows: 3,
								placeholder: "Alergji, sëmundje kronike, ilaçe…",
								onBlur: (e) => e.target.value !== (selected.medical_history ?? "") && updatePatient({ medical_history: e.target.value })
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase text-muted-foreground mb-1",
								children: "Shënime klinike"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								defaultValue: selected.clinical_notes ?? "",
								rows: 4,
								placeholder: "Shënime private të mjekes…",
								onBlur: (e) => e.target.value !== (selected.clinical_notes ?? "") && updatePatient({ clinical_notes: e.target.value })
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs uppercase text-muted-foreground mb-2",
								children: [
									"Historia e termineve (",
									selectedAppts.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 max-h-64 overflow-y-auto",
								children: [selectedAppts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border rounded-md p-2 text-xs flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: new Date(a.slot_start).toLocaleString("sq-AL", {
											timeZone: "Europe/Tirane",
											dateStyle: "short",
											timeStyle: "short"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground",
										children: [
											a.service ?? "—",
											" · ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: a.booking_code
											})
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: a.status === "booked" ? "default" : "outline",
										children: a.status
									})]
								}, a.id)), selectedAppts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "S'ka termine."
								})]
							})] })
						]
					})]
				})
			})
		]
	});
}
export { PatientsPage as component };
