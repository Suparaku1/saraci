// node_modules/.nitro/vite/services/ssr/assets/email-templates-Diue21CT.js
var BRAND = "#0ea5e9";
var CLINIC = "Saraci Dental Clinic";
var ADDR = "Rruga Ptoleme Xhuvani, Elbasan 3001";
var PHONE = "+355 67 540 2044";
var EMAIL = "xhensilasaraci@gmail.com";
function shell(title, inner, cta) {
	return `<!doctype html><html lang="sq"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,.06)">
        <tr><td style="background:${BRAND};padding:20px 28px;color:#fff">
          <div style="font-size:14px;letter-spacing:.12em;text-transform:uppercase;opacity:.85">${CLINIC}</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px">${title}</div>
        </td></tr>
        <tr><td style="padding:28px">
          ${inner}
          ${cta ? `<div style="margin-top:24px"><a href="${cta.href}" style="background:${BRAND};color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600;display:inline-block">${cta.label}</a></div>` : ""}
        </td></tr>
        <tr><td style="padding:20px 28px;background:#f8fafc;color:#64748b;font-size:12px;line-height:1.6;border-top:1px solid #e2e8f0">
          ${CLINIC} · ${ADDR}<br>
          Tel/WhatsApp: ${PHONE} · <a href="mailto:${EMAIL}" style="color:${BRAND}">${EMAIL}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
var fmt = (iso) => new Date(iso).toLocaleString("sq-AL", {
	timeZone: "Europe/Tirane",
	dateStyle: "full",
	timeStyle: "short"
});
function tplBookingConfirm(p) {
	const inner = `
    <p style="font-size:16px;margin:0 0 12px">Përshëndetje <strong>${escapeHtml(p.name)}</strong>,</p>
    <p style="margin:0 0 16px">Rezervimi juaj u konfirmua me sukses. Ju presim!</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <tr><td style="padding:12px 16px;background:#f8fafc;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Kodi i rezervimit</td>
          <td style="padding:12px 16px;background:#f8fafc;text-align:right;font-family:ui-monospace,SFMono-Regular,monospace;font-weight:700">${p.code}</td></tr>
      <tr><td style="padding:12px 16px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-top:1px solid #e2e8f0">Data & ora</td>
          <td style="padding:12px 16px;text-align:right;border-top:1px solid #e2e8f0">${fmt(p.slotIso)}</td></tr>
      <tr><td style="padding:12px 16px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-top:1px solid #e2e8f0">Shërbimi</td>
          <td style="padding:12px 16px;text-align:right;border-top:1px solid #e2e8f0">${escapeHtml(p.service ?? "—")}</td></tr>
      <tr><td style="padding:12px 16px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-top:1px solid #e2e8f0">Adresa</td>
          <td style="padding:12px 16px;text-align:right;border-top:1px solid #e2e8f0">${ADDR}</td></tr>
    </table>
    <p style="margin:20px 0 0;color:#475569;font-size:14px">Nëse s'mund të vini, ju lutemi anuloni së paku 4 orë përpara — kështu mundësojmë një pacient tjetër të përfitojë nga sloti. Kontakt i shpejtë: WhatsApp ${PHONE}.</p>`;
	return {
		subject: `Rezervimi u konfirmua — ${p.code}`,
		html: shell("Rezervimi u konfirmua", inner)
	};
}
function tplBookingCancel(p) {
	const inner = `
    <p style="font-size:16px;margin:0 0 12px">Përshëndetje <strong>${escapeHtml(p.name)}</strong>,</p>
    <p style="margin:0 0 16px">Rezervimi juaj <strong>${p.code}</strong> për datën <strong>${fmt(p.slotIso)}</strong> është anuluar.</p>
    ${p.reason ? `<p style="margin:0 0 16px;color:#475569">Arsyeja: ${escapeHtml(p.reason)}</p>` : ""}
    <p style="margin:0;color:#475569;font-size:14px">Për të rezervuar një orar tjetër, kthehuni në faqen tonë ose na shkruani në WhatsApp ${PHONE}.</p>`;
	return {
		subject: `Rezervimi u anulua — ${p.code}`,
		html: shell("Rezervimi u anulua", inner)
	};
}
function tplReminder(p) {
	const inner = `
    <p style="font-size:16px;margin:0 0 12px">Përshëndetje <strong>${escapeHtml(p.name)}</strong>,</p>
    <p style="margin:0 0 16px">Ky është një kujtesë e sjellshme: keni një termin te <strong>${CLINIC}</strong> <strong>${p.hoursBefore === 24 ? "nesër" : "për ~2 orë"}</strong>.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <tr><td style="padding:12px 16px;background:#f8fafc;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Kodi</td>
          <td style="padding:12px 16px;background:#f8fafc;text-align:right;font-family:ui-monospace,monospace;font-weight:700">${p.code}</td></tr>
      <tr><td style="padding:12px 16px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-top:1px solid #e2e8f0">Kur</td>
          <td style="padding:12px 16px;text-align:right;border-top:1px solid #e2e8f0">${fmt(p.slotIso)}</td></tr>
      <tr><td style="padding:12px 16px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-top:1px solid #e2e8f0">Ku</td>
          <td style="padding:12px 16px;text-align:right;border-top:1px solid #e2e8f0">${ADDR}</td></tr>
    </table>
    <p style="margin:20px 0 0;color:#475569;font-size:14px">Nëse duhet ta shtyni ose anuloni, ju lutemi njoftoni sa më shpejt në WhatsApp ${PHONE}.</p>`;
	return {
		subject: `Kujtesë: termini juaj ${p.hoursBefore === 24 ? "nesër" : "së shpejti"} — ${p.code}`,
		html: shell("Kujtesë për terminin", inner)
	};
}
function tplAdminNewBooking(p) {
	const inner = `
    <p style="margin:0 0 12px">Një rezervim i ri u krijua në sistem:</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <tr><td style="padding:10px 14px;background:#f8fafc"><strong>Kodi:</strong></td><td style="padding:10px 14px;background:#f8fafc;font-family:monospace">${p.code}</td></tr>
      <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0"><strong>Pacienti:</strong></td><td style="padding:10px 14px;border-top:1px solid #e2e8f0">${escapeHtml(p.name)} · ${escapeHtml(p.phone)}</td></tr>
      <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0"><strong>Data:</strong></td><td style="padding:10px 14px;border-top:1px solid #e2e8f0">${fmt(p.slotIso)}</td></tr>
      <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0"><strong>Shërbimi:</strong></td><td style="padding:10px 14px;border-top:1px solid #e2e8f0">${escapeHtml(p.service ?? "—")}</td></tr>
      ${p.notes ? `<tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0"><strong>Shënime:</strong></td><td style="padding:10px 14px;border-top:1px solid #e2e8f0">${escapeHtml(p.notes)}</td></tr>` : ""}
    </table>`;
	return {
		subject: `Rezervim i ri: ${p.code} — ${p.name}`,
		html: shell("Rezervim i ri", inner)
	};
}
function escapeHtml(s) {
	return s.replace(/[&<>"']/g, (c) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[c]);
}
function tplBookingReschedule(p) {
	const inner = `
    <p style="font-size:16px;margin:0 0 12px">Përshëndetje <strong>${escapeHtml(p.name)}</strong>,</p>
    <p style="margin:0 0 16px">Termini juaj u shty me sukses.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <tr><td style="padding:12px 16px;background:#f8fafc;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Ora e vjetër</td>
          <td style="padding:12px 16px;background:#f8fafc;text-align:right;text-decoration:line-through;color:#94a3b8">${fmt(p.oldSlotIso)}</td></tr>
      <tr><td style="padding:12px 16px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-top:1px solid #e2e8f0">Ora e re</td>
          <td style="padding:12px 16px;text-align:right;border-top:1px solid #e2e8f0;font-weight:700">${fmt(p.newSlotIso)}</td></tr>
      <tr><td style="padding:12px 16px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-top:1px solid #e2e8f0">Kodi i re</td>
          <td style="padding:12px 16px;text-align:right;border-top:1px solid #e2e8f0;font-family:ui-monospace,monospace;font-weight:700">${p.newCode}</td></tr>
    </table>
    <p style="margin:20px 0 0;color:#475569;font-size:14px">Kodi i vjetër ${p.oldCode} nuk është më aktiv. Adresa: ${ADDR}.</p>`;
	return {
		subject: `Termini u shty — kodi i re ${p.newCode}`,
		html: shell("Termini u shty", inner)
	};
}
function tplAdminChange(p) {
	const isCancel = p.kind === "cancel";
	const inner = `
    <p style="margin:0 0 12px">${isCancel ? "Një rezervim u anulua:" : "Një rezervim u shty:"}</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <tr><td style="padding:10px 14px;background:#f8fafc"><strong>Kodi:</strong></td><td style="padding:10px 14px;background:#f8fafc;font-family:monospace">${p.code}</td></tr>
      <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0"><strong>Pacienti:</strong></td><td style="padding:10px 14px;border-top:1px solid #e2e8f0">${escapeHtml(p.name)} · ${escapeHtml(p.phone)}</td></tr>
      <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0"><strong>${isCancel ? "Ora e liruar" : "Ora e re"}:</strong></td><td style="padding:10px 14px;border-top:1px solid #e2e8f0">${fmt(p.slotIso)}</td></tr>
      ${p.extra ? `<tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0"><strong>Detaje:</strong></td><td style="padding:10px 14px;border-top:1px solid #e2e8f0">${escapeHtml(p.extra)}</td></tr>` : ""}
    </table>`;
	return {
		subject: `${isCancel ? "Anulim" : "Shtyrje"}: ${p.code} — ${p.name}`,
		html: shell(isCancel ? "Rezervim i anuluar" : "Rezervim i shtyrë", inner)
	};
}
export { tplBookingReschedule as a, tplBookingConfirm as i, tplAdminNewBooking as n, tplReminder as o, tplBookingCancel as r, tplAdminChange as t };
