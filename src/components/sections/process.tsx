"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { process } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/mark";
import { RevealText } from "@/components/fx/reveal-text";

const tones = [
  "bg-ink-2 text-bone",
  "bg-accent text-on-accent",
  "bg-ink-3 text-bone",
  "bg-bone text-ink",
];

/**
 * Four steps that pile up. Each card pins under the header and shrinks back
 * as the next one slides over it, so the process reads as one stack.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".step-card");
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          ScrollTrigger.create({
            trigger: card,
            start: "top 12%",
            endTrigger: cards[cards.length - 1],
            end: "top 12%",
            pin: true,
            pinSpacing: false,
          });
          // The card itself stays opaque; a veil inside it darkens as the next
          // card slides over, so nothing behind ever shows through.
          const st = {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top 12%",
            scrub: true,
          };
          gsap.to(card, { scale: 0.92, filter: "blur(2px)", ease: "none", scrollTrigger: st });
          gsap.to(card.querySelector(".step-veil"), { opacity: 0.6, ease: "none", scrollTrigger: st });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className="relative bg-ink px-pad pt-24 pb-10 md:pt-36">
      <div className="mx-auto max-w-[1280px]">
        <RevealText className="font-display t-h2 max-w-[18ch] text-balance text-bone">
          {process.heading}
        </RevealText>

        <div className="mt-14 md:mt-20">
          {process.steps.map((s, i) => (
            <article
              key={s.title}
              className={cn(
                "step-card relative mb-6 flex min-h-[62vh] origin-top flex-col justify-between overflow-hidden rounded-card p-7 shadow-[0_-20px_60px_-30px_rgb(0_0_0/0.7)] md:min-h-[66vh] md:p-12",
                tones[i],
              )}
              style={{ zIndex: i + 1 }}
            >
              <div className="step-veil pointer-events-none absolute inset-0 z-10 bg-ink opacity-0" aria-hidden />
              <div className="flex items-start justify-between gap-6">
                <span className="font-display-tight text-[clamp(4rem,10vw,9rem)] leading-none opacity-90">
                  {i + 1}
                </span>
                <Mark className={cn("size-8 md:size-10", i === 1 ? "text-on-accent" : i === 3 ? "text-ink" : "text-accent")} />
              </div>
              <div className="grid gap-8 md:grid-cols-12 md:items-end">
                <div className="md:col-span-7">
                  <h3 className="font-display text-[clamp(2rem,4.5vw,4.25rem)]">{s.title}</h3>
                  <p className={cn("t-lead mt-5 max-w-[40ch] text-pretty", i === 1 ? "text-on-accent/80" : i === 3 ? "text-ink/80" : "text-bone-2")}>
                    {s.body}
                  </p>
                </div>
                <div className="md:col-span-5">
                  <p className={cn("t-mono mb-3", i === 1 ? "text-on-accent/60" : i === 3 ? "text-ink/60" : "text-bone-3")}>You get</p>
                  <ul className="flex flex-col gap-2">
                    {s.gets.map((g) => (
                      <li
                        key={g}
                        className={cn(
                          "rounded-full px-4 py-2.5 t-small font-medium",
                          i === 1 ? "bg-on-accent/10" : i === 3 ? "bg-ink/10" : "bg-bone/8",
                        )}
                      >
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
