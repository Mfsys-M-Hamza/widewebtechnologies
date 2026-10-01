import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Wide Web Technologies handles the details you enter in the consultation request form.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy notice"
        intro="A short, plain-language explanation of what happens to the information you enter on this website."
      />
      <div className="mx-auto mt-14 max-w-3xl space-y-10 px-5 leading-relaxed text-muted sm:px-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg">
        <section>
          <h2>What the booking form collects</h2>
          <p className="mt-3">
            The consultation form asks for your name, WhatsApp number, the service you&apos;re interested in, your
            preferred date, time and timezone, and a short description of your project. Your business name and email
            address are optional.
          </p>
        </section>
        <section>
          <h2>How it is used</h2>
          <p className="mt-3">
            When you select “Request Appointment on WhatsApp”, your browser creates a WhatsApp message containing
            these details and opens WhatsApp. <strong className="text-fg">This website does not store, save or send your form
            details anywhere.</strong> Nothing is shared with us until you choose to send the message in WhatsApp.
          </p>
        </section>
        <section>
          <h2>Once you send the message</h2>
          <p className="mt-3">
            Your message is delivered through WhatsApp, which is operated by WhatsApp LLC / Meta and governed by
            WhatsApp&apos;s own terms and privacy policy. We use the details you send only to respond to your request
            and to discuss your project. If you&apos;d like us to delete a conversation, ask us on WhatsApp
            {siteConfig.contact.email.verified ? ` or email ${siteConfig.contact.email.value}` : ""}.
          </p>
        </section>
        <section>
          <h2>Cookies and analytics</h2>
          <p className="mt-3">
            This website does not use advertising cookies or analytics tracking. If that changes, this notice will be
            updated first.
          </p>
        </section>
        <p className="border-t border-line pt-6 text-sm">
          Questions? <Link href="/contact" className="text-electric-soft underline underline-offset-4 hover:text-fg">Contact us</Link>.
        </p>
      </div>
    </>
  );
}
