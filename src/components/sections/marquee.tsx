"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { marquee } from "@/lib/content";
import { Mark } from "@/components/brand/mark";

/**
 * What we build, as one endless line. It drifts on its own and follows the
 * direction you scroll, so the page feels like it is moving with you.
 */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>(".marquee-track");
      if (!track) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const half = () => track.scrollWidth / 2;
      const tween = gsap.to(track, {
        x: () => -half(),
        duration: 38,
        ease: "none",
        repeat: -1,
        modifiers: { x: gsap.utils.unitize((x) => gsap.utils.wrap(-half(), 0, parseFloat(x))) },
      });

      ScrollTrigger.create({
        onUpdate: (self) => {
          gsap.to(tween, {
            timeScale: self.direction === -1 ? -1 : 1,
            duration: 0.9,
            overwrite: true,
          });
        },
      });
    },
    { scope: root },
  );

  const items = [...marquee, ...marquee];

  return (
    <div
      ref={root}
      className="relative overflow-hidden border-y border-line py-5 md:py-7"
      aria-label={marquee.join(", ")}
    >
      <div className="marquee-track items-center gap-8 md:gap-12" aria-hidden>
        {items.map((label, i) => (
          <span key={i} className="flex items-center gap-8 md:gap-12">
            <span className="font-display whitespace-nowrap text-[clamp(1.75rem,4vw,3.5rem)] text-bone">
              {label}
            </span>
            <Mark className="size-5 text-accent md:size-7" />
          </span>
        ))}
      </div>
    </div>
  );
}
