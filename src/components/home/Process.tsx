"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { CodeXml, MessagesSquare, PenTool, Rocket } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    title: "Discuss",
    icon: MessagesSquare,
    text: "We talk through your business, goals, audience and the pages or features you need.",
  },
  {
    title: "Design",
    icon: PenTool,
    text: "We plan the structure and create a visual design for you to review and refine.",
  },
  {
    title: "Develop",
    icon: CodeXml,
    text: "We build a fast, responsive website and test it across phones, tablets and desktops.",
  },
  {
    title: "Launch",
    icon: Rocket,
    text: "We go live, walk you through the site and stay available for updates and support.",
  },
];

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <ol ref={ref} className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-5">
      {/* connector line that draws as you scroll */}
      <div className="absolute bottom-7 left-7 top-7 w-px bg-line md:hidden" aria-hidden="true">
        <motion.div
          className="h-full w-full origin-top bg-gradient-to-b from-electric via-violet to-cyan"
          style={reduced ? undefined : { scaleY: progress }}
        />
      </div>
      <div className="absolute left-7 right-7 top-7 hidden h-px bg-line md:block" aria-hidden="true">
        <motion.div
          className="h-full w-full origin-left bg-gradient-to-r from-electric via-violet to-cyan"
          style={reduced ? undefined : { scaleX: progress }}
        />
      </div>
      {steps.map((s, i) => (
        <motion.li
          key={s.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ delay: i * 0.12, duration: 0.5 }}
          className="relative flex gap-5 md:block"
        >
          <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-electric/40 bg-ink-900 shadow-[0_0_30px_-6px_rgb(79_140_255/0.6)]">
            <s.icon className="h-6 w-6 text-electric-soft" aria-hidden="true" />
          </div>
          <div className="md:mt-6">
            <p className="font-mono text-xs text-subtle">Step 0{i + 1}</p>
            <h3 className="mt-1 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
