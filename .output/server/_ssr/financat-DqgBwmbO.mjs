import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CN0ofe5e.mjs";
import { v as Button } from "./router-DA3D-5Pv.mjs";
import { t as Input } from "./input-CqV36rr2.mjs";
import { t as Label } from "./label-BYIfJH-v.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CRTTy5Dx.mjs";
import { t as Badge } from "./badge-CRSM8iyI.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, t as Dialog } from "./dialog-CDPdBsuf.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Plus, H as Download, l as TrendingUp } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/financat-DqgBwmbO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_LABEL = {
	pending: "Në pritje",
	paid: "Paguar",
	refunded: "Rimbursuar",
	cancelled: "Anuluar"
};
function FinancePage() {
	const [payments, setPayments] = (0, import_react.useState)([]);
	const [appts, setAppts] = (0, import_react.useState)([]);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [form, setForm] = (0, import_react.useState)({
		appointment_id: "",
		amount: "",
		provider: "cash",
		status: "paid",
		notes: ""
	});
	async function load() {
		const [{ data: p }, { data: a }] = await Promise.all([supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(500), supabase.from("appointments").select("id, booking_code, patient_name, slot_start, service").order("slot_start", { ascending: false }).limit(200)]);
		setPayments(p ?? []);
		setAppts(a ?? []);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return;
			const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
			setIsAdmin(!!role);
			if (role) load();
			else setLoading(false);
		})();
	}, []);
	const paid = payments.filter((p) => p.status === "paid");
	const now = /* @__PURE__ */ new Date();
	const thisMonth = paid.filter((p) => {
		const d = new Date(p.created_at);
		return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
	});
	const total = paid.reduce((s, p) => s + Number(p.amount), 0);
	const monthTotal = thisMonth.reduce((s, p) => s + Number(p.amount), 0);
	const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);
	const monthly = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of paid) {
			const d = new Date(p.created_at);
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
			map.set(key, (map.get(key) ?? 0) + Number(p.amount));
		}
		return [...map.entries()].sort((a, b) => a[0] < b[0] ? 1 : -1).slice(0, 12);
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
			notes: form.notes.trim() || (appt ? `${appt.patient_name} — ${appt.service ?? "Termin"}` : null)
		});
		if (error) return toast.error(error.message);
		toast.success("Pagesa u regjistrua.");
		setForm({
			appointment_id: "",
			amount: "",
			provider: "cash",
			status: "paid",
			notes: ""
		});
		load();
	}
	function exportCsv() {
		const rows = [[
			"Data",
			"Shuma",
			"Monedha",
			"Statusi",
			"Mënyra",
			"Shënime"
		], ...payments.map((p) => [
			new Date(p.created_at).toLocaleString("sq-AL"),
			String(p.amount),
			p.currency,
			STATUS_LABEL[p.status] ?? p.status,
			p.provider,
			p.notes ?? ""
		])];
		const cell = (c) => {
			let s = String(c);
			if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
			return `"${s.replace(/"/g, "\"\"")}"`;
		};
		const csv = rows.map((r) => r.map(cell).join(",")).join("\n");
		const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = `pagesat-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
	if (isAdmin === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Kjo faqe është vetëm për administratorët."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 md:p-8 space-y-6 max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-display font-semibold",
					children: "Financat"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Pagesat e pacientëve dhe të ardhurat mujore."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: exportCsv,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 mr-2" }), " CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), " Pagesë e re"] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Regjistro pagesë" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Termini (opsional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
									value: form.appointment_id,
									onChange: (e) => setForm({
										...form,
										appointment_id: e.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "— Pa termin —"
									}), appts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: a.id,
										children: [
											a.booking_code,
											" · ",
											a.patient_name,
											" · ",
											new Date(a.slot_start).toLocaleDateString("sq-AL")
										]
									}, a.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Shuma (LEK)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.amount,
										onChange: (e) => setForm({
											...form,
											amount: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mënyra" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
										value: form.provider,
										onChange: (e) => setForm({
											...form,
											provider: e.target.value
										}),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "cash",
												children: "Kesh"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "card",
												children: "Kartë"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "bank",
												children: "Bankë"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Statusi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
									value: form.status,
									onChange: (e) => setForm({
										...form,
										status: e.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "paid",
											children: "Paguar"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "pending",
											children: "Në pritje"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "refunded",
											children: "Rimbursuar"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Shënime" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.notes,
									onChange: (e) => setForm({
										...form,
										notes: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: addPayment,
								children: "Ruaj"
							})
						]
					})] })] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground",
							children: "Këtë muaj"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "text-2xl font-semibold flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5 text-primary" }),
							monthTotal.toLocaleString("sq-AL"),
							" LEK"
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground",
							children: "Totali i paguar"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "text-2xl font-semibold",
						children: [total.toLocaleString("sq-AL"), " LEK"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground",
							children: "Në pritje"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "text-2xl font-semibold",
						children: [pending.toLocaleString("sq-AL"), " LEK"]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Të ardhurat sipas muajit"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: monthly.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nuk ka pagesa të regjistruara."
				}) : monthly.map(([key, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: key
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [val.toLocaleString("sq-AL"), " LEK"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 rounded-full bg-muted overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary",
							style: { width: `${val / max * 100}%` }
						})
					})]
				}, key))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Pagesat"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0 overflow-x-auto",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 text-sm text-muted-foreground",
					children: "Duke ngarkuar…"
				}) : payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 text-sm text-muted-foreground",
					children: "Nuk ka pagesa."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Data"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Shuma"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Statusi"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Mënyra"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Shënime"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 whitespace-nowrap",
								children: new Date(p.created_at).toLocaleDateString("sq-AL")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3 font-medium",
								children: [
									Number(p.amount).toLocaleString("sq-AL"),
									" ",
									p.currency
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: p.status === "paid" ? "secondary" : "outline",
									children: STATUS_LABEL[p.status] ?? p.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-muted-foreground",
								children: p.provider
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-muted-foreground",
								children: p.notes ?? "—"
							})
						]
					}, p.id)) })]
				})
			})] })
		]
	});
}
export { FinancePage as component };
