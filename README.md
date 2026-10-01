# Wide Web Technologies — Website

Informational website for **Wide Web Technologies**: Home, Services, About, Contact & Book a Consultation, and a short Privacy notice. Consultation requests are sent through WhatsApp.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Motion (animations), and React Three Fiber (the 3D hero scene).

## Run it locally

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm start            # serves the built site on http://localhost:3000
```

Checks:

```bash
npx tsc --noEmit     # type check
npm run lint         # ESLint
```

## Editing company details

**Edit `src/config/site.ts`. It is the single place for business information:**

| What | Key |
| --- | --- |
| Company name, tagline, description | `siteConfig.name`, `tagline`, `description` |
| Public site URL (SEO, sitemap, social cards) | `siteConfig.siteUrl` or the `NEXT_PUBLIC_SITE_URL` env variable |
| WhatsApp number (used in every `wa.me` link) | `siteConfig.contact.whatsapp`. International format, e.g. `+923001234567` |
| WhatsApp number as displayed | `siteConfig.contact.whatsappDisplay` |
| Email, location | `siteConfig.contact.email`, `location` |
| Default booking timezone | `siteConfig.contact.timezone` (default `Asia/Karachi`) |
| Business hours | `siteConfig.businessHours` |
| Social links (only non-empty links are shown) | `siteConfig.social` |
| Floating-button chat message | `siteConfig.quickChatMessage` |
| Services (titles, descriptions, deliverables) | `services` |
| Project showcase | `showcaseProjects` |
| FAQ | `faqs` |

### Real details and placeholders

Contact values use `{ value, verified }`. Current state:

| Detail | Value | Status |
| --- | --- | --- |
| WhatsApp | +92 304 0500121 | Real |
| Location | Islamabad, Pakistan | Real |
| Business hours | Every day, 9:00 AM – 1:00 AM (Asia/Karachi) | Real |
| Email | `hello@example.com` | **Placeholder** |
| Site URL | `https://www.example.com` | **Placeholder** (set `NEXT_PUBLIC_SITE_URL`) |

While a value is unverified (`verified: false`), the site:

- shows a yellow **PLACEHOLDER** tag next to it, and
- leaves it out of the search-engine structured data (JSON-LD).

When you enter a real value, set `verified: true`.

### Showcase projects

The Home page shows four live websites from `showcaseProjects`: Roop Beauty Salon, Auto Garage One, Binte Hawa Closet and Dental Valley. Each card has a desktop and a mobile screenshot (in `public/projects/`), a preview pop-up and a "Visit live site" link.

To add a project:

1. Save two screenshots in `public/projects/`: desktop at 1440×900 and mobile at 390×844 (2× resolution).
2. Add an entry with the live `url`, the two image paths, a short summary and highlights.

When a site changes, retake its screenshots so the previews stay accurate.

### Brand assets

Files from the official logo pack are in `public/brand/`:

- `logo-animation.mp4`: the logo reveal video at the top of the Home page.
- `logo-poster.jpg`: its final frame. It shows while the video loads, and for visitors who prefer reduced motion.
- `logo-white.svg`: the stacked logo in the footer.
- `icon-dark.svg` / `icon-dark.png`: the app icon. Copies are used as the favicon (`src/app/icon.svg`) and the Apple touch icon (`src/app/apple-icon.png`).

The nav logo (`src/components/brand/Logo.tsx`) redraws the same "W" symbol in code, with the name set in Poppins.

### Page copy

The About, Home and Services copy lives in `src/app/**/page.tsx` and `src/config/site.ts`. It is deliberately general. It doesn't invent team members, history, years of experience, reviews, awards or statistics.

## How the WhatsApp booking works

1. The visitor fills in the form, either on `/contact` or in the booking panel that "Book on WhatsApp" / "Discuss This Service" buttons open.
2. The fields are validated in the browser:
   - Required fields are checked.
   - Dates in the past are rejected.
   - Times already past today, in the selected timezone, are rejected.
   - Phone and email formats are checked.
3. A readable message is built with every detail (including the timezone), URL-encoded, and opened at `https://wa.me/<number>?text=…`.
4. The visitor reviews and sends it in WhatsApp. The site shows **"Request pending — not yet confirmed"**. It never shows the booking as confirmed.
5. If the browser blocks the new tab, the visitor gets an "Open WhatsApp" link and a **Copy message** button.

Nothing is stored. There's no backend, database, cookies, analytics, or local storage of form data. The Privacy page (`/privacy`) explains this. If you add storage or analytics later, update that page.

Service preselection:

- Buttons call the booking panel with a service ID.
- Links can use `/contact?service=<service-id>`, e.g. `/contact?service=landing-pages`.

## Project structure

```
src/
  config/site.ts              ← all editable business content
  lib/whatsapp.ts             ← message builder + wa.me link
  lib/datetime.ts             ← timezone-aware date helpers
  app/                        ← pages, metadata, sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
  components/
    booking/                  ← booking panel (context), form, contact-page form
    hero/                     ← 3D scene (HeroCanvas), SVG fallback, loader (HeroVisual)
    home/                     ← home-page sections
    layout/                   ← navbar + mobile menu, footer, floating WhatsApp button
    ui/                       ← shared UI (dialog, reveal, icons, placeholder tag)
```

## Motion, 3D and accessibility notes

- **Hero video.** Plays once on load and holds on the final logo, with a replay button. With reduced motion it doesn't autoplay; the still logo shows with a Play button.
- **3D workspace** (the "Built for every screen" section). Loads only when scrolled near, on screens 1024px and wider that have a hardware-accelerated GPU and aren't in Save-Data mode. It stops rendering when scrolled out of view.
- **3D fallback.** Phones, devices without WebGL, and software-only WebGL get an original SVG illustration instead. The same illustration is the placeholder while the 3D scene loads, so the layout doesn't shift.
- **Assets.** The 3D scene's models and screen images are generated in code, and the fallback illustration is original SVG. The logo, icon and logo video come from your brand pack. Project screenshots are of your own live sites. Icons are from [Lucide](https://lucide.dev) (ISC licence). Fonts are Inter, Sora and Poppins via `next/font` (SIL Open Font Licence).
- **Reduced motion.** The `prefers-reduced-motion` setting is respected. It turns off CSS floating, scroll parallax, pointer tilt and the 3D scene's motion; Motion animations fall back to simple fades.
- **Dialogs.** The booking panel, mobile menu and project previews use the native `<dialog>` element. That gives them focus trapping, Escape to close, and focus returning to the button that opened them.

## Deployment

The site hasn't been deployed. It builds as fully static pages, so any Next.js host works. Before deploying:

1. Set `NEXT_PUBLIC_SITE_URL` to your real domain.
2. Replace the placeholder email in `src/config/site.ts` and set `verified: true`.
