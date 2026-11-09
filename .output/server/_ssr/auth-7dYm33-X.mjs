import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CN0ofe5e.mjs";
import { d as Route$28, v as Button } from "./router-DA3D-5Pv.mjs";
import { t as Input } from "./input-CqV36rr2.mjs";
import { t as Label } from "./label-BYIfJH-v.mjs";
import { Ht as object, Kt as string } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as Card } from "./card-CRTTy5Dx.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DJmpbwhv.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-4g10N4ls.mjs";
import { r as createServerFn } from "./server-CkpSkju-.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DTualNdl.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { v as ShieldCheck } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/auth-7dYm33-X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var verifyStaffCode = createServerFn({ method: "POST" }).inputValidator((raw) => object({ code: string().min(1).max(32) }).parse(raw)).handler(createSsrRpc("7238c8c495c0f7211ccc86e52f8e7cbf3b5255f07bf3b0c015a0ea569b926833"));
var claimStaffRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	token: string().min(10).max(300),
	companyRole: string().min(2).max(80),
	fullName: string().min(2).max(120).optional(),
	phone: string().min(5).max(40).optional()
}).parse(raw)).handler(createSsrRpc("1f465d1dd28b21eadb3f8ed70b9a1d59487798157650db2e53845e0880652650"));
var PENDING_KEY = "saraci_pending_staff";
function AuthPage() {
	const nav = useNavigate();
	const search = Route$28.useSearch();
	const [tab, setTab] = (0, import_react.useState)(search.mode ?? "login");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [codeOk, setCodeOk] = (0, import_react.useState)(false);
	const [staffCode, setStaffCode] = (0, import_react.useState)("");
	const [staffToken, setStaffToken] = (0, import_react.useState)("");
	const verifyCode = useServerFn(verifyStaffCode);
	const claimRole = useServerFn(claimStaffRole);
	async function onVerifyCode(e) {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await verifyCode({ data: { code: staffCode } });
			if (!res.ok) return toast.error("Kodi është i pasaktë.");
			setStaffToken(res.token);
			setStaffCode("");
			setCodeOk(true);
			toast.success("Kodi u verifikua. Plotësoni të dhënat.");
		} finally {
			setLoading(false);
		}
	}
	async function onStaffRegister(e) {
		e.preventDefault();
		setLoading(true);
		const f = new FormData(e.currentTarget);
		const full_name = String(f.get("full_name") ?? "");
		const phone = String(f.get("phone") ?? "");
		const companyRole = String(f.get("company_role") ?? "");
		const { data: signUpData, error } = await supabase.auth.signUp({
			email: String(f.get("email")).trim().toLowerCase(),
			password: String(f.get("password")),
			options: {
				emailRedirectTo: window.location.origin + "/auth",
				data: {
					full_name,
					phone,
					city: "Elbasan"
				}
			}
		});
		if (error) {
			setLoading(false);
			return toast.error("Regjistrimi dështoi: " + error.message);
		}
		if (!signUpData.session) {
			localStorage.setItem(PENDING_KEY, JSON.stringify({
				token: staffToken,
				companyRole,
				full_name,
				phone
			}));
			setLoading(false);
			return toast.success("Konfirmoni emailin, pastaj hyni — roli admin aktivizohet automatikisht.");
		}
		try {
			await claimRole({ data: {
				token: staffToken,
				companyRole,
				fullName: full_name,
				phone
			} });
			toast.success("Llogaria admin u krijua!");
			nav({ to: "/admin" });
		} catch (err) {
			toast.error("Llogaria u krijua, por roli admin dështoi: " + err.message);
			goNext();
		} finally {
			setLoading(false);
		}
	}
	async function claimPendingStaff() {
		const raw = localStorage.getItem(PENDING_KEY);
		if (!raw) return false;
		try {
			const p = JSON.parse(raw);
			await claimRole({ data: {
				token: p.token,
				companyRole: p.companyRole,
				fullName: p.full_name,
				phone: p.phone
			} });
			localStorage.removeItem(PENDING_KEY);
			toast.success("Roli admin u aktivizua.");
			return true;
		} catch {
			return false;
		}
	}
	const goNext = () => {
		if (search.next) window.location.href = search.next;
		else nav({ to: "/dashboard" });
	};
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) goNext();
		});
	}, []);
	async function onLogin(e) {
		e.preventDefault();
		setLoading(true);
		const f = new FormData(e.currentTarget);
		const { error } = await supabase.auth.signInWithPassword({
			email: String(f.get("email")).trim().toLowerCase(),
			password: String(f.get("password"))
		});
		if (error) {
			setLoading(false);
			return toast.error("Hyrja dështoi: " + error.message);
		}
		const becameStaff = await claimPendingStaff();
		setLoading(false);
		toast.success("Mirë se erdhe!");
		if (becameStaff) return nav({ to: "/admin" });
		goNext();
	}
	async function onRegister(e) {
		e.preventDefault();
		setLoading(true);
		const f = new FormData(e.currentTarget);
		const redirectBack = window.location.origin + "/auth";
		const { data, error } = await supabase.auth.signUp({
			email: String(f.get("email")).trim().toLowerCase(),
			password: String(f.get("password")),
			options: {
				emailRedirectTo: redirectBack,
				data: {
					full_name: String(f.get("full_name") ?? ""),
					phone: String(f.get("phone") ?? ""),
					city: String(f.get("city") ?? "Elbasan")
				}
			}
		});
		setLoading(false);
		if (error) return toast.error("Regjistrimi dështoi: " + error.message);
		if (!data.session) {
			toast.success("Konfirmoni emailin përpara se të hyni në llogari.");
			setTab("login");
			return;
		}
		toast.success("Llogaria u krijua!");
		goNext();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-hero-gradient grid place-items-center px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 justify-center mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold",
						children: "S"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl font-semibold",
						children: "Saraci Dental"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "p-6 shadow-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: tab,
						onValueChange: (v) => setTab(v),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "grid grid-cols-3 w-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "login",
										children: "Hyr"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "register",
										children: "Regjistrohu"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "staf",
										children: "Staf"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "login",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: onLogin,
									className: "space-y-4 pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "email",
											children: "Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "email",
											name: "email",
											type: "email",
											required: true,
											autoComplete: "email"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "password",
											children: "Fjalëkalimi"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "password",
											name: "password",
											type: "password",
											required: true,
											autoComplete: "current-password"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "w-full",
											disabled: loading,
											children: loading ? "Duke hyrë..." : "Hyr në llogari"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "register",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: onRegister,
									className: "space-y-4 pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "r_full_name",
											children: "Emri i plotë"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "r_full_name",
											name: "full_name",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "r_phone",
												children: "Telefoni"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "r_phone",
												name: "phone",
												required: true,
												placeholder: "069..."
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "r_city",
												children: "Qyteti"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "r_city",
												name: "city",
												defaultValue: "Elbasan"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "r_email",
											children: "Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "r_email",
											name: "email",
											type: "email",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "r_password",
												children: "Fjalëkalimi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "r_password",
												name: "password",
												type: "password",
												required: true,
												minLength: 8,
												autoComplete: "new-password"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground mt-1",
												children: "Të paktën 8 karaktere."
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "w-full",
											disabled: loading,
											children: loading ? "Duke krijuar..." : "Krijo llogari"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "staf",
								children: !codeOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: onVerifyCode,
									className: "space-y-4 pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-3 rounded-lg border bg-muted/40 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-5 h-5 text-primary mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Regjistrimi i stafit është i mbrojtur. Shkruani kodin e klinikës për të hapur formën."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s_code",
											children: "Kodi i klinikës"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "s_code",
											value: staffCode,
											onChange: (e) => setStaffCode(e.target.value),
											inputMode: "numeric",
											autoComplete: "off",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "w-full",
											disabled: loading,
											children: loading ? "Duke verifikuar..." : "Vazhdo"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: onStaffRegister,
									className: "space-y-4 pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s_full_name",
											children: "Emër Mbiemër"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "s_full_name",
											name: "full_name",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "s_phone",
												children: "Telefoni"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "s_phone",
												name: "phone",
												required: true,
												placeholder: "069..."
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "s_role",
												children: "Roli në kompani"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "s_role",
												name: "company_role",
												required: true,
												placeholder: "Dentist / Recepsion"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s_email",
											children: "Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "s_email",
											name: "email",
											type: "email",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s_password",
											children: "Fjalëkalimi"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "s_password",
											name: "password",
											type: "password",
											required: true,
											minLength: 8,
											autoComplete: "new-password"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "w-full",
											disabled: loading,
											children: loading ? "Duke krijuar..." : "Krijo llogari administratori"
										})
									]
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted-foreground mt-4",
					children: "Duke vazhduar, pranoni kushtet e klinikës Saraci Dental."
				})
			]
		})
	});
}
export { AuthPage as component };
