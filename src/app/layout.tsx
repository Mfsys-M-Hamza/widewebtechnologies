import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Sora } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { ogImage } from "@/lib/seo";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["300", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl.value),
  title: {
    default: `${siteConfig.name} — Business Website Development & IT Services`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#05070f",
  colorScheme: "dark",
};

/** Business structured data — includes only details marked as verified in the config. */
function organizationJsonLd() {
  const { contact, siteUrl, businessHours } = siteConfig;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
  };
  if (siteUrl.verified) {
    data.url = siteUrl.value;
    data.logo = `${siteUrl.value.replace(/\/$/, "")}/brand/icon-dark.png`;
  }
  if (contact.email.verified) data.email = contact.email.value;
  if (contact.whatsapp.verified) data.telephone = contact.whatsapp.value;
  if (contact.location.verified) {
    const [locality, country] = contact.location.value.split(",").map((s) => s.trim());
    data.address = { "@type": "PostalAddress", addressLocality: locality, addressCountry: country ?? locality };
    data.areaServed = locality;
  }
  if (businessHours.verified) data.openingHours = businessHours.schema;
  const sameAs = siteConfig.social.map((s) => s.href).filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;
  return data;
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${poppins.variable} antialiased`}>
      <body className="site-bg flex min-h-dvh flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()).replace(/</g, "\\u003c") }}
        />
        <Providers>
          <Navbar />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
