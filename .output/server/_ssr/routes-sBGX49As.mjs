import { o as __toESM } from "../_runtime.mjs";
import { _ as CLINIC, v as Button } from "./router-DA3D-5Pv.mjs";
import { t as Card } from "./card-CRTTy5Dx.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Phone, F as Mail, K as CircleCheck, M as MessageCircle, N as Menu, P as MapPin, U as Clock, _ as Shield, at as ArrowRight, et as Calendar, k as Mic, m as Star, p as Stethoscope, t as X } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-sBGX49As.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-hero-gradient",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-6xl mx-auto px-4 py-14 md:py-24 grid lg:grid-cols-2 gap-10 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "w-3.5 h-3.5" }), " Elbasan · Shqipëri"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-4 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]",
							children: [
								"Buzëqeshja juaj,",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary",
									children: "prioriteti ynë"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-5 text-lg text-foreground/80 max-w-lg",
							children: [
								"Klinika e ",
								CLINIC.dentist,
								" në zemër të Elbasanit. Rezervo terminin online, ose bisedo me recepsionistin virtual në shqip — 24/7."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-7 flex flex-wrap gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									search: { mode: "register" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "lg",
										className: "gap-2",
										children: ["Rezervo terminin ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `tel:${CLINIC.phone}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "lg",
										variant: "outline",
										className: "gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }), " Telefono"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `https://wa.me/${CLINIC.whatsapp}`,
									target: "_blank",
									rel: "noopener",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										className: "gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50",
										children: "WhatsApp"
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4" }), " Hën–Sht 09–19"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-4 h-4" }),
										" ",
										CLINIC.street
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-4 h-4 fill-amber-400 text-amber-400" }), " 4.9 · 200+ pacientë"]
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: CLINIC.photos.hero,
							alt: `${CLINIC.name} — klinika në ${CLINIC.street}, Elbasan`,
							width: 1080,
							height: 720,
							className: "rounded-2xl shadow-2xl w-full h-auto aspect-[3/2] object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "hidden sm:block absolute -bottom-6 -left-6 p-4 bg-background/95 backdrop-blur shadow-xl max-w-[240px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "Recepsionisti online"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Përgjigjet në pak sekonda, në shqip."
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "max-w-6xl mx-auto px-4 py-10 md:py-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 gap-3",
					children: [
						[CLINIC.photos.room, "Ambienti i klinikës"],
						[CLINIC.photos.team, "Ekipi ynë në punë"],
						[CLINIC.photos.whitening, "Zbardhim profesional"],
						[CLINIC.photos.treatment, "Trajtim me kujdes"],
						[CLINIC.photos.team2, "Bashkëpunim mes dentistëve"],
						[CLINIC.photos.office, "Salloni kryesor"]
					].map(([src, alt]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[4/5] rounded-xl overflow-hidden bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src,
							alt,
							loading: "lazy",
							className: "w-full h-full object-cover hover:scale-105 transition-transform duration-500"
						})
					}, src))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-6xl mx-auto px-4 py-14 md:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center max-w-2xl mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl md:text-4xl",
							children: "Shërbimet tona"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted-foreground",
							children: "Nga kontrolli rutinë deri te implantologjia — gjithçka nën një kulm."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
						children: [
							["Kontroll & konsultë", "Vlerësim i plotë dhe plan trajtimi personal."],
							["Pastrim profesional", "Heqje e gurëzës me ultratinguj, pa dhimbje."],
							["Zbardhim profesional", "Buzëqeshje më e ndritshme me llambë LED."],
							["Mbushje estetike", "Kompozit i cilësisë së lartë, ngjyrë natyrale."],
							["Endodonci", "Trajtim modern i kanaleve rrënjore."],
							["Implantologji", "Zgjidhje afatgjata për dhëmbë të munguar."]
						].map(([t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5 bg-card-gradient hover:shadow-md transition-shadow",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold",
									children: t
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm text-muted-foreground",
									children: d
								})
							]
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/sherbimet",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								children: "Shiko të gjitha shërbimet"
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-muted/30 py-14 md:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6",
					children: [
						[
							Shield,
							"Higjienë europiane",
							"Sterilizim i çertifikuar dhe protokolle strikte."
						],
						[
							Calendar,
							"Rezervim 24/7",
							"Online në pak sekonda, sloti fiks 1 orë."
						],
						[
							MessageCircle,
							"Recepsionist virtual",
							"Chat dhe zë në shqip — natë e ditë."
						]
					].map(([Icon, t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-14 h-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center mx-auto shadow-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-7 h-7" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-xl",
								children: t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground max-w-xs mx-auto",
								children: d
							})
						]
					}, t))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "max-w-6xl mx-auto px-4 py-14 md:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid md:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 text-primary",
								children: [
									0,
									1,
									2,
									3,
									4
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-5 h-5 fill-current" }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-2xl",
								children: "Vlerësimet e pacientëve"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Lexoni përvojat e pacientëve tanë ose lini vlerësimin tuaj pas vizitës. Ne nuk publikojmë dëshmi pa pëlqimin e pacientit."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/recensionet",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "gap-2",
										children: ["Lexo recensionet ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/galeria",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										children: "Para / pas"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://www.google.com/maps/search/?api=1&query=Saraci+Dental+Clinic+Elbasan",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "mt-4 inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "gap-2",
									children: ["Shiko vlerësimet në Google ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "w-5 h-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-2xl",
								children: CLINIC.dentist
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }), " Mjeke stomatologe, pronare e klinikës në Elbasan"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }), " Trajtime estetike, endodonci dhe implantologji"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }), " Protokolle sterilizimi sipas standardeve europiane"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }), " Konsultë e shpjeguar me plan trajtimi dhe kosto paraprake"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/rreth",
								className: "mt-4 inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									className: "gap-2",
									children: ["Më shumë për klinikën ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-4xl mx-auto px-4 py-14 md:py-20 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl md:text-4xl",
						children: "Gati për buzëqeshjen tuaj?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: "Rezervo online tani ose bisedo me recepsionistin tonë virtual — përgjigjemi menjëherë."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: { mode: "register" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								className: "gap-2",
								children: ["Rezervo terminin ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/kontakt",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								variant: "outline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-4 h-4 mr-2" }), " Na kontaktoni"]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
export { CLINIC, PublicFooter, PublicHeader, Landing as component };
