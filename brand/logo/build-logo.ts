/**
 * Builds every Cinq logo file.
 *
 *   node brand/logo/build-logo.ts        (Node 23.6+ runs TypeScript directly)
 *
 * Writes SVGs and PNGs into public/brand/, plus the favicon and Apple touch
 * icon into src/app/. The mark's geometry comes from src/lib/mark.ts, the same
 * module the website renders from, so the files cannot drift from the site.
 *
 * ── The mark ───────────────────────────────────────────────────────────────
 * A C built from five arcs. Cinq is five, and there are five founders.
 *
 * ── The wordmark ───────────────────────────────────────────────────────────
 * "cinq" in Bricolage Grotesque at weight 800, width 90, optical size 96,
 * tracked -4.5%. Cut to outlines from the variable TTF so no one needs the
 * font installed. Glyphs are walked one at a time because the font carries a
 * ccmp lookup that opentype.js refuses, and none of it applies to "cinq".
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as opentype from "opentype.js/dist/opentype.mjs";
import sharp from "sharp";
import { MARK, markSegments } from "../../src/lib/mark.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "public/brand");
const APP = path.join(ROOT, "src/app");
fs.mkdirSync(OUT, { recursive: true });

const COLORS = {
  ink: "#0c0b0a",
  bone: "#f3efe7",
  accent: "#f9633a",
} as const;

// ── wordmark outlines ──────────────────────────────────────────────────────
const ttf = fs.readFileSync(path.join(HERE, "../fonts/BricolageGrotesque-Variable.ttf"));
const font = opentype.parse(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength));
font.variation.set({ wght: 800, wdth: 90, opsz: 96 });
const variation = font.variation.get();

const SIZE = 100;
const TRACKING = -0.045 * SIZE;

function wordmarkPath(text: string) {
  const scale = SIZE / font.unitsPerEm;
  let cursor = 0;
  let prev: opentype.Glyph | null = null;
  const parts: string[] = [];
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    if (prev) {
      let k = 0;
      try {
        k = font.getKerningValue(prev, glyph) || 0;
      } catch {
        k = 0;
      }
      cursor += k * scale + TRACKING;
    }
    parts.push(glyph.getPath(cursor, 0, SIZE, { variation }, font).toPathData(2));
    cursor += glyph.advanceWidth * scale;
    prev = glyph;
  }
  const d = parts.join(" ");
  return { d, ...bbox(d) };
}

function bbox(d: string) {
  const nums = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < nums.length; i += 2) {
    xs.push(nums[i]);
    ys.push(nums[i + 1]);
  }
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

const word = wordmarkPath("cinq");
const wordW = word.x1 - word.x0;
const wordH = word.y1 - word.y0;
/** Height of the wordmark above the baseline (top of the i dot to y=0). */
const wordAscent = -word.y0;

// ── mark ───────────────────────────────────────────────────────────────────
const segs = markSegments();
const f = (n: number) => Number(n.toFixed(3));

function markGroup(color: string, x = 0, y = 0, size = MARK.size) {
  const s = size / MARK.size;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})" fill="none" stroke="${color}" stroke-width="${MARK.stroke}">${segs
    .map((d) => `<path d="${d}"/>`)
    .join("")}</g>`;
}

function svg(w: number, h: number, body: string, bg?: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(w)} ${f(h)}" width="${f(w)}" height="${f(h)}">${
    bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ""
  }${body}</svg>\n`;
}

// The mark's ink spans r ± stroke/2 around the centre: a square of side
// 2r + stroke, from (cx - r - stroke/2). Files are cropped to that square.
const markInkSide = 2 * MARK.r + MARK.stroke;
const markInkOffset = MARK.cx - MARK.r - MARK.stroke / 2;

function markSvg(color: string) {
  return svg(
    markInkSide,
    markInkSide,
    `<g transform="translate(${f(-markInkOffset)} ${f(-markInkOffset)})">${markGroup(color)}</g>`,
  );
}

function wordmarkSvg(color: string) {
  return svg(
    wordW,
    wordH,
    `<path transform="translate(${f(-word.x0)} ${f(-word.y0)})" fill="${color}" d="${word.d}"/>`,
  );
}

/** Mark beside wordmark. The mark stands as tall as the i, and its optical
    centre sits on the middle of that height. */
function lockupSvg(color: string, markColor = color) {
  const markSize = wordAscent * 1.0;
  const gap = wordAscent * 0.34;
  const scale = markSize / markInkSide;
  const w = markSize + gap + wordW;
  const h = wordH;
  const markY = 0; // top of the i dot is y = 0 after translate
  return svg(
    w,
    h,
    `<g transform="translate(0 ${f(markY)}) scale(${f(scale)}) translate(${f(-markInkOffset)} ${f(-markInkOffset)})">${markGroup(markColor)}</g>` +
      `<path transform="translate(${f(markSize + gap - word.x0)} ${f(-word.y0)})" fill="${color}" d="${word.d}"/>`,
  );
}

/** Mark above wordmark, centred. */
function stackedSvg(color: string, markColor = color) {
  const markSize = wordW * 0.42;
  const gap = wordAscent * 0.5;
  const scale = markSize / markInkSide;
  const w = wordW;
  const h = markSize + gap + wordH;
  return svg(
    w,
    h,
    `<g transform="translate(${f((w - markSize) / 2)} 0) scale(${f(scale)}) translate(${f(-markInkOffset)} ${f(-markInkOffset)})">${markGroup(markColor)}</g>` +
      `<path transform="translate(${f(-word.x0)} ${f(markSize + gap - word.y0)})" fill="${color}" d="${word.d}"/>`,
  );
}

