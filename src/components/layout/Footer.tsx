import Link from "next/link";
import { Clock, Mail, MapPin } from "lucide-react";
import { navLinks, services, siteConfig } from "@/config/site";
import { asset } from "@/lib/asset";
import { ChatIcon } from "@/components/ui/ChatIcon";
import { ConfigText, PlaceholderTag } from "@/components/ui/Placeholder";

export function Footer() {
  const { contact, businessHours } = siteConfig;
  const socials = siteConfig.social.filter((s) => s.href);
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] mt-24 border-t border-line bg-ink-950 pb-28 sm:pb-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/60 to-transparent" aria-hidden="true" />
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-12 px-5 pt-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-4">
          {/* Official stacked logo from the brand pack (public/brand) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/brand/logo-white.svg")} alt={siteConfig.name} width={180} height={138} className="h-auto w-44" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            {siteConfig.tagline} Business website development, responsive web design and practical IT services.
          </p>
          {socials.length ? (
            <ul className="mt-6 flex flex-wrap gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-muted hover:text-fg"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Pages</h2>
          <ul className="mt-4 space-y-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-10 items-center text-sm text-muted hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="inline-flex min-h-10 items-center text-sm text-muted hover:text-fg">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Services</h2>
          <ul className="mt-4 space-y-1">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/contact?service=${s.id}`}
                  className="inline-flex min-h-10 items-center text-sm text-muted hover:text-fg"
                >
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex gap-2.5">
              <ChatIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
              <span>
                <span className="sr-only">WhatsApp: </span>
                <ConfigText item={contact.whatsappDisplay} />
              </span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-electric-soft" aria-hidden="true" />
              <span>
                <span className="sr-only">Email: </span>
                {contact.email.verified ? (
                  <a href={`mailto:${contact.email.value}`} className="break-all hover:text-fg">
                    {contact.email.value}
                  </a>
                ) : (
                  <ConfigText item={contact.email} />
                )}
              </span>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-soft" aria-hidden="true" />
              <span>
                <span className="sr-only">Location: </span>
                <ConfigText item={contact.location} />
              </span>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-electric-soft" aria-hidden="true" />
              <span>
                {businessHours.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
                <span className="block text-xs text-subtle">
                  {contact.timezone.replace(/_/g, " ")} time
                  {!businessHours.verified ? <PlaceholderTag /> : null}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-3 border-t border-line px-5 pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <p>{siteConfig.tagline}</p>
      </div>
    </footer>
  );
}
