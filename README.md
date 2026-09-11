# Cinq. The company site.

Deployed to GitHub Pages from this repo by `.github/workflows/pages.yml` on
every push to `main`. It is a fully static export; hand-written asset URLs go
through `withBase()` so they work under the `/cinq-website/` path.

One page. Next.js 16 (App Router, Turbopack), Tailwind v4, GSAP for
scrolltelling, Motion for component interaction, React Three Fiber for the
hero, Lenis for the scroll.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run lint
npm run brand:logo   # regenerate every logo file from src/lib/mark.ts
npm run brand:cards  # regenerate the business card PDFs (needs Chrome)
node brand/build-kit.js   # regenerate brand/brand-kit.html
```

## Where things live

| Path | What |
|---|---|
| `src/lib/content.ts` | **Every string on the site.** Copy, products, services, founders, contact. Edit here, not in components. |
| `src/lib/mark.ts` | The mark's geometry. The site, the favicon, the OG image and the logo files all read from it. |
| `src/app/globals.css` | Design tokens and the few global classes. See [`docs/design-system.md`](docs/design-system.md). |
| `src/components/sections/` | One file per section, in page order: hero, marquee, work, studio, products, services, process, founders, contact. |
| `src/components/fx/` | The showpieces: the WebGL hero, the preloader, magnetic buttons, spotlight cards, grain. |
| `src/components/work/` | Device frames and the four product visuals in the work showcase. |
| `brand/` | Fonts, the logo generator, the card generator, the kit generator and the kit itself. |
| `public/brand/` | Generated logo files. Do not edit by hand; run `npm run brand:logo`. |

## The brand, in one paragraph

Cinq is French for five and there are five founders. The mark is a C cut
into five segments. The wordmark is lowercase `cinq` in Bricolage Grotesque.
One palette, dark: ink, bone and a single vermilion. The full kit is
[`brand/brand-kit.html`](brand/brand-kit.html), one self-contained file that
opens without a network.

## Before this goes live

- [ ] **Domain.** `metadataBase`, `robots.txt`, the sitemap and the JSON-LD
      all read `NEXT_PUBLIC_SITE_URL`, which the workflow sets to the Pages
      URL. When a real domain is bought, add it as the custom domain in the
      Pages settings and set `NEXT_PUBLIC_BASE_PATH` to empty in the workflow.
- [ ] **Cards.** They say `cinqstudios.com`. Do not print until it is bought.

## Notes

- The intro plays once per browser session and never under
  `prefers-reduced-motion`. Every scroll-linked effect is also skipped there.
- Never run `npm run build` while `npm run dev` is up on the same folder. Both
  write `.next`.
- `AGENTS.md` is written and re-added by `next dev`; commit it with your work.
