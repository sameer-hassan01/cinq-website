"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { RevealText } from "@/components/fx/reveal-text";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Four big titles. Hover (or tap) opens the one you are curious about and
 * the rest step back. No cards, no grid: type and space do the work.
 */
export function Services() {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="services" className="relative bg-ink px-pad py-24 md:py-36">
      <div className="mx-auto max-w-[1280px]">
        <div>
          <RevealText className="font-display t-h2 max-w-[16ch] text-balance text-bone">
            {services.heading}
          </RevealText>
          <motion.p
            className="t-lead mt-6 max-w-[48ch] text-pretty text-bone-2"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease, delay: 0.3 }}
          >
            {services.sub}
          </motion.p>
        </div>

        <ul
          className="mt-14 border-t border-line md:mt-20"
          onMouseLeave={() => setActive(null)}
        >
          {services.items.map((s, i) => {
            const open = active === s.id;
            const dim = active !== null && !open;
            return (
              <motion.li
                key={s.id}
                layout
                className="border-b border-line"
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease, delay: i * 0.06 }}
              >
                <button
                  type="button"
                  className="group flex w-full items-center justify-between gap-6 py-7 text-left md:py-9"
                  onMouseEnter={() => setActive(s.id)}
                  onFocus={() => setActive(s.id)}
                  onClick={() => setActive(open ? null : s.id)}
                  aria-expanded={open}
                  aria-controls={`service-${s.id}`}
                >
                  <span
                    className={cn(
                      "font-display t-h3 transition-[color,transform] duration-700 ease-[var(--ease-out)]",
                      dim ? "text-bone-3" : "text-bone",
                      open && "translate-x-3 md:translate-x-6",
                    )}
                  >
                    {s.title}
                  </span>
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-full transition-[background-color,transform,color] duration-700 ease-[var(--ease-out)]",
                      open ? "rotate-45 bg-accent text-ink" : "bg-bone/6 text-bone-2",
                    )}
                    aria-hidden
                  >
                    <ArrowRight size={18} weight="bold" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`service-${s.id}`}
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.7, ease }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-9 md:grid-cols-12 md:pl-6">
                        <p className="t-body max-w-[52ch] text-pretty text-bone-2 md:col-span-7">
                          {s.description}
                        </p>
                        <ul className="flex flex-col gap-2 md:col-span-5">
                          {s.points.map((p) => (
                            <li key={p} className="flex items-center gap-2 t-small text-bone">
                              <Check size={14} weight="bold" className="text-accent" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
