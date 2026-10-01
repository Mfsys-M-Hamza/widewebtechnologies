import { Hourglass } from "lucide-react";
import { BookingButton } from "@/components/booking/BookingProvider";
import { ChatIcon } from "@/components/ui/ChatIcon";
import { Reveal } from "@/components/ui/Reveal";

/** Closing call-to-action used across pages. */
export function ConsultationCTA({
  title = "Ready to build a website your customers will trust?",
  text = "Tell us about your business and preferred time. We'll prepare a WhatsApp message for you to send, then reply to confirm your free consultation.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
      <Reveal>
        <div className="edge relative overflow-hidden rounded-[2rem] bg-ink-850 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 grid-texture opacity-80" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-electric/30 blur-3xl motion-float-a" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-violet/30 blur-3xl motion-float-b" aria-hidden="true" />
          <svg className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-25 motion-spin-slow" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="96" fill="none" stroke="#4f8cff" strokeWidth=".4" strokeDasharray="1 5" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#9b6bff" strokeWidth=".4" />
            <circle cx="196" cy="100" r="2" fill="#38d5f5" />
            <circle cx="30" cy="100" r="1.6" fill="#9b6bff" />
          </svg>

          <div className="relative mx-auto max-w-2xl">
            <h2 id="cta-title" className="font-display text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.08]">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{text}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <BookingButton className="inline-flex min-h-14 items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue px-7 text-base font-semibold text-ink-950 shadow-[0_14px_40px_-12px_rgb(46_230_214/0.6)] transition hover:brightness-110">
                <ChatIcon className="h-5 w-5" />
                Book a Free Consultation
              </BookingButton>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-subtle">
              <Hourglass className="h-4 w-4" aria-hidden="true" />
              Appointment requests are confirmed by our team on WhatsApp.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
