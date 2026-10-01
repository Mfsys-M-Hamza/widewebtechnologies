import type { Metadata } from "next";
import { openGraphFor } from "@/lib/seo";
import { Check, Info } from "lucide-react";
import { services } from "@/config/site";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { BookingButton } from "@/components/booking/BookingProvider";
import { Reveal } from "@/components/ui/Reveal";
import { ConsultationCTA } from "@/components/home/ConsultationCTA";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Website Services — Business Websites, Responsive Design & QA Testing",
  description:
    "Business and informational websites, landing pages, mobile-responsive web design, basic on-page SEO setup, website and mobile app QA testing, and website maintenance from Wide Web Technologies.",
  alternates: { canonical: "/services" },
  openGraph: openGraphFor("Website Services | Wide Web Technologies", "/services"),
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Practical web services for a <span className="text-gradient">strong digital presence</span>
          </>
        }
        intro="Whether you need a new business website, a refresh of your current one or reliable support after launch, we focus on clear structure, responsive web design and details that matter to your customers."
      >
        <nav aria-label="Services on this page" className="mt-9">
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex min-h-10 items-center rounded-full border border-line bg-white/[0.04] px-4 text-sm text-muted transition hover:border-electric/50 hover:text-fg"
                >
                  {s.shortTitle}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="mx-auto mt-16 max-w-6xl space-y-6 px-5 sm:px-8">
        {services.map((s, i) => (
          <Reveal key={s.id}>
            <article
              id={s.id}
              aria-labelledby={`${s.id}-title`}
              className="edge group relative grid scroll-mt-28 gap-8 overflow-hidden rounded-[2rem] bg-ink-900/80 p-6 sm:p-10 lg:grid-cols-[auto_1fr_1fr] lg:gap-12"
            >
              <div
                className={`pointer-events-none absolute h-72 w-72 rounded-full blur-3xl ${
                  i % 2 ? "-left-24 -bottom-24 bg-violet/15" : "-right-24 -top-24 bg-electric/15"
                }`}
                aria-hidden="true"
              />
              <div className="relative">
                <ServiceIcon icon={s.icon} size="lg" floating />
              </div>
              <div className="relative">
                <p className="font-mono text-xs text-subtle">0{i + 1}</p>
                <h2 id={`${s.id}-title`} className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted">{s.description}</p>
                <p className="mt-4 text-sm text-fg/80">
                  <span className="font-semibold text-electric-soft">Ideal for: </span>
                  {s.idealFor}
                </p>
                {s.note ? (
                  <p className="mt-4 flex gap-2 rounded-xl border border-line bg-white/[0.03] p-3 text-sm text-muted">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-electric-soft" aria-hidden="true" />
                    {s.note}
                  </p>
                ) : null}
                <BookingButton
                  service={s.id}
                  className="mt-7 inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-electric to-violet px-6 font-semibold text-white shadow-[0_12px_30px_-12px_rgb(79_140_255/0.7)] transition hover:brightness-110"
                >
                  Discuss This Service
                </BookingButton>
              </div>
              <div className="relative rounded-2xl border border-line bg-ink-950/50 p-5 sm:p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-electric-soft">Typical deliverables</h3>
                <ul className="mt-4 space-y-3">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-[0.95rem]">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan/15">
                        <Check className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <ConsultationCTA
        title="Not sure which service fits?"
        text="Book a free consultation and tell us what you're trying to achieve. We'll suggest a practical approach for your business."
      />
    </>
  );
}
