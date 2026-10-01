/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WIDE WEB TECHNOLOGIES — SITE CONFIGURATION
 *  Edit this file to update company details, services and showcase entries.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Contact fields use `{ value, verified }`.
 *   - `verified: false` marks a PLACEHOLDER. The site shows a small
 *     "placeholder" tag beside it and leaves it out of search-engine
 *     structured data, so it is never presented as real contact information.
 *   - When you replace a value with your real details, set `verified: true`.
 */

export type ConfigValue = { value: string; verified: boolean };

export type Service = {
  /** Used in URLs (/contact?service=landing-pages) and the booking form. */
  id: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  deliverables: string[];
  idealFor: string;
  /** Name of an icon in src/components/ui/ServiceIcon.tsx */
  icon: "business" | "landing" | "responsive" | "seo" | "qa-web" | "qa-mobile" | "maintenance";
  /** Optional honest caveat shown with the service. */
  note?: string;
};

export type ShowcaseProject = {
  id: string;
  title: string;
  category: string;
  /** City or area shown on the card (optional). */
  location?: string;
  /** Live website address. */
  url: string;
  summary: string;
  highlights: string[];
  /** Screenshots in /public/projects (desktop 1440x900, mobile 390x844 at 2x). */
  images: { desktop: string; mobile: string };
  /** Brand accent used for the card glow. */
  accent: string;
};

export const siteConfig = {
  name: "Wide Web Technologies",
  shortName: "Wide Web",
  tagline: "Smart Websites. Strong Digital Presence.",
  description:
    "Wide Web Technologies offers business website development, responsive web design and practical IT services that help businesses build a professional, trustworthy online presence.",

  /** Public site URL — used for SEO, sitemap and social sharing. Can be overridden with NEXT_PUBLIC_SITE_URL. */
  siteUrl: {
    value: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com",
    verified: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  } satisfies ConfigValue,

  contact: {
    /** International format, digits only or with "+" — e.g. "+923001234567". Used for every wa.me link. */
    whatsapp: { value: "+923040500121", verified: true } satisfies ConfigValue,
    /** How the WhatsApp number is displayed to visitors. */
    whatsappDisplay: { value: "+92 304 0500121", verified: true } satisfies ConfigValue,
    email: { value: "hello@example.com", verified: false } satisfies ConfigValue,
    /** Keep general (city / country) or leave as a placeholder. Do not add an address you don't want published. */
    location: { value: "Islamabad, Pakistan", verified: true } satisfies ConfigValue,
    /** Shown in the footer and contact page; also used as the default timezone in the booking form. */
    timezone: "Asia/Karachi",
  },

  /** Business hours (in the timezone above). `schema` is the machine-readable version used for search engines. */
  businessHours: {
    verified: true,
    hours: [{ days: "Every day", time: "9:00 AM – 1:00 AM" }],
    schema: "Mo-Su 09:00-01:00",
  },

  /** Only links with a non-empty href are displayed. */
  social: [
    { label: "LinkedIn", href: "" },
    { label: "Facebook", href: "" },
    { label: "Instagram", href: "" },
  ],

  /** Default text for the floating WhatsApp button. */
  quickChatMessage:
    "Hello Wide Web Technologies, I would like to know more about your website services.",
} as const;

