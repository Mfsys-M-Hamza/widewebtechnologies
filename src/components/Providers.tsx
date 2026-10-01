"use client";

import { MotionConfig } from "motion/react";
import { BookingProvider } from "@/components/booking/BookingProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // "user" honours the OS reduced-motion setting: transforms are skipped, opacity fades remain.
    <MotionConfig reducedMotion="user">
      <BookingProvider>{children}</BookingProvider>
    </MotionConfig>
  );
}
