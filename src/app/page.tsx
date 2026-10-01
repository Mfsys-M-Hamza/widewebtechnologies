import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Laptop, Layers, MessagesSquare, Monitor, MonitorSmartphone, Smartphone, Wrench } from "lucide-react";
import { siteConfig } from "@/config/site";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { HeroVideo } from "@/components/hero/HeroVideo";
import { BookingButton } from "@/components/booking/BookingProvider";
import { ChatIcon } from "@/components/ui/ChatIcon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { Showcase } from "@/components/home/Showcase";
import { Process } from "@/components/home/Process";
import { FAQ } from "@/components/home/FAQ";
import { ConsultationCTA } from "@/components/home/ConsultationCTA";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — Business Website Development & IT Services` },
  description:
    "Professional business website development and responsive web design. Wide Web Technologies helps businesses build a clear, trustworthy online presence. Book a free consultation on WhatsApp.",
  alternates: { canonical: "/" },
};

const reasons = [
  {
    icon: MonitorSmartphone,
    title: "Responsive design",
    text: "Your website is designed to look sharp and work smoothly on phones, tablets and desktops.",
    className: "md:col-span-2",
  },
  {
    icon: MessagesSquare,
    title: "Clear communication",
    text: "Plain-language updates, quick replies on WhatsApp, and no confusing jargon.",
    className: "",
  },
  {
    icon: Eye,
    title: "Attention to detail",
    text: "Careful spacing, readable text, tested forms and consistent styling on every page.",
    className: "",
  },
  {
    icon: Wrench,
    title: "Practical solutions",
    text: "We recommend what your business actually needs — not features that add cost without value.",
    className: "md:col-span-2",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden pt-24 sm:pt-32 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 grid-texture" aria-hidden="true" />
        <div className="relative mx-auto grid grid-cols-1 max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_rgb(56_213_245/0.9)]" aria-hidden="true" />
                {siteConfig.tagline}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1
                id="hero-title"
                className="mt-6 font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.1rem]"
              >
                We Build Websites That <span className="text-gradient">Bring Your Business to Life.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Wide Web Technologies designs and builds professional websites that explain what you do, earn
                visitors&apos; trust and make it easy for customers to contact you. From business website development
                to responsive web design and ongoing support, we keep the process clear and practical.
              </p>
            </Reveal>
            <Reveal delay={0.18} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <BookingButton className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue px-7 text-base font-semibold text-ink-950 shadow-[0_14px_40px_-12px_rgb(46_230_214/0.6)] transition hover:brightness-110">
                <ChatIcon className="h-5 w-5 transition group-hover:-rotate-6" />
                Book a Free Consultation
              </BookingButton>
              <Link
                href="/services"
                className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-line bg-white/[0.04] px-7 text-base font-semibold text-fg transition hover:border-electric/50 hover:bg-electric/10"
              >
                Explore Our Services
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Reveal>
            <Reveal delay={0.24}>
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-subtle">
                {["Business websites", "Responsive web design", "IT services & support"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-electric-soft" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="relative order-first mx-auto w-full max-w-[22rem] sm:max-w-md lg:order-none lg:max-w-none">
            <HeroVideo />
          </div>
        </div>
      </section>

      {/* EVERY SCREEN — interactive 3D workspace */}
      <section aria-labelledby="screens-title" className="mx-auto mt-20 max-w-6xl px-5 sm:mt-28 sm:px-8">
        <div className="edge relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[2rem] bg-ink-900/60 p-5 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="pointer-events-none absolute inset-0 grid-texture opacity-60" aria-hidden="true" />
          <div className="relative">
            <HeroVisual />
          </div>
          <div className="relative">
            <SectionHeading
              id="screens-title"
              eyebrow="Built for every screen"
              title={
                <>
                  One website. <span className="text-gradient">Every device.</span>
                </>
              }
              intro="Your customers find you on desktops, laptops and phones. We design and test every page so it looks sharp and works smoothly on all of them."
            />
            <ul className="mt-8 space-y-4">
              {[
                { icon: Monitor, title: "Desktop", text: "Spacious layouts that present your business clearly." },
                { icon: Laptop, title: "Laptop & tablet", text: "Content that adapts neatly to mid-sized screens." },
                { icon: Smartphone, title: "Mobile", text: "Large buttons, readable text and one-tap WhatsApp contact." },
              ].map((d) => (
                <li key={d.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.04]">
                    <d.icon className="h-5 w-5 text-cyan" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display font-semibold">{d.title}</span>
                    <span className="text-sm text-muted">{d.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section aria-labelledby="services-title" className="mx-auto mt-24 max-w-6xl px-5 sm:mt-32 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="services-title"
            eyebrow="What we do"
            title={
              <>
                Website services built around <span className="text-gradient">your business</span>
              </>
            }
            intro="Select a service to see what's typically included. Everything is tailored to your goals after a short consultation."
          />
          <Reveal>
            <Link
              href="/services"
              className="group inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-sm font-semibold text-electric-soft hover:text-fg"
            >
              All services <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
        <ServicesOverview />
      </section>

      {/* SHOWCASE */}
      <section aria-labelledby="work-title" className="relative mt-28 sm:mt-36">
        <div className="pointer-events-none absolute inset-x-0 top-24 h-[36rem] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(79_140_255/0.10),transparent)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            id="work-title"
            eyebrow="Our work"
            title={
              <>
                Websites we&apos;ve <span className="text-gradient">developed</span>
              </>
            }
            intro="Live websites we&apos;ve designed and built for businesses. Select a project to see it on desktop and mobile, or visit the live site."
          />
          <Showcase />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section aria-labelledby="why-title" className="mx-auto mt-28 max-w-6xl px-5 sm:mt-36 sm:px-8">
        <SectionHeading
          id="why-title"
          eyebrow="Why choose us"
          align="center"
          title={
            <>
              Thoughtful work. <span className="text-gradient">Straightforward process.</span>
            </>
          }
          intro="We focus on the things that make a website genuinely useful for your business and easy for your customers."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06} className={r.className}>
              <div className="edge group relative h-full overflow-hidden rounded-[1.6rem] bg-ink-900/80 p-7 transition hover:bg-ink-850 sm:p-8">
                <div className="pointer-events-none absolute inset-0 dot-texture opacity-40 [mask-image:linear-gradient(to_bottom_left,#000,transparent_60%)]" aria-hidden="true" />
                <div className="relative">
                  <div className="relative grid h-14 w-14 place-items-center">
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-electric/30 to-violet/30 transition-transform duration-500 group-hover:rotate-12" aria-hidden="true" />
                    <span className="absolute inset-1.5 rounded-xl bg-ink-900" aria-hidden="true" />
                    <r.icon className="relative h-6 w-6 text-electric-soft" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">{r.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-muted">{r.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section aria-labelledby="process-title" className="mx-auto mt-28 max-w-6xl px-5 sm:mt-36 sm:px-8">
        <SectionHeading
          id="process-title"
          eyebrow="How it works"
          title={
            <>
              Discuss <span className="text-subtle">→</span> Design <span className="text-subtle">→</span> Develop{" "}
              <span className="text-subtle">→</span> <span className="text-gradient">Launch</span>
            </>
          }
          intro="A simple, transparent process so you always know what's happening and what comes next."
        />
        <Process />
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="mx-auto mt-28 grid grid-cols-1 max-w-6xl gap-10 px-5 sm:mt-36 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions, answered" intro="Short answers to common questions. Anything else? Ask us on WhatsApp." />
          <Reveal className="mt-8 hidden lg:block">
            <div className="relative h-48 w-48" aria-hidden="true">
              <Layers className="absolute left-10 top-10 h-28 w-28 text-electric/30 motion-float-a" strokeWidth={0.8} />
            </div>
          </Reveal>
        </div>
        <Reveal>
          <FAQ />
        </Reveal>
      </section>

      <ConsultationCTA />
    </>
  );
}
