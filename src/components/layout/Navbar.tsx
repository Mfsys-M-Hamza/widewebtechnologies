"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { navLinks, siteConfig } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { useBooking } from "@/components/booking/BookingProvider";
import { AnimatedDialog } from "@/components/ui/AnimatedDialog";
import { ChatIcon } from "@/components/ui/ChatIcon";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const bookAfterMenuCloses = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <a
        href="#main"
        className="pointer-events-auto absolute left-4 top-3 z-10 -translate-y-24 rounded-full bg-electric px-4 py-2.5 text-sm font-semibold text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main"
        className={`pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full py-2 pl-3 pr-2 transition-all duration-500 sm:pl-4 ${
          scrolled
            ? "glass shadow-[0_12px_40px_-12px_rgb(0_0_0/0.7)]"
            : "border border-transparent bg-ink-900/30 backdrop-blur-md"
        }`}
      >
        <Link href="/" aria-label={`${siteConfig.name} — Home`} className="rounded-full py-1 pr-2">
          <Logo compact />
        </Link>

        <ul className="relative hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => setHovered(link.href)}
                  onFocus={() => setHovered(link.href)}
                  onBlur={() => setHovered(null)}
                  className={`relative block rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                    active ? "text-white" : "text-muted hover:text-fg"
                  }`}
                >
                  {hovered === link.href && !active ? (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  ) : null}
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-electric/30 to-violet/30 shadow-[inset_0_0_0_1px_rgb(122_168_255/0.35)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      aria-hidden="true"
                    >
                      <span className="absolute -bottom-[3px] left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan to-electric shadow-[0_0_12px_rgb(56_213_245/0.9)]" />
                    </motion.span>
                  ) : null}
                  <span className="relative">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => openBooking()}
            aria-haspopup="dialog"
            aria-controls="booking-panel"
            className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-brand-teal to-brand-blue px-4 text-[0.8rem] font-semibold text-ink-950 shadow-[0_8px_24px_-8px_rgb(46_230_214/0.55)] transition hover:brightness-110 sm:px-5 sm:text-sm"
          >
            <ChatIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden min-[430px]:inline">Book on WhatsApp</span>
            <span className="min-[430px]:hidden" aria-hidden="true">Book</span>
            <span className="sr-only min-[430px]:hidden">Book on WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="dialog"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/5 text-fg transition hover:bg-white/10 md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </nav>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
        onBook={() => {
          bookAfterMenuCloses.current = true;
          setMenuOpen(false);
        }}
        onClosed={() => {
          if (bookAfterMenuCloses.current) {
            bookAfterMenuCloses.current = false;
            openBooking();
          }
        }}
      />
    </header>
  );
}

function MobileMenu({
  open,
  onClose,
  pathname,
  onBook,
  onClosed,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  onBook: () => void;
  onClosed: () => void;
}) {
  return (
    <AnimatedDialog open={open} onClose={onClose} onClosed={onClosed} labelledBy="mobile-menu-title" id="mobile-menu">
      <motion.div
        key="menu"
        className="pointer-events-auto absolute inset-0 flex flex-col overflow-y-auto bg-ink-950"
        initial="closed"
        animate="open"
        exit="closed"
        variants={{
          open: { clipPath: "circle(150% at calc(100% - 2.6rem) 2.6rem)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], when: "beforeChildren", staggerChildren: 0.06 } },
          closed: { clipPath: "circle(0% at calc(100% - 2.6rem) 2.6rem)", transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } },
        }}
      >
        {/* technology-inspired background */}
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-violet/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-electric/20 blur-3xl" aria-hidden="true" />
        <svg className="pointer-events-none absolute right-6 top-28 h-56 w-56 opacity-30 motion-spin-slow" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#4f8cff" strokeDasharray="2 8" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#9b6bff" strokeDasharray="12 10" />
          <circle cx="190" cy="100" r="4" fill="#38d5f5" />
        </svg>

        <div className="relative flex items-center justify-between px-6 pt-5">
          <h2 id="mobile-menu-title" className="sr-only">
            Site menu
          </h2>
          <Link href="/" onClick={onClose} aria-label={`${siteConfig.name} — Home`}>
            <Logo />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/5"
          >
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Mobile" className="relative flex flex-1 flex-col justify-center px-6 py-10">
          <ul className="space-y-2">
            {navLinks.map((link, i) => {
              const active = isActive(pathname, link.href);
              return (
                <motion.li
                  key={link.href}
                  variants={{
                    open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                    closed: { opacity: 0, x: -24, transition: { duration: 0.15 } },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center justify-between rounded-2xl px-4 py-4 font-display text-3xl font-semibold tracking-tight transition ${
                      active ? "bg-gradient-to-r from-electric/20 to-violet/10 text-white" : "text-fg/85 hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-electric-soft">0{i + 1}</span>
                      {link.label}
                    </span>
                    {active ? (
                      <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_12px_rgb(56_213_245/0.9)]" aria-hidden="true" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-subtle transition group-hover:text-fg" aria-hidden="true" />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
          <motion.div
            className="mt-10"
            variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 16 } }}
          >
            <button
              type="button"
              onClick={onBook}
              aria-haspopup="dialog"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue px-6 text-base font-semibold text-ink-950"
            >
              <ChatIcon className="h-5 w-5" />
              Book on WhatsApp
            </button>
            <p className="mt-4 text-center text-sm text-subtle">{siteConfig.tagline}</p>
          </motion.div>
        </nav>
      </motion.div>
    </AnimatedDialog>
  );
}
