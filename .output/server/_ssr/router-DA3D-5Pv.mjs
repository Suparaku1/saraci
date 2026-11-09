import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D8jQpDG7.mjs";
import { t as supabase } from "./client-CN0ofe5e.mjs";
import { t as cn } from "./utils-DWGjSd5x.mjs";
import { a as streamText, i as isStepCount, o as require_jsx_runtime, r as convertToModelMessages, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { h as Slot } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as sendGmail } from "./email.server-yxKyM8V_.mjs";
import { o as tplReminder } from "./email-templates-Diue21CT.mjs";
import { S as useRouter, Ut as redirect, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Ht as object, Kt as string, Vt as number, dt as tool } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { i as QueryClientProvider, t as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { E as Phone, F as Mail, M as MessageCircle, N as Menu, P as MapPin, U as Clock, t as X } from "../_libs/lucide-react.mjs";
import { a as createTanStackListToolsHandler, i as createTanStackInvokeToolHandler, n as defineMcp, o as createTanStackMcpHandler, r as defineTool, s as createTanStackOAuthProtectedResourceMetadataHandler, t as auth } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
import processModule from "node:process";
// node_modules/.nitro/vite/services/ssr/assets/button-BRHp6KPB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
// node_modules/.nitro/vite/services/ssr/assets/routes-CfmkvilA.js
var clinic_front_default = "/assets/clinic-front-DlYpU6wZ.jpg";
var CLINIC = {
	name: "Saraci Dental Clinic",
	phone: "+355675402044",
	phoneDisplay: "+355 67 540 2044",
	whatsapp: "355675402044",
	street: "Rruga Ptoleme Xhuvani",
	city: "Elbasan 3001",
	country: "AL",
	lat: 41.1125,
	lng: 20.0822,
	email: "xhensilasaraci@gmail.com",
	dentist: "Dr. Xhensila Saraci",
	photos: {
		hero: clinic_front_default.url,
		room: "/assets/clinic-room-DjZTzzQL.jpg".url,
		team: "/assets/clinic-team-BvXvvHKK.jpg".url,
		team2: "/assets/clinic-team2-DmGgiDCY.jpg".url,
		treatment: "/assets/clinic-treatment-DzbZL2Me.jpg".url,
		whitening: "/assets/clinic-whitening-Bc26HPtY.jpg".url,
		office: "/assets/clinic-office-DlpKGVMz.jpg".url
	}
};
// node_modules/.nitro/vite/services/ssr/assets/public-content-CAWVPMpd.js
async function fetchPrices() {
	const { data, error } = await supabase.from("service_catalog").select("id, name, description, price_hint, duration_minutes").eq("active", true).order("name");
	if (error) throw error;
	return data ?? [];
}
async function fetchGallery() {
	const { data, error } = await supabase.from("before_after").select("id, title, description, before_path, after_path").order("created_at", { ascending: false });
	if (error) throw error;
	const rows = data ?? [];
	if (rows.length === 0) return [];
	const paths = rows.flatMap((r) => [r.before_path, r.after_path]);
	const { data: signed } = await supabase.storage.from("gallery").createSignedUrls(paths, 21600);
	const map = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
	return rows.map((r) => ({
		id: r.id,
		title: r.title,
		description: r.description,
		before: map.get(r.before_path) ?? "",
		after: map.get(r.after_path) ?? ""
	}));
}
async function fetchReviews() {
	const { data, error } = await supabase.from("reviews").select("id, display_name, rating, comment, created_at").eq("approved", true).order("created_at", { ascending: false }).limit(100);
	if (error) throw error;
	return data ?? [];
}
// node_modules/.nitro/vite/services/ssr/assets/router-DA3D-5Pv.js
var styles_default = "/assets/styles-D6Pfyfbf.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var installed = false;
async function report(message, stack) {
	try {
		await fetch("/api/public/hooks/errors", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				message: message.slice(0, 2e3),
				stack: stack?.slice(0, 8e3),
				path: window.location.pathname,
				userAgent: navigator.userAgent.slice(0, 500)
			})
		});
	} catch {}
}
function installClientErrorReporting() {
	if (installed || typeof window === "undefined") return;
	installed = true;
	window.addEventListener("error", (e) => {
		if (!e.message) return;
		report(e.message, e.error?.stack);
	});
	window.addEventListener("unhandledrejection", (e) => {
		const r = e.reason;
		report(typeof r === "string" ? r : r?.message ?? "Unhandled rejection", r?.stack);
	});
}
var KEY = "saraci_cookie_consent_v1";
function CookieConsent() {
	const [show, setShow] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			if (!localStorage.getItem(KEY)) setShow(true);
		} catch {}
	}, []);
	function decide(value) {
		try {
			localStorage.setItem(KEY, JSON.stringify({
				value,
				at: (/* @__PURE__ */ new Date()).toISOString()
			}));
		} catch {}
		setShow(false);
	}
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-label": "Pëlqimi për cookies",
		className: "fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl rounded-xl border border-border bg-background/98 backdrop-blur shadow-2xl p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-base font-semibold",
					children: "Respektojmë privatësinë tuaj"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: [
						"Përdorim vetëm cookies të nevojshme për të mbajtur hyrjen dhe rezervimin tuaj të sigurt. Nuk përdorim reklama dhe nuk shesim të dhëna. Lexoni",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privatesia",
							className: "underline hover:text-foreground",
							children: "Politikën e privatësisë"
						}),
						" ",
						"dhe",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/kushtet",
							className: "underline hover:text-foreground",
							children: "Kushtet e shërbimit"
						}),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col sm:flex-row gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => decide("accepted"),
						className: "sm:w-auto",
						children: "Pranoj"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => decide("essential"),
						className: "sm:w-auto",
						children: "Vetëm të nevojshmet"
					})]
				})
			]
		})
	});
}
var PHONE = "+355675402044";
var WHATSAPP = "355675402044";
function ContactFab() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed right-4 bottom-24 sm:bottom-6 z-50 flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Përshëndetje! Dua të rezervoj një termin në Saraci Dental.")}`,
			target: "_blank",
			rel: "noopener",
			"aria-label": "Shkruaj në WhatsApp",
			className: "w-12 h-12 sm:w-14 sm:h-14 grid place-items-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-6 h-6" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: `tel:${PHONE}`,
			"aria-label": "Telefono klinikën",
			className: "w-12 h-12 sm:w-14 sm:h-14 grid place-items-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-5 h-5" })
		})]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Faqja nuk u gjet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Faqja që kërkoni nuk ekziston ose është zhvendosur."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Kthehu në kryefaqe"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Diçka shkoi keq"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Provoni të rifreskoni ose të ktheheni në kryefaqe."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Provo përsëri"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent",
						children: "Kryefaqe"
					})]
				})
			]
		})
	});
}
var Route$31 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Saraci Dental Clinic — Klinika juaj dentare në Elbasan" },
			{
				name: "description",
				content: "Saraci Dental Clinic në Elbasan. Rezervoni terminin online, bisedoni me recepsionistin virtual dhe merrni kujdes dentar profesional nga Dr. Xhensila Saraci."
			},
			{
				name: "author",
				content: "Saraci Dental Clinic"
			},
			{
				name: "theme-color",
				content: "#0f766e"
			},
			{
				property: "og:title",
				content: "Saraci Dental Clinic — Elbasan"
			},
			{
				property: "og:description",
				content: "Klinikë dentare profesionale në Elbasan. Rezervo online, chat & voice agjent në shqip."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-192.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "sq",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$31.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		installClientErrorReporting();
	}, []);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactFab, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieConsent, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-right",
				richColors: true
			})
		]
	});
}
var $$splitComponentImporter$21 = () => import("./routes-sBGX49As.mjs");
var SITE_URL = "https://saracidental.al";
var jsonLd = {
	"@context": "https://schema.org",
	"@type": "Dentist",
	name: CLINIC.name,
	image: clinic_front_default.url,
	url: SITE_URL,
	telephone: CLINIC.phone,
	email: CLINIC.email,
	priceRange: "€€",
	address: {
		"@type": "PostalAddress",
		streetAddress: CLINIC.street,
		addressLocality: "Elbasan",
		postalCode: "3001",
		addressCountry: CLINIC.country
	},
	geo: {
		"@type": "GeoCoordinates",
		latitude: CLINIC.lat,
		longitude: CLINIC.lng
	},
	openingHoursSpecification: [{
		"@type": "OpeningHoursSpecification",
		dayOfWeek: [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		],
		opens: "09:00",
		closes: "19:00"
	}],
	areaServed: "Elbasan, Shqipëri",
	medicalSpecialty: "Dentistry",
	founder: {
		"@type": "Person",
		name: "Xhensila Saraci"
	}
};
var Route$30 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Saraci Dental Clinic — Klinika dentare në Elbasan | Rezervo online" },
			{
				name: "description",
				content: "Klinikë dentare profesionale në Elbasan, drejtuar nga Dr. Xhensila Saraci. Rezervo terminin online 24/7, bisedo me recepsionistin virtual në shqip."
			},
			{
				name: "keywords",
				content: "dentist elbasan, klinike dentare elbasan, saraci dental, xhensila saraci, rezervim online dentist, implante dhembesh elbasan"
			},
			{
				property: "og:title",
				content: "Saraci Dental Clinic — Elbasan"
			},
			{
				property: "og:description",
				content: "Rezervo terminin online. Chat & voice agjent në shqip. Hën–Sht 09–19."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: SITE_URL
			},
			{
				property: "og:image",
				content: clinic_front_default.url
			},
			{
				property: "og:locale",
				content: "sq_AL"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Saraci Dental Clinic — Elbasan"
			},
			{
				name: "twitter:description",
				content: "Klinika juaj dentare në Elbasan. Rezervo online."
			},
			{
				name: "twitter:image",
				content: clinic_front_default.url
			}
		],
		links: [{
			rel: "canonical",
			href: SITE_URL
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify(jsonLd)
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
function PublicHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const links = [
		["/sherbimet", "Shërbimet"],
		["/cmimet", "Çmimet"],
		["/galeria", "Para/pas"],
		["/recensionet", "Recensionet"],
		["/rreth", "Rreth nesh"],
		["/faq", "Pyetje"],
		["/kontakt", "Kontakt"]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "border-b border-border/60 bg-background/85 backdrop-blur sticky top-0 z-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto px-4 h-16 flex items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold",
						children: "S"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold",
						children: "Saraci Dental"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden md:flex items-center gap-1",
					children: [
						links.map(([to, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to,
							className: "px-3 py-2 text-sm text-foreground/80 hover:text-foreground rounded-md hover:bg-accent",
							children: label
						}, to)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								children: "Hyr"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: { mode: "register" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Rezervo" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "md:hidden p-2 -mr-2",
					"aria-label": "Menu",
					onClick: () => setOpen((o) => !o),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-6 h-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-6 h-6" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden border-t border-border/60 bg-background",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-3 flex flex-col gap-1",
				children: [
					links.map(([to, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to,
						onClick: () => setOpen(false),
						className: "px-3 py-2.5 text-sm rounded-md hover:bg-accent",
						children: label
					}, to)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border my-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						onClick: () => setOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "w-full justify-start",
							children: "Hyr"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { mode: "register" },
						onClick: () => setOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							children: "Rezervo terminin"
						})
					})
				]
			})
		})]
	});
}
function PublicFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border/60 bg-muted/30 mt-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-display font-bold",
						children: "S"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-semibold",
						children: "Saraci Dental"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-muted-foreground",
					children: [
						"Klinikë dentare në Elbasan, drejtuar nga ",
						CLINIC.dentist,
						". Kujdes profesional, teknologji moderne."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold mb-2",
					children: "Klinika"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-1.5 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/sherbimet",
							className: "hover:text-foreground",
							children: "Shërbimet"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/rreth",
							className: "hover:text-foreground",
							children: "Rreth nesh"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							className: "hover:text-foreground",
							children: "Pyetje të shpeshta"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/kontakt",
							className: "hover:text-foreground",
							children: "Kontakt"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold mb-2",
					children: "Kontakt"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-1.5 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `tel:${CLINIC.phone}`,
									className: "hover:text-foreground",
									children: CLINIC.phoneDisplay
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `mailto:${CLINIC.email}`,
									className: "hover:text-foreground break-all",
									children: CLINIC.email
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-4 h-4 mt-0.5 shrink-0" }),
								" ",
								CLINIC.street,
								", ",
								CLINIC.city
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4" }), " Hën–Sht 09:00–19:00"]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold mb-2",
						children: "Rezervo tani"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mb-2",
						children: "Sistemi ynë online punon 24/7."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { mode: "register" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							children: "Rezervo online"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `https://wa.me/${CLINIC.whatsapp}`,
						target: "_blank",
						rel: "noopener",
						className: "block mt-2 text-xs text-emerald-600 hover:underline",
						children: ["WhatsApp ", CLINIC.phoneDisplay]
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border/60 py-4 text-center text-xs text-muted-foreground space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap justify-center gap-x-4 gap-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/privatesia",
					className: "hover:text-foreground",
					children: "Politika e privatësisë"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/kushtet",
					className: "hover:text-foreground",
					children: "Kushtet e shërbimit"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" Saraci Dental Clinic — ",
				CLINIC.street,
				", ",
				CLINIC.city
			] })]
		})]
	});
}
var $$splitComponentImporter$20 = () => import("./route-DzbahHNf.mjs");
var Route$29 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./auth-7dYm33-X.mjs");
var Route$28 = createFileRoute("/auth")({
	validateSearch: (s) => ({
		mode: s.mode === "register" ? "register" : "login",
		next: typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//") ? s.next : void 0
	}),
	head: () => ({ meta: [
		{ title: "Hyr me email — Saraci Dental Clinic" },
		{
			name: "description",
			content: "Hyni ose regjistrohuni me email dhe fjalëkalim në Saraci Dental Clinic."
		},
		{
			property: "og:title",
			content: "Hyr me email — Saraci Dental Clinic"
		},
		{
			property: "og:description",
			content: "Hyrja e pacientëve dhe stafit në Saraci Dental Clinic."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var pricesQuery = queryOptions({
	queryKey: ["public-prices"],
	queryFn: fetchPrices,
	staleTime: 6e4
});
var $$splitComponentImporter$18 = () => import("./cmimet-CmEqdkD0.mjs");
var Route$27 = createFileRoute("/cmimet")({
	head: () => ({ meta: [
		{ title: "Çmimet — Saraci Dental Clinic Elbasan" },
		{
			name: "description",
			content: "Lista e përditësuar e çmimeve të shërbimeve dentare në Saraci Dental Clinic, Elbasan."
		},
		{
			property: "og:title",
			content: "Çmimet e shërbimeve — Saraci Dental"
		},
		{
			property: "og:description",
			content: "Çmime transparente për çdo shërbim dentar në Elbasan."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(pricesQuery),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var FAQS = [
	{
		q: "Si mund të rezervoj një termin?",
		a: "Regjistroheni në faqen tonë dhe zgjidhni datën/orarin e lirë. Sistemi konfirmon menjëherë me një kod rezervimi."
	},
	{
		q: "Sa zgjat një vizitë?",
		a: "Çdo termin është 1 orë fiks. Kjo na lejon të kushtojmë kohën e nevojshme për çdo pacient pa nxitim."
	},
	{
		q: "A mund të anuloj ose të shtyj terminin?",
		a: "Po, nga faqja 'Historia' me kodin e rezervimit dhe telefonin/email-in tuaj. Ju lutemi lajmëroni së paku 24 orë përpara."
	},
	{
		q: "Cili është orari i klinikës?",
		a: "E hënë deri të shtunë, 09:00 – 19:00. Të dielën jemi mbyllur."
	},
	{
		q: "A pranohet pagesa me kartë?",
		a: "Po, pranojmë para në dorë dhe kartë (Visa, Mastercard)."
	},
	{
		q: "A ofroni plane pagese për trajtime të mëdha?",
		a: "Për trajtime si implantologji apo ortodonci ofrojmë plane pagese me këste. Konsultohuni në telefon ose gjatë vizitës."
	},
	{
		q: "Si funksionon recepsionisti virtual?",
		a: "Është një asistent me AI në shqip që ju ndihmon të rezervoni, të anuloni ose të merrni informacion 24/7 — me chat ose me zë."
	},
	{
		q: "A janë të sigurta të dhënat e mia?",
		a: "Absolutisht. Të dhënat ruhen të enkriptuara dhe përdoren vetëm për menaxhimin e termineve tuaja."
	}
];
var $$splitComponentImporter$17 = () => import("./faq-CMrAaWUV.mjs");
var faqLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: FAQS.map((f) => ({
		"@type": "Question",
		name: f.q,
		acceptedAnswer: {
			"@type": "Answer",
			text: f.a
		}
	}))
};
var Route$26 = createFileRoute("/faq")({
	head: () => ({
		meta: [
			{ title: "Pyetjet e shpeshta — Saraci Dental Clinic" },
			{
				name: "description",
				content: "Përgjigje për pyetjet më të shpeshta rreth rezervimit, orarit, pagesave dhe shërbimeve në Saraci Dental Elbasan."
			},
			{
				property: "og:title",
				content: "Pyetje të shpeshta — Saraci Dental"
			},
			{
				property: "og:description",
				content: "Gjeni përgjigjen tuaj shpejt."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify(faqLd)
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./galeria-SwDRryX4.mjs");
var Route$25 = createFileRoute("/galeria")({
	head: () => ({ meta: [
		{ title: "Galeria para/pas — Saraci Dental Clinic" },
		{
			name: "description",
			content: "Rezultate reale para dhe pas trajtimit në Saraci Dental, të publikuara me pëlqimin e pacientëve."
		},
		{
			property: "og:title",
			content: "Para / pas — Saraci Dental Elbasan"
		},
		{
			property: "og:description",
			content: "Rezultate reale, me pëlqimin e pacientëve."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./kontakt-LqTZr_Ze.mjs");
var Route$24 = createFileRoute("/kontakt")({
	head: () => ({ meta: [
		{ title: "Kontakt — Saraci Dental Clinic Elbasan" },
		{
			name: "description",
			content: `Kontaktoni ${CLINIC.name} në ${CLINIC.street}, ${CLINIC.city}. Tel/WhatsApp ${CLINIC.phoneDisplay}, email ${CLINIC.email}.`
		},
		{
			property: "og:title",
			content: "Kontakt — Saraci Dental Elbasan"
		},
		{
			property: "og:description",
			content: `Na gjeni në ${CLINIC.street}. Hën–Sht 09–19.`
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			property: "og:image",
			content: CLINIC.photos.hero
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./kushtet-Be6Kta_d.mjs");
var TITLE$1 = "Kushtet e shërbimit — Saraci Dental Clinic";
var DESC$1 = "Kushtet e rezervimit online, anulimit, zhvendosjes dhe mosparaqitjes në Saraci Dental Clinic, Elbasan.";
var Route$23 = createFileRoute("/kushtet")({
	head: () => ({ meta: [
		{ title: TITLE$1 },
		{
			name: "description",
			content: DESC$1
		},
		{
			property: "og:title",
			content: TITLE$1
		},
		{
			property: "og:description",
			content: DESC$1
		},
		{
			property: "og:type",
			content: "article"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
function supabaseForUser(ctx) {
	return createClient(processModule.env.SUPABASE_URL, processModule.env.SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var list_services_default = defineTool({
	name: "list_services",
	title: "List clinic services",
	description: "List all available dental services at Saraci Dental Clinic with prices and durations.",
	inputSchema: {},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async (_input, ctx) => {
		const { data, error } = await supabaseForUser(ctx).from("service_catalog").select("name, description, price_hint, duration_minutes").eq("active", true).order("name");
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data)
			}],
			structuredContent: { services: data }
		};
	}
});
var get_availability_default = defineTool({
	name: "get_availability",
	title: "Get available appointment slots",
	description: "Return available 1-hour slots for the given date range. Dates are ISO strings (UTC). Clinic hours: Mon-Sat 09:00-19:00 Europe/Tirane; closed Sunday.",
	inputSchema: {
		from: string().describe("Start ISO datetime (UTC)."),
		to: string().describe("End ISO datetime (UTC).")
	},
	annotations: {
		readOnlyHint: true,
		openWorldHint: false
	},
	handler: async ({ from, to }, ctx) => {
		const sb = supabaseForUser(ctx);
		try {
			const { loadSlots } = await import("./slots.server-BpzP47ii.mjs");
			const free = (await loadSlots(sb, from, to)).filter((s) => !s.taken);
			return {
				content: [{
					type: "text",
					text: JSON.stringify(free)
				}],
				structuredContent: { slots: free }
			};
		} catch (e) {
			return {
				content: [{
					type: "text",
					text: e instanceof Error ? e.message : "Failed"
				}],
				isError: true
			};
		}
	}
});
var create_booking_default = defineTool({
	name: "create_booking",
	title: "Create an appointment",
	description: "Book a 1-hour appointment for the signed-in user. slotIso must be a whole-hour UTC ISO datetime within clinic hours (Mon-Sat 09:00-19:00 Europe/Tirane). All patient fields are required.",
	inputSchema: {
		slotIso: string().describe("UTC ISO datetime of the slot start."),
		firstName: string().min(2),
		lastName: string().min(2),
		patientPhone: string().describe("Must start with 06 and be 10 digits"),
		patientEmail: string().describe("Valid email address"),
		service: string().min(3),
		notes: string().optional()
	},
	annotations: {
		readOnlyHint: false,
		destructiveHint: false,
		openWorldHint: false
	},
	handler: async (input, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const sb = supabaseForUser(ctx);
		try {
			const { createBookingCore } = await import("./booking-core.server-BHy1cxK8.mjs");
			const appt = await createBookingCore(sb, ctx.getUserId(), {
				slotIso: input.slotIso,
				firstName: input.firstName,
				lastName: input.lastName,
				patientPhone: input.patientPhone,
				patientEmail: input.patientEmail,
				service: input.service,
				notes: input.notes ?? null
			}, "mcp");
			return {
				content: [{
					type: "text",
					text: `Booked. Code: ${appt.booking_code}`
				}],
				structuredContent: { appointment: appt }
			};
		} catch (e) {
			return {
				content: [{
					type: "text",
					text: e instanceof Error ? e.message : "Booking failed"
				}],
				isError: true
			};
		}
	}
});
var cancel_booking_default = defineTool({
	name: "cancel_booking",
	title: "Cancel an appointment",
	description: "Cancel an existing appointment by its booking code. Only the owner can cancel.",
	inputSchema: {
		bookingCode: string().min(3).describe("The 6-8 char booking code (e.g. AB12CD)."),
		reason: string().optional()
	},
	annotations: {
		readOnlyHint: false,
		destructiveHint: true,
		openWorldHint: false
	},
	handler: async ({ bookingCode, reason }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const sb = supabaseForUser(ctx);
		try {
			const { cancelBookingCore } = await import("./booking-core.server-BHy1cxK8.mjs");
			const appt = await cancelBookingCore(sb, ctx.getUserId(), {
				bookingCode,
				reason: reason ?? null
			}, "mcp");
			return {
				content: [{
					type: "text",
					text: `Cancelled ${appt.booking_code}`
				}],
				structuredContent: {
					ok: true,
					booking_code: appt.booking_code
				}
			};
		} catch (e) {
			return {
				content: [{
					type: "text",
					text: e instanceof Error ? e.message : "Cancel failed"
				}],
				isError: true
			};
		}
	}
});
var list_my_appointments_default = defineTool({
	name: "list_my_appointments",
	title: "List my appointments",
	description: "List all appointments for the signed-in user, newest first.",
	inputSchema: {},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async (_input, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const { data, error } = await supabaseForUser(ctx).from("appointments").select("booking_code, slot_start, status, service, patient_name").eq("user_id", ctx.getUserId()).order("slot_start", { ascending: false }).limit(50);
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data)
			}],
			structuredContent: { appointments: data }
		};
	}
});
var mcp_default = defineMcp({
	name: "saraci-dental-mcp",
	title: "Saraci Dental Clinic",
	version: "0.1.0",
	instructions: "Tools for Saraci Dental Clinic (Elbasan). Use `list_services` to see offered treatments, `get_availability` to find free 1-hour slots (Mon-Sat 09:00-19:00 Europe/Tirane), `create_booking` to reserve a slot for the signed-in user, `list_my_appointments` to review bookings, and `cancel_booking` to cancel by booking code.",
	auth: auth.oauth.issuer({
		issuer: `https://project-ref-unset.supabase.co/auth/v1`,
		acceptedAudiences: "authenticated"
	}),
	tools: [
		list_services_default,
		get_availability_default,
		create_booking_default,
		cancel_booking_default,
		list_my_appointments_default
	]
});
var Route$22 = createFileRoute("/mcp")({ server: { handlers: { ANY: createTanStackMcpHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var $$splitComponentImporter$13 = () => import("./privatesia-CefLZZ79.mjs");
var TITLE = "Politika e privatësisë — Saraci Dental Clinic";
var DESC = "Si Saraci Dental Clinic në Elbasan mbledh, përdor dhe mbron të dhënat tuaja personale dhe shëndetësore, sipas legjislacionit shqiptar dhe GDPR.";
var Route$21 = createFileRoute("/privatesia")({
	head: () => ({ meta: [
		{ title: TITLE },
		{
			name: "description",
			content: DESC
		},
		{
			property: "og:title",
			content: TITLE
		},
		{
			property: "og:description",
			content: DESC
		},
		{
			property: "og:type",
			content: "article"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "index,follow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./recensionet-D0yk2DYN.mjs");
var Route$20 = createFileRoute("/recensionet")({
	head: () => ({ meta: [
		{ title: "Recensionet e pacientëve — Saraci Dental Clinic" },
		{
			name: "description",
			content: "Lexoni vlerësimet e pacientëve të Saraci Dental Clinic në Elbasan dhe lini vlerësimin tuaj."
		},
		{
			property: "og:title",
			content: "Recensionet — Saraci Dental Elbasan"
		},
		{
			property: "og:description",
			content: "Përvojat reale të pacientëve tanë."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./rreth-BTBbnSxb.mjs");
var Route$19 = createFileRoute("/rreth")({
	head: () => ({ meta: [
		{ title: `Rreth ${CLINIC.dentist} — Saraci Dental Clinic Elbasan` },
		{
			name: "description",
			content: `Njihuni me ${CLINIC.dentist} dhe klinikën dentare Saraci në Elbasan. Kujdes i personalizuar, teknologji moderne, ekip profesional.`
		},
		{
			property: "og:title",
			content: `Rreth ${CLINIC.name}`
		},
		{
			property: "og:description",
			content: `Historia, misioni dhe ekipi i klinikës dentare Saraci në Elbasan.`
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			property: "og:image",
			content: CLINIC.photos.team
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:image",
			content: CLINIC.photos.team
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./sherbimet-StItuvZb.mjs");
var Route$18 = createFileRoute("/sherbimet")({
	head: () => ({ meta: [
		{ title: "Shërbimet — Saraci Dental Clinic Elbasan" },
		{
			name: "description",
			content: "Lista e plotë e shërbimeve dentare në Saraci Dental: kontroll, pastrim, zbardhim, mbushje, endodonci, implante, ortodonci."
		},
		{
			property: "og:title",
			content: "Shërbimet dentare — Saraci Dental Elbasan"
		},
		{
			property: "og:description",
			content: "Kujdes dentar i plotë në Elbasan. Çmime transparente, kohëzgjatje e qartë."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var Route$17 = createFileRoute("/.mcp/list-tools")({ server: { handlers: { ANY: createTanStackListToolsHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var Route$16 = createFileRoute("/.well-known/oauth-protected-resource")({ server: { handlers: { ANY: createTanStackOAuthProtectedResourceMetadataHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var $$splitComponentImporter$9 = () => import("./admin-YZ9QfrYf.mjs");
var Route$15 = createFileRoute("/_authenticated/admin")({
	head: () => ({ meta: [{ title: "Admin — Saraci Dental" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./booking-Bv7mz6uK.mjs");
var Route$14 = createFileRoute("/_authenticated/booking")({
	head: () => ({ meta: [{ title: "Rezervo termin — Saraci Dental" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./chat-Bl754H60.mjs");
var Route$13 = createFileRoute("/_authenticated/chat")({
	head: () => ({ meta: [{ title: "Chat & Zë — Saraci Dental" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dashboard-CCbeMn__.mjs");
var Route$12 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Paneli — Saraci Dental" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./financat-DqgBwmbO.mjs");
var Route$11 = createFileRoute("/_authenticated/financat")({
	head: () => ({ meta: [
		{ title: "Financat — Saraci Dental Clinic" },
		{
			name: "description",
			content: "Raporte të ardhurash, pagesa dhe statistika mujore për Saraci Dental Clinic në Elbasan."
		},
		{
			property: "og:title",
			content: "Financat — Saraci Dental Clinic"
		},
		{
			property: "og:description",
			content: "Ndiqni pagesat dhe të ardhurat mujore të klinikës."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./historia-fZTedArB.mjs");
var Route$10 = createFileRoute("/_authenticated/historia")({
	head: () => ({ meta: [{ title: "Historia ime — Saraci Dental" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./info-B-Rm-6dR.mjs");
var Route$9 = createFileRoute("/_authenticated/info")({
	head: () => ({ meta: [{ title: "Info klinika — Saraci Dental" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./inventari-tLha-vDn.mjs");
var Route$8 = createFileRoute("/_authenticated/inventari")({
	head: () => ({ meta: [
		{ title: "Inventari — Saraci Dental Clinic" },
		{
			name: "description",
			content: "Menaxhimi i materialeve dhe stokut të klinikës Saraci Dental në Elbasan."
		},
		{
			property: "og:title",
			content: "Inventari — Saraci Dental Clinic"
		},
		{
			property: "og:description",
			content: "Ndiqni sasitë, furnitorët dhe lëvizjet e stokut të klinikës."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./pacientet-eNshDnJP.mjs");
var Route$7 = createFileRoute("/_authenticated/pacientet")({
	head: () => ({ meta: [{ title: "CRM Pacientë — Saraci Dental" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
function createLovableAiGatewayProvider(lovableApiKey) {
	return createOpenAICompatible({
		name: "lovable",
		baseURL: "https://ai.gateway.lovable.dev/v1",
		headers: {
			"Lovable-API-Key": lovableApiKey,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		}
	});
}
var TZ = "Europe/Tirane";
var Route$6 = createFileRoute("/api/chat")({ server: { handlers: { POST: async ({ request }) => {
	const auth = request.headers.get("authorization");
	if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
	const token = auth.slice(7);
	const key = processModule.env.LOVABLE_API_KEY;
	if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
	const SUPABASE_URL = processModule.env.SUPABASE_URL;
	const SUPABASE_PUBLISHABLE_KEY = processModule.env.SUPABASE_PUBLISHABLE_KEY;
	const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: {
			Authorization: `Bearer ${token}`,
			apikey: SUPABASE_PUBLISHABLE_KEY
		} },
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			storage: void 0
		}
	});
	const { data: claims, error: cerr } = await supabase.auth.getClaims(token);
	if (cerr || !claims?.claims?.sub) return new Response("Unauthorized", { status: 401 });
	const userId = claims.claims.sub;
	const body = await request.json();
	const { sessionId } = body;
	if (!Array.isArray(body.messages)) return new Response("Bad request", { status: 400 });
	const incomingUser = body.messages.filter((m) => m && m.role === "user").slice(-1);
	let messages = incomingUser;
	if (sessionId) {
		const { data: hist } = await supabase.from("chat_messages").select("id, role, content").eq("session_id", sessionId).in("role", ["user", "assistant"]).order("created_at", { ascending: true }).limit(40);
		messages = [...(hist ?? []).map((h) => ({
			id: h.id,
			role: h.role,
			parts: [{
				type: "text",
				text: h.content
			}]
		})), ...incomingUser];
	}
	const { data: isAdminRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
	const isAdmin = !!isAdminRow;
	const { data: settingsRows } = await supabase.from("clinic_settings").select("key, value, is_public");
	const settings = {};
	(settingsRows ?? []).forEach((r) => {
		if (r.is_public || isAdmin) settings[r.key] = r.value;
	});
	const lastUser = [...messages].reverse().find((m) => m.role === "user");
	if (sessionId && lastUser) {
		const text = lastUser.parts?.map((p) => p.type === "text" ? p.text : "").join("") ?? "";
		if (text) {
			await supabase.from("chat_messages").insert({
				session_id: sessionId,
				user_id: userId,
				role: "user",
				content: text
			});
			const { count } = await supabase.from("chat_messages").select("id", {
				count: "exact",
				head: true
			}).eq("session_id", sessionId).eq("role", "user");
			if ((count ?? 0) <= 1) {
				const title = text.slice(0, 60).trim() + (text.length > 60 ? "…" : "");
				await supabase.from("chat_sessions").update({ title }).eq("id", sessionId);
			}
		}
	}
	const gateway = createLovableAiGatewayProvider(key);
	const system = `Ti je recepsionisti virtual i klinikës dentare "Saraci Dental Clinic" në Elbasan, Shqipëri.

REGULLA THELBËSORE:
- Fol GJITHMONË në shqip, natyral dhe i sjellshëm.
- Ti nuk je AI gjeneral; je recepsionist i kësaj klinike specifike.
- Për informacione për klinikën përdor VETËM të dhënat e mëposhtme; mos shpik.
- Për rezervime, anulime, riprogramime dhe kontroll oraresh — përdor mjetet (tools).
- Çdo termin zgjat 1 orë fiks, në orë të plota (09:00, 10:00, ...). Klinika hapet Hën-Sht 09:00-19:00. E diela mbyllur.
- Sloti i fundit fillon në 18:00 dhe mbaron në 19:00.
- URGJENCA: nëse pacienti raporton dhimbje ekstreme, ënjtje, temperaturë, gjakderdhje ose vështirësi frymëmarrjeje/gëlltitjeje — thuaj menjëherë: "Telefononi urgjencën 127 tani ose shkoni në urgjencën më të afërt." dhe pastaj ofro terminin më të afërt të lirë.
- Për cancel/reschedule: kërko booking code + verifikim me telefon ose email. Përdor toolset përkatës.
- Data/ora tani në Elbasan: ${(/* @__PURE__ */ new Date()).toLocaleString("sq-AL", {
		timeZone: TZ,
		dateStyle: "full",
		timeStyle: "short"
	})}.

TË DHËNAT E KLINIKËS:
- Emri: ${settings.clinic_name}
- Adresa: ${settings.address}
- Telefoni: ${settings.phone}
- Email: ${settings.email}
- Dentisti/Pronari: ${settings.dentist}
- Orari: ${settings.working_hours}
- Parking: ${settings.parking}
- Tualet: ${settings.toilet}
- Aksesueshmëri: ${settings.accessibility}
- Pagesa: ${settings.payment_methods}
- Urgjenca: ${settings.emergency_number}
${isAdmin ? `\nINFO PRIVATE (vetëm admin):\n- Wi-Fi: ${settings.wifi_password}\n- Shënime: ${settings.internal_notes}\n- Eskalim urgjence: ${settings.emergency_escalation}` : ""}

Për pyetje specifike ("ku ndodhet klinika?"/"cili është telefoni?") jep VETËM informacionin e kërkuar, shkurt.`;
	const tools = {
		check_availability: tool({
			description: "Kontrollon oraret e disponueshme për një datë ose interval datash. Përdore për 'kur keni orare të lira sot/nesër/kjo javë'.",
			inputSchema: object({
				date_from: string().describe("Data fillestare në format YYYY-MM-DD"),
				date_to: string().describe("Data përfundimtare në format YYYY-MM-DD (mund të jetë e njëjtë me date_from)"),
				min_hour: number().int().min(9).max(18).optional().describe("Ora minimale (opsionale)")
			}),
			execute: async ({ date_from, date_to, min_hour }) => {
				const { loadSlots } = await import("./slots.server-BpzP47ii.mjs");
				const free = (await loadSlots(supabase, `${date_from}T00:00:00Z`, `${date_to}T23:59:59Z`, min_hour)).filter((s) => !s.taken).map((s) => s.label.replace(" ", " në "));
				return {
					free_slots: free.slice(0, 20),
					total: free.length
				};
			}
		}),
		list_my_appointments: tool({
			description: "Kthen listën e termineve të përdoruesit aktual.",
			inputSchema: object({}),
			execute: async () => {
				const { formatSlotLocal } = await import("./slots.server-BpzP47ii.mjs");
				const { data } = await supabase.from("appointments").select("booking_code, slot_start, status, service").eq("user_id", userId).order("slot_start", { ascending: false }).limit(20);
				return { appointments: (data ?? []).map((a) => ({
					code: a.booking_code,
					date: formatSlotLocal(a.slot_start),
					status: a.status,
					service: a.service ?? "—"
				})) };
			}
		}),
		create_booking: tool({
			description: "Krijon një rezervim të ri. Përdore VETËM kur pacienti ka dhënë: emrin, mbiemrin, telefonin (fillon me 06, 10 numra), email të vlefshëm dhe shërbimin. Nëse mungon ndonjë, kërkoje para se ta thërrasësh.",
			inputSchema: object({
				slot_iso: string().describe("Ora e rezervimit në ISO 8601 UTC (p.sh. 2026-07-02T09:00:00Z për 11:00 lokale në verë)"),
				first_name: string().describe("Emri"),
				last_name: string().describe("Mbiemri"),
				patient_phone: string().describe("Telefon: fillon me 06, 10 numra"),
				patient_email: string().describe("Email i vlefshëm"),
				service: string().describe("Shërbimi, p.sh. pastrim, mbushje, ortodonci, implant"),
				notes: string().optional()
			}),
			execute: async (input) => {
				try {
					const { createBookingCore } = await import("./booking-core.server-BHy1cxK8.mjs");
					const { formatSlotLocal } = await import("./slots.server-BpzP47ii.mjs");
					const appt = await createBookingCore(supabase, userId, {
						slotIso: input.slot_iso,
						firstName: input.first_name,
						lastName: input.last_name,
						patientPhone: input.patient_phone,
						patientEmail: input.patient_email,
						service: input.service,
						notes: input.notes ?? null
					}, "chat");
					return {
						booking_code: appt.booking_code,
						slot: formatSlotLocal(appt.slot_start)
					};
				} catch (e) {
					return { error: e instanceof Error ? e.message : "Rezervimi dështoi." };
				}
			}
		}),
		cancel_booking: tool({
			description: "Anulon një rezervim ekzistues me kod dhe verifikim (telefon ose email).",
			inputSchema: object({
				booking_code: string(),
				verify_phone_or_email: string(),
				reason: string().optional()
			}),
			execute: async (input) => {
				try {
					const { cancelBookingCore } = await import("./booking-core.server-BHy1cxK8.mjs");
					await cancelBookingCore(supabase, userId, {
						bookingCode: input.booking_code,
						verify: input.verify_phone_or_email,
						reason: input.reason ?? null
					}, "chat");
					return {
						ok: true,
						code: input.booking_code.toUpperCase()
					};
				} catch (e) {
					return { error: e instanceof Error ? e.message : "Anulimi dështoi." };
				}
			}
		}),
		reschedule_booking: tool({
			description: "Ripërcakton një rezervim ekzistues në një orar të ri. Kërkon kodin dhe verifikimin.",
			inputSchema: object({
				booking_code: string(),
				verify_phone_or_email: string(),
				new_slot_iso: string().describe("Ora e re në ISO 8601 UTC")
			}),
			execute: async (input) => {
				try {
					const { rescheduleBookingCore } = await import("./booking-core.server-BHy1cxK8.mjs");
					const { formatSlotLocal } = await import("./slots.server-BpzP47ii.mjs");
					const { newAppointment } = await rescheduleBookingCore(supabase, userId, {
						bookingCode: input.booking_code,
						verify: input.verify_phone_or_email,
						newSlotIso: input.new_slot_iso
					}, "chat");
					return {
						ok: true,
						new_code: newAppointment.booking_code,
						slot: formatSlotLocal(newAppointment.slot_start)
					};
				} catch (e) {
					return { error: e instanceof Error ? e.message : "Zhvendosja dështoi." };
				}
			}
		}),
		get_service_info: tool({
			description: "Kthen listën e shërbimeve të klinikës me çmime indikative dhe përshkrime.",
			inputSchema: object({}),
			execute: async () => {
				const { data } = await supabase.from("service_catalog").select("name, description, price_hint").eq("active", true).order("name");
				return { services: data ?? [] };
			}
		})
	};
	return streamText({
		model: gateway("google/gemini-3-flash-preview"),
		system,
		messages: await convertToModelMessages(messages),
		tools,
		stopWhen: isStepCount(50)
	}).toUIMessageStreamResponse({
		originalMessages: messages,
		onFinish: async ({ messages: finalMessages }) => {
			if (!sessionId) return;
			const assistant = finalMessages[finalMessages.length - 1];
			if (assistant?.role === "assistant") {
				const text = assistant.parts?.map((p) => p.type === "text" ? p.text : "").join("") ?? "";
				if (text) await supabase.from("chat_messages").insert({
					session_id: sessionId,
					user_id: userId,
					role: "assistant",
					content: text
				});
				await supabase.from("chat_sessions").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId);
			}
		}
	});
} } } });
var oauth = supabase.auth.oauth;
var $$splitErrorComponentImporter = () => import("../_._lovable.oauth.consent-BcMVTpsi.mjs");
var $$splitComponentImporter = () => import("../_._lovable.oauth.consent-u21-3zJp.mjs");
var Route$5 = createFileRoute("/.lovable/oauth/consent")({
	ssr: false,
	validateSearch: (s) => ({ authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "" }),
	beforeLoad: async ({ search, location }) => {
		if (!search.authorization_id) throw new Error("Missing authorization_id");
		const { data } = await supabase.auth.getSession();
		if (!data.session) {
			const next = location.pathname + location.searchStr;
			throw redirect({
				to: "/auth",
				search: {
					mode: "login",
					next
				}
			});
		}
	},
	loader: async ({ location }) => {
		const authorizationId = new URLSearchParams(location.search).get("authorization_id");
		const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
		if (error) throw error;
		const immediate = data?.redirect_url ?? data?.redirect_to;
		if (immediate && !data?.client) throw redirect({ href: immediate });
		return data;
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
var Route$4 = createFileRoute("/.mcp/invoke-tool/$tool")({ server: { handlers: { ANY: createTanStackInvokeToolHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var Route$3 = createFileRoute("/api/public/hooks/calendar-sync")({ server: { handlers: { POST: async ({ request }) => {
	const { assertCronRequest } = await import("./cron-auth.server-DuPmkle6.mjs");
	const denied = await assertCronRequest(request);
	if (denied) return denied;
	const cal = await import("./calendar.server-DiqIMIfJ.mjs");
	if (!cal.calendarConfigured()) return Response.json({
		ok: false,
		reason: "google_calendar_not_configured"
	}, { status: 200 });
	const admin = createClient(processModule.env.SUPABASE_URL, processModule.env.SUPABASE_SERVICE_ROLE_KEY, { auth: {
		persistSession: false,
		autoRefreshToken: false,
		storage: void 0
	} });
	const log = async (direction, action, ok, opts = {}) => {
		await admin.from("calendar_sync_log").insert({
			direction,
			action,
			ok,
			appointment_id: opts.appointment_id ?? null,
			gcal_event_id: opts.gcal_event_id ?? null,
			error: opts.error ?? null
		});
	};
	const now = /* @__PURE__ */ new Date();
	const from = /* @__PURE__ */ new Date(now.getTime() - 72e5);
	const to = new Date(now.getTime() + 5184e6);
	let created = 0, deleted = 0, blocks = 0, unblocked = 0;
	const { data: toCreate } = await admin.from("appointments").select("id, booking_code, patient_name, patient_phone, patient_email, service, notes, slot_start").eq("status", "booked").is("gcal_event_id", null).gte("slot_start", from.toISOString()).limit(100);
	for (const a of toCreate ?? []) try {
		const eventId = await cal.pushCreateEvent(a);
		await admin.from("appointments").update({ gcal_event_id: eventId }).eq("id", a.id);
		await log("push", "create_event", true, {
			appointment_id: a.id,
			gcal_event_id: eventId
		});
		created++;
	} catch (e) {
		await log("push", "create_event", false, {
			appointment_id: a.id,
			error: String(e.message ?? e)
		});
	}
	const { data: toDelete } = await admin.from("appointments").select("id, gcal_event_id").not("gcal_event_id", "is", null).in("status", ["cancelled", "rescheduled"]).gte("slot_start", from.toISOString()).limit(100);
	for (const a of toDelete ?? []) {
		if (!a.gcal_event_id) continue;
		try {
			await cal.pushDeleteEvent(a.gcal_event_id);
			await admin.from("appointments").update({ gcal_event_id: null }).eq("id", a.id);
			await log("push", "delete_event", true, {
				appointment_id: a.id,
				gcal_event_id: a.gcal_event_id
			});
			deleted++;
		} catch (e) {
			await log("push", "delete_event", false, {
				appointment_id: a.id,
				gcal_event_id: a.gcal_event_id,
				error: String(e.message ?? e)
			});
		}
	}
	try {
		const events = await cal.listEvents(from.toISOString(), to.toISOString());
		const keep = /* @__PURE__ */ new Set();
		for (const ev of events) {
			const ourApptId = ev.extendedProperties?.private?.saraci_appointment_id;
			if (ourApptId) {
				if (ev.status === "cancelled") continue;
				const { data: appt } = await admin.from("appointments").select("id, booking_code, patient_name, patient_phone, patient_email, service, notes, slot_start, status, gcal_event_id").eq("id", ourApptId).maybeSingle();
				try {
					if (!appt || appt.status !== "booked") {
						await cal.pushDeleteEvent(ev.id);
						if (appt) await admin.from("appointments").update({ gcal_event_id: null }).eq("id", appt.id);
						await log("reconcile", "delete_event", true, {
							appointment_id: appt?.id,
							gcal_event_id: ev.id
						});
						deleted++;
					} else {
						if ((ev.start?.dateTime ? new Date(ev.start.dateTime).getTime() : null) !== new Date(appt.slot_start).getTime()) {
							await cal.pushUpdateEvent(ev.id, appt);
							await log("reconcile", "update_event", true, {
								appointment_id: appt.id,
								gcal_event_id: ev.id
							});
						}
						if (appt.gcal_event_id !== ev.id) await admin.from("appointments").update({ gcal_event_id: ev.id }).eq("id", appt.id);
					}
				} catch (e) {
					await log("reconcile", "fix_event", false, {
						appointment_id: ourApptId,
						gcal_event_id: ev.id,
						error: String(e.message ?? e)
					});
				}
				continue;
			}
			const startIso = ev.start?.dateTime ?? (ev.start?.date ? `${ev.start.date}T00:00:00Z` : null);
			const endIso = ev.end?.dateTime ?? (ev.end?.date ? `${ev.end.date}T23:59:59Z` : null);
			if (ev.status === "cancelled" || !startIso || !endIso) {
				await admin.from("calendar_blocks").delete().eq("gcal_event_id", ev.id);
				continue;
			}
			keep.add(ev.id);
			await admin.from("calendar_blocks").upsert({
				gcal_event_id: ev.id,
				summary: ev.summary ?? null,
				start_ts: new Date(startIso).toISOString(),
				end_ts: new Date(endIso).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}, { onConflict: "gcal_event_id" });
			blocks++;
		}
		const { data: existing } = await admin.from("calendar_blocks").select("id, gcal_event_id").gte("start_ts", from.toISOString()).lte("start_ts", to.toISOString());
		for (const b of existing ?? []) if (!keep.has(b.gcal_event_id)) {
			await admin.from("calendar_blocks").delete().eq("id", b.id);
			unblocked++;
		}
		await log("pull", "sync_blocks", true);
	} catch (e) {
		await log("pull", "sync_blocks", false, { error: String(e.message ?? e) });
	}
	return Response.json({
		ok: true,
		created,
		deleted,
		blocks,
		unblocked
	});
} } } });
var schema = object({
	message: string().min(1).max(500),
	stack: string().max(2e3).optional(),
	path: string().max(300).optional(),
	userAgent: string().max(300).optional()
});
var MAX_PER_MINUTE = 60;
var Route$2 = createFileRoute("/api/public/hooks/errors")({ server: { handlers: { POST: async ({ request }) => {
	if (Number(request.headers.get("content-length") ?? 0) > 8e3) return new Response("Payload too large", { status: 413 });
	let parsed;
	try {
		parsed = schema.parse(await request.json());
	} catch {
		return new Response("Bad request", { status: 400 });
	}
	const { supabaseAdmin } = await import("./client.server-DP5_l0A2.mjs");
	const since = (/* @__PURE__ */ new Date(Date.now() - 6e4)).toISOString();
	const { count } = await supabaseAdmin.from("error_log").select("id", {
		count: "exact",
		head: true
	}).gte("created_at", since);
	if ((count ?? 0) >= MAX_PER_MINUTE) return new Response("Too many requests", { status: 429 });
	const { error } = await supabaseAdmin.from("error_log").insert({
		message: parsed.message,
		stack: parsed.stack ?? null,
		path: parsed.path ?? null,
		user_agent: parsed.userAgent ?? request.headers.get("user-agent")?.slice(0, 300) ?? null
	});
	if (error) return new Response("Insert failed", { status: 500 });
	return Response.json({ ok: true });
} } } });
var Route$1 = createFileRoute("/api/public/hooks/process-emails")({ server: { handlers: { POST: async ({ request }) => {
	const { assertCronRequest } = await import("./cron-auth.server-DuPmkle6.mjs");
	const denied = await assertCronRequest(request);
	if (denied) return denied;
	const url = processModule.env.SUPABASE_URL;
	const serviceKey = processModule.env.SUPABASE_SERVICE_ROLE_KEY;
	const admin = createClient(url, serviceKey, { auth: {
		persistSession: false,
		autoRefreshToken: false,
		storage: void 0
	} });
	const { data: queued, error } = await admin.from("email_log").select("id, to_email, subject, body, html, attempts, template, related_appointment").eq("status", "queued").lt("attempts", 5).order("created_at", { ascending: true }).limit(20);
	if (error) return Response.json({
		ok: false,
		error: error.message
	}, { status: 500 });
	const results = [];
	for (const row of queued ?? []) {
		const html = row.html && row.html.trim().length > 0 ? row.html : `<pre style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap">${row.body}</pre>`;
		let invite;
		if (row.related_appointment && [
			"booking_confirm",
			"booking_cancel",
			"booking_reschedule"
		].includes(row.template ?? "")) {
			const { data: appointment } = await admin.from("appointments").select("booking_code, patient_name, patient_email, service, notes, slot_start").eq("id", row.related_appointment).maybeSingle();
			if (appointment) {
				const method = row.template === "booking_cancel" ? "CANCEL" : "REQUEST";
				let currentId = row.related_appointment;
				let rootCode = appointment.booking_code;
				let sequence = 0;
				for (let hop = 0; hop < 10; hop++) {
					const { data: event } = await admin.from("appointment_events").select("payload").eq("appointment_id", currentId).eq("event_type", "rescheduled_in").maybeSingle();
					const payload = event?.payload;
					const sourceId = payload && typeof payload === "object" && !Array.isArray(payload) && typeof payload["from"] === "string" ? String(payload["from"]) : void 0;
					if (!sourceId) break;
					const { data: source } = await admin.from("appointments").select("id, booking_code").eq("id", sourceId).maybeSingle();
					if (!source) break;
					rootCode = source.booking_code;
					currentId = source.id;
					sequence++;
				}
				if (row.template === "booking_cancel") sequence++;
				const { buildCalendarInvite } = await import("./calendar-invite.server-Dn0e-1Dz.mjs");
				invite = {
					content: buildCalendarInvite(appointment, method, rootCode, sequence),
					method
				};
			}
		}
		const r = await sendGmail(row.to_email, row.subject, html, invite);
		if (r.ok) {
			await admin.from("email_log").update({
				status: "sent",
				sent_at: (/* @__PURE__ */ new Date()).toISOString(),
				error: null,
				attempts: (row.attempts ?? 0) + 1
			}).eq("id", row.id);
			results.push({
				id: row.id,
				ok: true
			});
		} else {
			const nextAttempts = (row.attempts ?? 0) + 1;
			await admin.from("email_log").update({
				status: nextAttempts >= 5 ? "failed" : "queued",
				error: r.error,
				attempts: nextAttempts
			}).eq("id", row.id);
			results.push({
				id: row.id,
				ok: false,
				error: r.error
			});
		}
	}
	return Response.json({
		ok: true,
		processed: results.length,
		results
	});
} } } });
var Route = createFileRoute("/api/public/hooks/send-reminders")({ server: { handlers: { POST: async ({ request }) => {
	const { assertCronRequest } = await import("./cron-auth.server-DuPmkle6.mjs");
	const denied = await assertCronRequest(request);
	if (denied) return denied;
	const admin = createClient(processModule.env.SUPABASE_URL, processModule.env.SUPABASE_SERVICE_ROLE_KEY, { auth: {
		persistSession: false,
		autoRefreshToken: false,
		storage: void 0
	} });
	const now = /* @__PURE__ */ new Date();
	const in23h = new Date(now.getTime() + 828e5);
	const in25h = new Date(now.getTime() + 9e7);
	const in90m = new Date(now.getTime() + 54e5);
	const in150m = new Date(now.getTime() + 9e6);
	const { data: r24 } = await admin.from("appointments").select("id, booking_code, patient_name, patient_email, slot_start").eq("status", "booked").is("reminder_24h_sent_at", null).not("patient_email", "is", null).gte("slot_start", in23h.toISOString()).lte("slot_start", in25h.toISOString());
	const { data: r2 } = await admin.from("appointments").select("id, booking_code, patient_name, patient_email, slot_start").eq("status", "booked").is("reminder_2h_sent_at", null).not("patient_email", "is", null).gte("slot_start", in90m.toISOString()).lte("slot_start", in150m.toISOString());
	let queued = 0;
	for (const a of r24 ?? []) {
		if (!a.patient_email) continue;
		const t = tplReminder({
			name: a.patient_name,
			code: a.booking_code,
			slotIso: a.slot_start,
			hoursBefore: 24
		});
		const { error: queueError } = await admin.from("email_log").insert({
			to_email: a.patient_email,
			subject: t.subject,
			body: `Kujtesë 24h · ${a.booking_code}`,
			html: t.html,
			template: "reminder_24h",
			related_appointment: a.id
		});
		if (queueError) {
			console.error("Reminder enqueue failed:", queueError.message);
			continue;
		}
		await admin.from("appointments").update({ reminder_24h_sent_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", a.id);
		queued++;
	}
	for (const a of r2 ?? []) {
		if (!a.patient_email) continue;
		const t = tplReminder({
			name: a.patient_name,
			code: a.booking_code,
			slotIso: a.slot_start,
			hoursBefore: 2
		});
		const { error: queueError } = await admin.from("email_log").insert({
			to_email: a.patient_email,
			subject: t.subject,
			body: `Kujtesë 2h · ${a.booking_code}`,
			html: t.html,
			template: "reminder_2h",
			related_appointment: a.id
		});
		if (queueError) {
			console.error("Reminder enqueue failed:", queueError.message);
			continue;
		}
		await admin.from("appointments").update({ reminder_2h_sent_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", a.id);
		queued++;
	}
	return Response.json({
		ok: true,
		queued_24h: r24?.length ?? 0,
		queued_2h: r2?.length ?? 0,
		queued
	});
} } } });
var IndexRoute = Route$30.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$31
});
var AuthenticatedRouteRoute = Route$29.update({
	id: "/_authenticated",
	getParentRoute: () => Route$31
});
var AuthRoute = Route$28.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$31
});
var CmimetRoute = Route$27.update({
	id: "/cmimet",
	path: "/cmimet",
	getParentRoute: () => Route$31
});
var FaqRoute = Route$26.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$31
});
var GaleriaRoute = Route$25.update({
	id: "/galeria",
	path: "/galeria",
	getParentRoute: () => Route$31
});
var KontaktRoute = Route$24.update({
	id: "/kontakt",
	path: "/kontakt",
	getParentRoute: () => Route$31
});
var KushtetRoute = Route$23.update({
	id: "/kushtet",
	path: "/kushtet",
	getParentRoute: () => Route$31
});
var McpRoute = Route$22.update({
	id: "/mcp",
	path: "/mcp",
	getParentRoute: () => Route$31
});
var PrivatesiaRoute = Route$21.update({
	id: "/privatesia",
	path: "/privatesia",
	getParentRoute: () => Route$31
});
var RecensionetRoute = Route$20.update({
	id: "/recensionet",
	path: "/recensionet",
	getParentRoute: () => Route$31
});
var RrethRoute = Route$19.update({
	id: "/rreth",
	path: "/rreth",
	getParentRoute: () => Route$31
});
var SherbimetRoute = Route$18.update({
	id: "/sherbimet",
	path: "/sherbimet",
	getParentRoute: () => Route$31
});
var Char91DotmcpChar93ListToolsRoute = Route$17.update({
	id: "/.mcp/list-tools",
	path: "/.mcp/list-tools",
	getParentRoute: () => Route$31
});
var Char91DotwellKnownChar93OauthProtectedResourceRoute = Route$16.update({
	id: "/.well-known/oauth-protected-resource",
	path: "/.well-known/oauth-protected-resource",
	getParentRoute: () => Route$31
});
var AuthenticatedAdminRoute = Route$15.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedBookingRoute = Route$14.update({
	id: "/booking",
	path: "/booking",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedChatRoute = Route$13.update({
	id: "/chat",
	path: "/chat",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$12.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFinancatRoute = Route$11.update({
	id: "/financat",
	path: "/financat",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedHistoriaRoute = Route$10.update({
	id: "/historia",
	path: "/historia",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInfoRoute = Route$9.update({
	id: "/info",
	path: "/info",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInventariRoute = Route$8.update({
	id: "/inventari",
	path: "/inventari",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPacientetRoute = Route$7.update({
	id: "/pacientet",
	path: "/pacientet",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiChatRoute = Route$6.update({
	id: "/api/chat",
	path: "/api/chat",
	getParentRoute: () => Route$31
});
var DotlovableOauthConsentRoute = Route$5.update({
	id: "/.lovable/oauth/consent",
	path: "/.lovable/oauth/consent",
	getParentRoute: () => Route$31
});
var Char91DotmcpChar93InvokeToolToolRoute = Route$4.update({
	id: "/.mcp/invoke-tool/$tool",
	path: "/.mcp/invoke-tool/$tool",
	getParentRoute: () => Route$31
});
var ApiPublicHooksCalendarSyncRoute = Route$3.update({
	id: "/api/public/hooks/calendar-sync",
	path: "/api/public/hooks/calendar-sync",
	getParentRoute: () => Route$31
});
var ApiPublicHooksErrorsRoute = Route$2.update({
	id: "/api/public/hooks/errors",
	path: "/api/public/hooks/errors",
	getParentRoute: () => Route$31
});
var ApiPublicHooksProcessEmailsRoute = Route$1.update({
	id: "/api/public/hooks/process-emails",
	path: "/api/public/hooks/process-emails",
	getParentRoute: () => Route$31
});
var ApiPublicHooksSendRemindersRoute = Route.update({
	id: "/api/public/hooks/send-reminders",
	path: "/api/public/hooks/send-reminders",
	getParentRoute: () => Route$31
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute,
	AuthenticatedBookingRoute,
	AuthenticatedChatRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedFinancatRoute,
	AuthenticatedHistoriaRoute,
	AuthenticatedInfoRoute,
	AuthenticatedInventariRoute,
	AuthenticatedPacientetRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	CmimetRoute,
	FaqRoute,
	GaleriaRoute,
	KontaktRoute,
	KushtetRoute,
	McpRoute,
	PrivatesiaRoute,
	RecensionetRoute,
	RrethRoute,
	SherbimetRoute,
	Char91DotmcpChar93ListToolsRoute,
	Char91DotwellKnownChar93OauthProtectedResourceRoute,
	ApiChatRoute,
	DotlovableOauthConsentRoute,
	Char91DotmcpChar93InvokeToolToolRoute,
	ApiPublicHooksCalendarSyncRoute,
	ApiPublicHooksErrorsRoute,
	ApiPublicHooksProcessEmailsRoute,
	ApiPublicHooksSendRemindersRoute
};
var routeTree = Route$31._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
export { CLINIC as _, Route$12 as a, Route$15 as c, Route$28 as d, Route$29 as f, fetchReviews as g, fetchGallery as h, Route$7 as i, FAQS as l, PublicHeader as m, Route$5 as n, Route$13 as o, PublicFooter as p, oauth as r, Route$14 as s, router_exports as t, pricesQuery as u, Button as v, buttonVariants as y };
