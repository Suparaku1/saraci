import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CN0ofe5e.mjs";
import { o as Route$13, v as Button } from "./router-DA3D-5Pv.mjs";
import { t as Card } from "./card-CRTTy5Dx.mjs";
import { t as Input } from "./input-CqV36rr2.mjs";
import { Ht as object, Kt as string } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { a as SheetTrigger, i as SheetTitle, n as SheetContent, r as SheetHeader, t as Sheet } from "./sheet-0dKAHe_K.mjs";
import { t as Badge } from "./badge-CRSM8iyI.mjs";
import { t as cn } from "./utils-DWGjSd5x.mjs";
import { t as Label } from "./label-BYIfJH-v.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-4g10N4ls.mjs";
import { r as createServerFn } from "./server-CkpSkju-.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DTualNdl.mjs";
import { n as DefaultChatTransport, o as require_jsx_runtime, s as require_react, t as useChat } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as MicOff, C as Plus, K as CircleCheck, L as LoaderCircle, M as MessageCircle, N as Menu, T as Play, a as VolumeX, b as Send, h as Square, k as Mic, n as Wrench, o as Volume2, u as Trash2 } from "../_libs/lucide-react.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/chat-Bl754H60.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var transcribeAudio = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	audioBase64: string().min(10),
	mimeType: string().default("audio/webm")
}).parse(raw)).handler(createSsrRpc("fa24ebf5573467edcb99bddb050e632486b3860fe569b13b402a128f2e87cf96"));
var synthesizeSpeech = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
	text: string().min(1).max(4e3),
	voice: string().default("alloy")
}).parse(raw)).handler(createSsrRpc("51a04871e5b83ac420e68b8ac727216f4eddf762c64fd2b61aca27a32949231c"));
var TOOL_LABELS = {
	check_availability: "Po kontrolloj oraret e lira",
	list_my_appointments: "Po marr terminet tuaja",
	create_booking: "Po krijoj rezervimin",
	cancel_booking: "Po anuloj rezervimin",
	reschedule_booking: "Po ripërcaktoj terminin",
	get_service_info: "Po marr shërbimet"
};
var VOICE_STATE_META = {
	idle: {
		label: "Gati",
		color: "bg-muted text-muted-foreground",
		pulse: false
	},
	listening: {
		label: "Duke dëgjuar",
		color: "bg-red-500 text-white",
		pulse: true
	},
	thinking: {
		label: "Duke menduar",
		color: "bg-amber-500 text-white",
		pulse: true
	},
	speaking: {
		label: "Duke folur",
		color: "bg-emerald-500 text-white",
		pulse: true
	}
};
function suggestedPrompts() {
	return [
		(/* @__PURE__ */ new Date()).getHours() < 12 ? "Kur keni orare të lira sot?" : "Kur keni orare të lira nesër?",
		"Dua të rezervoj një kontroll",
		"Ku ndodhet klinika?",
		"Cilat termine kam lënë?"
	];
}
function ChatPage() {
	const { user } = Route$13.useRouteContext();
	const [sessions, setSessions] = (0, import_react.useState)([]);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [initialMessages, setInitialMessages] = (0, import_react.useState)([]);
	const [loadingSession, setLoadingSession] = (0, import_react.useState)(false);
	const [token, setToken] = (0, import_react.useState)("");
	const [autoSpeak, setAutoSpeak] = (0, import_react.useState)(false);
	const [conversationMode, setConversationMode] = (0, import_react.useState)(false);
	const [input, setInput] = (0, import_react.useState)("");
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const [voiceState, setVoiceState] = (0, import_react.useState)("idle");
	const transcribeFn = useServerFn(transcribeAudio);
	const speakFn = useServerFn(synthesizeSpeech);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(null);
	const scrollRef = (0, import_react.useRef)(null);
	const conversationRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		conversationRef.current = conversationMode;
	}, [conversationMode]);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? ""));
	}, []);
	(0, import_react.useEffect)(() => {
		loadSessions();
	}, []);
	async function loadSessions() {
		const { data } = await supabase.from("chat_sessions").select("id, title, created_at").order("updated_at", { ascending: false });
		setSessions(data ?? []);
		if (!activeId && data && data.length > 0) selectSession(data[0].id);
	}
	async function selectSession(id) {
		setLoadingSession(true);
		setActiveId(id);
		setSidebarOpen(false);
		const { data } = await supabase.from("chat_messages").select("id, role, content, created_at").eq("session_id", id).order("created_at");
		setInitialMessages((data ?? []).map((m) => ({
			id: m.id,
			role: m.role,
			parts: [{
				type: "text",
				text: m.content
			}]
		})));
		setLoadingSession(false);
	}
	async function newSession() {
		const { data, error } = await supabase.from("chat_sessions").insert({
			user_id: user.id,
			title: "Bisedë e re"
		}).select().single();
		if (error) {
			toast.error(error.message);
			return null;
		}
		setSessions((s) => [data, ...s]);
		setActiveId(data.id);
		setInitialMessages([]);
		setSidebarOpen(false);
		return data.id;
	}
	async function deleteSession(id) {
		await supabase.from("chat_sessions").delete().eq("id", id);
		setSessions((s) => s.filter((x) => x.id !== id));
		if (activeId === id) {
			setActiveId(null);
			setInitialMessages([]);
		}
	}
	const transport = (0, import_react.useMemo)(() => new DefaultChatTransport({
		api: "/api/chat",
		headers: () => token ? { Authorization: `Bearer ${token}` } : {},
		body: () => ({ sessionId: activeId })
	}), [token, activeId]);
	const { messages, sendMessage, status, setMessages, stop } = useChat({
		transport,
		id: activeId ?? "none",
		onError: (e) => {
			setVoiceState("idle");
			toast.error(e.message);
		},
		onFinish: async ({ message }) => {
			loadSessions();
			const text = message.parts?.map((p) => p.type === "text" ? p.text : "").join("").trim();
			if ((autoSpeak || conversationRef.current) && text) {
				setVoiceState("speaking");
				await speak(text);
				setVoiceState("idle");
				if (conversationRef.current) setTimeout(() => {
					if (conversationRef.current) startRecording();
				}, 300);
			} else setVoiceState("idle");
		}
	});
	(0, import_react.useEffect)(() => {
		setMessages(initialMessages);
	}, [initialMessages, setMessages]);
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, status]);
	(0, import_react.useEffect)(() => {
		if (status === "submitted" || status === "streaming") setVoiceState((s) => s === "speaking" ? s : "thinking");
	}, [status]);
	async function speak(text) {
		try {
			const r = await speakFn({ data: {
				text,
				voice: "alloy"
			} });
			const audio = new Audio(`data:${r.mimeType};base64,${r.audioBase64}`);
			audioRef.current?.pause();
			audioRef.current = audio;
			await new Promise((resolve) => {
				audio.onended = () => resolve();
				audio.onerror = () => resolve();
				audio.play().catch(() => resolve());
			});
		} catch (e) {
			console.warn("TTS", e);
		}
	}
	const startRecording = (0, import_react.useCallback)(async () => {
		if (recRef.current) return;
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
			const rec = new MediaRecorder(stream, { mimeType: mime });
			const chunks = [];
			rec.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
			rec.onstop = async () => {
				const ref = recRef.current;
				if (ref?.rafId) cancelAnimationFrame(ref.rafId);
				ref?.ctx?.close().catch(() => {});
				stream.getTracks().forEach((t) => t.stop());
				recRef.current = null;
				setRecording(false);
				setVoiceState("thinking");
				const blob = new Blob(chunks, { type: mime });
				if (blob.size < 1200) {
					setVoiceState("idle");
					toast("Nuk u kap zë.");
					return;
				}
				const b64 = await blobToBase64(blob);
				try {
					const r = await transcribeFn({ data: {
						audioBase64: b64,
						mimeType: mime
					} });
					if (r.text?.trim()) {
						let id = activeId;
						if (!id) id = await newSession();
						if (id) await sendMessage({ text: r.text });
					} else {
						setVoiceState("idle");
						toast("Nuk u kap zë.");
					}
				} catch (e) {
					setVoiceState("idle");
					toast.error(e.message);
				}
			};
			const ctx = new AudioContext();
			const source = ctx.createMediaStreamSource(stream);
			const analyser = ctx.createAnalyser();
			analyser.fftSize = 512;
			source.connect(analyser);
			const buf = new Uint8Array(analyser.fftSize);
			const startTs = Date.now();
			const SILENCE_MS = 1400;
			const THRESHOLD = .018;
			let spokeOnce = false;
			const tick = () => {
				const ref = recRef.current;
				if (!ref) return;
				analyser.getByteTimeDomainData(buf);
				let sum = 0;
				for (let i = 0; i < buf.length; i++) {
					const v = (buf[i] - 128) / 128;
					sum += v * v;
				}
				const rms = Math.sqrt(sum / buf.length);
				const now = Date.now();
				if (rms > THRESHOLD) {
					spokeOnce = true;
					ref.silenceStart = now;
				} else if (spokeOnce && ref.silenceStart && now - ref.silenceStart > SILENCE_MS) {
					if (rec.state !== "inactive") rec.stop();
					return;
				}
				if (now - startTs > 3e4 && rec.state !== "inactive") {
					rec.stop();
					return;
				}
				ref.rafId = requestAnimationFrame(tick);
			};
			recRef.current = {
				rec,
				chunks,
				stream,
				ctx,
				analyser,
				silenceStart: Date.now()
			};
			rec.start();
			setRecording(true);
			setVoiceState("listening");
			recRef.current.rafId = requestAnimationFrame(tick);
		} catch (e) {
			setVoiceState("idle");
			toast.error("Nuk mund të hap mikrofonin: " + e.message);
		}
	}, [
		activeId,
		sendMessage,
		transcribeFn
	]);
	function stopRecording() {
		const ref = recRef.current;
		if (ref?.rec.state !== "inactive") ref?.rec.stop();
	}
	async function submit(e) {
		e.preventDefault();
		if (!input.trim()) return;
		let id = activeId;
		if (!id) id = await newSession();
		if (!id) return;
		const text = input.trim();
		setInput("");
		await sendMessage({ text });
	}
	function toggleConversationMode() {
		const next = !conversationMode;
		setConversationMode(next);
		if (next) {
			setAutoSpeak(true);
			startRecording();
		} else {
			stopRecording();
			audioRef.current?.pause();
		}
	}
	async function replayMessage(text) {
		if (!text.trim()) return;
		setVoiceState("speaking");
		await speak(text);
		setVoiceState("idle");
	}
	const isBusy = status === "submitted" || status === "streaming";
	const meta = VOICE_STATE_META[voiceState];
	const SessionsList = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-3 border-b",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: newSession,
			className: "w-full",
			size: "sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-1" }), " Bisedë e re"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto p-2 space-y-1",
		children: [sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `group flex items-center gap-2 px-2 py-2 rounded-md text-sm cursor-pointer ${activeId === s.id ? "bg-muted font-medium" : "hover:bg-muted/60"}`,
			onClick: () => selectSession(s.id),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-4 h-4 shrink-0 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 truncate",
					children: s.title || "Bisedë"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "opacity-0 group-hover:opacity-100",
					onClick: (e) => {
						e.stopPropagation();
						deleteSession(s.id);
					},
					"aria-label": "Fshi",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5 text-muted-foreground hover:text-destructive" })
				})
			]
		}, s.id)), sessions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground p-2",
			children: "S'ka biseda ende."
		})]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-[calc(100vh-4rem)] md:h-screen flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-64 border-r bg-background hidden md:flex flex-col",
			children: SessionsList
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-14 border-b flex items-center justify-between px-3 sm:px-4 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
								open: sidebarOpen,
								onOpenChange: setSidebarOpen,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "md:hidden",
										"aria-label": "Bisedat",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
									side: "left",
									className: "p-0 w-72 flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
										className: "p-4 pb-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Bisedat" })
									}), SessionsList]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold truncate",
								children: "Recepsionisti virtual"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: `${meta.color} ${meta.pulse ? "animate-pulse" : ""} gap-1`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-current opacity-80" }), meta.label]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								id: "conv",
								checked: conversationMode,
								onCheckedChange: toggleConversationMode
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "conv",
								className: "text-xs cursor-pointer",
								children: "Bisedë"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setAutoSpeak((v) => !v),
							title: "Aktivo/çaktivizo zërin",
							"aria-label": "Zëri",
							children: autoSpeak ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-4 h-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: scrollRef,
					className: "flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-muted/20",
					children: [
						messages.length === 0 && !loadingSession && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-6 max-w-xl mx-auto text-center bg-background",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-4xl mb-2",
									children: "🦷"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl mb-1",
									children: "Mirë se erdhët!"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Pyet për orare të lira, rezervo termin, ose kërko info për klinikën. Aktivo \"Bisedë\" për të folur natyrshëm — mikrofoni ndalon vetë kur ndalni së foluri."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid sm:grid-cols-2 gap-2 mt-4 text-xs",
									children: suggestedPrompts().map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setInput(q),
										className: "text-left border rounded-md p-2 hover:bg-muted transition",
										children: q
									}, q))
								})
							]
						}),
						messages.map((m) => {
							const textOnly = m.parts?.map((p) => p.type === "text" ? p.text : "").join("") ?? "";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex ${m.role === "user" ? "justify-end" : "justify-start"} group`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border"}`,
									children: [m.parts?.map((p, i) => {
										if (p.type === "text") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { children: p.text })
										}, i);
										if (p.type?.startsWith("tool-")) {
											const toolName = p.type.replace("tool-", "");
											const label = TOOL_LABELS[toolName] ?? toolName;
											const state = p.state;
											const done = state === "output-available" || state === "result";
											const failed = state === "output-error";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `flex items-center gap-2 text-xs my-1.5 px-2 py-1 rounded-md border ${failed ? "bg-destructive/10 border-destructive/30 text-destructive" : done ? "bg-primary/5 border-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"}`,
												children: [failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "w-3.5 h-3.5" }) : done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [label, done ? " ✓" : "…"] })]
											}, i);
										}
										return null;
									}), m.role === "assistant" && textOnly.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => replayMessage(textOnly),
										className: "mt-1 opacity-0 group-hover:opacity-100 transition text-xs text-muted-foreground hover:text-primary flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3 h-3" }), " Dëgjo përsëri"]
									})]
								})
							}, m.id);
						}),
						status === "submitted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-background border rounded-2xl px-4 py-2.5 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin text-muted-foreground" })
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "border-t p-2 sm:p-3 flex items-center gap-2 bg-background",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: recording ? "destructive" : "outline",
							size: "icon",
							onClick: recording ? stopRecording : startRecording,
							title: recording ? "Ndalo regjistrimin" : "Fol",
							"aria-label": "Mikrofoni",
							children: recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: input,
							onChange: (e) => setInput(e.target.value),
							placeholder: recording ? "Duke dëgjuar… (ndalon vetë)" : conversationMode ? "Modaliteti Bisedë aktiv" : "Shkruani mesazhin…",
							disabled: isBusy
						}),
						isBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "destructive",
							onClick: () => {
								stop();
								setVoiceState("idle");
								audioRef.current?.pause();
							},
							"aria-label": "Ndalo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-4 h-4" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							disabled: !input.trim(),
							"aria-label": "Dërgo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" })
						})
					]
				})
			]
		})]
	});
}
function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => {
			const s = r.result;
			resolve(s.split(",")[1]);
		};
		r.onerror = reject;
		r.readAsDataURL(blob);
	});
}
export { ChatPage as component };
