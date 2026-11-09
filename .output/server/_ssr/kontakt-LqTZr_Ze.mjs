import { _ as CLINIC, m as PublicHeader, p as PublicFooter } from "./router-DA3D-5Pv.mjs";
import { t as Card } from "./card-CRTTy5Dx.mjs";
import { o as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { E as Phone, F as Mail, M as MessageCircle, P as MapPin, U as Clock } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/kontakt-LqTZr_Ze.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "min-h-screen bg-background",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "max-w-4xl mx-auto px-4 py-12 md:py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl md:text-5xl",
					children: "Na kontaktoni"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted-foreground",
					children: "Zgjidhni mënyrën më të përshtatshme për ju."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid sm:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${CLINIC.phone}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-5 hover:shadow-md transition-shadow h-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-6 h-6 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 font-semibold",
										children: "Telefon"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: CLINIC.phoneDisplay
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `https://wa.me/${CLINIC.whatsapp}`,
							target: "_blank",
							rel: "noopener",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-5 hover:shadow-md transition-shadow h-full border-emerald-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-6 h-6 text-emerald-600" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 font-semibold",
										children: "WhatsApp"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: CLINIC.phoneDisplay
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `mailto:${CLINIC.email}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-5 hover:shadow-md transition-shadow h-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-6 h-6 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 font-semibold",
										children: "Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground break-all",
										children: CLINIC.email
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-6 h-6 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 font-semibold",
									children: "Adresa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm text-muted-foreground",
									children: [
										CLINIC.street,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										CLINIC.city
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5 sm:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-6 h-6 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 font-semibold",
									children: "Orari"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: "E hënë – E shtunë · 09:00 – 19:00 · E diela e mbyllur"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 rounded-2xl overflow-hidden shadow-md aspect-[16/9]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: `Harta ${CLINIC.name}`,
						src: `https://www.google.com/maps?q=${encodeURIComponent(CLINIC.street + ", " + CLINIC.city)}&z=16&output=embed`,
						className: "w-full h-full border-0",
						loading: "lazy"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
	]
});
export { SplitComponent as component };
