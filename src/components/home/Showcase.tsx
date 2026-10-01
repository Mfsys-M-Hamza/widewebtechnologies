"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, Check, ExternalLink, MapPin, X } from "lucide-react";
import { useRef, useState } from "react";
import { showcaseProjects, type ShowcaseProject } from "@/config/site";
import { AnimatedDialog } from "@/components/ui/AnimatedDialog";
import { useBooking } from "@/components/booking/BookingProvider";
import { Reveal } from "@/components/ui/Reveal";

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

/** Desktop screenshot in a browser frame with the mobile screenshot overlapping it. */
function DeviceShots({ project, large = false }: { project: ShowcaseProject; large?: boolean }) {
  return (
    <div className={`relative ${large ? "pb-6 pr-6 sm:pb-10 sm:pr-16" : "pb-5 pr-10"}`}>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-950 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#111833] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff6b6b]/80" />
          <span className="h-2 w-2 rounded-full bg-[#f5c451]/80" />
          <span className="h-2 w-2 rounded-full bg-[#4ade80]/80" />
          <span className="ml-3 truncate rounded-md bg-white/5 px-2 text-[0.62rem] leading-4 text-white/45">{host(project.url)}</span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.images.desktop}
            alt={`${project.title} website shown on a desktop screen`}
            fill
            sizes={large ? "(min-width: 768px) 720px, 92vw" : "(min-width: 768px) 520px, 88vw"}
            className={`object-cover object-top ${large ? "" : "transition-transform duration-700 ease-out group-hover:scale-[1.04]"}`}
          />
        </div>
      </div>
      <div
        className={`absolute bottom-0 right-0 overflow-hidden rounded-[1.1rem] border-[3px] border-[#1d2750] bg-ink-950 shadow-[0_20px_40px_-12px_rgb(0_0_0/0.9)] ${
          large ? "w-[24%] sm:w-[20%]" : "w-[26%] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-[-2deg]"
        }`}
      >
        <div className="relative aspect-[390/844]">
          <Image
            src={project.images.mobile}
            alt={`${project.title} website shown on a mobile phone`}
            fill
            sizes={large ? "180px" : "140px"}
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  const [selected, setSelected] = useState<ShowcaseProject | null>(null);
  const { openBooking } = useBooking();
  const bookAfterClose = useRef(false);

  return (
    <>
      <ul className="mt-14 grid gap-6 md:grid-cols-2">
        {showcaseProjects.map((p, i) => (
          <li key={p.id}>
            <Reveal delay={(i % 2) * 0.08} className="h-full">
              <article className="edge glass group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-3">
                <div className="relative overflow-hidden rounded-[1.25rem] bg-ink-850 p-5 sm:p-7">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `radial-gradient(70% 60% at 70% 20%, ${p.accent}33, transparent 70%)` }}
                    aria-hidden="true"
                  />
                  <div className="relative [perspective:1000px]">
                    <div className="transition-transform duration-500 ease-out [transform:rotateX(8deg)_scale(0.97)] group-hover:[transform:rotateX(0deg)_scale(1)] group-focus-within:[transform:rotateX(0deg)_scale(1)]">
                      <DeviceShots project={p} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-wider text-subtle">
                    <span className="text-cyan">{p.category}</span>
                    {p.location ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {p.location}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-2.5 font-display text-xl font-semibold tracking-tight">
                    {/* the stretched button makes the whole card open the preview */}
                    <button
                      type="button"
                      onClick={() => setSelected(p)}
                      aria-haspopup="dialog"
                      className="text-left after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-electric-soft"
                    >
                      {p.title}
                      <span className="sr-only"> — open project preview</span>
                    </button>
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted">{p.summary}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white/5 px-4 text-sm font-semibold text-fg transition hover:border-cyan/50 hover:bg-cyan/10"
                    >
                      Visit live site <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">(opens {p.title} in a new tab)</span>
                    </a>
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-white/5 transition group-hover:rotate-45 group-hover:border-electric/60 group-hover:bg-electric/20"
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      <AnimatedDialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onClosed={() => {
          if (bookAfterClose.current) {
            bookAfterClose.current = false;
            openBooking();
          }
        }}
        labelledBy="project-title"
      >
        {selected ? (
          <motion.div
            key={selected.id}
            className="absolute inset-0 flex items-end justify-center p-0 sm:items-center sm:p-6"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{ open: {}, closed: { transition: { when: "afterChildren" } } }}
          >
            <motion.div
              className="absolute inset-0 bg-ink-950/75 backdrop-blur-md"
              variants={{ open: { opacity: 1 }, closed: { opacity: 0, transition: { duration: 0.2 } } }}
              onClick={() => setSelected(null)}
              aria-hidden="true"
            />
            <motion.div
              className="relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-[1.75rem] border border-line bg-ink-900 p-5 shadow-glow sm:rounded-[1.75rem] sm:p-8"
              variants={{
                open: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
                closed: { opacity: 0, y: 40, scale: 0.94, rotateX: 8, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ transformPerspective: 1200 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-wider text-subtle">
                    <span className="text-cyan">{selected.category}</span>
                    {selected.location ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {selected.location}
                      </span>
                    ) : null}
                  </div>
                  <h2 id="project-title" className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {selected.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-white/5 hover:bg-white/10"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Close preview</span>
                </button>
              </div>

              <motion.div
                className="mt-6"
                variants={{ open: { opacity: 1, y: 0, transition: { delay: 0.08, duration: 0.4 } }, closed: { opacity: 0, transition: { duration: 0.15 } } }}
              >
                <DeviceShots project={selected} large />
              </motion.div>

              <p className="mt-6 text-muted">{selected.summary}</p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
                {selected.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 rounded-xl border border-line bg-white/[0.03] p-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue px-6 font-semibold text-ink-950 transition hover:brightness-110"
                >
                  Visit live site <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => {
                    bookAfterClose.current = true;
                    setSelected(null);
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white/5 px-6 font-semibold text-fg transition hover:bg-white/10"
                >
                  Discuss a similar website
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatedDialog>
    </>
  );
}