/** App icon: the mark on an ink tile. `rounded` for the favicon, square for
    Apple, which masks its own corners. */
function iconSvg(rounded: boolean) {
  const S = 100;
  const markSize = 64;
  const scale = markSize / markInkSide;
  return svg(
    S,
    S,
    `<rect width="${S}" height="${S}" rx="${rounded ? 22 : 0}" fill="${COLORS.ink}"/>` +
      `<g transform="translate(${f((S - markSize) / 2)} ${f((S - markSize) / 2)}) scale(${f(scale)}) translate(${f(-markInkOffset)} ${f(-markInkOffset)})">${markGroup(COLORS.accent)}</g>`,
  );
}

/** The mark as a loading indicator, animated with SMIL so it moves anywhere
    an SVG can be shown: segments light up in turn while the ring turns. */
function loaderSvg(color: string) {
  const step = 0.24;
  const paths = segs
    .map(
      (d, i) =>
        `<path d="${d}" opacity="0.25"><animate attributeName="opacity" values="0.25;1;0.25" keyTimes="0;0.25;1" dur="1.2s" begin="${f(-1.2 + i * step)}s" repeatCount="indefinite"/></path>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK.size} ${MARK.size}" width="${MARK.size}" height="${MARK.size}"><g fill="none" stroke="${color}" stroke-width="${MARK.stroke}"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="2.4s" repeatCount="indefinite"/>${paths}</g></svg>\n`;
}

// ── write files ────────────────────────────────────────────────────────────
const files: Record<string, string> = {
  "mark.svg": markSvg("currentColor"),
  "mark-accent.svg": markSvg(COLORS.accent),
  "mark-bone.svg": markSvg(COLORS.bone),
  "mark-ink.svg": markSvg(COLORS.ink),
  "wordmark.svg": wordmarkSvg("currentColor"),
  "wordmark-bone.svg": wordmarkSvg(COLORS.bone),
  "wordmark-ink.svg": wordmarkSvg(COLORS.ink),
  "lockup.svg": lockupSvg("currentColor"),
  "lockup-bone.svg": lockupSvg(COLORS.bone, COLORS.accent),
  "lockup-ink.svg": lockupSvg(COLORS.ink, COLORS.accent),
  "lockup-mono-bone.svg": lockupSvg(COLORS.bone),
  "lockup-mono-ink.svg": lockupSvg(COLORS.ink),
  "lockup-stacked.svg": stackedSvg("currentColor"),
  "lockup-stacked-bone.svg": stackedSvg(COLORS.bone, COLORS.accent),
  "lockup-stacked-ink.svg": stackedSvg(COLORS.ink, COLORS.accent),
  "icon.svg": iconSvg(true),
  "loader-accent.svg": loaderSvg(COLORS.accent),
  "loader-bone.svg": loaderSvg(COLORS.bone),
  "loader-ink.svg": loaderSvg(COLORS.ink),
};
for (const [name, body] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), body);
}
fs.writeFileSync(path.join(APP, "icon.svg"), iconSvg(true));

async function png(svgText: string, out: string, width: number, bg?: string) {
  let img = sharp(Buffer.from(svgText), { density: 300 }).resize({ width });
  if (bg) img = img.flatten({ background: bg });
  await img.png().toFile(out);
}

const pngJobs: Promise<void>[] = [
  png(files["mark-accent.svg"], path.join(OUT, "mark-accent-512.png"), 512),
  png(files["mark-bone.svg"], path.join(OUT, "mark-bone-512.png"), 512),
  png(files["mark-ink.svg"], path.join(OUT, "mark-ink-512.png"), 512),
  png(files["icon.svg"], path.join(OUT, "icon-1024.png"), 1024),
  png(files["icon.svg"], path.join(OUT, "icon-512.png"), 512),
  png(iconSvg(false), path.join(OUT, "avatar-1024.png"), 1024),
  png(iconSvg(false), path.join(APP, "apple-icon.png"), 180),
  png(files["lockup-bone.svg"], path.join(OUT, "lockup-bone-2000.png"), 2000),
  png(files["lockup-ink.svg"], path.join(OUT, "lockup-ink-2000.png"), 2000),
  png(files["lockup-bone.svg"], path.join(OUT, "lockup-on-ink-2000.png"), 2000, COLORS.ink),
  png(files["wordmark-bone.svg"], path.join(OUT, "wordmark-bone-2000.png"), 2000),
  png(files["wordmark-ink.svg"], path.join(OUT, "wordmark-ink-2000.png"), 2000),
  png(files["lockup-stacked-bone.svg"], path.join(OUT, "lockup-stacked-bone-1200.png"), 1200),
  png(files["lockup-stacked-ink.svg"], path.join(OUT, "lockup-stacked-ink-1200.png"), 1200),
];
await Promise.all(pngJobs);

console.log(
  `wrote ${Object.keys(files).length} SVGs and ${pngJobs.length} PNGs to public/brand/\n` +
    `wordmark ${f(wordW)} x ${f(wordH)} (ascent ${f(wordAscent)}), mark ink side ${markInkSide}`,
);
