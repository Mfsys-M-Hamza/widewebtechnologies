"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/config/site";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          // The open question gets a tinted surface and accent border so it stands out from the rest.
          <div
            key={f.q}
            className={`rounded-2xl border transition-colors duration-300 ${
              isOpen
                ? "border-electric/40 bg-gradient-to-br from-electric/[0.09] to-violet/[0.05] shadow-glow"
                : "border-line bg-ink-900/60 hover:border-ink-600 hover:bg-ink-900/80"
            }`}
          >
            <h3>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left font-display text-base font-semibold sm:px-7 sm:text-lg"
              >
                {f.q}
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition ${
                    isOpen ? "rotate-180 border-electric/60 bg-electric/15 text-electric-soft" : "border-line"
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-6 leading-relaxed text-muted sm:px-7">{f.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
