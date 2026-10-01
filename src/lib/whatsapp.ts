import { siteConfig } from "@/config/site";
import { formatDateLong, formatTime12h } from "@/lib/datetime";

/** Business WhatsApp number as digits only, as required by wa.me. */
export function businessWhatsAppDigits(): string {
  return siteConfig.contact.whatsapp.value.replace(/\D/g, "");
}

/** Official wa.me click-to-chat link with a URL-encoded message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${businessWhatsAppDigits()}?text=${encodeURIComponent(message)}`;
}

export type AppointmentRequest = {
  name: string;
  business: string;
  whatsapp: string;
  email: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  timezone: string;
  details: string;
};

/** Readable WhatsApp message containing every entered detail. */
export function buildAppointmentMessage(r: AppointmentRequest): string {
  const orNone = (v: string) => (v.trim() ? v.trim() : "Not provided");
  return [
    `Hello ${siteConfig.name}, I would like to request a consultation.`,
    "",
    `Name: ${r.name.trim()}`,
    `Business: ${orNone(r.business)}`,
    `WhatsApp: ${r.whatsapp.trim()}`,
    `Email: ${orNone(r.email)}`,
    `Service: ${r.service}`,
    `Preferred date: ${formatDateLong(r.date)}`,
    `Preferred time: ${formatTime12h(r.time)}`,
    `Timezone: ${r.timezone}`,
    `Project details: ${r.details.trim()}`,
    "",
    "Please confirm your availability. Thank you.",
  ].join("\n");
}
