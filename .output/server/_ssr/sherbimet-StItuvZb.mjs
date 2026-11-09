import { t as Card } from "./card-CRTTy5Dx.mjs";
import { m as PublicHeader, p as PublicFooter, v as Button } from "./router-DA3D-5Pv.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { K as CircleCheck } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/sherbimet-StItuvZb.js
var import_jsx_runtime = require_jsx_runtime();
var SERVICES = [
	{
		t: "Kontroll & konsultë",
		d: "Vlerësim i plotë i shëndetit oral, plan trajtimi i personalizuar.",
		price: "1.500 – 2.500 L",
		duration: "30–60 min"
	},
	{
		t: "Pastrim profesional",
		d: "Heqje e gurëzës dhe pllakës me ultratinguj, lustrim.",
		price: "3.000 – 5.000 L",
		duration: "45 min"
	},
	{
		t: "Zbardhim profesional",
		d: "Zbardhim me llambë LED, rezultat i menjëhershëm.",
		price: "15.000 – 25.000 L",
		duration: "60–90 min"
	},
	{
		t: "Mbushje estetike",
		d: "Kompozit ngjyrë natyrale për dhëmbët e prishur.",
		price: "3.500 – 6.000 L",
		duration: "30–45 min"
	},
	{
		t: "Endodonci (kanal)",
		d: "Trajtim i kanaleve rrënjore me teknologji moderne.",
		price: "8.000 – 15.000 L",
		duration: "60–90 min"
	},
	{
		t: "Implantologji",
		d: "Implante titani, zgjidhje afatgjata për dhëmbët e munguar.",
		price: "45.000 – 90.000 L",
		duration: "60–120 min"
	},
	{
		t: "Ortodonci",
		d: "Aparate fikse dhe të lëvizshme, alignerë transparentë.",
		price: "Sipas planit",
		duration: "Konsultë"
	},
	{
		t: "Kirurgji orale",
		d: "Nxjerrje dhëmbësh, dhëmbë të mençurisë, kirurgji e vogël.",
		price: "3.000 – 12.000 L",
		duration: "30–60 min"
	}
];
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "min-h-screen bg-background",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "max-w-5xl mx-auto px-4 py-12 md:py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl md:text-5xl",
					children: "Shërbimet tona"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted-foreground max-w-2xl",
					children: "Çmimet janë orientuese — konfirmohen pas konsultës. Çdo termin zgjat minimalisht 1 orë."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid sm:grid-cols-2 gap-4",
					children: SERVICES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "p-5 bg-card-gradient",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold",
										children: s.t
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: s.d
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/70",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
											className: "text-foreground",
											children: s.price
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", s.duration] })]
									})
								]
							})]
						})
					}, s.t))
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
export { SplitComponent as component };
