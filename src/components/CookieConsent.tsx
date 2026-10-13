import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const KEY = "saraci_cookie_consent_v1";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage e bllokuar — nuk shfaqim banner */
    }
  }, []);

  function decide(value: "accepted" | "essential") {
    try {
      localStorage.setItem(KEY, JSON.stringify({ value, at: new Date().toISOString() }));
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Pëlqimi për cookies"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-background/98 backdrop-blur shadow-2xl p-4 sm:p-5">
        <h2 className="font-display text-base font-semibold">Respektojmë privatësinë tuaj</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Përdorim vetëm cookies të nevojshme për të mbajtur hyrjen dhe rezervimin tuaj të sigurt.
          Nuk përdorim reklama dhe nuk shesim të dhëna. Lexoni{" "}
          <Link to="/privatesia" className="underline hover:text-foreground">Politikën e privatësisë</Link>{" "}
          dhe{" "}
          <Link to="/kushtet" className="underline hover:text-foreground">Kushtet e shërbimit</Link>.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button onClick={() => decide("accepted")} className="sm:w-auto">Pranoj</Button>
          <Button variant="outline" onClick={() => decide("essential")} className="sm:w-auto">
            Vetëm të nevojshmet
          </Button>
        </div>
      </div>
    </div>
  );
}
