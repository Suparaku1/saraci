import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { streamText, tool, stepCountIs, convertToModelMessages, type UIMessage } from "ai";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const TZ = "Europe/Tirane";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization");
        if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
        const token = auth.slice(7);
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const SUPABASE_URL = process.env.SUPABASE_URL!;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_PUBLISHABLE_KEY } },
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
        });
        const { data: claims, error: cerr } = await supabase.auth.getClaims(token);
        if (cerr || !claims?.claims?.sub) return new Response("Unauthorized", { status: 401 });
        const userId = claims.claims.sub;

        const body = await request.json() as { messages: UIMessage[]; sessionId?: string };
        const { messages, sessionId } = body;
        if (!Array.isArray(messages)) return new Response("Bad request", { status: 400 });

        // Load clinic settings (public + private if admin)
        const { data: isAdminRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
        const isAdmin = !!isAdminRow;
        const { data: settingsRows } = await supabase.from("clinic_settings").select("key, value, is_public");
        const settings: Record<string, string> = {};
        (settingsRows ?? []).forEach((r) => { if (r.is_public || isAdmin) settings[r.key] = r.value; });

        // Persist the last user message + auto-title on first message
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        if (sessionId && lastUser) {
          const text = lastUser.parts?.map((p: any) => p.type === "text" ? p.text : "").join("") ?? "";
          if (text) {
            await supabase.from("chat_messages").insert({ session_id: sessionId, user_id: userId, role: "user", content: text });
            const { count } = await supabase.from("chat_messages").select("id", { count: "exact", head: true }).eq("session_id", sessionId).eq("role", "user");
            if ((count ?? 0) <= 1) {
              const title = text.slice(0, 60).trim() + (text.length > 60 ? "…" : "");
              await supabase.from("chat_sessions").update({ title }).eq("id", sessionId);
            }
          }
        }

        const gateway = createLovableAiGatewayProvider(key);
        const now = new Date();
        const nowLocal = now.toLocaleString("sq-AL", { timeZone: TZ, dateStyle: "full", timeStyle: "short" });

        const system = `Ti je recepsionisti virtual i klinikës dentare "Saraci Dental Clinic" në Elbasan, Shqipëri.

REGULLA THELBËSORE:
- Fol GJITHMONË në shqip, natyral dhe i sjellshëm.
- Ti nuk je AI gjeneral; je recepsionist i kësaj klinike specifike.
- Për informacione për klinikën përdor VETËM të dhënat e mëposhtme; mos shpik.
- Për rezervime, anulime, riprogramime dhe kontroll oraresh — përdor mjetet (tools).
- Çdo termin zgjat 1 orë fiks, në orë të plota (09:00, 10:00, ...). Klinika hapet Hën-Sht 09:00-19:00. E diela mbyllur.
- Sloti i fundit fillon në 18:00 dhe mbaron në 19:00.
- URGJENCA: nëse pacienti raporton dhimbje ekstreme, ënjtje, temperaturë, gjakderdhje ose vështirësi frymëmarrjeje/gëlltitjeje — thuaj menjëherë: "Telefononi urgjencën 127 tani ose shkoni në urgjencën më të afërt." dhe pastaj ofro terminin më të afërt të lirë.
- Për cancel/reschedule: kërko booking code + verifikim me telefon ose email. Përdor toolset përkatës.
- Data/ora tani në Elbasan: ${nowLocal}.

TË DHËNAT E KLINIKËS:
- Emri: ${settings.clinic_name}
- Adresa: ${settings.address}
- Telefoni: ${settings.phone}
- Email: ${settings.email}
- Dentisti/Pronari: ${settings.dentist}
- Orari: ${settings.working_hours}
- Parking: ${settings.parking}
- Tualet: ${settings.toilet}
- Aksesueshmëri: ${settings.accessibility}
- Pagesa: ${settings.payment_methods}
- Urgjenca: ${settings.emergency_number}
${isAdmin ? `\nINFO PRIVATE (vetëm admin):\n- Wi-Fi: ${settings.wifi_password}\n- Shënime: ${settings.internal_notes}\n- Eskalim urgjence: ${settings.emergency_escalation}` : ""}

Për pyetje specifike ("ku ndodhet klinika?"/"cili është telefoni?") jep VETËM informacionin e kërkuar, shkurt.`;

        const tools = {
          check_availability: tool({
            description: "Kontrollon oraret e disponueshme për një datë ose interval datash. Përdore për 'kur keni orare të lira sot/nesër/kjo javë'.",
            inputSchema: z.object({
              date_from: z.string().describe("Data fillestare në format YYYY-MM-DD"),
              date_to: z.string().describe("Data përfundimtare në format YYYY-MM-DD (mund të jetë e njëjtë me date_from)"),
              min_hour: z.number().int().min(9).max(18).optional().describe("Ora minimale (opsionale)"),
            }),
            execute: async ({ date_from, date_to, min_hour }) => {
              const { loadSlots } = await import("@/lib/slots.server");
              const slots = await loadSlots(supabase, `${date_from}T00:00:00Z`, `${date_to}T23:59:59Z`, min_hour);
              const free = slots.filter((s) => !s.taken).map((s) => s.label.replace(" ", " në "));
              return { free_slots: free.slice(0, 20), total: free.length };
            },
          }),
          list_my_appointments: tool({
            description: "Kthen listën e termineve të përdoruesit aktual.",
            inputSchema: z.object({}),
            execute: async () => {
              const { formatSlotLocal } = await import("@/lib/slots.server");
              const { data } = await supabase.from("appointments").select("booking_code, slot_start, status, service")
                .eq("user_id", userId).order("slot_start", { ascending: false }).limit(20);
              return { appointments: (data ?? []).map((a) => ({
                code: a.booking_code, date: formatSlotLocal(a.slot_start),
                status: a.status, service: a.service ?? "—",
              })) };
            },
          }),
          create_booking: tool({
            description:
              "Krijon një rezervim të ri. Përdore VETËM kur pacienti ka dhënë: emrin, mbiemrin, telefonin (fillon me 06, 10 numra), email të vlefshëm dhe shërbimin. Nëse mungon ndonjë, kërkoje para se ta thërrasësh.",
            inputSchema: z.object({
              slot_iso: z.string().describe("Ora e rezervimit në ISO 8601 UTC (p.sh. 2026-07-02T09:00:00Z për 11:00 lokale në verë)"),
              first_name: z.string().describe("Emri"),
              last_name: z.string().describe("Mbiemri"),
              patient_phone: z.string().describe("Telefon: fillon me 06, 10 numra"),
              patient_email: z.string().describe("Email i vlefshëm"),
              service: z.string().describe("Shërbimi, p.sh. pastrim, mbushje, ortodonci, implant"),
              notes: z.string().optional(),
            }),
            execute: async (input) => {
              try {
                const { createBookingCore } = await import("@/lib/booking-core.server");
                const { formatSlotLocal } = await import("@/lib/slots.server");
                const appt = await createBookingCore(supabase, userId, {
                  slotIso: input.slot_iso,
                  firstName: input.first_name,
                  lastName: input.last_name,
                  patientPhone: input.patient_phone,
                  patientEmail: input.patient_email,
                  service: input.service,
                  notes: input.notes ?? null,
                }, "chat");
                return { booking_code: appt.booking_code, slot: formatSlotLocal(appt.slot_start) };
              } catch (e) {
                return { error: e instanceof Error ? e.message : "Rezervimi dështoi." };
              }
            },
          }),

          cancel_booking: tool({
            description: "Anulon një rezervim ekzistues me kod dhe verifikim (telefon ose email).",
            inputSchema: z.object({
              booking_code: z.string(),
              verify_phone_or_email: z.string(),
              reason: z.string().optional(),
            }),
            execute: async (input) => {
              try {
                const { cancelBookingCore } = await import("@/lib/booking-core.server");
                await cancelBookingCore(supabase, userId, {
                  bookingCode: input.booking_code,
                  verify: input.verify_phone_or_email,
                  reason: input.reason ?? null,
                }, "chat");
                return { ok: true, code: input.booking_code.toUpperCase() };
              } catch (e) {
                return { error: e instanceof Error ? e.message : "Anulimi dështoi." };
              }
            },
          }),
          reschedule_booking: tool({
            description: "Ripërcakton një rezervim ekzistues në një orar të ri. Kërkon kodin dhe verifikimin.",
            inputSchema: z.object({
              booking_code: z.string(),
              verify_phone_or_email: z.string(),
              new_slot_iso: z.string().describe("Ora e re në ISO 8601 UTC"),
            }),
            execute: async (input) => {
              try {
                const { rescheduleBookingCore } = await import("@/lib/booking-core.server");
                const { formatSlotLocal } = await import("@/lib/slots.server");
                const { newAppointment } = await rescheduleBookingCore(supabase, userId, {
                  bookingCode: input.booking_code,
                  verify: input.verify_phone_or_email,
                  newSlotIso: input.new_slot_iso,
                }, "chat");
                return { ok: true, new_code: newAppointment.booking_code, slot: formatSlotLocal(newAppointment.slot_start) };
              } catch (e) {
                return { error: e instanceof Error ? e.message : "Zhvendosja dështoi." };
              }
            },
          }),
          get_service_info: tool({
            description: "Kthen listën e shërbimeve të klinikës me çmime indikative dhe përshkrime.",
            inputSchema: z.object({}),
            execute: async () => {
              const { data } = await supabase.from("service_catalog").select("name, description, price_hint").eq("active", true).order("name");
              return { services: data ?? [] };
            },
          }),
        };

        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system,
          messages: await convertToModelMessages(messages),
          tools,
          stopWhen: stepCountIs(50),
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: messages,
          onFinish: async ({ messages: finalMessages }) => {
            if (!sessionId) return;
            const assistant = finalMessages[finalMessages.length - 1];
            if (assistant?.role === "assistant") {
              const text = assistant.parts?.map((p: any) => p.type === "text" ? p.text : "").join("") ?? "";
              if (text) await supabase.from("chat_messages").insert({ session_id: sessionId, user_id: userId, role: "assistant", content: text });
              await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", sessionId);
            }
          },
        });

        return response;
      },
    },
  },
});
