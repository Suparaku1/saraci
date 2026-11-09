# Saraci Dental — Roadmap (audit 02.09.2026)

## Audit 01.11.2026 — databaza dhe hyrja
- [x] Krahaso historinë me llogaritë, rolet, rregullat dhe njoftimet aktuale.
- [x] Aktivizo dhe provo hyrjen me fjalëkalim për gjashtë llogaritë e kërkuara.
- [x] Rregullime prioritare dhe kufijtë e auditit dokumentuar në audit-2026-11-01.md.
- [ ] Përfundo auditin e thelluar — pritet rezultati i skanimit të sigurisë.

## Faza A — Siguri & bllokues (kritike)
- [x] Rolet admin ekzistojnë; verifikuar hyrja e orarishpe në panel (01.11.2026).
- [x] Zëvendëso `apikey === SUPABASE_PUBLISHABLE_KEY` në `/api/public/hooks/*` me `CRON_SECRET`
- [x] Mbroj `/api/public/hooks/errors` (rate-limit + kufizim gjatësie)
- [x] Retention për `calendar_sync_log` / `email_log` / `error_log` (8k+ rreshta log)
- [x] Hiq kodin e stafit nga localStorage; nxirre në secret, jo literal në kod

## Faza B — GDPR & besueshmëri (EU/AL) ✅
- [x] Cookie consent banner + `/privatesia` + `/kushtet` (të dhëna shëndetësore, Art.9)
- [x] Checkbox pëlqimi në formën e rezervimit (jo i para-shënuar)
- [x] Seksion vlerësime Google (lidhje) + kredencialet e mjekes në kryefaqe
- [x] Buton WhatsApp `wa.me` i fiksuar + click-to-call
- [ ] Galeri para/pas — pritet fotot reale me pëlqim pacienti

## Faza C — Konsolidim kodi ✅
- [x] Një burim i vetëm për slot/timezone: `src/lib/slots.server.ts`
- [x] MCP + chat + web thërrasin `src/lib/booking-core.server.ts`
- [x] Shkrimet e adminit përmes `src/lib/admin.functions.ts` me `assertAdmin` + audit log
- [x] Fshi `availability_cache`, var `utc` i papërdorur (`CLINIC_ADMIN_EMAILS` mbetet: destinacioni i njoftimeve; `app_user_connections` përdoret nga konektorët)

## Faza D — Performancë & UX
- [ ] Pagination për `pacientet`/`admin` (aktualisht 500-1000 rreshta pa faqe)
- [ ] Debounce realtime reload në `admin.tsx`
- [ ] aria-label për butonat me ikonë; tokens semantike (hiq `text-amber-600` etc.)
- [ ] Skeleton/empty states; `/dashboard` dhe `/booking` ngarkohen ngadalë

## Faza E — Rritje
- [ ] Rezervim si vizitor (pa llogari) + konfirmim me kod
- [ ] Politikë no-show + kujtesa WhatsApp
- [ ] Çmime transparente / vlerësues kostos
- [ ] IT/EN për turizmin dentar
- [ ] Të dhëna reale në inventar & financa (tani 0 rreshta)
