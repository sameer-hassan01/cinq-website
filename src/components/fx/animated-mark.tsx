"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markSegmentLength } from "@/lib/mark";
import { Mark } from "@/components/brand/mark";
import { cn } from "@/lib/utils";

/**
 * The mark, alive: its five segments draw on one after another when it
 * scrolls into view, and chase each other round the ring on hover or tap.
 * Same choreography as the hero and the intro, so the brand moves the same
 * way everywhere it appears.
 */
export function AnimatedMark({ className, label }: { className?: string; label?: string }) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const paths = gsap.utils.toArray<SVGPathElement>("path", root.current);
      if (!paths.length) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const len = markSegmentLength();
      gsap.set(paths, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: "power3.inOut",
        scrollTrigger: { trigger: root.current, start: "top 92%", once: true },
      });
    },
    { scope: root },
  );

  function spin() {
    if (!root.current) return;
    gsap.to(root.current.querySelectorAll("path"), {
      rotation: "+=360",
      svgOrigin: "50 50",
      duration: 1.4,
      stagger: 0.07,
      ease: "expo.inOut",
      overwrite: "auto",
    });
  }

  return (
    <span
      ref={root}
      className={cn("inline-block cursor-pointer text-accent", className)}
      onMouseEnter={spin}
      onClick={spin}
      title={label ?? "Five segments, five founders"}
    >
      <Mark className="size-full" />
    </span>
  );
}
