/**
 * Assembles brand/brand-kit.html: the shareable brand kit as one
 * self-contained file. Fonts are embedded, logo files are inlined, the cards
 * are drawn at life size. Opens by double-clicking with no network; Ctrl+P
 * gives a clean PDF.
 *
 *   node brand/build-kit.js      (run `npm run brand:logo` first)
 */
const fs = require("fs");
const path = require("path");

const here = (...p) => path.resolve(__dirname, ...p);
const svg = (f) => fs.readFileSync(here("../public/brand", f), "utf8");
const font = (f) => {
  const mime = f.endsWith(".ttf") ? "font/ttf" : "font/woff";
  return `data:${mime};base64,${fs.readFileSync(here("fonts", f)).toString("base64")}`;
};
const people = JSON.parse(fs.readFileSync(here("cards/people.json"), "utf8")).people;

const C = {
  ink: "#0c0b0a",
  ink2: "#141311",
  ink3: "#1d1b18",
  bone: "#f3efe7",
  bone2: "#aca69b",
  bone3: "#6f6a62",
  accent: "#f9633a",
  accentLight: "#ef5a2f",
  accentText: "#b8360f",
  accentDeep: "#c9330c",
  paper: "#f4f1ea",
  amber: "#ffb020",
};

const swatches = [
  ["Ink", C.ink, "The canvas. Not pure black: it carries a little warmth."],
  ["Ink 2", C.ink2, "Raised surfaces: cards, panels, the header pill."],
  ["Ink 3", C.ink3, "A second step up, used sparingly."],
  ["Bone", C.bone, "Type and the wordmark. Never pure white."],
  ["Bone 2", C.bone2, "Secondary text. 6.4:1 on Ink."],
  ["Vermilion", C.accent, "The one accent. Buttons, the mark, highlights. 6.5:1 on Ink."],
  ["Paper", C.paper, "Light mode canvas. Ink and Bone swap roles on it."],
  ["Vermilion on paper", C.accentLight, "Fills in light mode. Ink text on it is 5.8:1."],
  ["Vermilion, as text", C.accentText, "Small type on paper. 5.1:1."],
  ["Vermilion deep", C.accentDeep, "Gradients and print shadows only."],
  ["Amber", C.amber, "Only inside the hero light and the OG image. Never as UI."],
];

const cardCss = `
.card{position:relative;width:85mm;height:55mm;overflow:hidden;border-radius:1.5mm;box-shadow:0 8px 30px rgba(0,0,0,.45)}
.card .safe{position:absolute;inset:5mm}
.card.front{background:${C.ink};color:${C.bone}}
.card .mark{position:absolute;top:0;left:0;width:8mm;height:8mm}
.card .mark svg{width:100%;height:100%;display:block}
.card .name{position:absolute;left:0;bottom:12.5mm;font-family:'BG';font-variation-settings:'opsz' 96,'wdth' 90,'wght' 800;letter-spacing:-0.045em;line-height:.9;font-size:15.5pt}
.card .role{position:absolute;left:0;bottom:8.8mm;font-size:6.2pt;color:${C.accent};font-weight:500}
.card .contact{position:absolute;left:0;bottom:0;display:flex;flex-direction:column;gap:.7mm;font-size:5.6pt;color:${C.bone2}}
.card .contact b{color:${C.bone};font-weight:500}
.card .place{position:absolute;right:0;bottom:0;font-family:'GM';font-size:5.4pt;letter-spacing:.08em;text-transform:uppercase;color:${C.bone2}}
.card.back{background:${C.accent};color:${C.ink}}
.card.back .line{position:absolute;left:5mm;top:5mm;width:38mm;font-family:'BG';font-variation-settings:'opsz' 96,'wdth' 100,'wght' 700;letter-spacing:-.03em;line-height:1.02;font-size:8.2pt}
.card.back .site{position:absolute;left:5mm;bottom:5mm;font-family:'GM';font-size:5.8pt;letter-spacing:.02em;line-height:1.7}
.card.back .word{position:absolute;right:5mm;bottom:3.2mm;width:40mm}
.card.back .word svg{width:100%;height:auto;display:block}
`;

