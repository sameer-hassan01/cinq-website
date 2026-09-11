# Cinq. Design system for the website

**Canonical tokens:** `src/app/globals.css`. If this file and the CSS
disagree, the CSS wins and this file gets updated.

**Design read.** A studio landing page for restaurant, clinic and founder
buyers. Awwwards-tier cinematic language on one committed dark theme. Dials:
variance 9, motion 9, density 3.

---

## 1. Colour

One palette, dark by default. Light mode is an opt-in toggle in the header:
`html.light` swaps the same roles (ink becomes paper, bone becomes near-black)
so every component inverts without a second set of classes. The accent
deepens where it is read as text.

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0c0b0a` | Page canvas. Warm near-black, never pure black. |
| `--ink-2` | `#141311` | Raised surfaces: cards, panels, the work title cards. |
| `--ink-3` | `#1d1b18` | A second step, used once or twice per page. |
| `--ink-4` | `#2a2723` | Device bezels only. |
| `--bone` | `#f3efe7` | Type, the wordmark. Never pure white. |
| `--bone-2` | `#aca69b` | Secondary text. 6.4:1 on ink. |
| `--bone-3` | `#6f6a62` | Mono labels and quiet metadata. 3.4:1: large or uppercase mono only. |
| `--accent` | `#f9633a` (light: `#ef5a2f`) | The one accent for fills and the mark. 6.5:1 on ink; ink text on it 5.8:1. |
| `--accent-text` | `#f9633a` (light: `#b8360f`) | The accent as small text. Use `text-accent-text` for labels and links, `text-accent` only for the mark and display numerals. |
| `--on-accent` | `#0c0b0a` | Text on an accent fill, in both modes. |
| `--ink-warm` | `#1a1410` (light: `#efe3d3`) | The warm panel in the work showcase. |
| `--amber` | `#ffb020` | Inside the hero shader and the OG gradient only. Never UI. |
| `--line` | bone at 10% | Hairlines. |

Ink text on accent (`#0c0b0a` on `#ff4d1f`) is 5.9:1; ink on bone is 17:1.
Bone on accent fails and is never used.

**Hard-coded colours are banned in components.** Every alpha tint goes
through `color-mix(in srgb, var(--bone) 10%, transparent)` or a Tailwind
opacity utility on a token, so light mode inverts it for free. The hero
shader takes a `uLight` uniform and draws the same ribbons as vermilion ink
on paper.

**Colour blocks.** The page is one theme. Two deliberate exceptions, each
used once: the vermilion panel in the work showcase (Cinq RMS) and the bone
card at the end of the process stack. Do not add a third.

## 2. Type

| Face | Use | Settings |
|---|---|---|
| Bricolage Grotesque (variable) | Display | `.font-display`: weight 700, `opsz 96`, `wdth 100`, tracking -0.03em. `.font-display-tight`: weight 800, `wdth 90`, tracking -0.045em. Product names and the wordmark use the tight version. |
| Geist | Body, UI | 400 and 500 only. |
| Geist Mono | Small labels | `.t-mono`: 0.75rem, uppercase, tracking 0.08em. |

Scale classes: `.t-hero`, `.t-h2`, `.t-h3`, `.t-lead`, `.t-body`,
`.t-small`. All fluid via `clamp()`. Headlines are sentence case. No
em-dashes anywhere on the site.

## 3. Shape and surfaces

- One radius system: cards `--radius` 28px, small elements 16px, every
  interactive pill `9999px`.
- `.bezel > .core` is the double-bezel card: a 6px translucent shell with a
  hairline, and a concentric inner core. Use it for anything that should read
  as a physical object (product cards, the contact form).
- `.glass` is for fixed elements only (the header pill, the menu). Never put
  `backdrop-filter` on something that scrolls.
- Shadows are large, soft and tinted to ink. No `shadow-md`.

## 4. Motion

Three libraries, each with a job. Never animate one element with two of them.

| Library | Owns |
|---|---|
| GSAP + ScrollTrigger + SplitText | Everything scroll-linked: the pinned work showcase, the process stack, the marquee, the studio word fill, the hero entrance, header hide and show, the preloader. |
| Motion (`motion/react`) | Component state: the menu, services accordion, product card tilt and spotlight, magnetic buttons, in-view reveals. |
| React Three Fiber | The hero shader only. |

Lenis drives the scroll and GSAP's ticker drives Lenis, so pinned sections
and the smooth scroll share one clock.

Rules:

- Ease is `expo.out` or `cubic-bezier(0.16, 1, 0.3, 1)`. Nothing linear
  except scrubbed tweens.
- Only `transform`, `opacity`, `filter` and `clip-path` animate.
- Every scroll-linked effect is inside `gsap.matchMedia()` or checks
  `prefers-reduced-motion`; under reduced motion the page is static and
  complete. The intro never plays there.
- Pointer-driven effects (magnetic, tilt, spotlight, the footer wordmark) go
  through motion values or direct style writes. Never React state on pointer
  move.
- A pinned card that must recede as the next one arrives keeps its own
  opacity at 1 and darkens through an inner veil. Fading the card itself
  shows the cards beneath it through the gap while the next card is only
  half over it.
- One marquee per page. It is the "what we build" strip under the hero.

## 5. Layout

- Page padding `--pad`: 20px on phones to 64px on wide screens. Content
  max-width 1280px inside sections; 1120px for the header pill.
- Sections alternate layout families on purpose: full-bleed hero, marquee,
  horizontal pinned showcase, single statement, asymmetric bento, accordion
  list, sticky stack, accordion slider, split form, footer. No two adjacent
  sections share a family.
- Below `lg` the work showcase stops pinning and stacks; below `md` the
  bento, the founders slider and the contact grid go to one column.
- Hero copy is a headline of three lines at most, a sub of at most twenty
  words, and two buttons. Nothing else goes in the hero.

## 6. Custom CSS and Tailwind

Every custom class in `globals.css` sits inside `@layer components`, so any
Tailwind utility on the same element wins. Unlayered CSS would beat
`hidden`, `md:flex` and friends, and that is exactly the bug that hid the
mobile header CTA before the layer was added. Keep new classes in the layer.
