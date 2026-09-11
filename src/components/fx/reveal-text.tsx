"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Tag = "h1" | "h2" | "h3" | "p";

/**
 * A heading whose lines rise out of masks as it scrolls into view. GSAP
 * SplitText re-splits on resize so the masks always match the wrapping.
 */
export function RevealText({
  as = "h2",
  children,
  className,
  delay = 0,
}: {
  as?: Tag;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const Comp = as as "h2";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      let split: SplitText | undefined;
      document.fonts.ready.then(() => {
        if (!ref.current) return;
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              rotate: 1.5,
              transformOrigin: "0% 100%",
              duration: 1.3,
              stagger: 0.09,
              delay,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }),
        });
      });
      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
