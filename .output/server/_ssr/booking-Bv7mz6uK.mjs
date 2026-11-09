import { o as __toESM } from "../_runtime.mjs";
import { n as useServerFn } from "./createSsrRpc-4g10N4ls.mjs";
import { i as getAvailability, o as listServices, r as createBooking, t as Calendar$1 } from "./calendar-CfuAdN7E.mjs";
import { t as Card } from "./card-CRTTy5Dx.mjs";
import { s as Route$14, v as Button } from "./router-DA3D-5Pv.mjs";
import { t as Input } from "./input-CqV36rr2.mjs";
import { t as Label } from "./label-BYIfJH-v.mjs";
import { t as Textarea } from "./textarea-DvN15-gJ.mjs";
import { t as cn } from "./utils-DWGjSd5x.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BdJfjbEJ.mjs";
import { t as Badge } from "./badge-CRSM8iyI.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CDPdBsuf.mjs";
import { t as supabase } from "./client-CN0ofe5e.mjs";
import { c as isValidPhone, f as splitFullName, i as SERVICE_RULE, r as PHONE_RULE, s as isValidEmail, t as EMAIL_RULE } from "./booking-validation-Ch97K_k5.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Check, K as CircleCheck, O as Moon, U as Clock, f as Sun, nt as CalendarDays } from "../_libs/lucide-react.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/booking-Bv7mz6uK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
function BookingBody() {
	const { user } = Route$14.useRouteContext();
	const nav = useNavigate();
	const getAvail = useServerFn(getAvailability);
	const create = useServerFn(createBooking);
	const getServices = useServerFn(listServices);
	const [date, setDate] = (0, import_react.useState)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	});
	const [slots, setSlots] = (0, import_react.useState)([]);
	const [loadingSlots, setLoadingSlots] = (0, import_react.useState)(false);
	const [pick, setPick] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [services, setServices] = (0, import_react.useState)([]);
	const [service, setService] = (0, import_react.useState)("");
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [patientPhone, setPatientPhone] = (0, import_react.useState)("");
	const [patientEmail, setPatientEmail] = (0, import_react.useState)(user.email ?? "");
	const [consent, setConsent] = (0, import_react.useState)(false);
	const [confirmation, setConfirmation] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.from("profiles").select("full_name, phone, email").eq("id", user.id).maybeSingle().then(({ data }) => {
			const { firstName: f, lastName: l } = splitFullName(data?.full_name ?? "");
			setFirstName(f);
			setLastName(l);
			setPatientPhone(data?.phone ?? "");
			setPatientEmail(data?.email ?? user.email ?? "");
		});
		getServices({ data: void 0 }).then((r) => {
			setServices(r.services);
			if (r.services[0]) setService(r.services[0].name);
		}).catch((e) => toast.error(String(e.message ?? e)));
	}, [user.id, getServices]);
	(0, import_react.useEffect)(() => {
		const from = new Date(date);
		from.setHours(0, 0, 0, 0);
		const to = new Date(date);
		to.setHours(23, 59, 59, 999);
		setLoadingSlots(true);
		setPick(null);
		getAvail({ data: {
			from: from.toISOString(),
			to: to.toISOString()
		} }).then((r) => setSlots(r.slots)).catch((e) => toast.error(String(e.message ?? e))).finally(() => setLoadingSlots(false));
	}, [date, getAvail]);
	const { morning, afternoon } = (0, import_react.useMemo)(() => {
		const morning = [], afternoon = [];
		for (const s of slots) if (parseInt(s.label.split(" ")[1]?.split(":")[0] ?? "0", 10) < 13) morning.push(s);
		else afternoon.push(s);
		return {
			morning,
			afternoon
		};
	}, [slots]);
	const isSunday = date.getDay() === 0;
	const isPast = date < new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0));
	const errors = {
		firstName: firstName.trim().length < 2 ? "Shkruani emrin." : null,
		lastName: lastName.trim().length < 2 ? "Shkruani mbiemrin." : null,
		phone: isValidPhone(patientPhone) ? null : PHONE_RULE,
		email: isValidEmail(patientEmail) ? null : EMAIL_RULE,
		service: service.trim().length < 3 ? SERVICE_RULE : null,
		consent: consent ? null : "Duhet të pranoni përpunimin e të dhënave për të rezervuar."
	};
	const formValid = Object.values(errors).every((e) => e === null);
	async function submit(e) {
		e.preventDefault();
		if (!pick) return toast.error("Zgjidhni një orar");
		const firstError = Object.values(errors).find((x) => x !== null);
		if (firstError) return toast.error(firstError);
		const f = new FormData(e.currentTarget);
		setLoading(true);
		try {
			const res = await create({ data: {
				slotIso: pick,
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				patientPhone: patientPhone.replace(/[\s\-()]/g, ""),
				patientEmail: patientEmail.trim().toLowerCase(),
				service,
				notes: String(f.get("notes") ?? "")
			} });
			setConfirmation({
				code: res.appointment.booking_code,
				slot: res.appointment.slot_start,
				service
			});
		} catch (e) {
			toast.error(e.message ?? "Diçka shkoi keq");
		} finally {
			setLoading(false);
		}
	}
	const selectedService = services.find((s) => s.name === service);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-5xl mx-auto p-4 sm:p-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-3xl flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "w-7 h-7 text-primary" }), " Rezervo termin"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mt-1",
				children: "Zgjidh datën, orarin dhe shërbimin. Çdo termin zgjat 1 orë. Klinika është e mbyllur të dielën."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-[auto,1fr] gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4 h-fit",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-medium mb-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "w-4 h-4" }), " Zgjidh datën"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, {
							mode: "single",
							selected: date,
							onSelect: (d) => d && setDate(d),
							disabled: (d) => d < new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)) || d.getDay() === 0,
							className: "pointer-events-auto",
							weekStartsOn: 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-2",
							children: "E hënë – E shtunë · 09:00 – 19:00"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: date.toLocaleDateString("sq-AL", {
									weekday: "long",
									day: "2-digit",
									month: "long",
									year: "numeric"
								})
							}), slots.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: [slots.filter((s) => !s.taken).length, " të lira"]
							})]
						}),
						isSunday || isPast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground py-8 text-center",
							children: isSunday ? "Klinika është e mbyllur të dielën." : "Zgjidhni një datë të vlefshme."
						}) : loadingSlots ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 sm:grid-cols-5 gap-2",
							children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10" }, i))
						}) : slots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground py-8 text-center",
							children: "Nuk ka orare të disponueshme."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotGroup, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-4 h-4" }),
								title: "Paradite",
								slots: morning,
								pick,
								onPick: setPick
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotGroup, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-4 h-4" }),
								title: "Pasdite",
								slots: afternoon,
								pick,
								onPick: setPick
							})]
						}),
						pick && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 p-3 rounded-md bg-primary/5 border border-primary/20 text-sm flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-primary" }),
								"Ora e zgjedhur: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: new Date(pick).toLocaleString("sq-AL", {
										timeZone: "Europe/Tirane",
										dateStyle: "medium",
										timeStyle: "short"
									})
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: submit,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg",
							children: "Të dhënat e pacientit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "firstName",
										children: "Emri *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "firstName",
										required: true,
										value: firstName,
										onChange: (e) => setFirstName(e.target.value),
										placeholder: "Filan"
									}),
									errors.firstName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive mt-1",
										children: errors.firstName
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "lastName",
										children: "Mbiemri *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "lastName",
										required: true,
										value: lastName,
										onChange: (e) => setLastName(e.target.value),
										placeholder: "Fisteku"
									}),
									errors.lastName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive mt-1",
										children: errors.lastName
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "patientPhone",
										children: "Telefoni *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "patientPhone",
										required: true,
										inputMode: "numeric",
										maxLength: 14,
										value: patientPhone,
										onChange: (e) => setPatientPhone(e.target.value),
										placeholder: "0691234567"
									}),
									errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive mt-1",
										children: errors.phone
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "patientEmail",
										children: "Email *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "patientEmail",
										type: "email",
										required: true,
										value: patientEmail,
										onChange: (e) => setPatientEmail(e.target.value),
										placeholder: "emri@gmail.com"
									}),
									errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive mt-1",
										children: errors.email
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "service",
											children: "Shërbimi *"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: service,
											onValueChange: setService,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Zgjidh shërbimin (pastrim, mbushje, ortodonci, implant...)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: s.name,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.name }), s.price_hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground",
														children: s.price_hint
													})]
												})
											}, s.id)) })]
										}),
										errors.service && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive mt-1",
											children: errors.service
										}),
										selectedService?.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: selectedService.description
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "notes",
							children: "Shënime (opsionale)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "notes",
							name: "notes",
							placeholder: "P.sh. dhimbje në dhëmballën poshtë..."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 rounded-md border border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								id: "consent",
								checked: consent,
								onCheckedChange: (v) => setConsent(v === true),
								className: "mt-0.5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "consent",
								className: "text-sm font-normal leading-relaxed text-muted-foreground",
								children: [
									"Pranoj që Saraci Dental Clinic të përpunojë të dhënat e mia personale dhe shëndetësore për terminin dhe kujdesin dentar, sipas",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/privatesia",
										className: "underline text-foreground",
										children: "Politikës së privatësisë"
									}),
									" dhe",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/kushtet",
										className: "underline text-foreground",
										children: "Kushteve të shërbimit"
									}),
									". *"
								]
							})]
						}),
						!formValid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Plotësoni të gjitha fushat e detyrueshme për të vazhduar."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: !pick || loading || !formValid,
							className: "w-full sm:w-auto",
							size: "lg",
							children: loading ? "Duke rezervuar..." : "Konfirmo rezervimin"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!confirmation,
				onOpenChange: (o) => {
					if (!o) {
						setConfirmation(null);
						nav({ to: "/historia" });
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-6 h-6" }), " Rezervimi u konfirmua!"]
						}) }),
						confirmation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center p-4 bg-white rounded-lg border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
										value: `SDC:${confirmation.code}`,
										size: 180
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: "Kodi i rezervimit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-2xl font-bold text-primary",
										children: confirmation.code
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border rounded-md p-3 text-sm space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Data:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: new Date(confirmation.slot).toLocaleString("sq-AL", {
													timeZone: "Europe/Tirane",
													dateStyle: "full",
													timeStyle: "short"
												})
											})
										] }),
										confirmation.service && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Shërbimi:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: confirmation.service
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Adresa:"
										}), " Rruga Ptoleme Xhuvani, Elbasan 3001"] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground text-center",
									children: "Ruani këtë kod për të anuluar ose ripërcaktuar terminin."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [
								confirmation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `https://wa.me/355675402044?text=${encodeURIComponent(`Përshëndetje Saraci Dental! Kam rezervuar një termin.\nKodi: ${confirmation.code}\nData: ${new Date(confirmation.slot).toLocaleString("sq-AL", {
										timeZone: "Europe/Tirane",
										dateStyle: "full",
										timeStyle: "short"
									})}${confirmation.service ? `\nShërbimi: ${confirmation.service}` : ""}`)}`,
									target: "_blank",
									rel: "noopener noreferrer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "w-full",
										children: "Njofto në WhatsApp"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => window.print(),
									children: "Printo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => {
										setConfirmation(null);
										nav({ to: "/historia" });
									},
									children: "Shko te Historia"
								})
							]
						})
					]
				})
			})
		]
	});
}
function SlotGroup({ icon, title, slots, pick, onPick }) {
	if (slots.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5",
		children: [
			icon,
			" ",
			title
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-3 sm:grid-cols-5 gap-2",
		children: slots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			disabled: s.taken,
			onClick: () => onPick(s.iso),
			className: `px-3 py-2 rounded-md text-sm border transition ${s.taken ? "bg-muted text-muted-foreground line-through cursor-not-allowed" : pick === s.iso ? "bg-primary text-primary-foreground border-primary shadow-sm" : "hover:bg-accent hover:border-primary/50 border-border"}`,
			children: s.label.split(" ")[1]
		}, s.iso))
	})] });
}
export { BookingBody as component };
