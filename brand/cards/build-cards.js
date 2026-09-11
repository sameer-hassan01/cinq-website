/**
 * Business cards, print-ready.
 *
 *   node brand/cards/build-cards.js
 *
 * Edit `people.json` and the CONTACT block below, then re-run. Every card is a
 * 2-page PDF: page 1 front, page 2 back. Run `npm run brand:logo` first so the
 * logo SVGs exist.
 *
 * Needs Chrome and puppeteer-core. Point CHROME_PATH at the binary if it is
 * not in the usual Windows location.
 *
 * Print spec is in the geometry block and in ../README.md. Do not change the
 * trim size without telling the printer.
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

// Shared on every card. Change the email the day a Cinq inbox exists, and the
// domain the day it is registered. Printing a domain you do not own is how you
// end up reprinting 500 cards.
const CONTACT = {
  email: "vertexdevstudio.tech@gmail.com",
  site: "cinqstudios.com",
  place: "Islamabad, Pakistan",
  line: "Software your business actually runs on.",
};

// --- geometry --------------------------------------------------------------
// 85 x 55 mm trim, 3 mm bleed on all sides, so the artwork is 91 x 61 mm and
// the printer trims 3 mm off each edge. Nothing readable within 5 mm of trim.
const TRIM_W = 85;
const TRIM_H = 55;
const BLEED = 3;
const SAFE = 5;
const ART_W = TRIM_W + BLEED * 2;
const ART_H = TRIM_H + BLEED * 2;
const INSET = BLEED + SAFE;

const INK = "#0c0b0a";
const BONE = "#f3efe7";
const BONE_2 = "#aca69b";
const ACCENT = "#f9633a";

const here = (...p) => path.resolve(__dirname, ...p);
const svg = (f) => fs.readFileSync(here("../../public/brand", f), "utf8");
// Fonts are inlined as data URLs: a page built with setContent has no origin,
// so Chrome refuses to fetch file:// fonts for it and falls back to a serif.
const fontUrl = (f) => {
  const ext = path.extname(f).slice(1);
  const mime = ext === "ttf" ? "font/ttf" : "font/woff";
  return `data:${mime};base64,${fs.readFileSync(here("../fonts", f)).toString("base64")}`;
};

const CSS = `
@font-face{font-family:'BG';src:url('${fontUrl("BricolageGrotesque-Variable.ttf")}');font-weight:200 800;font-stretch:75% 100%}
@font-face{font-family:'G';src:url('${fontUrl("Geist-Regular.woff")}');font-weight:400}
@font-face{font-family:'G';src:url('${fontUrl("Geist-Medium.woff")}');font-weight:500}
@font-face{font-family:'GM';src:url('${fontUrl("GeistMono-Regular.woff")}');font-weight:400}
*{box-sizing:border-box;margin:0}
@page{size:${ART_W}mm ${ART_H}mm;margin:0}
html,body{background:${INK}}
body{font-family:'G',system-ui,sans-serif;color:${BONE};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:${ART_W}mm;height:${ART_H}mm;overflow:hidden;page-break-after:always;background:${INK}}
.page:last-child{page-break-after:auto}
.safe{position:absolute;left:${INSET}mm;top:${INSET}mm;right:${INSET}mm;bottom:${INSET}mm}
.display{font-family:'BG';font-variation-settings:'opsz' 96,'wdth' 90,'wght' 800;letter-spacing:-0.045em;line-height:0.9}
.mono{font-family:'GM';font-size:5.4pt;letter-spacing:0.08em;text-transform:uppercase;color:${BONE_2}}
.mark{position:absolute;top:0;left:0;width:8mm;height:8mm}
.mark svg{width:100%;height:100%;display:block}
.name{position:absolute;left:0;bottom:12.5mm;font-size:15.5pt;color:${BONE}}
.role{position:absolute;left:0;bottom:8.8mm;font-size:6.2pt;color:${ACCENT};font-weight:500}
.contact{position:absolute;left:0;bottom:0;display:flex;flex-direction:column;gap:0.7mm;font-size:5.6pt;color:${BONE_2}}
.contact b{color:${BONE};font-weight:500}
.place{position:absolute;right:0;bottom:0;text-align:right}
.back{background:${ACCENT}}
.back .word{position:absolute;right:${INSET}mm;bottom:${INSET - 2.2}mm;width:52mm}
.back .word svg{width:100%;height:auto;display:block}
.back .line{position:absolute;left:${INSET}mm;top:${INSET}mm;width:38mm;font-size:8.2pt;color:${INK};font-family:'BG';font-variation-settings:'opsz' 96,'wdth' 100,'wght' 700;letter-spacing:-0.03em;line-height:1.02}
.back .site{position:absolute;left:${INSET}mm;bottom:${INSET}mm;font-family:'GM';font-size:5.6pt;letter-spacing:0.08em;text-transform:uppercase;color:${INK}}
`;

function front(p) {
  const phone = p.phone
    ? `<span><b>${p.phone}</b>${p.whatsapp ? " · WhatsApp" : ""}</span>`
    : "";
  return `
  <section class="page">
    <div class="safe">
      <div class="mark">${svg("mark-accent.svg")}</div>
      <div class="name display">${p.name}</div>
      <div class="role">${p.role}</div>
      <div class="contact">
        ${phone}
        <span>${p.email || CONTACT.email}</span>
        <span>${CONTACT.site}</span>
      </div>
      <div class="place mono">${CONTACT.place}</div>
    </div>
  </section>`;
}

function back() {
  return `
  <section class="page back">
    <div class="line">${CONTACT.line}</div>
    <div class="site">${CONTACT.site}</div>
    <div class="word">${svg("wordmark-ink.svg")}</div>
  </section>`;
}

function html(p) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${front(p)}${back()}</body></html>`;
}

async function main() {
  const { people } = JSON.parse(fs.readFileSync(here("people.json"), "utf8"));
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();
  for (const p of people) {
    const slug = p.name.split(" ")[0].toLowerCase();
    await page.setContent(html(p), { waitUntil: "load" });
    await page.evaluateHandle("document.fonts.ready");
    const out = here(`cinq-card-${slug}.pdf`);
    await page.pdf({
      path: out,
      width: `${ART_W}mm`,
      height: `${ART_H}mm`,
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log("wrote", path.basename(out));
  }
  // A proof sheet of every front and back, for on-screen review.
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}
    body{background:#333;padding:10mm;display:grid;grid-template-columns:repeat(2,${ART_W}mm);gap:8mm}
    .page{page-break-after:auto;box-shadow:0 2mm 6mm rgba(0,0,0,.5)}</style></head><body>${people
      .map((p) => front(p) + back())
      .join("")}</body></html>`,
    { waitUntil: "load" },
  );
  await page.evaluateHandle("document.fonts.ready");
  await page.setViewport({ width: 900, height: 1400, deviceScaleFactor: 2 });
  await page.screenshot({ path: here("proof-sheet.png"), fullPage: true });
  console.log("wrote proof-sheet.png");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
