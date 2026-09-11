"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/brand/wordmark";
import { ProgressMark } from "@/components/brand/progress-mark";
import { RollText } from "@/components/ui/roll-text";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { useIntro } from "@/components/providers/intro";
import { Menu } from "./menu";

/**
 * A floating glass pill, not a bar glued to the top. It steps out of the way
 * while you read downward and comes back the moment you scroll up.
 */
export function Header() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!root.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!ready && !reduce) return;

      gsap.fromTo(
        root.current,
        { yPercent: -220, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: reduce ? 0 : 1.1, ease: "expo.out", delay: reduce ? 0 : 0.5 },
      );

      let hidden = false;
      const show = () => {
        if (!hidden) return;
        hidden = false;
        gsap.to(root.current, { yPercent: 0, duration: 0.6, ease: "expo.out", overwrite: true });
      };
      const hide = () => {
        if (hidden) return;
        hidden = true;
        gsap.to(root.current, { yPercent: -220, duration: 0.5, ease: "power3.in", overwrite: true });
      };
      ScrollTrigger.create({
        start: 120,
        end: "max",
        onUpdate: (self) => {
          if (open) return show();
          if (self.direction === 1 && self.scroll() > 200) hide();
          else show();
        },
        onLeaveBack: show,
      });
    },
    { scope: root, dependencies: [ready, open] },
  );

  return (
    <>
      <header
        ref={root}
        className="fixed inset-x-0 top-4 z-[80] flex justify-center px-4 md:top-6"
        style={{ visibility: "hidden" }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "glass flex h-14 w-full max-w-[1120px] items-center justify-between gap-2 rounded-full pr-2 pl-5 transition-[background-color] duration-500",
            open && "bg-ink/80",
          )}
        >
          <a href="#top" className="flex items-center gap-2 text-bone" aria-label="Cinq, back to top">
            <ProgressMark className="size-6 text-accent" />
            <Wordmark className="text-[1.45rem] translate-y-[-0.06em]" />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative block px-3.5 py-2 text-[0.9rem] font-medium text-bone-2 transition-colors duration-300 hover:text-bone"
                >
                  <RollText>{l.label}</RollText>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ButtonLink
              href={nav.cta.href}
              variant="bone"
              className="hidden py-2 pl-4 text-[0.875rem] sm:inline-flex [&_.btn-ico]:size-7"
            >
              {nav.cta.label}
            </ButtonLink>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid size-10 place-items-center rounded-full bg-bone/8 transition-colors duration-300 hover:bg-bone/14"
            >
              <span
                className={cn(
                  "absolute h-[1.5px] w-4 bg-bone transition-transform duration-500 ease-[var(--ease-out)]",
                  open ? "rotate-45" : "-translate-y-[3px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-[1.5px] w-4 bg-bone transition-transform duration-500 ease-[var(--ease-out)]",
                  open ? "-rotate-45" : "translate-y-[3px]",
                )}
              />
            </button>
          </div>
        </nav>
      </header>
      <Menu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
