import { t as Card } from "./card-CRTTy5Dx.mjs";
import { _ as CLINIC, m as PublicHeader, p as PublicFooter, v as Button } from "./router-DA3D-5Pv.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { V as Heart, g as Sparkles, it as Award } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/rreth-BTBbnSxb.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "min-h-screen bg-background",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "max-w-5xl mx-auto px-4 py-12 md:py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid md:grid-cols-2 gap-8 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl md:text-5xl",
						children: "Rreth Saraci Dental"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-lg text-foreground/80",
						children: [
							"Klinika Saraci Dental ndodhet në ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								CLINIC.street,
								", ",
								CLINIC.city
							] }),
							", dhe drejtohet nga ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: CLINIC.dentist }),
							". Misioni ynë: kujdes dentar modern, i butë dhe i përballueshëm për çdo pacient."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: CLINIC.photos.team,
						alt: `${CLINIC.dentist} me ekipin`,
						className: "rounded-2xl shadow-xl aspect-[4/5] object-cover w-full",
						loading: "lazy"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid md:grid-cols-3 gap-4",
					children: [
						[
							Heart,
							"Kujdes njerëzor",
							"Çdo pacient trajtohet si familjar. Dëgjojmë, shpjegojmë, kujdesemi."
						],
						[
							Award,
							"Ekspertizë",
							`${CLINIC.dentist} — mjek stomatolog me përvojë të gjatë klinike.`
						],
						[
							Sparkles,
							"Teknologji",
							"Pajisje moderne, materiale të certifikuara europiane."
						]
					].map(([Icon, t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-8 h-8 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-semibold",
								children: t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: d
							})
						]
					}, t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid md:grid-cols-3 gap-3",
					children: [
						CLINIC.photos.treatment,
						CLINIC.photos.whitening,
						CLINIC.photos.team2
					].map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: "Klinika Saraci Dental gjatë punës",
						loading: "lazy",
						className: "rounded-xl aspect-square object-cover w-full"
					}, src))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 p-6 rounded-2xl bg-hero-gradient",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: CLINIC.dentist
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-foreground/80",
						children: "E diplomuar në Fakultetin e Mjekësisë Dentare, me trajnime të vazhdueshme në estetikë, endodonci dhe implantologji. E përkushtuar për të krijuar një përvojë të qetë dhe pa stres për çdo pacient."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { mode: "register" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							children: "Rezervo konsultën"
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
	]
});
export { SplitComponent as component };