export const services: Service[] = [
  {
    id: "business-websites",
    title: "Business & Informational Websites",
    shortTitle: "Business Websites",
    icon: "business",
    summary:
      "A professional website that explains who you are, what you offer and how customers can reach you.",
    description:
      "We plan, design and build a clear, well-structured website for your business — the kind of site that helps visitors quickly understand your services and feel confident getting in touch.",
    deliverables: [
      "Site structure and page planning",
      "Custom visual design aligned with your brand",
      "Core pages such as Home, About, Services and Contact",
      "Contact form or WhatsApp enquiry buttons",
      "Responsive layout for phones, tablets and desktops",
      "Basic on-page SEO foundations",
    ],
    idealFor: "New businesses, service providers and companies replacing a basic or outdated site.",
  },
  {
    id: "landing-pages",
    title: "Landing Pages",
    shortTitle: "Landing Pages",
    icon: "landing",
    summary:
      "Focused single pages for a product, offer, event or campaign — built around one clear action.",
    description:
      "A landing page keeps attention on a single goal, such as an enquiry, sign-up or booking. We structure the message, design the page and make the next step obvious.",
    deliverables: [
      "Message and section planning",
      "Conversion-focused page design",
      "Clear call-to-action buttons or forms",
      "WhatsApp or email enquiry integration",
      "Fast, responsive build",
      "Basic tracking setup on request",
    ],
    idealFor: "Promotions, product launches, events and advertising campaigns.",
  },
  {
    id: "responsive-design",
    title: "Mobile-Responsive Web Design",
    shortTitle: "Responsive Design",
    icon: "responsive",
    summary:
      "Layouts that adapt cleanly to every screen, so your site is easy to use on phones as well as desktops.",
    description:
      "Many visitors arrive on a phone. We design and adjust layouts, typography, images and buttons so your website stays readable and easy to use on every screen size.",
    deliverables: [
      "Mobile, tablet and desktop layouts",
      "Touch-friendly buttons and navigation",
      "Readable typography at every size",
      "Optimised images for smaller screens",
      "Cross-browser checks",
      "Fixes for layout issues on existing sites",
    ],
    idealFor: "New projects, and existing sites that are difficult to use on mobile devices.",
  },
  {
    id: "on-page-seo",
    title: "Basic On-Page SEO Setup",
    shortTitle: "On-Page SEO",
    icon: "seo",
    summary:
      "Set up the technical and on-page basics that help search engines understand your website.",
    description:
      "We put the essential on-page foundations in place so search engines can read and present your pages properly. This supports your visibility, alongside your content and other ongoing efforts.",
    deliverables: [
      "Page titles and meta descriptions",
      "Clear heading structure",
      "Descriptive image alt text",
      "XML sitemap and robots configuration",
      "Social sharing previews",
      "Search Console setup guidance",
    ],
    idealFor: "New websites and existing sites missing the on-page basics.",
    note: "Search rankings depend on many factors outside any agency's control, so we never guarantee specific positions or traffic.",
  },
  {
    id: "website-qa-testing",
    title: "Website QA & Testing",
    shortTitle: "Website QA",
    icon: "qa-web",
    summary:
      "Careful testing of your website before and after launch, so problems are found and fixed before your visitors notice them.",
    description:
      "We test your website the way your customers use it — across browsers, devices and screen sizes — and report clear, reproducible issues so they can be fixed quickly. Useful before launch, after updates, or as a regular check-up.",
    deliverables: [
      "Functional testing of pages, forms and links",
      "Cross-browser checks (Chrome, Safari, Firefox, Edge)",
      "Responsive testing on phones, tablets and desktops",
      "Basic usability and accessibility review",
      "Page speed and performance checks",
      "Clear bug reports with screenshots and steps to reproduce",
    ],
    idealFor: "New websites before launch, sites after major changes, and teams without a dedicated tester.",
    note: "Testing greatly reduces risk, but no testing process can guarantee software is completely free of defects.",
  },
  {
    id: "mobile-app-qa-testing",
    title: "Mobile App QA & Testing",
    shortTitle: "Mobile App QA",
    icon: "qa-mobile",
    summary:
      "Testing for Android and iOS apps, so features work reliably before your users run into problems.",
    description:
      "We test your mobile app across different devices, screen sizes and operating system versions — checking features, user flows and edge cases — and deliver organised bug reports your developers can act on.",
    deliverables: [
      "Functional testing of app features and user flows",
      "Testing on Android and iOS",
      "Checks across screen sizes and OS versions",
      "UI and usability review",
      "Regression testing after updates",
      "Detailed bug reports with screenshots or screen recordings",
    ],
    idealFor: "Apps preparing for release, new app versions, and startups that need independent testing.",
    note: "Testing greatly reduces risk, but no testing process can guarantee software is completely free of defects.",
  },
  {
    id: "maintenance-support",
    title: "Website Maintenance & Support",
    shortTitle: "Maintenance",
    icon: "maintenance",
    summary:
      "Ongoing help to keep your website updated, working smoothly and ready for changes.",
    description:
      "After launch, your website still needs care. We help with content updates, fixes, small improvements and routine checks so your site stays current and dependable.",
    deliverables: [
      "Content and image updates",
      "Bug fixes and small improvements",
      "Routine checks for broken links and forms",
      "Software and plugin updates where applicable",
      "Backup guidance",
      "Support by WhatsApp or email",
    ],
    idealFor: "Businesses that want a reliable partner after launch instead of handling updates themselves.",
  },
];

