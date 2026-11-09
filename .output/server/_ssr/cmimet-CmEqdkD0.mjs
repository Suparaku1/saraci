import { m as PublicHeader, p as PublicFooter, u as pricesQuery, v as Button } from "./router-DA3D-5Pv.mjs";
import { t as Card } from "./card-CRTTy5Dx.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { U as Clock } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/cmimet-CmEqdkD0.js
var import_jsx_runtime = require_jsx_runtime();
function PricesPage() {
	const { data } = useSuspenseQuery(pricesQuery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-4xl mx-auto px-4 py-12 md:py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl md:text-5xl",
						children: "Çmimet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground max-w-2xl",
						children: "Çmimet përditësohen nga klinika dhe janë orientuese — konfirmohen pas konsultës."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "mt-8 divide-y divide-border",
						children: [data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-5 text-sm text-muted-foreground",
							children: "Çmimet do publikohen së shpejti."
						}), data.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold",
										children: s.name
									}),
									s.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: s.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-xs text-muted-foreground flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }),
											" ",
											s.duration_minutes,
											" min"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-lg text-primary whitespace-nowrap",
								children: s.price_hint || "Sipas konsultës"
							})]
						}, s.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: { mode: "register" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								children: "Rezervo tani"
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
export { PricesPage as component };
