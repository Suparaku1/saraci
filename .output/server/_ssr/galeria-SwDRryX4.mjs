import { t as Card } from "./card-CRTTy5Dx.mjs";
import { h as fetchGallery, m as PublicHeader, p as PublicFooter } from "./router-DA3D-5Pv.mjs";
import { o as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
// node_modules/.nitro/vite/services/ssr/assets/galeria-SwDRryX4.js
var import_jsx_runtime = require_jsx_runtime();
function GalleryPage() {
	const { data = [], isLoading } = useQuery({
		queryKey: ["public-gallery"],
		queryFn: fetchGallery
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-5xl mx-auto px-4 py-12 md:py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl md:text-5xl",
						children: "Para / pas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground max-w-2xl",
						children: "Çdo foto publikohet vetëm me pëlqimin me shkrim të pacientit."
					}),
					isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-sm text-muted-foreground",
						children: "Duke ngarkuar…"
					}),
					!isLoading && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-sm text-muted-foreground",
						children: "Galeria do pasurohet së shpejti."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid md:grid-cols-2 gap-6",
						children: data.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2",
								children: [["Para", g.before], ["Pas", g.after]].map(([label, src]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative aspect-square bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src,
										alt: `${g.title} — ${label}`,
										loading: "lazy",
										className: "w-full h-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute top-2 left-2 rounded bg-background/90 px-2 py-0.5 text-xs font-medium",
										children: label
									})]
								}, label))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold",
									children: g.title
								}), g.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: g.description
								})]
							})]
						}, g.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
export { GalleryPage as component };