const cardFront = (p) => `
<div class="card front"><div class="safe">
  <div class="mark">${svg("mark-accent.svg")}</div>
  <div class="name">${p.name}</div>
  <div class="role">${p.role}</div>
  <div class="contact">${p.phone ? `<span><b>${p.phone}</b>${p.whatsapp ? " · WhatsApp" : ""}</span>` : ""}${p.email ? `<span>${p.email}</span>` : ""}<span>cinqstudios.com</span></div>
  <div class="place">Islamabad, Pakistan</div>
</div></div>`;
const cardBack = `
<div class="card back">
  <div class="line">Software your business actually runs on.</div>
  <div class="site">cinqdevstudio@gmail.com<br/>cinqstudios.com</div>
  <div class="word">${svg("wordmark-ink.svg")}</div>
</div>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cinq brand kit</title>
<style>
@font-face{font-family:'BG';src:url('${font("BricolageGrotesque-Variable.ttf")}');font-weight:200 800;font-stretch:75% 100%}
@font-face{font-family:'G';src:url('${font("Geist-Regular.woff")}');font-weight:400}
@font-face{font-family:'G';src:url('${font("Geist-Medium.woff")}');font-weight:500}
@font-face{font-family:'GM';src:url('${font("GeistMono-Regular.woff")}');font-weight:400}
*{box-sizing:border-box;margin:0}
html{background:${C.ink};color:${C.bone};font-family:'G',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
body{max-width:1100px;margin:0 auto;padding:64px 32px 120px;line-height:1.55}
h1,h2,h3{font-family:'BG';font-variation-settings:'opsz' 96,'wdth' 100;letter-spacing:-.03em;line-height:.95;font-weight:700}
h1{font-size:clamp(2.5rem,7vw,5.5rem);max-width:14ch}
h2{font-size:clamp(1.75rem,3.5vw,2.75rem);margin:96px 0 24px;padding-top:32px;border-top:1px solid rgba(243,239,231,.1)}
h3{font-size:1.25rem;margin:32px 0 12px}
p{max-width:64ch;color:${C.bone2}}
p b{color:${C.bone};font-weight:500}
.lede{font-size:1.25rem;color:${C.bone};margin-top:24px}
.mono{font-family:'GM';font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:${C.bone3}}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.tile{background:${C.ink2};border-radius:24px;padding:24px;box-shadow:inset 0 0 0 1px rgba(243,239,231,.08)}
.tile.light{background:${C.bone};color:${C.ink}}
.tile.accent{background:${C.accent};color:${C.ink}}
.tile svg{display:block;max-width:100%;height:auto}
.sizes{display:flex;align-items:flex-end;gap:32px;flex-wrap:wrap}
.sizes div{display:flex;flex-direction:column;gap:8px;align-items:center}
.sw{display:flex;flex-direction:column;gap:10px}
.sw .chip{height:96px;border-radius:16px;box-shadow:inset 0 0 0 1px rgba(243,239,231,.08)}
.sw code{font-family:'GM';font-size:.8rem;color:${C.bone}}
.sw small{color:${C.bone2};font-size:.85rem}
.type{display:grid;gap:24px}
.type .display{font-family:'BG';font-variation-settings:'opsz' 96,'wdth' 90,'wght' 800;letter-spacing:-.045em;line-height:.9;font-size:clamp(3rem,8vw,7rem)}
.type .head{font-family:'BG';font-variation-settings:'opsz' 96,'wdth' 100,'wght' 700;letter-spacing:-.03em;line-height:.95;font-size:2.5rem}
.type .body{font-size:1.05rem;max-width:60ch;color:${C.bone2}}
.cards{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(85mm,1fr));margin-top:24px}
ul{padding-left:20px;color:${C.bone2};max-width:64ch}
li{margin:6px 0}
li b{color:${C.bone};font-weight:500}
table{border-collapse:collapse;width:100%;max-width:720px;font-size:.95rem}
td,th{text-align:left;padding:10px 12px;border-bottom:1px solid rgba(243,239,231,.1);color:${C.bone2};vertical-align:top}
th{color:${C.bone};font-weight:500}
${cardCss}
@media print{html{background:#fff;color:#111}body{padding:0}h2{break-before:page}}
</style></head>
<body>
<p class="mono">Brand kit · 2026</p>
<h1 style="margin-top:16px">cinq</h1>
<p class="lede">Cinq is French for five. There are five founders. Everything in this kit says that once, quietly: a C cut into five segments, a wordmark in lowercase, one colour on ink.</p>

<h2>The mark</h2>
<p>A C built from five arcs with one wide opening. At 16px the gaps close and it reads as a bold C; at poster size you can count the five. Geometry is fixed in <b>src/lib/mark.ts</b>: radius 33, stroke 20, opening 78°, gap 7°, on a 100-unit grid. The website, the favicon, the OG image and every file here are generated from that one module.</p>
<div class="grid" style="margin-top:24px">
  <div class="tile"><p class="mono" style="margin-bottom:16px">On ink</p>${svg("mark-accent.svg")}</div>
  <div class="tile light"><p class="mono" style="margin-bottom:16px;color:${C.bone3}">On bone</p>${svg("mark-accent.svg")}</div>
  <div class="tile accent"><p class="mono" style="margin-bottom:16px;color:${C.accentDeep}">On vermilion</p>${svg("mark-ink.svg")}</div>
</div>
<h3>At the sizes it is used</h3>
<div class="tile sizes">
  ${[16, 24, 32, 48, 96, 160].map((s) => `<div><span style="width:${s}px;height:${s}px;display:block">${svg("mark-accent.svg")}</span><span class="mono">${s}px</span></div>`).join("")}
</div>

<h3>As a loading indicator</h3>
<p>The five segments light up in turn while the ring turns. Use it wherever something is buffering: the site has it as a React component (<b>src/components/brand/loader.tsx</b>) and the kit ships it as animated SVG files (<b>loader-accent / -bone / -ink .svg</b>) that move anywhere an SVG can be shown.</p>
<div class="tile sizes" style="margin-top:16px">
  ${[20, 32, 48, 96].map((s) => `<div><span style="width:${s}px;height:${s}px;display:block">${svg("loader-accent.svg").replace("<svg ", '<svg style="width:100%;height:100%;display:block" ')}</span><span class="mono">${s}px</span></div>`).join("")}
  <div><span style="width:96px;height:96px;display:block;background:${C.paper};border-radius:16px;padding:12px">${svg("loader-ink.svg").replace("<svg ", '<svg style="width:100%;height:100%;display:block" ')}</span><span class="mono">On paper</span></div>
</div>

<h2>The wordmark</h2>
<p><b>cinq</b>, lowercase, in Bricolage Grotesque at weight 800, width 90, optical size 96, tracked -4.5%. Lowercase on purpose: the descender of the q is the only thing that drops below the line and it gives the word its shape. The files are outlined, so nobody needs the font installed.</p>
<div class="grid" style="margin-top:24px">
  <div class="tile">${svg("wordmark-bone.svg")}</div>
  <div class="tile light">${svg("wordmark-ink.svg")}</div>
</div>

<h2>Lockups</h2>
<p>Mark beside wordmark for anything wide; mark above wordmark for square spaces. The mark stands exactly as tall as the i. Use the two-colour version wherever colour is available and the one-colour version for single-plate print.</p>
<div class="grid" style="margin-top:24px">
  <div class="tile">${svg("lockup-bone.svg")}</div>
  <div class="tile light">${svg("lockup-ink.svg")}</div>
  <div class="tile">${svg("lockup-mono-bone.svg")}</div>
  <div class="tile light" style="display:grid;place-items:center">${svg("lockup-stacked-ink.svg").replace("<svg ", '<svg style="width:55%" ')}</div>
  <div class="tile" style="display:grid;place-items:center">${svg("lockup-stacked-bone.svg").replace("<svg ", '<svg style="width:55%" ')}</div>
  <div class="tile" style="display:grid;place-items:center;padding:48px">${svg("icon.svg").replace("<svg ", '<svg style="width:120px" ')}</div>
</div>
<h3>Rules</h3>
<ul>
  <li><b>Clear space</b> on all sides is one fifth of the mark's height. Nothing else inside that.</li>
  <li><b>Minimum size</b> is 16px for the mark and 96px wide for the horizontal lockup. Below that, the mark alone.</li>
  <li>Do not recolour, outline, add a gradient to, rotate or stretch the mark or the wordmark. Vermilion, bone or ink, on a background it passes contrast against.</li>
  <li>Do not redraw the C or set the wordmark in another face. Use the files.</li>
  <li>On photographs use the solid bone or ink versions and give the mark a quiet area to sit in.</li>
</ul>

<h2>Colour</h2>
<p>Dark is the brand and the default. Light mode exists as an opt-in on the site: the same roles inverted, ink becoming paper and bone becoming near-black, with the vermilion deepened wherever it is read as text. Print flood colours from the hex and ask for a proof; a vermilion this saturated converts badly to CMYK, so match a swatch rather than a number.</p>
<div class="grid" style="margin-top:24px">
  ${swatches.map(([n, hex, note]) => `<div class="sw"><div class="chip" style="background:${hex}"></div><code>${hex}</code><b>${n}</b><small>${note}</small></div>`).join("")}
</div>

<h2>Type</h2>
<p><b>Bricolage Grotesque</b> for display, variable: weight 800 and width 90 for the wordmark and product names, weight 700 and width 100 for headings. <b>Geist</b> for everything you read. <b>Geist Mono</b>, uppercase and tracked, for the small labels. All three are free under the SIL Open Font License and can be embedded in anything.</p>
<div class="type tile" style="margin-top:24px">
  <div class="display">cinq</div>
  <div class="head">Software your business actually runs on.</div>
  <div class="body">Websites, mobile apps and the systems behind restaurants, clinics and growing companies. Built in Islamabad by five founders.</div>
  <div class="mono">Five founders · One studio</div>
</div>
<h3>Voice</h3>
<ul>
  <li>Sentence case everywhere, including buttons.</li>
  <li>Say what the customer gets, not what the software has.</li>
  <li>No em-dashes. Periods and commas.</li>
  <li>No leverage, seamless, cutting-edge, world-class, next-gen or revolutionise.</li>
  <li>Buttons say what happens: "Book a clinic demo", not "Submit".</li>
</ul>

<h2>Business cards</h2>
<p>85 × 55 mm trim, 3 mm bleed, nothing readable within 5 mm of the trim. Front on ink, back a solid vermilion flood. 300 to 350 gsm, matt lamination or uncoated; gloss shows every fingerprint on the flood. Print-ready PDFs are in <b>brand/cards/</b>; edit <b>people.json</b> and re-run the build to change them.</p>
<table style="margin-top:16px"><tr><th>Trim</th><td>85 × 55 mm</td></tr><tr><th>Bleed</th><td>3 mm all sides, artwork 91 × 61 mm</td></tr><tr><th>Safe area</th><td>5 mm inside the trim</td></tr><tr><th>Colour</th><td>Ink ${C.ink} front, vermilion ${C.accent} back. Give the printer the hex and ask for a proof.</td></tr><tr><th>Stock</th><td>300 to 350 gsm, matt lamination or uncoated</td></tr></table>
<div class="cards">
  ${people.map((p) => cardFront(p) + cardBack).join("")}
</div>
<p style="margin-top:24px">Three cards carry no phone number because only two real numbers exist, and only one carries a personal address on the front so far; the studio inbox is on every back. Add the others to people.json as they come in. Never invent a number or an address to balance the layout. Do not print until the domain is registered: the cards say cinqstudios.com.</p>

<h2>Files</h2>
<table>
<tr><th>public/brand/mark.svg</th><td>The mark in currentColor. Inherits the surrounding text colour.</td></tr>
<tr><th>mark-accent / mark-bone / mark-ink .svg, -512.png</th><td>Fixed colour, for anywhere CSS cannot reach.</td></tr>
<tr><th>wordmark*.svg, wordmark-*-2000.png</th><td>Type only, outlined.</td></tr>
<tr><th>lockup*.svg, lockup-*-2000.png</th><td>Mark beside wordmark. "mono" variants are one colour.</td></tr>
<tr><th>lockup-stacked*.svg, -1200.png</th><td>Mark above wordmark, for square spaces.</td></tr>
<tr><th>icon.svg, icon-512/1024.png, avatar-1024.png</th><td>App icon and social avatars: the mark on an ink tile.</td></tr>
<tr><th>loader-accent / -bone / -ink .svg</th><td>The animated loading indicator.</td></tr>
<tr><th>src/lib/mark.ts, brand/logo/build-logo.ts</th><td>The geometry and the generator. Change the mark there and re-run; every file above is rebuilt.</td></tr>
</table>
</body></html>`;

fs.writeFileSync(here("brand-kit.html"), html);
console.log(`wrote brand/brand-kit.html (${Math.round(html.length / 1024)} KB)`);
