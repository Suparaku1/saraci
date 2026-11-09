globalThis.__nitro_main__ = import.meta.url;
import { t as HookableCore } from "./_libs/hookable.mjs";
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
// #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
// #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"d5c-r2mGYiwKJx7leESSIoz3/eeaehE\"",
		"mtime": "2026-11-09T10:54:07.183Z",
		"size": 3420,
		"path": "../public/favicon.png"
	},
	"/icon-192.png": {
		"type": "image/png",
		"etag": "\"6a9e-r0IS/T+LAUav86ZheekOUmDYTKM\"",
		"mtime": "2026-11-09T10:54:15.678Z",
		"size": 27294,
		"path": "../public/icon-192.png"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"295-qpdEG7s6XeMrXcdX0IDm9In4se0\"",
		"mtime": "2026-11-09T10:54:31.949Z",
		"size": 661,
		"path": "../public/manifest.webmanifest"
	},
	"/og-image.jpg": {
		"type": "image/jpeg",
		"etag": "\"1859b-4FH0dQlrINY99w5G4a+Mnc3ILKk\"",
		"mtime": "2026-11-09T10:54:41.276Z",
		"size": 99739,
		"path": "../public/og-image.jpg"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"6f-E0ePEC74+XIBF87F9U6UwJga+Zw\"",
		"mtime": "2026-11-09T10:54:43.970Z",
		"size": 111,
		"path": "../public/robots.txt"
	},
	"/sitemap.xml": {
		"type": "application/xml",
		"etag": "\"292-UyYZh3Fc9gTFTrouAvpRNjHmQws\"",
		"mtime": "2026-11-09T10:54:46.519Z",
		"size": 658,
		"path": "../public/sitemap.xml"
	},
	"/assets/auth-middleware-B6PB5npq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12eb-JQU7NXXhcPdJ8x7kIXoulGjK4sg\"",
		"mtime": "2026-11-09T11:52:40.228Z",
		"size": 4843,
		"path": "../public/assets/auth-middleware-B6PB5npq.js"
	},
	"/assets/admin-CKfNfnWJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6bf1-+5w84rT8VDLpJuIWFSReCDGt1U0\"",
		"mtime": "2026-11-09T11:52:40.228Z",
		"size": 27633,
		"path": "../public/assets/admin-CKfNfnWJ.js"
	},
	"/assets/auth-svIQxrlu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f1e-OaDIaGhe7saVbAP9n5S+rvzi5NM\"",
		"mtime": "2026-11-09T11:52:40.230Z",
		"size": 7966,
		"path": "../public/assets/auth-svIQxrlu.js"
	},
	"/assets/calendar-DaIq-wLM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-eeFhp712BnXhemItsnCCg0HBiCM\"",
		"mtime": "2026-11-09T11:52:40.231Z",
		"size": 257,
		"path": "../public/assets/calendar-DaIq-wLM.js"
	},
	"/assets/booking-yBuUNi6w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"858b-djMn5u+Kg3xKIm9YlIOZxKCTNrM\"",
		"mtime": "2026-11-09T11:52:40.230Z",
		"size": 34187,
		"path": "../public/assets/booking-yBuUNi6w.js"
	},
	"/assets/card-Brfuyri8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f5-wF2McaKZAb7oTpdmNSJR3Zyvdpk\"",
		"mtime": "2026-11-09T11:52:40.232Z",
		"size": 1013,
		"path": "../public/assets/card-Brfuyri8.js"
	},
	"/assets/calendar-rm0hLJMm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11bcc-OAHyKB7NEDZWAvcRmKN8OWa/0sU\"",
		"mtime": "2026-11-09T11:52:40.232Z",
		"size": 72652,
		"path": "../public/assets/calendar-rm0hLJMm.js"
	},
	"/assets/chevron-down-D6etxbdR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"80-4ytSGg7jAz4jOSWGqotxLDYWmWY\"",
		"mtime": "2026-11-09T11:52:40.233Z",
		"size": 128,
		"path": "../public/assets/chevron-down-D6etxbdR.js"
	},
	"/assets/circle-check-Du0sCq7B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-Fgri755qpusISed+VC9j1JBns68\"",
		"mtime": "2026-11-09T11:52:40.234Z",
		"size": 178,
		"path": "../public/assets/circle-check-Du0sCq7B.js"
	},
	"/assets/chat-Cc8cHggU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33b9f-1r3dfNv5PX+g9MoXBlpGi93VKlM\"",
		"mtime": "2026-11-09T11:52:40.233Z",
		"size": 211871,
		"path": "../public/assets/chat-Cc8cHggU.js"
	},
	"/assets/clinic-office-DlpKGVMz.jpg": {
		"type": "image/jpeg",
		"etag": "\"61a3-O7GLjKFtD7rGfYBkCVi9FDhJHcs\"",
		"mtime": "2026-11-09T11:52:40.275Z",
		"size": 24995,
		"path": "../public/assets/clinic-office-DlpKGVMz.jpg"
	},
	"/assets/clinic-front-DlYpU6wZ.jpg": {
		"type": "image/jpeg",
		"etag": "\"9a17-A6iD/gHh4FGnJyQBxWTWIyB2pvE\"",
		"mtime": "2026-11-09T11:52:40.274Z",
		"size": 39447,
		"path": "../public/assets/clinic-front-DlYpU6wZ.jpg"
	},
	"/assets/client-DWYpslKO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"355fa-ynN1avwGPQ3asO0VM362iMyDmro\"",
		"mtime": "2026-11-09T11:52:40.235Z",
		"size": 218618,
		"path": "../public/assets/client-DWYpslKO.js"
	},
	"/assets/clinic-room-DjZTzzQL.jpg": {
		"type": "image/jpeg",
		"etag": "\"1e92e-yZuF0KWzA5hSzYaLaQPIsqS7as0\"",
		"mtime": "2026-11-09T11:52:40.276Z",
		"size": 125230,
		"path": "../public/assets/clinic-room-DjZTzzQL.jpg"
	},
	"/assets/clinic-team-BvXvvHKK.jpg": {
		"type": "image/jpeg",
		"etag": "\"25000-HBYLDeV1un7sh3K6yWARPoONFcM\"",
		"mtime": "2026-11-09T11:52:40.276Z",
		"size": 151552,
		"path": "../public/assets/clinic-team-BvXvvHKK.jpg"
	},
	"/assets/clinic-treatment-DzbZL2Me.jpg": {
		"type": "image/jpeg",
		"etag": "\"1acf1-s7GyIgjACSg9yFVDTJnFTyoz/IM\"",
		"mtime": "2026-11-09T11:52:40.280Z",
		"size": 109809,
		"path": "../public/assets/clinic-treatment-DzbZL2Me.jpg"
	},
	"/assets/clinic-team2-DmGgiDCY.jpg": {
		"type": "image/jpeg",
		"etag": "\"1fac2-ZYeeFMfogwjp4wYonfZFZYdNRew\"",
		"mtime": "2026-11-09T11:52:40.277Z",
		"size": 129730,
		"path": "../public/assets/clinic-team2-DmGgiDCY.jpg"
	},
	"/assets/clinic-whitening-Bc26HPtY.jpg": {
		"type": "image/jpeg",
		"etag": "\"1286d-5DGb01mJGBVPc/aancclhJ46vno\"",
		"mtime": "2026-11-09T11:52:40.281Z",
		"size": 75885,
		"path": "../public/assets/clinic-whitening-Bc26HPtY.jpg"
	},
	"/icon-512.png": {
		"type": "image/png",
		"etag": "\"90556-zWHh6DhIIo2yQaIMuKiWa0/UwuM\"",
		"mtime": "2026-11-09T10:54:26.284Z",
		"size": 591190,
		"path": "../public/icon-512.png"
	},
	"/assets/cmimet-DBUiBOZA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72b-829JtuOkmOIGRS9r3DQMm6eWPUo\"",
		"mtime": "2026-11-09T11:52:40.235Z",
		"size": 1835,
		"path": "../public/assets/cmimet-DBUiBOZA.js"
	},
	"/assets/Combination-C0nvt9Rn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a83-inJr+w1rRhNBRN7Ps4h2qAbZ6DA\"",
		"mtime": "2026-11-09T11:52:40.226Z",
		"size": 23171,
		"path": "../public/assets/Combination-C0nvt9Rn.js"
	},
	"/assets/createLucideIcon-BUe_ptH1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a5-PRL5s+5rmpJCYvbDrPuVRogeiqw\"",
		"mtime": "2026-11-09T11:52:40.236Z",
		"size": 1189,
		"path": "../public/assets/createLucideIcon-BUe_ptH1.js"
	},
	"/assets/dashboard-ClFiZOov.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1245-4ZeZtXtukK3t6QlPwTyWoGcqJEI\"",
		"mtime": "2026-11-09T11:52:40.237Z",
		"size": 4677,
		"path": "../public/assets/dashboard-ClFiZOov.js"
	},
	"/assets/dialog-BxuF6I5B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82d-IjK1YL7w35YjCP/H8rLT6CUcW40\"",
		"mtime": "2026-11-09T11:52:40.237Z",
		"size": 2093,
		"path": "../public/assets/dialog-BxuF6I5B.js"
	},
	"/assets/dist-BbfnXhkO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1466-16a6dCCh8+Ye6ZHlTNIUac0J+X8\"",
		"mtime": "2026-11-09T11:52:40.239Z",
		"size": 5222,
		"path": "../public/assets/dist-BbfnXhkO.js"
	},
	"/assets/dist-BdI_4xeA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e67-n75lBE/L3yGc/es0z8/pxkqd8JI\"",
		"mtime": "2026-11-09T11:52:40.239Z",
		"size": 7783,
		"path": "../public/assets/dist-BdI_4xeA.js"
	},
	"/assets/dist-CRDyI67C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e7-TdfxFVndLnvJ5JPUA/mJX3zj5/8\"",
		"mtime": "2026-11-09T11:52:40.240Z",
		"size": 743,
		"path": "../public/assets/dist-CRDyI67C.js"
	},
	"/assets/dist-CSKoHCXi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21d8-ERmCWqJlQBH37EeonQw1H++AncU\"",
		"mtime": "2026-11-09T11:52:40.241Z",
		"size": 8664,
		"path": "../public/assets/dist-CSKoHCXi.js"
	},
	"/assets/dist-DpJ_kXbp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17c-D6iiHggJRwNTm90Z0FGB8r4py68\"",
		"mtime": "2026-11-09T11:52:40.241Z",
		"size": 380,
		"path": "../public/assets/dist-DpJ_kXbp.js"
	},
	"/assets/download-ClEQpUZ9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-EIc4zPbqER/zahZRt//W6N/I16c\"",
		"mtime": "2026-11-09T11:52:40.241Z",
		"size": 232,
		"path": "../public/assets/download-ClEQpUZ9.js"
	},
	"/assets/faq-DWgISTc7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e75-l1gXbtkdJSiSfwPo+GEGvTJfT+4\"",
		"mtime": "2026-11-09T11:52:40.243Z",
		"size": 7797,
		"path": "../public/assets/faq-DWgISTc7.js"
	},
	"/assets/financat-C1P2aN7k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2367-aJNqNiIWjTvRAZIqcqfNRCEECAY\"",
		"mtime": "2026-11-09T11:52:40.245Z",
		"size": 9063,
		"path": "../public/assets/financat-C1P2aN7k.js"
	},
	"/assets/galeria-D6TIklIr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"69d-oFASxLvrzdF/rngDByNxdm7d9+4\"",
		"mtime": "2026-11-09T11:52:40.245Z",
		"size": 1693,
		"path": "../public/assets/galeria-D6TIklIr.js"
	},
	"/assets/historia-CfIDaCbQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b35-LHAkokLNhxwN9lC86sXC/YKvYhM\"",
		"mtime": "2026-11-09T11:52:40.250Z",
		"size": 6965,
		"path": "../public/assets/historia-CfIDaCbQ.js"
	},
	"/assets/history-4bjVZcBI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ed-eer1LDLhnbHuJF6y7eSe6S5HInc\"",
		"mtime": "2026-11-09T11:52:40.250Z",
		"size": 237,
		"path": "../public/assets/history-4bjVZcBI.js"
	},
	"/assets/info-D8KdxTgT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a6-7Gp0tjaP8dvtlZIq+kDWuueFHjE\"",
		"mtime": "2026-11-09T11:52:40.251Z",
		"size": 4262,
		"path": "../public/assets/info-D8KdxTgT.js"
	},
	"/assets/index-gcmdmgfA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"65fdb-Fj+wf4Xn3WVr2oY8IQ3RRv4E4ZY\"",
		"mtime": "2026-11-09T11:52:40.225Z",
		"size": 417755,
		"path": "../public/assets/index-gcmdmgfA.js"
	},
	"/assets/input-BGM3mJ3n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"246-UrJ1YZB433Fjnpmk0k+5Vd4dv2E\"",
		"mtime": "2026-11-09T11:52:40.252Z",
		"size": 582,
		"path": "../public/assets/input-BGM3mJ3n.js"
	},
	"/assets/invariant-CgFvOqN2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c2-OtvVxjJzKVqOT1XQL6Tnz3B8fGk\"",
		"mtime": "2026-11-09T11:52:40.252Z",
		"size": 450,
		"path": "../public/assets/invariant-CgFvOqN2.js"
	},
	"/assets/inventari-DxOgjhC3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"236b-psqnmd4lwh+UL0Bpfn3uA6tq6nU\"",
		"mtime": "2026-11-09T11:52:40.252Z",
		"size": 9067,
		"path": "../public/assets/inventari-DxOgjhC3.js"
	},
	"/assets/kontakt-BihbmbMm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a35-YVNWsQNjXtSrV9xTmv9uzAFfsb0\"",
		"mtime": "2026-11-09T11:52:40.254Z",
		"size": 2613,
		"path": "../public/assets/kontakt-BihbmbMm.js"
	},
	"/assets/kushtet-btnHJ-5Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d39-69J35PlMZsk9BaJZ20UVoineY1I\"",
		"mtime": "2026-11-09T11:52:40.255Z",
		"size": 3385,
		"path": "../public/assets/kushtet-btnHJ-5Y.js"
	},
	"/assets/label-D-OdD8bV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a7-v5VsPbqBQbcNe04UQu0VMI6RukE\"",
		"mtime": "2026-11-09T11:52:40.255Z",
		"size": 679,
		"path": "../public/assets/label-D-OdD8bV.js"
	},
	"/assets/link-DqkI8zbQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bd4-h1gkxIEEiSIbzUT8m6LgD6shyDc\"",
		"mtime": "2026-11-09T11:52:40.255Z",
		"size": 11220,
		"path": "../public/assets/link-DqkI8zbQ.js"
	},
	"/assets/mic-DebPmzqa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eb-b3pHNd9l2RawHfqxNe9YVCua1k4\"",
		"mtime": "2026-11-09T11:52:40.257Z",
		"size": 235,
		"path": "../public/assets/mic-DebPmzqa.js"
	},
	"/assets/not-found-DIgawKw1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37-RTB6YH5iXRKeXz1Sn6ZQ+vS0lnc\"",
		"mtime": "2026-11-09T11:52:40.258Z",
		"size": 55,
		"path": "../public/assets/not-found-DIgawKw1.js"
	},
	"/assets/pacientet-CjMjdpVT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e14-uicLk+EixPNFylepDy72kYx5+G8\"",
		"mtime": "2026-11-09T11:52:40.258Z",
		"size": 7700,
		"path": "../public/assets/pacientet-CjMjdpVT.js"
	},
	"/assets/package-BgSiMTX2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-1uWV2lGS4KMqGPqegkMEn0XvskQ\"",
		"mtime": "2026-11-09T11:52:40.259Z",
		"size": 372,
		"path": "../public/assets/package-BgSiMTX2.js"
	},
	"/assets/plus-Do93dZZ8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-c/pWPS2JrgH80AHvOYVhFSP8JLk\"",
		"mtime": "2026-11-09T11:52:40.259Z",
		"size": 153,
		"path": "../public/assets/plus-Do93dZZ8.js"
	},
	"/assets/privatesia-DcdE39zJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1333-RG+oZvRNbjG0a0gEN4KtpzjSMmo\"",
		"mtime": "2026-11-09T11:52:40.259Z",
		"size": 4915,
		"path": "../public/assets/privatesia-DcdE39zJ.js"
	},
	"/assets/recensionet-CZuidpHy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e02-wYLWxMv5pJy3d86ZCaVS0Qk+WyE\"",
		"mtime": "2026-11-09T11:52:40.260Z",
		"size": 3586,
		"path": "../public/assets/recensionet-CZuidpHy.js"
	},
	"/assets/route-DaeQBPTe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1152-82maS1xpTUVOTwXvqHHj5LQre5o\"",
		"mtime": "2026-11-09T11:52:40.261Z",
		"size": 4434,
		"path": "../public/assets/route-DaeQBPTe.js"
	},
	"/assets/routes-CtV_jhHc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a12-v7xBY0qSYf/AqpqJ16VfLxNOVa4\"",
		"mtime": "2026-11-09T11:52:40.262Z",
		"size": 14866,
		"path": "../public/assets/routes-CtV_jhHc.js"
	},
	"/assets/rreth-fmqNars0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d50-WQtVY0VExjAWmXG6Dtu8fuDPkIE\"",
		"mtime": "2026-11-09T11:52:40.262Z",
		"size": 3408,
		"path": "../public/assets/rreth-fmqNars0.js"
	},
	"/assets/search-CmybxHk_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-mcw7DCdgq69S8QscSM6V1mfBTtM\"",
		"mtime": "2026-11-09T11:52:40.263Z",
		"size": 174,
		"path": "../public/assets/search-CmybxHk_.js"
	},
	"/assets/sheet-DAwDGEcI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"903-QIgjQ2nsyUyQK3f1fCJ6j5PsN8E\"",
		"mtime": "2026-11-09T11:52:40.265Z",
		"size": 2307,
		"path": "../public/assets/sheet-DAwDGEcI.js"
	},
	"/assets/sherbimet-BsqUIKuR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ab3-XBNnyA2xqk+fpD2xFUyemT1gips\"",
		"mtime": "2026-11-09T11:52:40.266Z",
		"size": 2739,
		"path": "../public/assets/sherbimet-BsqUIKuR.js"
	},
	"/assets/select-BMNJ1MI5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be3d-eHnay1eCZPmNRCuH4noLnEIbxe0\"",
		"mtime": "2026-11-09T11:52:40.264Z",
		"size": 48701,
		"path": "../public/assets/select-BMNJ1MI5.js"
	},
	"/assets/schemas-BFP0Q-i7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17c51-Frjgq8H197L+F4wc2EBxuFn1RZI\"",
		"mtime": "2026-11-09T11:52:40.263Z",
		"size": 97361,
		"path": "../public/assets/schemas-BFP0Q-i7.js"
	},
	"/assets/shield-6FpNIAQL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"110-HREzhXBQFuPO1Zm5RkzEb5DePjQ\"",
		"mtime": "2026-11-09T11:52:40.266Z",
		"size": 272,
		"path": "../public/assets/shield-6FpNIAQL.js"
	},
	"/assets/shield-check-DCMwRmm4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-cbMlN7pBp/5LJaBj1uQEoO/s/Ac\"",
		"mtime": "2026-11-09T11:52:40.267Z",
		"size": 320,
		"path": "../public/assets/shield-check-DCMwRmm4.js"
	},
	"/assets/star-D73ts8t7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8-kR+D62jPILZI0cD7Cz3N1Ph3Ugo\"",
		"mtime": "2026-11-09T11:52:40.267Z",
		"size": 472,
		"path": "../public/assets/star-D73ts8t7.js"
	},
	"/assets/stethoscope-DzLMMrSF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"156-+UHeicpy7/LYj5nXNo3KIeopZ/k\"",
		"mtime": "2026-11-09T11:52:40.268Z",
		"size": 342,
		"path": "../public/assets/stethoscope-DzLMMrSF.js"
	},
	"/assets/tabs-BNYpWjvz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1db6-5nQDOOI8gTEGiaMwv7oVx9ESxqc\"",
		"mtime": "2026-11-09T11:52:40.268Z",
		"size": 7606,
		"path": "../public/assets/tabs-BNYpWjvz.js"
	},
	"/assets/textarea-DkmnJCFK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e0-C2u9b270t4w+8YGE0gYrHElLqh8\"",
		"mtime": "2026-11-09T11:52:40.269Z",
		"size": 480,
		"path": "../public/assets/textarea-DkmnJCFK.js"
	},
	"/assets/styles-D6Pfyfbf.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"152f6-g3ceTZB02z56zBYnn3J6N7FaE5c\"",
		"mtime": "2026-11-09T11:52:40.283Z",
		"size": 86774,
		"path": "../public/assets/styles-D6Pfyfbf.css"
	},
	"/assets/trash-2-DU5hL9eW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"235-f8saQ/zoWn2TV96gcI35WIgzMPQ\"",
		"mtime": "2026-11-09T11:52:40.269Z",
		"size": 565,
		"path": "../public/assets/trash-2-DU5hL9eW.js"
	},
	"/assets/tslib.es6-Tae09705.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42d-qJHuGuq51+EbLaebsBAkbj1JLbk\"",
		"mtime": "2026-11-09T11:52:40.270Z",
		"size": 1069,
		"path": "../public/assets/tslib.es6-Tae09705.js"
	},
	"/assets/useBaseQuery-Di1rBpID.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f29-NMIDgKYpqcrBmhjFfy6wkKK6GWQ\"",
		"mtime": "2026-11-09T11:52:40.270Z",
		"size": 7977,
		"path": "../public/assets/useBaseQuery-Di1rBpID.js"
	},
	"/assets/useQuery-_11dMbwS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"60-i+N531bU2sjihI+9ar+Mx89jmIc\"",
		"mtime": "2026-11-09T11:52:40.271Z",
		"size": 96,
		"path": "../public/assets/useQuery-_11dMbwS.js"
	},
	"/assets/useRouter-CUUK-Bg_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"91-1W3IZKR6YrC7mQpIbQubMmBY8eU\"",
		"mtime": "2026-11-09T11:52:40.271Z",
		"size": 145,
		"path": "../public/assets/useRouter-CUUK-Bg_.js"
	},
	"/assets/users-mvv7pTy-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-Alq9rCoFWlO5S+pzZWZTN8dYudo\"",
		"mtime": "2026-11-09T11:52:40.273Z",
		"size": 306,
		"path": "../public/assets/users-mvv7pTy-.js"
	},
	"/assets/_._lovable.oauth.consent-BxRNvp0B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1be-/Gz2chm1wqLxbUFgfgvR5yBIUFs\"",
		"mtime": "2026-11-09T11:52:40.228Z",
		"size": 446,
		"path": "../public/assets/_._lovable.oauth.consent-BxRNvp0B.js"
	},
	"/assets/utils-zOvS3iXM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ea6-jWvRosTSOr6XCPfwWoag3uiDWkI\"",
		"mtime": "2026-11-09T11:52:40.273Z",
		"size": 36518,
		"path": "../public/assets/utils-zOvS3iXM.js"
	},
	"/assets/_._lovable.oauth.consent-Q2wa7G2T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"982-PEy+D/wd95NFQ2AoHcsisXAtTCU\"",
		"mtime": "2026-11-09T11:52:40.228Z",
		"size": 2434,
		"path": "../public/assets/_._lovable.oauth.consent-Q2wa7G2T.js"
	}
};
// #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
// node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
// #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_OqaTx0 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_OqaTx0
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
// node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
// #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
// #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
// node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
// node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
// node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
export { cloudflare_module_default as default };
