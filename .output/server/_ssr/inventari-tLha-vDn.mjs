import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CN0ofe5e.mjs";
import { v as Button } from "./router-DA3D-5Pv.mjs";
import { t as Input } from "./input-CqV36rr2.mjs";
import { t as Label } from "./label-BYIfJH-v.mjs";
import { t as Textarea } from "./textarea-DvN15-gJ.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CRTTy5Dx.mjs";
import { t as Badge } from "./badge-CRSM8iyI.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, t as Dialog } from "./dialog-CDPdBsuf.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Plus, D as Package, J as CircleArrowDown, c as TriangleAlert, q as CircleArrowUp } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/inventari-tLha-vDn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InventoryPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [moves, setMoves] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [q, setQ] = (0, import_react.useState)("");
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		category: "",
		unit: "copë",
		quantity: "0",
		min_quantity: "0",
		unit_cost: "",
		supplier: "",
		notes: ""
	});
	async function load() {
		const [{ data: it }, { data: mv }] = await Promise.all([supabase.from("inventory_items").select("*").order("name"), supabase.from("stock_movements").select("*").order("created_at", { ascending: false }).limit(50)]);
		setItems(it ?? []);
		setMoves(mv ?? []);
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
	const filtered = (0, import_react.useMemo)(() => {
		const s = q.trim().toLowerCase();
		if (!s) return items;
		return items.filter((i) => [
			i.name,
			i.category,
			i.supplier
		].filter(Boolean).some((v) => v.toLowerCase().includes(s)));
	}, [items, q]);
	const lowStock = items.filter((i) => Number(i.quantity) <= Number(i.min_quantity));
	const totalValue = items.reduce((s, i) => s + Number(i.quantity) * Number(i.unit_cost ?? 0), 0);
	async function createItem() {
		if (!form.name.trim()) return toast.error("Emri i artikullit është i detyrueshëm.");
		const { error } = await supabase.from("inventory_items").insert({
			name: form.name.trim(),
			category: form.category.trim() || null,
			unit: form.unit.trim() || "copë",
			quantity: Number(form.quantity) || 0,
			min_quantity: Number(form.min_quantity) || 0,
			unit_cost: form.unit_cost ? Number(form.unit_cost) : null,
			supplier: form.supplier.trim() || null,
			notes: form.notes.trim() || null
		});
		if (error) return toast.error(error.message);
		toast.success("Artikulli u shtua.");
		setForm({
			name: "",
			category: "",
			unit: "copë",
			quantity: "0",
			min_quantity: "0",
			unit_cost: "",
			supplier: "",
			notes: ""
		});
		load();
	}
	async function move(item, type) {
		const raw = window.prompt(type === "in" ? `Sa ${item.unit} të shtohen?` : `Sa ${item.unit} të hiqen?`, "1");
		if (!raw) return;
		const qty = Number(raw);
		if (!qty || qty <= 0) return toast.error("Sasi e pavlefshme.");
		const { data: u } = await supabase.auth.getUser();
		const { error } = await supabase.from("stock_movements").insert({
			item_id: item.id,
			movement_type: type,
			quantity: qty,
			reason: type === "in" ? "Furnizim" : "Konsum",
			created_by: u.user?.id ?? null
		});
		if (error) return toast.error(error.message);
		toast.success("Stoku u përditësua.");
		load();
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
					children: "Inventari"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Materialet, stoku dhe furnitorët e klinikës."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), " Artikull i ri"] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Shto artikull" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Emri" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kategoria" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.category,
									onChange: (e) => setForm({
										...form,
										category: e.target.value
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Njësia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.unit,
									onChange: (e) => setForm({
										...form,
										unit: e.target.value
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sasia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.quantity,
										onChange: (e) => setForm({
											...form,
											quantity: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Minimum" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.min_quantity,
										onChange: (e) => setForm({
											...form,
											min_quantity: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Çmim/njësi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: form.unit_cost,
										onChange: (e) => setForm({
											...form,
											unit_cost: e.target.value
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Furnitori" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.supplier,
								onChange: (e) => setForm({
									...form,
									supplier: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Shënime" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.notes,
								onChange: (e) => setForm({
									...form,
									notes: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: createItem,
							children: "Ruaj"
						})
					]
				})] })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground",
							children: "Artikuj"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "text-2xl font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-5 h-5 text-primary" }), items.length]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground",
							children: "Nën minimum"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "text-2xl font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-destructive" }), lowStock.length]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground",
							children: "Vlera e stokut"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "text-2xl font-semibold",
						children: [totalValue.toLocaleString("sq-AL"), " LEK"]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Kërko artikull, kategori, furnitor…",
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "max-w-sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0 overflow-x-auto",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 text-sm text-muted-foreground",
					children: "Duke ngarkuar…"
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 text-sm text-muted-foreground",
					children: "Nuk ka artikuj."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Artikulli"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Kategoria"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Sasia"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Min"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Furnitori"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Veprime"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((i) => {
						const low = Number(i.quantity) <= Number(i.min_quantity);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 font-medium",
									children: i.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-muted-foreground",
									children: i.category ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: low ? "destructive" : "secondary",
										children: [
											Number(i.quantity),
											" ",
											i.unit
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-muted-foreground",
									children: Number(i.min_quantity)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-muted-foreground",
									children: i.supplier ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-3 text-right whitespace-nowrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => move(i, "in"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowDown, { className: "w-4 h-4 mr-1" }), " Hyrje"]
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => move(i, "out"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "w-4 h-4 mr-1" }), " Dalje"]
										})
									]
								})
							]
						}, i.id);
					}) })]
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Lëvizjet e fundit të stokut"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-2",
				children: moves.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nuk ka lëvizje."
				}) : moves.map((m) => {
					const item = items.find((i) => i.id === m.item_id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-sm border-b border-border pb-2 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							item?.name ?? "Artikull",
							" — ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: m.reason ?? m.movement_type
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: m.movement_type === "out" ? "text-destructive" : "text-primary",
							children: [m.movement_type === "out" ? "−" : "+", Number(m.quantity)]
						})]
					}, m.id);
				})
			})] })
		]
	});
}
export { InventoryPage as component };
