import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/booking/ContactForm";
import { BookingForm } from "@/components/booking/BookingForm";
import { ChatIcon } from "@/components/ui/ChatIcon";
import { ConfigText, PlaceholderTag } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact & Book a Consultation",
  description:
    "Request a free website consultation with Wide Web Technologies on WhatsApp. Choose a service, your preferred date, time and timezone, and our team will confirm.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact & Book a Consultation | Wide Web Technologies", url: "/contact" },
};

export default function ContactPage() {
  const { contact, businessHours } = siteConfig;
  return (
    <>
      <PageHero
        eyebrow="Contact & booking"
        title={
          <>
            Book a free <span className="text-gradient">consultation</span>
          </>
        }
        intro="Tell us a little about your business and when you'd like to talk. Your request opens in WhatsApp so you can review and send it — our team then confirms your appointment."
      />

      <div className="mx-auto mt-14 grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.35fr_0.65fr]">
        <Reveal>
          <section aria-labelledby="form-title" className="edge rounded-[2rem] bg-ink-900/85 p-5 sm:p-9">
            <h2 id="form-title" className="font-display text-2xl font-semibold tracking-tight">
              Appointment request
            </h2>
            <p className="mt-2 text-sm text-muted">
              Takes about a minute. We&apos;ll reply on WhatsApp to confirm a time that works.
            </p>
            <div className="mt-7">
              <Suspense fallback={<BookingForm />}>
                <ContactForm />
              </Suspense>
            </div>
          </section>
        </Reveal>

        <aside className="space-y-5" aria-label="Contact details">
          <Reveal delay={0.06}>
            <div className="edge rounded-[1.6rem] bg-ink-900/80 p-6">
              <h2 className="font-display text-lg font-semibold">Contact details</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-teal/15 text-brand-teal">
                    <ChatIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-subtle">WhatsApp</span>
                    <span className="text-fg">
                      <ConfigText item={contact.whatsappDisplay} />
                    </span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-electric/15 text-electric-soft">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-subtle">Email</span>
                    {contact.email.verified ? (
                      <a href={`mailto:${contact.email.value}`} className="text-fg hover:text-electric-soft">
                        {contact.email.value}
                      </a>
                    ) : (
                      <span className="text-fg">
                        <ConfigText item={contact.email} />
                      </span>
                    )}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-soft">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-subtle">Location</span>
                    <span className="text-fg">
                      <ConfigText item={contact.location} />
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="edge rounded-[1.6rem] bg-ink-900/80 p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Clock className="h-5 w-5 text-electric-soft" aria-hidden="true" /> Business hours
                {!businessHours.verified ? <PlaceholderTag /> : null}
              </h2>
              <dl className="mt-4 space-y-2 text-sm">
                {businessHours.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
                    <dt className="text-muted">{h.days}</dt>
                    <dd className="text-right text-fg">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-subtle">Times shown in {contact.timezone.replace(/_/g, " ")} time.</p>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="rounded-[1.6rem] border border-line bg-white/[0.02] p-6 text-sm text-muted">
              <h2 className="font-display text-base font-semibold text-fg">How booking works</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>Fill in the form and select “Request Appointment on WhatsApp”.</li>
                <li>WhatsApp opens with your details ready — review and send.</li>
                <li>We reply to confirm the time or suggest another slot.</li>
              </ol>
              <p className="mt-3">Your appointment is only booked once we confirm it.</p>
            </div>
          </Reveal>
        </aside>
      </div>
    </>
  );
}
