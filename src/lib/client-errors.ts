// Kap gabimet e klientit dhe i regjistron në backend (error_log).
let installed = false;

async function report(message: string, stack?: string) {
  try {
    await fetch("/api/public/hooks/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message.slice(0, 2000),
        stack: stack?.slice(0, 8000),
        path: window.location.pathname,
        userAgent: navigator.userAgent.slice(0, 500),
      }),
    });
  } catch {
    // heshtazi — nuk duam loop gabimesh
  }
}

export function installClientErrorReporting() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("error", (e) => {
    if (!e.message) return;
    report(e.message, e.error?.stack);
  });
  window.addEventListener("unhandledrejection", (e) => {
    const r = e.reason;
    report(typeof r === "string" ? r : (r?.message ?? "Unhandled rejection"), r?.stack);
  });
}

export function reportClientError(err: unknown, context?: string) {
  const e = err as { message?: string; stack?: string };
  report(`${context ? context + ": " : ""}${e?.message ?? String(err)}`, e?.stack);
}
