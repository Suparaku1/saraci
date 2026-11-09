import { Ht as object, Kt as string } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-BWRng4-H.mjs";
import { r as createServerFn } from "./server-CkpSkju-.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DTualNdl.mjs";
import processModule from "node:process";
// node_modules/.nitro/vite/services/ssr/assets/voice.functions-DAHt-OEc.js
var transcribeAudio_createServerFn_handler = createServerRpc({
	id: "fa24ebf5573467edcb99bddb050e632486b3860fe569b13b402a128f2e87cf96",
	name: "transcribeAudio",
	filename: "src/lib/voice.functions.ts"
}, (opts) => transcribeAudio.__executeServer(opts));
var transcribeAudio = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	audioBase64: string().min(10),
	mimeType: string().default("audio/webm")
}).parse(raw)).handler(transcribeAudio_createServerFn_handler, async ({ data, context }) => {
	const key = processModule.env.LOVABLE_API_KEY;
	if (!key) throw new Error("Missing LOVABLE_API_KEY");
	const bin = Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0));
	const ext = data.mimeType.includes("mp4") ? "mp4" : data.mimeType.includes("mp3") || data.mimeType.includes("mpeg") ? "mp3" : data.mimeType.includes("wav") ? "wav" : "webm";
	const form = new FormData();
	form.append("model", "openai/gpt-4o-mini-transcribe");
	form.append("file", new Blob([bin], { type: data.mimeType }), `audio.${ext}`);
	const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
		method: "POST",
		headers: { Authorization: `Bearer ${key}` },
		body: form
	});
	if (!res.ok) throw new Error(`Transkriptimi dështoi: ${res.status} ${await res.text().catch(() => "")}`);
	return { text: (await res.json()).text ?? "" };
});
var synthesizeSpeech_createServerFn_handler = createServerRpc({
	id: "51a04871e5b83ac420e68b8ac727216f4eddf762c64fd2b61aca27a32949231c",
	name: "synthesizeSpeech",
	filename: "src/lib/voice.functions.ts"
}, (opts) => synthesizeSpeech.__executeServer(opts));
var synthesizeSpeech = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	text: string().min(1).max(4e3),
	voice: string().default("alloy")
}).parse(raw)).handler(synthesizeSpeech_createServerFn_handler, async ({ data }) => {
	const key = processModule.env.LOVABLE_API_KEY;
	if (!key) throw new Error("Missing LOVABLE_API_KEY");
	const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			model: "openai/gpt-4o-mini-tts",
			input: data.text,
			voice: data.voice,
			response_format: "mp3"
		})
	});
	if (!res.ok) throw new Error(`TTS dështoi: ${res.status} ${await res.text().catch(() => "")}`);
	const buf = new Uint8Array(await res.arrayBuffer());
	let bin = "";
	for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
	return {
		audioBase64: btoa(bin),
		mimeType: "audio/mpeg"
	};
});
export { synthesizeSpeech_createServerFn_handler, transcribeAudio_createServerFn_handler };
