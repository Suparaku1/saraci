import { o as __toESM } from "../_runtime.mjs";
import { n as useServerFn } from "./createSsrRpc-4g10N4ls.mjs";
import { a as listMyAppointments, i as getAvailability, n as cancelBooking, s as rescheduleBooking, t as Calendar$1 } from "./calendar-CfuAdN7E.mjs";
import { t as Card } from "./card-CRTTy5Dx.mjs";
import { v as Button } from "./router-DA3D-5Pv.mjs";
import { t as Badge } from "./badge-CRSM8iyI.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-CDPdBsuf.mjs";
import { t as Input } from "./input-CqV36rr2.mjs";
import { t as Label } from "./label-BYIfJH-v.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as History, rt as CalendarClock } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/historia-fZTedArB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const list = useServerFn(listMyAppointments);
	const cancel = useServerFn(cancelBooking);
	const reschedule = useServerFn(rescheduleBooking);
	const getAvailabilityForDate = useServerFn(getAvailability);
	const [items, setItems] = (0, import_react.useState)([]);
	const [refreshKey, setRefreshKey] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		list({ data: void 0 }).then((r) => setItems(r.appointments)).catch((e) => toast.error(String(e.message ?? e)));
	}, [list, refreshKey]);
	const upcoming = items.filter((a) => a.status === "booked" && new Date(a.slot_start) >= /* @__PURE__ */ new Date());
	const past = items.filter((a) => !(a.status === "booked" && new Date(a.slot_start) >= /* @__PURE__ */ new Date()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl mx-auto p-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-3xl flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-7 h-7 text-primary" }), " Historia ime"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold mb-2",
				children: "Termine aktive"
			}), upcoming.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Nuk keni termine aktive."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: upcoming.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApptCard, {
					a,
					onChanged: () => setRefreshKey((k) => k + 1),
					cancel,
					reschedule,
					getAvailabilityForDate
				}, a.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold mb-2",
				children: "Historia e vizitave"
			}), past.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Nuk ka rekorde të mëparshme."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: past.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApptCard, {
					a,
					readOnly: true,
					cancel,
					reschedule,
					getAvailabilityForDate,
					onChanged: () => {}
				}, a.id))
			})] })
		]
	});
}
function statusBadge(s) {
	const it = {
		booked: {
			label: "Aktiv",
			variant: "default"
		},
		cancelled: {
			label: "Anuluar",
			variant: "destructive"
		},
		rescheduled: {
			label: "Rishënuar",
			variant: "secondary"
		},
		completed: {
			label: "Përfunduar",
			variant: "outline"
		},
		no_show: {
			label: "Mungoi",
			variant: "destructive"
		}
	}[s] ?? {
		label: s,
		variant: "outline"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: it.variant,
		children: it.label
	});
}
function ApptCard({ a, readOnly, cancel, reschedule, getAvailabilityForDate, onChanged }) {
	const [cancelOpen, setCancelOpen] = (0, import_react.useState)(false);
	const [rescheduleOpen, setRescheduleOpen] = (0, import_react.useState)(false);
	const [verify, setVerify] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [date, setDate] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [slots, setSlots] = (0, import_react.useState)([]);
	const [slot, setSlot] = (0, import_react.useState)("");
	const [loadingSlots, setLoadingSlots] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!rescheduleOpen) return;
		const from = new Date(date);
		from.setHours(0, 0, 0, 0);
		const to = new Date(date);
		to.setHours(23, 59, 59, 999);
		setLoadingSlots(true);
		setSlot("");
		getAvailabilityForDate({ data: {
			from: from.toISOString(),
			to: to.toISOString()
		} }).then((result) => setSlots(result.slots)).catch((error) => toast.error(error.message)).finally(() => setLoadingSlots(false));
	}, [
		date,
		getAvailabilityForDate,
		rescheduleOpen
	]);
	async function doCancel() {
		setBusy(true);
		try {
			await cancel({ data: {
				bookingCode: a.booking_code,
				verify,
				reason
			} });
			toast.success("Rezervimi u anulua");
			setCancelOpen(false);
			onChanged();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	async function doReschedule() {
		if (!slot) return toast.error("Zgjidhni orarin e ri.");
		setBusy(true);
		try {
			await reschedule({ data: {
				bookingCode: a.booking_code,
				verify,
				newSlotIso: slot
			} });
			toast.success("Termini u zhvendos dhe njoftimet u aktivizuan.");
			setRescheduleOpen(false);
			onChanged();
		} catch (e) {
			toast.error(e.message ?? "Zhvendosja dështoi.");
			const from = new Date(date);
			from.setHours(0, 0, 0, 0);
			const to = new Date(date);
			to.setHours(23, 59, 59, 999);
			getAvailabilityForDate({ data: {
				from: from.toISOString(),
				to: to.toISOString()
			} }).then((result) => setSlots(result.slots));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-4 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: new Date(a.slot_start).toLocaleString("sq-AL", {
							timeZone: "Europe/Tirane",
							dateStyle: "medium",
							timeStyle: "short"
						})
					}), statusBadge(a.status)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground mt-1",
					children: [
						"Kodi: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: a.booking_code
						}),
						" · ",
						a.service ?? "—"
					]
				}),
				a.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm mt-2",
					children: a.notes
				})
			] }), !readOnly && a.status === "booked" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: rescheduleOpen,
					onOpenChange: setRescheduleOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "mr-2 h-4 w-4" }), " Zhvendos"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Zhvendos terminin" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-5 md:grid-cols-[auto,1fr]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, {
									mode: "single",
									selected: date,
									onSelect: (nextDate) => nextDate && setDate(nextDate),
									disabled: (day) => day < new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)) || day.getDay() === 0,
									weekStartsOn: 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ora e re" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4",
										children: [loadingSlots ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "col-span-full text-sm text-muted-foreground",
											children: "Po kontrollohen oraret…"
										}) : slots.filter((item) => !item.taken).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											size: "sm",
											variant: slot === item.iso ? "default" : "outline",
											onClick: () => setSlot(item.iso),
											children: item.label.split(" ")[1]
										}, item.iso)), !loadingSlots && slots.every((item) => item.taken) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "col-span-full text-sm text-muted-foreground",
											children: "Nuk ka orare të lira në këtë datë."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: `rv-${a.id}`,
											children: "Telefoni ose emaili i rezervimit"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: `rv-${a.id}`,
											value: verify,
											onChange: (event) => setVerify(event.target.value)
										})]
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setRescheduleOpen(false),
								children: "Mbyll"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy || !verify || !slot,
								onClick: doReschedule,
								children: busy ? "Po zhvendoset…" : "Konfirmo orarin e ri"
							})] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: cancelOpen,
					onOpenChange: setCancelOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "destructive",
							children: "Anulo termin"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Anulo rezervimin" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Për siguri, konfirmoni me telefonin ose emailin që përdorët gjatë rezervimit."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "v",
								children: "Telefoni ose emaili"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "v",
								value: verify,
								onChange: (e) => setVerify(e.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "r",
								children: "Arsyeja (opsionale)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "r",
								value: reason,
								onChange: (e) => setReason(e.target.value)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setCancelOpen(false),
							children: "Mbyll"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							disabled: busy || !verify,
							onClick: doCancel,
							children: "Konfirmo anulimin"
						})] })
					] })]
				})]
			})]
		})
	});
}
export { HistoryPage as component };
