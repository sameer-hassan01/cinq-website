"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { studio } from "@/lib/content";

/**
 * The studio in one paragraph. Words light up as you scroll, so you read at
 * the pace the page sets. The three numbers count up once they are seen.
 */
export function Studio() {
  const root = useRef<HTMLElement>(null);
  const words = studio.statement.split(" ");

  useGSAP(
    () => {
      if (!root.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(".studio-word", { opacity: 1 });
        return;
      }
      gsap.fromTo(
        ".studio-word",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: ".studio-text",
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.6,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".studio-num").forEach((el) => {
        const target = el.dataset.value ?? "";
        const numeric = parseFloat(target);
        const suffix = target.replace(/[\d.]/g, "");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: numeric,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="studio" className="relative bg-ink px-pad py-28 md:py-40">
      <div className="mx-auto max-w-[1280px]">
        <p className="studio-text font-display text-[clamp(1.75rem,3.6vw,3.9rem)] leading-[1.12] tracking-[-0.02em] text-bone">
          {words.map((w, i) => (
            <span key={i} className="studio-word inline-block" style={{ opacity: 0.16 }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>

        <ul className="mt-20 grid gap-8 border-t border-line pt-10 sm:grid-cols-3 md:mt-28">
          {studio.facts.map((f) => (
            <li key={f.label} className="flex flex-col gap-2">
              <span className="studio-num font-display-tight text-[clamp(3.5rem,6vw,6rem)] text-accent" data-value={f.value}>
                0
              </span>
              <span className="t-body max-w-[22ch] text-bone-2">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
