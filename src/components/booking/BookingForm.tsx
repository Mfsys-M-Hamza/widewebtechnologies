"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, CircleAlert, Copy, Hourglass, Lock } from "lucide-react";
import { useCallback, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { generalConsultation, services, siteConfig } from "@/config/site";
import {
  COMMON_TIMEZONES,
  allTimeZones,
  isValidTimeZone,
  nowTimeInTimeZone,
  todayInTimeZone,
} from "@/lib/datetime";
import { buildAppointmentMessage, whatsappLink } from "@/lib/whatsapp";
import { ChatIcon } from "@/components/ui/ChatIcon";

type Field = "name" | "business" | "whatsapp" | "email" | "service" | "date" | "time" | "timezone" | "details";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const serviceOptions = [
  ...services.map((s) => ({ id: s.id, title: s.title })),
  { id: generalConsultation.id, title: generalConsultation.title },
];

const DETAILS_MIN = 10;
const DETAILS_MAX = 1000;
const FIELD_ORDER: Field[] = ["name", "business", "whatsapp", "email", "service", "date", "time", "timezone", "details"];

// True only in the browser after hydration — avoids server/client mismatches for "today" and timezone lists.
const subscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function validateBooking(v: Values, now = new Date()): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";

  const digits = v.whatsapp.replace(/\D/g, "");
  if (!v.whatsapp.trim()) e.whatsapp = "Please enter your WhatsApp number.";
  else if (!/^\+?[\d\s\-().]+$/.test(v.whatsapp.trim()) || digits.length < 8 || digits.length > 15)
    e.whatsapp = "Enter a valid number with country code, e.g. +92 300 1234567.";

  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = "Please enter a valid email address, or leave this blank.";

  if (!v.service) e.service = "Please choose the service you're interested in.";

  if (!v.timezone.trim()) e.timezone = "Please choose your timezone.";
  else if (!isValidTimeZone(v.timezone)) e.timezone = "Please choose a timezone from the list.";

  const tz = isValidTimeZone(v.timezone) ? v.timezone : siteConfig.contact.timezone;
  const today = todayInTimeZone(tz, now);
  if (!v.date) e.date = "Please choose a preferred date.";
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date)) e.date = "Please choose a valid date.";
  else if (v.date < today) e.date = "This date has passed. Please choose today or a future date.";

  if (!v.time) e.time = "Please choose a preferred time.";
  else if (!e.date && v.date === today && v.time <= nowTimeInTimeZone(tz, now))
    e.time = `This time has already passed today in ${tz}. Please choose a later time.`;

  const len = v.details.trim().length;
  if (!len) e.details = "Please describe your project briefly.";
  else if (len < DETAILS_MIN) e.details = `Please add a little more detail (at least ${DETAILS_MIN} characters).`;
  else if (len > DETAILS_MAX) e.details = `Please keep this under ${DETAILS_MAX} characters.`;

  return e;
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="flex items-baseline justify-between text-sm font-medium text-fg">
      <span>
        {children}
        {!optional ? (
          <span className="ml-0.5 text-electric-soft" aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
      {optional ? <span className="text-xs font-normal text-subtle">Optional</span> : null}
    </label>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm text-danger">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {error}
    </p>
  );
}

type Prepared ={ message: string; url: string; opened: boolean };

