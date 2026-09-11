"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MARK, markSegmentLength, markSegments } from "@/lib/mark";
import { cn } from "@/lib/utils";

const segments = markSegments();

/**
 * The header mark doubles as the page's progress. Its five segments fill in
 * one after another as you travel down the page: five founders, five stages.
 */
export function ProgressMark({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const paths = gsap.utils.toArray<SVGPathElement>(".pm-fill", ref.current);
      const len = markSegmentLength();
      gsap.set(paths, { strokeDasharray: len, strokeDashoffset: len });
      const setters = paths.map((p) => gsap.quickTo(p, "strokeDashoffset", { duration: 0.35, ease: "power2.out" }));
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const total = self.progress * paths.length;
          paths.forEach((_, i) => {
            const t = Math.min(1, Math.max(0, total - i));
            setters[i](len * (1 - t));
          });
        },
      });
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox={`0 0 ${MARK.size} ${MARK.size}`} className={cn("block shrink-0", className)} fill="none" aria-hidden>
      {segments.map((d, i) => (
        <path key={`t${i}`} d={d} stroke="currentColor" strokeWidth={MARK.stroke} opacity={0.38} />
      ))}
      {segments.map((d, i) => (
        <path key={`f${i}`} d={d} className="pm-fill" stroke="currentColor" strokeWidth={MARK.stroke} />
      ))}
    </svg>
  );
}
