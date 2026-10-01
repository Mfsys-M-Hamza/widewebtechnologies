"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";
import { ChatIcon } from "@/components/ui/ChatIcon";

/** Floating quick-chat button. Sits in the corner; the footer reserves space so it never covers content. */
export function FloatingWhatsApp() {
  return (
    <motion.a
      href={whatsappLink(siteConfig.quickChatMessage)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 items-center gap-0 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue pl-4 pr-4 text-ink-950 shadow-[0_14px_40px_-10px_rgb(46_230_214/0.65)] ring-1 ring-white/20 transition-[gap,padding] duration-300 hover:gap-2 hover:pr-5 focus-visible:gap-2 focus-visible:pr-5 sm:bottom-6 sm:right-6"
    >
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue motion-pulse-soft blur-md" aria-hidden="true" />
      <ChatIcon className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width] duration-300 group-hover:max-w-40 group-focus-visible:max-w-40">
        Chat on WhatsApp
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </motion.a>
  );
}