export function BookingForm({ initialService }: { initialService?: string }) {
  const uid = useId();
  const fid = (f: string) => `${uid}-${f}`;
  const isClient = useIsClient();

  const [values, setValues] = useState<Values>(() => ({
    name: "",
    business: "",
    whatsapp: "",
    email: "",
    service: serviceOptions.some((o) => o.id === initialService) ? (initialService as string) : "",
    date: "",
    time: "",
    timezone: siteConfig.contact.timezone,
    details: "",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [announce, setAnnounce] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const focusOnMount = useCallback((el: HTMLHeadingElement | null) => el?.focus({ preventScroll: true }), []);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const timezones = useMemo(() => {
    const list = isClient ? allTimeZones() : COMMON_TIMEZONES;
    return list.includes(values.timezone) || !values.timezone ? list : [values.timezone, ...list];
  }, [isClient, values.timezone]);

  const tzForMin = isValidTimeZone(values.timezone) ? values.timezone : siteConfig.contact.timezone;
  const minDate = isClient ? todayInTimeZone(tzForMin) : undefined;

  function update(field: Field, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validateBooking(next));
  }

  function blur(field: Field) {
    const all = validateBooking(values);
    // Only surface errors for touched fields before the first submit.
    if (submitted || values[field]) setErrors((prev) => ({ ...prev, [field]: all[field] }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const found = validateBooking(values);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((f) => found[f]);
    if (firstInvalid) {
      const count = Object.keys(found).length;
      setAnnounce(`Please correct ${count} ${count === 1 ? "field" : "fields"} before continuing.`);
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fid(firstInvalid))}`)?.focus();
      return;
    }

    const serviceTitle = serviceOptions.find((o) => o.id === values.service)?.title ?? values.service;
    const message = buildAppointmentMessage({ ...values, service: serviceTitle });
    const url = whatsappLink(message);
    // Not passing "noopener" here: it would make window.open return null and hide whether it opened.
    const win = window.open(url, "_blank");
    if (win) {
      try {
        win.opener = null;
      } catch {
        /* ignore */
      }
    }
    setPrepared({ message, url, opened: Boolean(win) });
    setCopyState("idle");
    setAnnounce("");
    // Show the result from its top (status badge first); focus moves to its heading once it mounts.
    const scroller = formRef.current?.closest<HTMLElement>("[data-scroll-container]");
    if (scroller) scroller.scrollTo({ top: 0 });
    else formRef.current?.closest("section")?.scrollIntoView({ block: "start" });
  }

  async function copyMessage() {
    if (!prepared) return;
    try {
      await navigator.clipboard.writeText(prepared.message);
      setCopyState("copied");
    } catch {
      const ta = messageRef.current;
      if (ta) {
        ta.focus();
        ta.select();
        const ok = document.execCommand?.("copy");
        setCopyState(ok ? "copied" : "failed");
      } else setCopyState("failed");
    }
  }

  const describedBy = (f: Field, hint?: boolean) =>
    [hint ? fid(`${f}-hint`) : null, errors[f] ? fid(`${f}-error`) : null].filter(Boolean).join(" ") || undefined;

  const inputClass = (f: Field) =>
    `mt-2 block w-full rounded-xl border bg-ink-950/60 px-4 py-3 text-[0.95rem] text-fg placeholder:text-subtle shadow-[inset_0_1px_0_rgb(255_255_255/0.03)] transition focus:border-electric focus:bg-ink-950 focus:outline-none focus-visible:outline-2 focus-visible:outline-electric-soft ${
      errors[f] ? "border-danger/70" : "border-line hover:border-ink-600"
    }`;

  return (
    <div>
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
      <AnimatePresence mode="wait" initial={false}>
        {prepared ? (
          <motion.section
            key="prepared"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            aria-labelledby={fid("result-title")}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-teal/15 text-brand-teal ring-1 ring-brand-teal/30">
                <ChatIcon className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                <Hourglass className="h-3.5 w-3.5" aria-hidden="true" /> Request pending — not yet confirmed
              </span>
            </div>
            <h3
              id={fid("result-title")}
              ref={focusOnMount}
              tabIndex={-1}
              className="mt-5 font-display text-2xl font-semibold tracking-tight focus:outline-none"
            >
              Your request is ready to send on WhatsApp
            </h3>
            <p className="mt-2 text-muted">
              {prepared.opened
                ? "We opened WhatsApp in a new tab with your message filled in. Please review it and tap Send."
                : "WhatsApp didn't open automatically — your browser may have blocked the new tab. Use the button below, or copy the message and send it to us on WhatsApp."}
            </p>

            <ol className="mt-6 space-y-3 rounded-2xl border border-line bg-ink-950/50 p-5 text-sm">
              {[
                "Review the prepared message in WhatsApp and tap Send.",
                "Our team will reply to confirm your preferred time or suggest an alternative.",
                "Your consultation is booked only once we confirm it in WhatsApp.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-electric/15 text-xs font-semibold text-electric-soft">
                    {i + 1}
                  </span>
                  <span className="text-fg/90">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={prepared.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue px-5 font-semibold text-ink-950 transition hover:brightness-110"
              >
                <ChatIcon className="h-5 w-5" />
                {prepared.opened ? "Open WhatsApp again" : "Open WhatsApp"}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <button
                type="button"
                onClick={copyMessage}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-white/5 px-5 font-semibold text-fg transition hover:bg-white/10"
              >
                {copyState === "copied" ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
                {copyState === "copied" ? "Message copied" : "Copy message"}
              </button>
            </div>
            <p className="mt-2 min-h-5 text-sm" role="status" aria-live="polite">
              {copyState === "copied" && <span className="text-success">Copied. Paste it into a WhatsApp chat with us.</span>}
              {copyState === "failed" && (
                <span className="text-amber-200">Couldn&apos;t copy automatically — select the text below and copy it.</span>
              )}
            </p>

            <details className="group mt-4 rounded-2xl border border-line bg-ink-950/40" open={!prepared.opened}>
              <summary className="cursor-pointer list-none rounded-2xl px-5 py-4 text-sm font-semibold text-fg">
                <span className="inline-block transition group-open:rotate-90" aria-hidden="true">
                  ›
                </span>{" "}
                View prepared message
              </summary>
              <div className="px-5 pb-5">
                <label htmlFor={fid("message")} className="sr-only">
                  Prepared WhatsApp message
                </label>
                <textarea
                  id={fid("message")}
                  ref={messageRef}
                  readOnly
                  value={prepared.message}
                  rows={14}
                  className="w-full resize-none rounded-xl border border-line bg-ink-950 p-4 font-mono text-[0.8rem] leading-relaxed text-fg/90"
                />
                <p className="mt-2 text-xs text-subtle">
                  Send to WhatsApp: <span className="text-muted">{siteConfig.contact.whatsappDisplay.value}</span>
                  {!siteConfig.contact.whatsappDisplay.verified ? " (placeholder number)" : null}
                </p>
              </div>
            </details>

            <button
              type="button"
              onClick={() => setPrepared(null)}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-electric-soft hover:text-fg"
            >
              <ArrowLeft className="h-4 w-4" /> Edit details
            </button>
          </motion.section>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            aria-describedby={fid("form-note")}
          >
            <p id={fid("form-note")} className="mb-6 text-sm text-muted">
              Fields marked <span className="text-electric-soft">*</span> are required.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor={fid("name")}>Full name</FieldLabel>
                <input
                  id={fid("name")}
                  name="name"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => blur("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy("name")}
                  className={inputClass("name")}
                />
                <FieldError id={fid("name-error")} error={errors.name} />
              </div>

              <div>
                <FieldLabel htmlFor={fid("business")} optional>
                  Business or company
                </FieldLabel>
                <input
                  id={fid("business")}
                  name="business"
                  autoComplete="organization"
                  value={values.business}
                  onChange={(e) => update("business", e.target.value)}
                  className={inputClass("business")}
                />
              </div>

              <div>
                <FieldLabel htmlFor={fid("whatsapp")}>WhatsApp number</FieldLabel>
                <input
                  id={fid("whatsapp")}
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={values.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                  onBlur={() => blur("whatsapp")}
                  aria-invalid={Boolean(errors.whatsapp)}
                  aria-describedby={describedBy("whatsapp", true)}
                  className={inputClass("whatsapp")}
                />
                <p id={fid("whatsapp-hint")} className="mt-1.5 text-xs text-subtle">
                  Include your country code.
                </p>
                <FieldError id={fid("whatsapp-error")} error={errors.whatsapp} />
              </div>

              <div>
                <FieldLabel htmlFor={fid("email")} optional>
                  Email
                </FieldLabel>
                <input
                  id={fid("email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => blur("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                  className={inputClass("email")}
                />
                <FieldError id={fid("email-error")} error={errors.email} />
              </div>

              <div>
                <FieldLabel htmlFor={fid("service")}>Service interested in</FieldLabel>
                <select
                  id={fid("service")}
                  name="service"
                  required
                  value={values.service}
                  onChange={(e) => update("service", e.target.value)}
                  onBlur={() => blur("service")}
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={describedBy("service")}
                  className={`${inputClass("service")} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23a6b0cc%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10`}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {serviceOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title}
                    </option>
                  ))}
                </select>
                <FieldError id={fid("service-error")} error={errors.service} />
              </div>

              <div>
                <FieldLabel htmlFor={fid("date")}>Preferred date</FieldLabel>
                <input
                  id={fid("date")}
                  name="date"
                  type="date"
                  required
                  min={minDate}
                  value={values.date}
                  onChange={(e) => update("date", e.target.value)}
                  onBlur={() => blur("date")}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={describedBy("date")}
                  className={inputClass("date")}
                />
                <FieldError id={fid("date-error")} error={errors.date} />
              </div>

              <div>
                <FieldLabel htmlFor={fid("time")}>Preferred time</FieldLabel>
                <input
                  id={fid("time")}
                  name="time"
                  type="time"
                  step={900}
                  required
                  value={values.time}
                  onChange={(e) => update("time", e.target.value)}
                  onBlur={() => blur("time")}
                  aria-invalid={Boolean(errors.time)}
                  aria-describedby={describedBy("time", true)}
                  className={inputClass("time")}
                />
                <p id={fid("time-hint")} className="mt-1.5 text-xs text-subtle">
                  Usual hours: {siteConfig.businessHours.hours[0].days}, {siteConfig.businessHours.hours[0].time}.
                </p>
                <FieldError id={fid("time-error")} error={errors.time} />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel htmlFor={fid("timezone")}>Your timezone</FieldLabel>
                <select
                  id={fid("timezone")}
                  name="timezone"
                  required
                  value={values.timezone}
                  onChange={(e) => update("timezone", e.target.value)}
                  onBlur={() => blur("timezone")}
                  aria-invalid={Boolean(errors.timezone)}
                  aria-describedby={describedBy("timezone", true)}
                  className={`${inputClass("timezone")} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23a6b0cc%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10`}
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <p id={fid("timezone-hint")} className="mt-1.5 text-xs text-subtle">
                  Defaults to {siteConfig.contact.timezone.replace(/_/g, " ")} (Pakistan Standard Time). Change it if you&apos;re elsewhere.
                </p>
                <FieldError id={fid("timezone-error")} error={errors.timezone} />
              </div>

              <div className="sm:col-span-2">
                <FieldLabel htmlFor={fid("details")}>Brief project requirements</FieldLabel>
                <textarea
                  id={fid("details")}
                  name="details"
                  required
                  rows={4}
                  maxLength={DETAILS_MAX + 200}
                  placeholder="e.g. A 5-page website for my clinic with a WhatsApp booking button."
                  value={values.details}
                  onChange={(e) => update("details", e.target.value)}
                  onBlur={() => blur("details")}
                  aria-invalid={Boolean(errors.details)}
                  aria-describedby={describedBy("details", true)}
                  className={`${inputClass("details")} resize-y`}
                />
                <p id={fid("details-hint")} className="mt-1.5 flex justify-between text-xs text-subtle">
                  <span>What you need, any pages or features, and your goals.</span>
                  <span aria-hidden="true" className={values.details.trim().length > DETAILS_MAX ? "text-danger" : ""}>
                    {values.details.trim().length}/{DETAILS_MAX}
                  </span>
                </p>
                <FieldError id={fid("details-error")} error={errors.details} />
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-line bg-ink-950/50 p-4 text-sm text-muted">
              <p className="flex gap-2.5">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-electric-soft" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-fg">Privacy:</strong> your details are not stored on this
                  website. They are placed into a WhatsApp message on your device, and are only shared when you
                  choose to send it — WhatsApp&apos;s own terms then apply.{" "}
                  <Link href="/privacy" className="font-medium text-electric-soft underline underline-offset-4 hover:text-fg">
                    Privacy notice
                  </Link>
                </span>
              </p>
              <p className="mt-3 flex gap-2.5">
                <Hourglass className="mt-0.5 h-4 w-4 shrink-0 text-electric-soft" aria-hidden="true" />
                <span>This sends an appointment <em>request</em>. Our team will confirm the time with you on WhatsApp.</span>
              </p>
            </div>

            <button
              type="submit"
              className="group mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue px-6 text-base font-semibold text-ink-950 shadow-[0_12px_40px_-12px_rgb(46_230_214/0.6)] transition hover:brightness-110 active:scale-[0.99]"
            >
              <ChatIcon className="h-5 w-5 transition group-hover:-rotate-6" />
              Request Appointment on WhatsApp
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
