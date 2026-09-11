"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { work, type WorkProject } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import {
  DentistoVisual,
  QeematVisual,
  RmsVisual,
  SpiceHutVisual,
} from "@/components/work/visuals";

const visuals = {
  qeemat: QeematVisual,
  rms: RmsVisual,
  dentisto: DentistoVisual,
  spicehut: SpiceHutVisual,
} as const;

const tones: Record<WorkProject["tone"], string> = {
  ink: "bg-ink-2 text-bone",
  accent: "bg-accent text-on-accent",
  deep: "bg-ink-3 text-bone",
  bone: "bg-ink-warm text-bone",
};

/**
 * The work, as one long horizontal room you walk through. On large screens
 * the section pins and vertical scroll becomes sideways travel; on phones the
 * same panels simply stack.
 */
export function Work() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          if (!wrap.current || !track.current) return;
          const dist = () => track.current!.scrollWidth - window.innerWidth;
          const travel = gsap.to(track.current, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: wrap.current,
              start: "top top",
              end: () => `+=${dist()}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Inside the moving room: each panel's copy rises as the panel
          // arrives, and its visual drifts slower than the panel (parallax),
          // so the showcase has depth rather than sliding as one flat sheet.
          gsap.utils.toArray<HTMLElement>(".work-panel").forEach((panel) => {
            gsap.from(panel.querySelectorAll(".work-reveal"), {
              y: 40,
              autoAlpha: 0,
              duration: 1,
              stagger: 0.08,
              ease: "expo.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: travel,
                start: "left 75%",
                once: true,
              },
            });
            const visual = panel.querySelector(".work-visual");
            if (visual) {
              gsap.fromTo(
                visual,
                { xPercent: 10 },
                {
                  xPercent: -10,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: travel,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                },
              );
            }
          });
          gsap.to(".work-progress", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: wrap.current,
              start: "top top",
              end: () => `+=${dist()}`,
              scrub: true,
            },
          });
        },
      );
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".work-panel").forEach((panel) => {
          gsap.from(panel.querySelectorAll(".work-reveal"), {
            y: 30,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: panel, start: "top 80%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <section ref={wrap} id="work" className="relative overflow-hidden bg-ink">
      <div
        ref={track}
        className="flex flex-col gap-4 px-4 py-4 lg:h-[100dvh] lg:flex-row lg:items-stretch lg:gap-5 lg:px-5 lg:py-5"
      >
        {/* Title card */}
        <div className="flex shrink-0 flex-col justify-between rounded-card bg-ink-2 p-7 md:p-10 lg:w-[38vw] lg:min-w-[420px]">
          <p className="t-mono text-accent-text">Work</p>
          <div>
            <h2 className="font-display t-h2 text-balance text-bone">
              Four things we built. Three are ours.
            </h2>
            <p className="t-body mt-6 max-w-[38ch] text-bone-2">
              Products we run ourselves, and one client system large enough to
              prove the point. Every screen here is either the real thing or a
              working slice of it.
            </p>
          </div>
        </div>

        {work.map((p) => {
          const Visual = visuals[p.visual];
          const onAccent = p.tone === "accent";
          return (
            <article
              key={p.slug}
              className={cn(
                "work-panel relative flex shrink-0 flex-col overflow-hidden rounded-card lg:w-[min(84vw,1240px)] lg:flex-row",
                tones[p.tone],
              )}
            >
              <div className="flex flex-col justify-between p-7 md:p-10 lg:w-[42%] lg:shrink-0">
                <div>
                  <p className={cn("work-reveal t-mono", onAccent ? "text-on-accent/70" : "text-accent-text")}>{p.kind}</p>
                  <h3 className="work-reveal font-display-tight mt-4 text-[clamp(2.5rem,4.5vw,4.5rem)]">
                    {p.name}
                  </h3>
                </div>
                <div className="mt-10">
                  <p className="work-reveal font-display t-h3 text-balance">{p.title}</p>
                  <p className={cn("work-reveal t-body mt-5 max-w-[42ch] text-pretty", onAccent ? "text-on-accent/80" : "text-bone-2")}>
                    {p.summary}
                  </p>
                  <p className={cn("work-reveal mt-6 border-t pt-4 t-small font-medium", onAccent ? "border-on-accent/20" : "border-line")}>
                    {p.outcome}
                  </p>
                </div>
              </div>
              <div className="relative min-h-[460px] flex-1 overflow-hidden p-6 md:p-8 sm:min-h-[520px] lg:min-h-0">
                <div className="work-visual absolute inset-6 md:inset-8">
                  <Visual />
                </div>
              </div>
            </article>
          );
        })}

        {/* End card */}
        <div className="flex shrink-0 flex-col justify-between rounded-card bg-ink-2 p-7 md:p-10 lg:w-[38vw] lg:min-w-[420px]">
          <p className="t-mono text-bone-3">Next</p>
          <div>
            <h2 className="font-display t-h2 text-balance text-bone">
              Yours could be the fifth.
            </h2>
            <div className="mt-8">
              <ButtonLink href="#contact" variant="primary">
                Start a project
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-5 bottom-2 hidden h-px bg-line lg:block">
        <div className="work-progress h-full w-full origin-left scale-x-0 bg-accent" />
      </div>
    </section>
  );
}
