"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MARK, markSegments } from "@/lib/mark";

export type SendBurstHandle = { fire: () => void };

const segments = markSegments();

/**
 * When the form is sent, the mark's five segments burst out of the button
 * and fade. Feedback for the one action on the page that leaves it.
 */
export const SendBurst = forwardRef<SendBurstHandle>(function SendBurst(_, ref) {
  const root = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    fire() {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const bits = el.querySelectorAll<SVGSVGElement>("svg");
      gsap.killTweensOf(bits);
      bits.forEach((b, i) => {
        const a = (i / bits.length) * Math.PI * 2 - Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        const d = 110 + Math.random() * 90;
        gsap.fromTo(
          b,
          { x: 0, y: 0, scale: 0.4, rotation: 0, autoAlpha: 1 },
          {
            x: Math.cos(a) * d,
            y: Math.sin(a) * d,
            scale: 1,
            rotation: (Math.random() - 0.5) * 240,
            autoAlpha: 0,
            duration: 1.2 + Math.random() * 0.4,
            ease: "power3.out",
          },
        );
      });
    },
  }));

  return (
    <span ref={root} className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      {segments.map((d, i) => (
        <svg
          key={i}
          viewBox={`0 0 ${MARK.size} ${MARK.size}`}
          className="absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-1/2 opacity-0"
          fill="none"
        >
          <path d={d} stroke="var(--accent)" strokeWidth={MARK.stroke} />
        </svg>
      ))}
    </span>
  );
});
