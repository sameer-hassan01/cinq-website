"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { contact, nav } from "@/lib/content";
import { getLenis } from "@/components/providers/smooth-scroll";
import { Mark } from "@/components/brand/mark";

const ease = [0.16, 1, 0.3, 1] as const;

const links = [...nav.links, { href: "#contact", label: "Contact" }];

/** Full-screen menu. Links rise out of masks one after another. */
export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[70] flex flex-col bg-ink/90 backdrop-blur-2xl"
          initial={{ clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" }}
          animate={{ clipPath: "inset(0 0 0% 0 round 0 0 0px 0px)" }}
          exit={{ clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="grid h-full w-full grid-rows-[1fr_auto] px-pad pt-[calc(var(--nav-h)+2rem)] pb-8 md:grid-cols-12 md:grid-rows-1 md:items-end md:pb-12">
            <ul className="flex flex-col gap-1 md:col-span-8">
              {links.map((l, i) => (
                <li key={l.href} className="mask-line">
                  <motion.a
                    href={l.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-4 py-1 font-display-tight text-[clamp(2.6rem,9vw,6.5rem)] text-bone transition-colors duration-500 hover:text-accent"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.9, ease, delay: 0.12 + i * 0.06 }}
                  >
                    <span className="t-mono w-6 shrink-0 text-bone-3 transition-colors group-hover:text-accent">
                      0{i + 1}
                    </span>
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>

            <motion.div
              className="flex flex-col gap-4 md:col-span-4 md:items-end md:text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease, delay: 0.4 }}
            >
              <Mark className="size-8 text-accent" />
              <p className="t-body max-w-[28ch] text-bone-2">{nav.menuNote}</p>
              <a
                href={`mailto:${contact.email}`}
                className="group inline-flex items-center gap-2 text-bone underline-offset-4 hover:underline"
              >
                {contact.email}
                <ArrowUpRight size={16} className="text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <div className="flex flex-wrap gap-x-5 gap-y-1 md:justify-end">
                {contact.phones.map((p) => (
                  <a
                    key={p.wa}
                    href={`https://wa.me/${p.wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-small text-bone-2 hover:text-bone"
                  >
                    WhatsApp {p.name.split(" ")[0]}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
