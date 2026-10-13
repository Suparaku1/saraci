import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, Send, Plus, MessageCircle, Volume2, VolumeX, Trash2, Menu, Square, CheckCircle2, Loader2, Wrench, Play, Pause } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { transcribeAudio, synthesizeSpeech } from "@/lib/voice.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "Chat & Zë — Saraci Dental" }] }),
  component: ChatPage,
});

type Session = { id: string; title: string; created_at: string };
type VoiceState = "idle" | "listening" | "thinking" | "speaking";

const TOOL_LABELS: Record<string, string> = {
  check_availability: "Po kontrolloj oraret e lira",
  list_my_appointments: "Po marr terminet tuaja",
  create_booking: "Po krijoj rezervimin",
  cancel_booking: "Po anuloj rezervimin",
  reschedule_booking: "Po ripërcaktoj terminin",
  get_service_info: "Po marr shërbimet",
};

const VOICE_STATE_META: Record<VoiceState, { label: string; color: string; pulse: boolean }> = {
  idle: { label: "Gati", color: "bg-muted text-muted-foreground", pulse: false },
  listening: { label: "Duke dëgjuar", color: "bg-red-500 text-white", pulse: true },
  thinking: { label: "Duke menduar", color: "bg-amber-500 text-white", pulse: true },
  speaking: { label: "Duke folur", color: "bg-emerald-500 text-white", pulse: true },
};

function suggestedPrompts() {
  const h = new Date().getHours();
  const greet = h < 12 ? "Kur keni orare të lira sot?" : "Kur keni orare të lira nesër?";
  return [greet, "Dua të rezervoj një kontroll", "Ku ndodhet klinika?", "Cilat termine kam lënë?"];
}

