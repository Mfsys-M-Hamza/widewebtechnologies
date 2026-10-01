import type { Metadata } from "next";
import { Compass, Gem, HeartHandshake, RefreshCcw, ScanEye, ShieldCheck, Target } from "lucide-react";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ConsultationCTA } from "@/components/home/ConsultationCTA";

export const metadata: Metadata = {
  title: "About Us — Our Mission, Approach & Values",
  description:
    "Learn about Wide Web Technologies: an IT services and website development company focused on clear communication, quality work and practical websites for businesses.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About | Wide Web Technologies", url: "/about" },
};

/* Copy below is intentionally general and editable — replace it with your own story when ready. */

const approach = [
  {
    title: "Listen first",
    text: "We start by understanding your business, your customers and what you want your website to achieve.",
  },
  {
    title: "Plan clearly",
    text: "You get a clear outline of pages, features and next steps before design work begins.",
  },
  {
    title: "Share progress",
    text: "We show work as it develops and ask for your feedback at the stages where it matters most.",
  },
  {
    title: "Support after launch",
    text: "Launch is not the end. We remain available for updates, fixes and improvements.",
  },
];

const values = [
  { icon: ScanEye, title: "Clarity", text: "Clear communication, clear pricing discussions and websites that are easy to understand." },
  { icon: Gem, title: "Quality", text: "Careful design and development, tested on real screen sizes before anything goes live." },
  { icon: ShieldCheck, title: "Reliability", text: "We do what we say, keep you updated and respond when you need help." },
  { icon: RefreshCcw, title: "Ongoing improvement", text: "We keep learning and refining our work — and help your website improve over time." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Helping businesses look professional <span className="text-gradient">online</span>
          </>
        }
        intro={`${siteConfig.name} is an IT services and website development company. We help businesses create websites that present them clearly, work well on every device and make it simple for customers to get in touch.`}
      />

      {/* Who we are + mission */}
      <section className="mx-auto mt-20 grid max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-2" aria-label="Who we are and our mission">
        <Reveal>
          <article className="edge relative h-full overflow-hidden rounded-[2rem] bg-ink-900/80 p-8 sm:p-10">
            <Compass className="h-10 w-10 text-electric-soft" aria-hidden="true" />
            <h2 className="mt-6 font-display text-2xl font-semibold sm:text-3xl">Who we are</h2>
            <p className="mt-4 leading-relaxed text-muted">
              We are a website development team that cares about doing things properly. We combine thoughtful design
              with dependable development to build business websites that are easy to use and easy to maintain.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              We work with businesses that want a professional online presence without the confusion — and we
              explain each step in plain language.
            </p>
          </article>
        </Reveal>
        <Reveal delay={0.08}>
          <article className="edge relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-electric/15 via-ink-900 to-violet/15 p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border border-electric/20 motion-spin-slow" aria-hidden="true">
              <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-cyan" />
            </div>
            <Target className="h-10 w-10 text-violet-soft" aria-hidden="true" />
            <h2 className="mt-6 font-display text-2xl font-semibold sm:text-3xl">Our mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-fg/90">
              To give every business we work with a smart, reliable website and a strong digital presence — built
              with care, explained clearly and supported after launch.
            </p>
          </article>
        </Reveal>
      </section>

      {/* Approach */}
      <section aria-labelledby="approach-title" className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="approach-title"
          eyebrow="Our approach"
          title={
            <>
              How we work <span className="text-gradient">with you</span>
            </>
          }
          intro="A collaborative process that keeps you informed and in control."
        />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {approach.map((a, i) => (
            <li key={a.title}>
              <Reveal delay={i * 0.07} className="h-full">
              <div className="group relative h-full rounded-[1.6rem] border border-line bg-ink-900/70 p-6 transition hover:-translate-y-1 hover:border-electric/40">
                <span className="font-display text-5xl font-semibold text-transparent [-webkit-text-stroke:1px_rgb(122_168_255/0.5)] transition group-hover:[-webkit-text-stroke:1px_rgb(155_107_255/0.9)]">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.text}</p>
              </div>
            </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="values-title"
          eyebrow="Our values"
          align="center"
          title={
            <>
              What we <span className="text-gradient">stand for</span>
            </>
          }
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="edge group flex h-full gap-5 rounded-[1.6rem] bg-ink-900/80 p-7">
                <div className="[perspective:500px]">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-electric to-violet shadow-[0_14px_30px_-10px_rgb(79_140_255/0.7)] transition-transform duration-500 [transform:rotateY(-14deg)_rotateX(10deg)] group-hover:[transform:rotateY(0)_rotateX(0)]">
                    <v.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{v.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center text-sm text-subtle">
            <HeartHandshake className="h-4 w-4" aria-hidden="true" />
            We&apos;d love to learn about your business.
          </p>
        </Reveal>
      </section>

      <ConsultationCTA title="Let's talk about your website" />
    </>
  );
}
