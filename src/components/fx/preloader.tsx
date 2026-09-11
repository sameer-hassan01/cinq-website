"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markSegmentLength } from "@/lib/mark";
import { Mark } from "@/components/brand/mark";
import { useIntro } from "@/components/providers/intro";
import { getLenis } from "@/components/providers/smooth-scroll";

/**
 * The first thing anyone sees: the five segments of the mark draw on one
 * after another, the name arrives, and the curtain lifts. Under two seconds,
 * once per session, never under reduced motion.
 */
export function Preloader() {
  const { play, finish } = useIntro();
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      if (!play || !root.current) return;
      const len = markSegmentLength();
      const segs = gsap.utils.toArray<SVGPathElement>(".intro-seg");
      const lenis = getLenis();
      lenis?.stop();
      window.scrollTo(0, 0);

      gsap.set(segs, { strokeDasharray: len, strokeDashoffset: len });

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          lenis?.start();
          setGone(true);
        },
      });

      tl.to(segs, {
        strokeDashoffset: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: "power3.inOut",
      })
        .fromTo(
          ".intro-word",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9 },
          "-=0.35",
        )
        .to(".intro-mark", { scale: 0.92, duration: 0.6, ease: "power2.inOut" }, "<")
        .add(() => finish(), "+=0.25")
        .to(
          ".intro-lip",
          { scaleY: 1, duration: 0.9, ease: "power4.inOut" },
          "<",
        )
        .to(
          root.current,
          { yPercent: -100, duration: 1.05, ease: "power4.inOut" },
          "<",
        )
        .to(
          ".intro-inner",
          { yPercent: 40, opacity: 0, duration: 0.7, ease: "power3.in" },
          "<",
        );
    },
    { scope: root, dependencies: [play] },
  );

  if (!play || gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] bg-ink"
      aria-hidden
    >
      <div className="intro-inner flex h-full w-full flex-col items-center justify-center gap-8">
        <div className="intro-mark text-accent">
          <Mark className="size-24 md:size-32" segmentClassName="intro-seg" />
        </div>
        <div className="mask-line">
          <span className="intro-word font-display-tight block text-[3.5rem] text-bone md:text-[5rem]">
            cinq
          </span>
        </div>
      </div>
      {/* The curved lip that makes the curtain read as fabric, not a div. */}
      <div
        className="intro-lip absolute inset-x-[-10vw] top-full h-[18vh] origin-top scale-y-0 rounded-b-[100%] bg-ink"
      />
    </div>
  );
}
