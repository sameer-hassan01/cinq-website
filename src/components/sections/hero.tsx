"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { hero } from "@/lib/content";
import { useIntro } from "@/components/providers/intro";
import { ButtonLink } from "@/components/ui/button";
import { Magnetic } from "@/components/fx/magnetic";
import { Mark } from "@/components/brand/mark";

const HeroCanvas = dynamic(
  () => import("@/components/fx/hero-canvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!root.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const h1 = root.current.querySelector<HTMLElement>(".hero-h1");
      if (!h1) return;

      let split: SplitText | undefined;
      const run = () => {
        if (!ready && !reduce) return;
        gsap.set(root.current, { autoAlpha: 1 });
        if (reduce) return;

        split = SplitText.create(h1, {
          type: "lines",
          mask: "lines",
          linesClass: "hero-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              rotate: 2,
              transformOrigin: "0% 100%",
              duration: 1.4,
              stagger: 0.09,
              ease: "expo.out",
            }),
        });

        gsap.from(".hero-fade", {
          y: 28,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.1,
          delay: 0.45,
          ease: "expo.out",
        });
        gsap.from(".hero-mark path", {
          scale: 0,
          transformOrigin: "50% 50%",
          duration: 1,
          stagger: 0.06,
          delay: 0.2,
          ease: "back.out(1.6)",
        });

        // Scrolling out: the copy drifts up faster than the page and dims, so
        // the ribbons are the last thing to leave.
        gsap.to(".hero-copy", {
          yPercent: -18,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom 40%",
            scrub: true,
          },
        });
        ScrollTrigger.refresh();
      };

      document.fonts.ready.then(run);
      return () => split?.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-ink"
      style={{ visibility: "hidden" }}
    >
      <HeroCanvas active intro={ready} />
      {/* Scrim for legibility where the copy sits. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_100%,rgb(12_11_10/0.85)_0%,rgb(12_11_10/0.35)_45%,transparent_70%)]"
        aria-hidden
      />

      <div className="hero-copy relative z-10 mt-auto grid w-full gap-10 px-pad pt-[calc(var(--nav-h)+4rem)] pb-[clamp(2rem,6vh,4.5rem)] lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="lg:col-span-8">
          <div className="hero-mark hero-fade mb-6 text-accent">
            <Mark className="size-10 md:size-12" />
          </div>
          <h1 className="hero-h1 font-display t-hero max-w-[17ch] text-balance text-bone">
            {hero.headline}
          </h1>
        </div>

        <div className="lg:col-span-4 lg:pb-3">
          <p className="hero-fade t-lead max-w-[36ch] text-pretty text-bone-2">
            {hero.sub}
          </p>
          <div className="hero-fade mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink href={hero.primary.href} variant="primary">
                {hero.primary.label}
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink href={hero.secondary.href} variant="ghost" icon="right">
                {hero.secondary.label}
              </ButtonLink>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
