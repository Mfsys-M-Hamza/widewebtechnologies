"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { services } from "@/config/site";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { BookingButton } from "@/components/booking/BookingProvider";

/** Service cards that expand in place to reveal deliverables and a booking shortcut. */
export function ServicesOverview() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <LayoutGroup>
      <ul className="mt-14 grid grid-flow-dense gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const open = openId === s.id;
          // Let a lone card on the last row span the full row (2 columns on tablet, 3 on desktop).
          const isLast = i === services.length - 1;
          const fill = [
            isLast && services.length % 2 === 1 ? "md:col-span-2" : "",
            isLast && services.length % 3 === 1 ? "lg:col-span-3" : "",
          ].join(" ");
          const panelId = `svc-panel-${s.id}`;
          return (
            <motion.li
              key={s.id}
              layout
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className={`edge group relative overflow-hidden rounded-[1.6rem] ${
                open ? "bg-ink-800 md:col-span-2" : "bg-ink-900/80 hover:bg-ink-850"
              } ${fill} shadow-card`}
            >
              <div
                className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-electric/30 to-violet/20 blur-3xl transition-opacity duration-500 ${
                  open ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                }`}
                aria-hidden="true"
              />
              <motion.div layout="position" className="relative p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <ServiceIcon icon={s.icon} />
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : s.id)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/5 transition hover:border-electric/50 hover:bg-electric/15"
                  >
                    <Plus className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-45" : ""}`} aria-hidden="true" />
                    <span className="sr-only">
                      {open ? "Hide" : "Show"} details for {s.title}
                    </span>
                  </button>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.summary}</p>

                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      id={panelId}
                      key="panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-electric-soft">Typical deliverables</p>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                          {s.deliverables.map((d, i) => (
                            <motion.li
                              key={d}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * i + 0.1 }}
                              className="flex items-start gap-2 text-sm text-fg/90"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
                              {d}
                            </motion.li>
                          ))}
                        </ul>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <BookingButton
                            service={s.id}
                            className="inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-electric to-violet px-5 text-sm font-semibold text-white transition hover:brightness-110"
                          >
                            Discuss This Service
                          </BookingButton>
                          <Link
                            href={`/services#${s.id}`}
                            className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-semibold text-fg transition hover:bg-white/5"
                          >
                            Learn more
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </LayoutGroup>
  );
}