/** Extra booking-form option for visitors who aren't sure yet. */
export const generalConsultation = {
  id: "general-consultation",
  title: "Not sure yet — general consultation",
} as const;

/**
 * Project showcase — websites developed by Wide Web Technologies.
 * Screenshots live in /public/projects. To add a project, add an entry here
 * with its live URL and two screenshots (desktop + mobile).
 */
export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "roop-beauty-salon",
    title: "Roop Beauty Salon",
    category: "Business Website",
    location: "Faisalabad",
    url: "https://mfsys-m-hamza.github.io/beauty-salon-website/",
    summary:
      "A warm, elegant website for a beauty salon, presenting hair, bridal makeup, facial, manicure and spa services with clear prices and easy WhatsApp appointment booking.",
    highlights: ["Services with clear pricing", "Bridal gallery and client reviews", "WhatsApp appointment booking"],
    images: { desktop: "/projects/salon-desktop.jpg", mobile: "/projects/salon-mobile.jpg" },
    accent: "#c8963e",
  },
  {
    id: "auto-garage-one",
    title: "Auto Garage One",
    category: "Business Website",
    location: "B-17, Islamabad",
    url: "https://autogarageone.autos/",
    summary:
      "A bold website for a car repair workshop, covering repair and advanced vehicle services, special offers, a gallery and a blog, with booking, WhatsApp and call buttons throughout.",
    highlights: ["Service and special-offer pages", "Gallery and blog", "Book, WhatsApp and call actions"],
    images: { desktop: "/projects/garage-desktop.jpg", mobile: "/projects/garage-mobile.jpg" },
    accent: "#3ddc4a",
  },
  {
    id: "binte-hawa-closet",
    title: "Binte Hawa Closet",
    category: "Online Store",
    location: "Pakistan",
    url: "https://handmadecloset-theta-rust.vercel.app/",
    summary:
      "An online store for handmade beaded bags, crochet, jewellery and keychains, with category browsing, custom order requests, and ordering by Cash on Delivery or WhatsApp.",
    highlights: ["Shop by category", "Custom order requests", "Cash on Delivery and WhatsApp ordering"],
    images: { desktop: "/projects/closet-desktop.jpg", mobile: "/projects/closet-mobile.jpg" },
    accent: "#d9a5b3",
  },
  {
    id: "dental-valley",
    title: "Dental Valley",
    category: "Healthcare Website",
    location: "Islamabad",
    url: "https://mfsys-m-hamza.github.io/DentalClinic/services/dental-fillings/",
    summary:
      "A clean, reassuring website for a dental clinic, with detailed treatment pages, team and blog sections, and appointment and WhatsApp enquiry buttons on every page.",
    highlights: ["Detailed treatment pages", "Team and blog sections", "Appointment and WhatsApp enquiries"],
    images: { desktop: "/projects/dental-desktop.jpg", mobile: "/projects/dental-mobile.jpg" },
    accent: "#14a37f",
  },
];

export const faqs = [
  {
    q: "How does the consultation work?",
    a: "Fill in the booking form with your details and preferred time. Your request opens in WhatsApp so you can review and send it. Our team then replies to confirm a suitable time — the appointment is not booked until we confirm it.",
  },
  {
    q: "How long does it take to build a website?",
    a: "It depends on the number of pages, features and how quickly content is ready. After the consultation we share a realistic timeline for your specific project.",
  },
  {
    q: "How much does a website cost?",
    a: "Pricing depends on scope. We discuss your goals first, then provide a clear quote so you know exactly what is included before any work begins.",
  },
  {
    q: "Will my website work on mobile phones?",
    a: "Yes. Every website we build is designed to work on phones, tablets and desktops, and we check layouts on different screen sizes before launch.",
  },
  {
    q: "Can you test a website or app we already have?",
    a: "Yes. Our QA and testing services cover existing websites as well as Android and iOS apps. We test features, devices and screen sizes, and give you clear bug reports your developers can act on.",
  },
  {
    q: "Do you guarantee top Google rankings?",
    a: "No one can honestly guarantee rankings. We set up solid on-page SEO foundations that help search engines understand your site, and explain what else can support your visibility over time.",
  },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
