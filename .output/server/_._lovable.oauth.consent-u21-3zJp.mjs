import { o as __toESM } from "./_runtime.mjs";
import { n as Route$5, r as oauth, v as Button } from "./_ssr/router-DA3D-5Pv.mjs";
import { t as Card } from "./_ssr/card-CRTTy5Dx.mjs";
import { o as require_jsx_runtime, s as require_react } from "./_libs/@ai-sdk/react+[...].mjs";
import { v as ShieldCheck } from "./_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-u21-3zJp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Consent() {
	const details = Route$5.useLoaderData();
	const { authorization_id } = Route$5.useSearch();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const clientName = details?.client?.name ?? details?.client?.client_name ?? "Aplikacioni";
	const scopes = (details?.scope ?? "").split(/\s+/).filter(Boolean);
	async function decide(approve) {
		setBusy(true);
		setError(null);
		const { data, error } = approve ? await oauth.approveAuthorization(authorization_id) : await oauth.denyAuthorization(authorization_id);
		if (error) {
			setBusy(false);
			setError(error.message ?? String(error));
			return;
		}
		const target = data?.redirect_url ?? data?.redirect_to;
		if (!target) {
			setBusy(false);
			setError("Serveri nuk ktheu një URL kthyese.");
			return;
		}
		window.location.href = target;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen grid place-items-center p-6 bg-hero-gradient",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6 max-w-md w-full space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 rounded-lg bg-primary/10 text-primary grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-6 h-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-lg",
						children: [
							"Lidh ",
							clientName,
							" me Saraci Dental"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Kërkohet leje për të përdorur llogarinë tuaj."
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Kjo lejon ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: clientName }),
							" të veprojë si ju në Saraci Dental Clinic:"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "list-disc pl-5 text-muted-foreground text-sm space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Të shohë shërbimet dhe oraret e lira" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Të bëjë ose të anulojë termine në emrin tuaj" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Të shohë historikun e termineve tuaja" })
							]
						}),
						scopes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Fusha të kërkuara: ", scopes.join(", ")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Rregullat e privatësisë dhe RLS të klinikës vlejnë gjithmonë."
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive",
					role: "alert",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => decide(true),
						className: "flex-1",
						children: "Aprovo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						variant: "outline",
						onClick: () => decide(false),
						className: "flex-1",
						children: "Anulo"
					})]
				})
			]
		})
	});
}
export { Consent as component };
