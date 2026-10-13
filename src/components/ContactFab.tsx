import { Phone, MessageCircle } from "lucide-react";

const PHONE = "+355675402044";
const WHATSAPP = "355675402044";

export function ContactFab() {
  return (
    <div className="fixed right-4 bottom-24 sm:bottom-6 z-50 flex flex-col gap-2">
      <a
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Përshëndetje! Dua të rezervoj një termin në Saraci Dental.")}`}
        target="_blank"
        rel="noopener"
        aria-label="Shkruaj në WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 grid place-items-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      <a
        href={`tel:${PHONE}`}
        aria-label="Telefono klinikën"
        className="w-12 h-12 sm:w-14 sm:h-14 grid place-items-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition"
      >
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
}