function ChatPage() {
  const { user } = Route.useRouteContext();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [loadingSession, setLoadingSession] = useState(false);
  const [token, setToken] = useState<string>("");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [conversationMode, setConversationMode] = useState(false); // Phase 5: auto-loop
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const transcribeFn = useServerFn(transcribeAudio);
  const speakFn = useServerFn(synthesizeSpeech);
  const [recording, setRecording] = useState(false);
  const recRef = useRef<{ rec: MediaRecorder; chunks: Blob[]; stream: MediaStream; ctx?: AudioContext; analyser?: AnalyserNode; silenceStart?: number; rafId?: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const conversationRef = useRef(false);
  useEffect(() => { conversationRef.current = conversationMode; }, [conversationMode]);

  useEffect(() => { supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? "")); }, []);
  useEffect(() => { loadSessions(); }, []);

  async function loadSessions() {
    const { data } = await supabase.from("chat_sessions").select("id, title, created_at").order("updated_at", { ascending: false });
    setSessions((data as any) ?? []);
    if (!activeId && data && data.length > 0) selectSession((data[0] as any).id);
  }

  async function selectSession(id: string) {
    setLoadingSession(true);
    setActiveId(id);
    setSidebarOpen(false);
    const { data } = await supabase.from("chat_messages").select("id, role, content, created_at").eq("session_id", id).order("created_at");
    setInitialMessages((data ?? []).map((m: any) => ({ id: m.id, role: m.role, parts: [{ type: "text", text: m.content }] })));
    setLoadingSession(false);
  }

  async function newSession() {
    const { data, error } = await supabase.from("chat_sessions").insert({ user_id: user.id, title: "Bisedë e re" }).select().single();
    if (error) { toast.error(error.message); return null; }
    setSessions((s) => [data as any, ...s]);
    setActiveId((data as any).id);
    setInitialMessages([]);
    setSidebarOpen(false);
    return (data as any).id as string;
  }

  async function deleteSession(id: string) {
    await supabase.from("chat_sessions").delete().eq("id", id);
    setSessions((s) => s.filter((x) => x.id !== id));
    if (activeId === id) { setActiveId(null); setInitialMessages([]); }
  }

  const transport = useMemo(() => new DefaultChatTransport({
    api: "/api/chat",
    headers: () => (token ? { Authorization: `Bearer ${token}` } : {} as Record<string, string>),
    body: () => ({ sessionId: activeId }),
  }), [token, activeId]);

  const { messages, sendMessage, status, setMessages, stop } = useChat({
    transport,
    id: activeId ?? "none",
    onError: (e) => { setVoiceState("idle"); toast.error(e.message); },
    onFinish: async ({ message }) => {
      loadSessions();
      const text = message.parts?.map((p: any) => p.type === "text" ? p.text : "").join("").trim();
      if ((autoSpeak || conversationRef.current) && text) {
        setVoiceState("speaking");
        await speak(text);
        setVoiceState("idle");
        // Phase 5: auto-loop — after speaking, resume listening automatically
        if (conversationRef.current) {
          setTimeout(() => { if (conversationRef.current) startRecording(); }, 300);
        }
      } else {
        setVoiceState("idle");
      }
    },
  });

  useEffect(() => { setMessages(initialMessages); }, [initialMessages, setMessages]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, status]);
  useEffect(() => { if (status === "submitted" || status === "streaming") setVoiceState((s) => s === "speaking" ? s : "thinking"); }, [status]);

  async function speak(text: string) {
    try {
      const r = await speakFn({ data: { text, voice: "alloy" } });
      const audio = new Audio(`data:${r.mimeType};base64,${r.audioBase64}`);
      audioRef.current?.pause();
      audioRef.current = audio;
      await new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
    } catch (e: any) { console.warn("TTS", e); }
  }

  const startRecording = useCallback(async () => {
    if (recRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      const chunks: Blob[] = [];
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
        if (blob.size < 1200) { setVoiceState("idle"); toast("Nuk u kap zë."); return; }
        const b64 = await blobToBase64(blob);
        try {
          const r = await transcribeFn({ data: { audioBase64: b64, mimeType: mime } });
          if (r.text?.trim()) {
            let id = activeId;
            if (!id) id = await newSession();
            if (id) await sendMessage({ text: r.text });
          } else { setVoiceState("idle"); toast("Nuk u kap zë."); }
        } catch (e: any) { setVoiceState("idle"); toast.error(e.message); }
      };

      // VAD via AnalyserNode — auto-stop after ~1.4s of silence
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      const startTs = Date.now();
      const SILENCE_MS = 1400;
      const THRESHOLD = 0.018;
      let spokeOnce = false;
      const tick = () => {
        const ref = recRef.current;
        if (!ref) return;
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / buf.length);
        const now = Date.now();
        if (rms > THRESHOLD) { spokeOnce = true; ref.silenceStart = now; }
        else if (spokeOnce && ref.silenceStart && (now - ref.silenceStart > SILENCE_MS)) {
          if (rec.state !== "inactive") rec.stop();
          return;
        }
        // Max 30s safety
        if (now - startTs > 30_000 && rec.state !== "inactive") { rec.stop(); return; }
        ref.rafId = requestAnimationFrame(tick);
      };
      recRef.current = { rec, chunks, stream, ctx, analyser, silenceStart: Date.now() };
      rec.start();
      setRecording(true);
      setVoiceState("listening");
      recRef.current.rafId = requestAnimationFrame(tick);
    } catch (e: any) { setVoiceState("idle"); toast.error("Nuk mund të hap mikrofonin: " + e.message); }
  }, [activeId, sendMessage, transcribeFn]);

  function stopRecording() {
    const ref = recRef.current;
    if (ref?.rec.state !== "inactive") ref?.rec.stop();
  }

  async function submit(e: React.FormEvent) {
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
    if (next) { setAutoSpeak(true); startRecording(); }
    else { stopRecording(); audioRef.current?.pause(); }
  }

  async function replayMessage(text: string) {
    if (!text.trim()) return;
    setVoiceState("speaking");
    await speak(text);
    setVoiceState("idle");
  }

  const isBusy = status === "submitted" || status === "streaming";
  const meta = VOICE_STATE_META[voiceState];

  const SessionsList = (
    <>
      <div className="p-3 border-b">
        <Button onClick={newSession} className="w-full" size="sm"><Plus className="w-4 h-4 mr-1" /> Bisedë e re</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map((s) => (
          <div key={s.id} className={`group flex items-center gap-2 px-2 py-2 rounded-md text-sm cursor-pointer ${activeId === s.id ? "bg-muted font-medium" : "hover:bg-muted/60"}`} onClick={() => selectSession(s.id)}>
            <MessageCircle className="w-4 h-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">{s.title || "Bisedë"}</span>
            <button className="opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }} aria-label="Fshi">
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
        {sessions.length === 0 && <p className="text-xs text-muted-foreground p-2">S'ka biseda ende.</p>}
      </div>
    </>
  );

  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen flex">
      <div className="w-64 border-r bg-background hidden md:flex flex-col">{SessionsList}</div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b flex items-center justify-between px-3 sm:px-4 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Bisedat"><Menu className="w-5 h-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 flex flex-col">
                <SheetHeader className="p-4 pb-0"><SheetTitle>Bisedat</SheetTitle></SheetHeader>
                {SessionsList}
              </SheetContent>
            </Sheet>
            <div className="font-semibold truncate">Recepsionisti virtual</div>
            <Badge className={`${meta.color} ${meta.pulse ? "animate-pulse" : ""} gap-1`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              {meta.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <Switch id="conv" checked={conversationMode} onCheckedChange={toggleConversationMode} />
              <Label htmlFor="conv" className="text-xs cursor-pointer">Bisedë</Label>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setAutoSpeak((v) => !v)} title="Aktivo/çaktivizo zërin" aria-label="Zëri">
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-muted/20">
          {messages.length === 0 && !loadingSession && (
            <Card className="p-6 max-w-xl mx-auto text-center bg-background">
              <div className="text-4xl mb-2">🦷</div>
              <h2 className="font-display text-xl mb-1">Mirë se erdhët!</h2>
              <p className="text-sm text-muted-foreground">Pyet për orare të lira, rezervo termin, ose kërko info për klinikën. Aktivo "Bisedë" për të folur natyrshëm — mikrofoni ndalon vetë kur ndalni së foluri.</p>
              <div className="grid sm:grid-cols-2 gap-2 mt-4 text-xs">
                {suggestedPrompts().map((q) => (
                  <button key={q} onClick={() => setInput(q)} className="text-left border rounded-md p-2 hover:bg-muted transition">{q}</button>
                ))}
              </div>
            </Card>
          )}

          {messages.map((m) => {
            const textOnly = m.parts?.map((p: any) => p.type === "text" ? p.text : "").join("") ?? "";
            return (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} group`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border"}`}>
                  {m.parts?.map((p: any, i) => {
                    if (p.type === "text") {
                      return (
                        <div key={i} className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
                          <ReactMarkdown>{p.text}</ReactMarkdown>
                        </div>
                      );
                    }
                    if (p.type?.startsWith("tool-")) {
                      const toolName = p.type.replace("tool-", "");
                      const label = TOOL_LABELS[toolName] ?? toolName;
                      const state = p.state as string | undefined;
                      const done = state === "output-available" || state === "result";
                      const failed = state === "output-error";
                      return (
                        <div key={i} className={`flex items-center gap-2 text-xs my-1.5 px-2 py-1 rounded-md border ${failed ? "bg-destructive/10 border-destructive/30 text-destructive" : done ? "bg-primary/5 border-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"}`}>
                          {failed ? <Wrench className="w-3.5 h-3.5" /> : done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{label}{done ? " ✓" : "…"}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                  {m.role === "assistant" && textOnly.trim() && (
                    <button onClick={() => replayMessage(textOnly)} className="mt-1 opacity-0 group-hover:opacity-100 transition text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                      <Play className="w-3 h-3" /> Dëgjo përsëri
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="bg-background border rounded-2xl px-4 py-2.5 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="border-t p-2 sm:p-3 flex items-center gap-2 bg-background">
          <Button type="button" variant={recording ? "destructive" : "outline"} size="icon" onClick={recording ? stopRecording : startRecording} title={recording ? "Ndalo regjistrimin" : "Fol"} aria-label="Mikrofoni">
            {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={recording ? "Duke dëgjuar… (ndalon vetë)" : conversationMode ? "Modaliteti Bisedë aktiv" : "Shkruani mesazhin…"} disabled={isBusy} />
          {isBusy ? (
            <Button type="button" size="icon" variant="destructive" onClick={() => { stop(); setVoiceState("idle"); audioRef.current?.pause(); }} aria-label="Ndalo"><Square className="w-4 h-4" /></Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Dërgo"><Send className="w-4 h-4" /></Button>
          )}
        </form>
      </div>
    </div>
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => { const s = r.result as string; resolve(s.split(",")[1]); };
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}
