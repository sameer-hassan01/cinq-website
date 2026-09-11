"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, GithubLogo, LinkedinLogo, Globe } from "@phosphor-icons/react/dist/ssr";
import { founders } from "@/lib/content";
import { cn } from "@/lib/utils";
import { RevealText } from "@/components/fx/reveal-text";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Five strips, one per founder. The one you point at opens up. On phones the
 * strips stack and a tap opens them.
 */
export function Founders() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section id="founders" className="relative bg-ink px-pad py-24 md:py-36">
      <div className="mx-auto max-w-[1280px]">
        <RevealText className="font-display t-h2 max-w-[18ch] text-balance text-bone">
          {founders.heading}
        </RevealText>

        <motion.ul
          className="mt-14 flex flex-col gap-3 md:mt-20 md:h-[640px] md:flex-row"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease, delay: 0.1 }}
        >
          {founders.people.map((f, i) => {
            const open = active === i;
            return (
              <li
                key={f.name}
                className={cn(
                  "relative overflow-hidden rounded-card bg-ink-2 transition-[flex-grow,height] duration-[900ms] ease-[var(--ease-out)] md:h-auto",
                  open ? "h-[480px] md:flex-[3.4]" : "h-[96px] md:flex-1",
                )}
                onMouseEnter={() => setActive(i)}
              >
                <button
                  type="button"
                  className="absolute inset-0 z-20 w-full text-left md:cursor-default"
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={open}
                  aria-label={`${f.name}, ${f.role}`}
                />
                <div className="absolute inset-0">
                  <Image
                    src={f.image}
                    alt={`${f.name}, ${f.role} at Cinq.`}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className={cn(
                      "duotone object-cover object-[50%_28%] transition-[transform,filter] duration-[1200ms] ease-[var(--ease-out)]",
                      open ? "scale-100" : "scale-110",
                    )}
                  />
                  {/* Duotone: grayscale image under an ink-to-accent wash. */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-accent mix-blend-multiply transition-opacity duration-1000",
                      open ? "opacity-55" : "opacity-85",
                    )}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(12_11_10/0.95)_0%,rgb(12_11_10/0.35)_45%,transparent_80%)]" />
                </div>

                {/* Collapsed label */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-between px-6 transition-opacity duration-500 md:items-end md:justify-start md:px-0 md:pb-8",
                    open ? "opacity-0" : "opacity-100",
                  )}
                >
                  <span className="font-display text-[1.4rem] text-bone md:absolute md:bottom-8 md:left-1/2 md:origin-center md:-translate-x-1/2 md:-rotate-90 md:whitespace-nowrap md:text-[1.25rem]">
                    {f.first}
                  </span>
                </div>

                {/* Open content */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 transition-[opacity,transform] duration-700 ease-[var(--ease-out)] md:p-8",
                    // z-30 here, not only on the links: the transform below
                    // makes this box its own stacking context, so the links'
                    // z-index alone never climbs above the card's hit area.
                    open ? "z-30 translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-4 opacity-0",
                  )}
                >
                  <p className="t-mono text-accent">{f.role}</p>
                  <h3 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] text-bone">{f.name}</h3>
                  <p className="t-body max-w-[44ch] text-pretty text-bone-2">{f.bio}</p>
                  <div className="relative mt-1 flex items-center gap-2">
                    {f.linkedin ? (
                      <Social href={f.linkedin} label={`${f.first} on LinkedIn`}>
                        <LinkedinLogo size={18} />
                      </Social>
                    ) : null}
                    {f.github ? (
                      <Social href={f.github} label={`${f.first} on GitHub`}>
                        <GithubLogo size={18} />
                      </Social>
                    ) : null}
                    {f.site ? (
                      <Social href={f.site} label={`${f.first}'s website`}>
                        <Globe size={18} />
                      </Social>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </motion.ul>

        <p className="mt-8 flex items-center gap-2 t-small text-bone-3">
          <ArrowUpRight size={14} className="text-accent" />
          Every project is led by one of the five. No account managers in between.
        </p>
      </div>
    </section>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full bg-bone/10 text-bone transition-colors duration-300 hover:bg-accent hover:text-ink"
    >
      {children}
    </a>
  );
}
