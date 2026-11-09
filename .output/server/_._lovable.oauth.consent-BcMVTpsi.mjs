import { t as Card } from "./_ssr/card-CRTTy5Dx.mjs";
import { o as require_jsx_runtime } from "./_libs/@ai-sdk/react+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-BcMVTpsi.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
	className: "min-h-screen grid place-items-center p-6",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 max-w-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-lg mb-2",
			children: "Kërkesa nuk u ngarkua"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: String(error?.message ?? error)
		})]
	})
});
export { SplitErrorComponent as errorComponent };
