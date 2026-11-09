import { o as __toESM } from "../_runtime.mjs";
import { t as Card } from "./card-CRTTy5Dx.mjs";
import { g as fetchReviews, m as PublicHeader, p as PublicFooter, v as Button } from "./router-DA3D-5Pv.mjs";
import { t as Input } from "./input-CqV36rr2.mjs";
import { t as Textarea } from "./textarea-DvN15-gJ.mjs";
import { t as supabase } from "./client-CN0ofe5e.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as Star } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/recensionet-D0yk2DYN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Stars({ n, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-0.5 text-primary",
		children: [
			1,
			2,
			3,
			4,
			5
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			disabled: !onPick,
			onClick: () => onPick?.(i),
			"aria-label": `${i} yje`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `w-5 h-5 ${i <= n ? "fill-current" : "opacity-30"}` })
		}, i))
	});
}
function ReviewsPage() {
	const { data = [], isLoading } = useQuery({
		queryKey: ["public-reviews"],
		queryFn: fetchReviews
	});
	const [userId, setUserId] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [rating, setRating] = (0, import_react.useState)(5);
	const [comment, setComment] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
	}, []);
	const avg = data.length ? (data.reduce((a, r) => a + r.rating, 0) / data.length).toFixed(1) : null;
	async function submit(e) {
		e.preventDefault();
		if (name.trim().length < 2) return toast.error("Shkruani emrin tuaj.");
		if (comment.trim().length < 5) return toast.error("Komenti duhet të ketë së paku 5 shkronja.");
		setBusy(true);
		const { error } = await supabase.from("reviews").insert({
			user_id: userId,
			display_name: name.trim().slice(0, 80),
			rating,
			comment: comment.trim().slice(0, 1500)
		});
		setBusy(false);
		if (error) return toast.error("Nuk u dërgua. Provoni përsëri.");
		toast.success("Faleminderit! Vlerësimi shfaqet pasi të miratohet nga klinika.");
		setComment("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-4xl mx-auto px-4 py-12 md:py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl md:text-5xl",
						children: "Recensionet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: avg ? `Mesatarja ${avg} / 5 nga ${data.length} vlerësime.` : "Vlerësimet e pacientëve tanë."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 space-y-4",
						children: [
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Duke ngarkuar…"
							}),
							!isLoading && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Ende nuk ka vlerësime të publikuara. Bëhuni i pari!"
							}),
							data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold",
											children: r.display_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { n: r.rating })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-foreground/80 whitespace-pre-line",
										children: r.comment
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 text-xs text-muted-foreground",
										children: new Date(r.created_at).toLocaleDateString("sq-AL")
									})
								]
							}, r.id))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "mt-10 p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Lini vlerësimin tuaj"
						}), userId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: submit,
							className: "mt-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
									n: rating,
									onPick: setRating
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Emri juaj (p.sh. Arta K.)",
									value: name,
									onChange: (e) => setName(e.target.value),
									maxLength: 80
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									placeholder: "Si ishte përvoja juaj?",
									value: comment,
									onChange: (e) => setComment(e.target.value),
									maxLength: 1500,
									rows: 4
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy,
									children: busy ? "Duke dërguar…" : "Dërgo vlerësimin"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Hyni në llogarinë tuaj për të lënë një vlerësim."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								className: "mt-3 inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Hyr për të vlerësuar" })
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
export { ReviewsPage as component };
