"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatedDialog } from "@/components/ui/AnimatedDialog";
import { BookingForm } from "@/components/booking/BookingForm";
import { ChatIcon } from "@/components/ui/ChatIcon";

type BookingContextValue = { openBooking: (serviceId?: string) => void };

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; service?: string; session: number }>({
    open: false,
    session: 0,
  });

  const openBooking = useCallback((serviceId?: string) => {
    setState((s) => ({ open: true, service: serviceId, session: s.session + 1 }));
  }, []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <AnimatedDialog open={state.open} onClose={close} labelledBy="booking-title" id="booking-panel">
        <motion.div
          key="booking"
          className="absolute inset-0"
          initial="closed"
          animate="open"
          exit="closed"
          variants={{ open: {}, closed: { transition: { when: "afterChildren" } } }}
        >
          <motion.div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
            variants={{ open: { opacity: 1, transition: { duration: 0.25 } }, closed: { opacity: 0, transition: { duration: 0.2 } } }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-hidden border-l border-line bg-ink-900 shadow-[0_0_80px_-10px_rgb(79_140_255/0.35)] sm:inset-y-3 sm:right-3 sm:rounded-[1.75rem] sm:border"
            variants={{
              open: { x: 0, opacity: 1, scale: 1 },
              closed: { x: "12%", opacity: 0, scale: 0.98, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
            }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="relative overflow-hidden border-b border-line px-5 pb-5 pt-5 sm:px-7">
              <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-violet/30 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -left-10 -top-20 h-44 w-44 rounded-full bg-electric/25 blur-3xl" aria-hidden="true" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
                    <ChatIcon className="h-4 w-4" /> WhatsApp appointment request
                  </p>
                  <h2 id="booking-title" className="mt-2 font-display text-2xl font-semibold tracking-tight">
                    Book a free consultation
                  </h2>
                  <p className="mt-1.5 text-sm text-muted">
                    Share a few details. We&apos;ll prepare a WhatsApp message for you to review and send.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-white/5 text-fg transition hover:bg-white/10"
                  aria-label="Close booking panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div data-scroll-container className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
              <BookingForm key={state.session} initialService={state.service} />
            </div>
          </motion.div>
        </motion.div>
      </AnimatedDialog>
    </BookingContext.Provider>
  );
}

/** Button that opens the booking panel, optionally with a service preselected. */
export function BookingButton({
  service,
  className,
  children,
  ...rest
}: { service?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openBooking } = useBooking();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-controls="booking-panel"
      onClick={() => openBooking(service)}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
