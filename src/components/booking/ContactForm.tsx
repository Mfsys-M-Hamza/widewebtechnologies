"use client";

import { useSearchParams } from "next/navigation";
import { BookingForm } from "@/components/booking/BookingForm";

/** Contact-page form; preselects a service from ?service=<id> (used by footer and other links). */
export function ContactForm() {
  const service = useSearchParams().get("service") ?? undefined;
  return <BookingForm key={service ?? "none"} initialService={service} />;
}
