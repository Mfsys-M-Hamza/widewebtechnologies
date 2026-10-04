import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { navLinks } from "@/config/site";
import { BookingButton } from "@/components/booking/BookingProvider";
import { ChatIcon } from "@/components/ui/ChatIcon";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** Branded 404 for any URL that doesn't match a page. */
export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="relative overflow-hidden pb-10 pt-36 sm:pt-44">
      <div className="pointer-events-none absolute inset-0 grid-texture" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-violet/15 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="font-display text-[7rem] font-semibold leading-none tracking-tighter sm:text-[10rem]" aria-hidden="true">
          <span className="text-gradient">404</span>
        </p>
        <h1 id="nf-title" className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          The link may be old or mistyped. Here are the pages that do exist — or tell us what you were looking for.
        </p>

        <nav aria-label="Site pages" className="mt-9">
          <ul className="flex flex-wrap justify-center gap-2.5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-white/[0.04] px-5 text-sm font-medium text-fg transition hover:border-electric/50 hover:bg-electric/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex min-h-12 items-center gap-2 rounded-full px-4 font-semibold text-electric-soft transition hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" aria-hidden="true" />
            Back to home
          </Link>
          <BookingButton className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue px-6 font-semibold text-ink-950 shadow-[0_14px_40px_-12px_rgb(46_230_214/0.6)] transition hover:brightness-110">
            <ChatIcon className="h-5 w-5" />
            Ask us on WhatsApp
          </BookingButton>
        </div>
      </div>
    </section>
  );
}
