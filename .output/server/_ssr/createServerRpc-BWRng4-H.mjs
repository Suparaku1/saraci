import { i as TSS_SERVER_FUNCTION } from "./server-CkpSkju-.mjs";
// node_modules/.nitro/vite/services/ssr/assets/createServerRpc-BWRng4-H.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
export { createServerRpc as t };
