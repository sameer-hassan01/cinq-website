"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { brand, contact, footer } from "@/lib/content";
import { AnimatedMark } from "@/components/fx/animated-mark";

const letters = brand.wordmark.split("");

/**
 * The name, as big as the screen. Each letter gets heavier as the cursor
 * comes near, driven straight through the variable font axis. No React
 * state on pointer move.
 */
export function Footer() {
  const word = useRef<HTMLDivElement>(null);
  const target = useRef<number[]>(letters.map(() => 800));
  const current = useRef<number[]>(letters.map(() => 800));
  const raf = useRef(0);

  // Weight is eased in JS, one frame at a time, and only the weight axis
  // moves. A CSS transition on font-variation-settings plus a width change
  // left slivers of the old glyph behind in Chrome.
  function step() {
    const spans = word.current?.querySelectorAll<HTMLSpanElement>("[data-letter]");
    if (!spans) return;
    let moving = false;
    spans.forEach((s, i) => {
      const c = current.current[i];
      const t = target.current[i];
      const n = Math.abs(t - c) < 0.5 ? t : c + (t - c) * 0.16;
      if (n !== c) {
        current.current[i] = n;
        s.style.fontVariationSettings = `"opsz" 96, "wdth" 90, "wght" ${Math.round(n)}`;
        moving = true;
      }
    });
    if (moving) raf.current = requestAnimationFrame(step);
  }

  function schedule() {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const spans = word.current?.querySelectorAll<HTMLSpanElement>("[data-letter]");
    if (!spans) return;
    const x = e.clientX;
    spans.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(x - (r.left + r.width / 2));
      const t = Math.max(0, 1 - d / 420);
      target.current[i] = 300 + t * 500;
    });
    schedule();
  }
  function onLeave() {
    target.current = letters.map(() => 800);
    schedule();
  }

  return (
    <footer className="relative overflow-hidden bg-ink px-pad pt-20 pb-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-12 border-t border-line pt-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <AnimatedMark className="size-9" />
            <p className="t-lead mt-6 max-w-[26ch] text-bone">{brand.tagline}</p>
            <a
              href={`mailto:${contact.email}`}
              className="t-body mt-6 inline-block text-bone-2 underline-offset-4 hover:text-bone hover:underline"
            >
              {contact.email}
            </a>
            <p className="t-body mt-2 text-bone-3">{contact.location}</p>
          </div>
          {footer.columns.map((col) => (
            <div key={col.title} className="md:col-span-3">
              <p className="t-mono mb-4 text-bone-3">{col.title}</p>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="t-body text-bone-2 transition-colors hover:text-bone">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="md:col-span-1 md:justify-self-end">
            <a
              href="#top"
              aria-label="Back to top"
              className="grid size-11 place-items-center rounded-full bg-bone/6 text-bone transition-colors hover:bg-accent hover:text-ink"
            >
              <ArrowUp size={18} weight="bold" />
            </a>
          </div>
        </div>
      </div>

      <div
        ref={word}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="mt-16 flex select-none justify-center pb-[0.16em] text-[30vw] leading-[0.8] text-bone"
        aria-hidden
        translate="no"
      >
        {letters.map((ch, i) => (
          <span
            key={i}
            data-letter
            className="font-display-tight inline-block"
            style={{ fontVariationSettings: '"opsz" 96, "wdth" 90, "wght" 800' }}
          >
            {ch}
          </span>
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-line pt-5 t-small text-bone-3">
        <span>{contact.copyright}</span>
        <span>Five founders. One studio.</span>
      </div>
    </footer>
  );
}
