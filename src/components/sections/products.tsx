"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { products } from "@/lib/content";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { Mark } from "@/components/brand/mark";
import { RevealText } from "@/components/fx/reveal-text";

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Three products, three cells, no filler tile. Qeemat gets the big cell
 * because it is the one with real screens to show.
 */
export function Products() {
  const [qeemat, rms, dentisto] = products.items;

  return (
    <section id="products" className="relative bg-ink px-pad py-24 md:py-36">
      <div className="mx-auto max-w-[1280px]">
        <RevealText className="font-display t-h2 max-w-[22ch] text-balance text-bone">
          {products.heading}
        </RevealText>

        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-12 md:grid-rows-2">
          {/* Qeemat */}
          <Reveal className="md:col-span-7 md:row-span-2" delay={0.05}>
            <SpotlightCard className="h-full">
              <article className="bezel h-full">
                <div className="core relative flex h-full min-h-[560px] flex-col overflow-hidden md:min-h-[680px]">
                  <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_80%_100%,rgb(255_77_31/0.35),transparent_70%)]" />
                  <div className="relative z-10 flex flex-col gap-4 p-7 md:p-9">
                    <Header name={qeemat.name} status={qeemat.status} />
                    <p className="t-lead max-w-[30ch] text-bone">{qeemat.get}</p>
                    <p className="t-body max-w-[46ch] text-bone-2">{qeemat.what}</p>
                    <CtaLink href={qeemat.href}>{qeemat.cta}</CtaLink>
                  </div>
                  <div className="relative mt-auto h-[360px] md:h-[380px]">
                    <div className="absolute right-[8%] bottom-[-16%] w-[200px] rotate-[-8deg] overflow-hidden rounded-[1.6rem] shadow-[0_40px_60px_-20px_rgb(0_0_0/0.7)] transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-y-[-10px] group-hover:rotate-[-5deg] md:w-[240px]">
                      <Image
                        src="/products/qeemat/add.jpg"
                        alt="Adding a transaction in Qeemat."
                        width={576}
                        height={1160}
                        sizes="240px"
                        className="w-full"
                      />
                    </div>
                    <div className="absolute right-[36%] bottom-[-30%] w-[200px] rotate-[6deg] overflow-hidden rounded-[1.6rem] shadow-[0_40px_60px_-20px_rgb(0_0_0/0.7)] transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-y-[-18px] group-hover:rotate-[3deg] md:w-[240px]">
                      <Image
                        src="/products/qeemat/dashboard.jpg"
                        alt="The Qeemat home screen."
                        width={576}
                        height={1160}
                        sizes="240px"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </article>
            </SpotlightCard>
          </Reveal>

          {/* RMS */}
          <Reveal className="md:col-span-5" delay={0.12}>
            <SpotlightCard className="h-full">
              <article className="bezel h-full">
                <div className="core relative flex h-full flex-col gap-4 overflow-hidden p-7 md:p-9">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(255_77_31/0.22),transparent_55%)]" />
                  <Mark className="absolute -right-10 -bottom-12 size-56 text-accent/15 transition-transform duration-1000 ease-[var(--ease-out)] group-hover:rotate-[-20deg]" />
                  <div className="relative z-10 flex flex-col gap-4">
                    <Header name={rms.name} />
                    <p className="t-lead max-w-[26ch] text-bone">{rms.get}</p>
                    <p className="t-body max-w-[40ch] text-bone-2">{rms.what}</p>
                    <CtaLink href={rms.href}>{rms.cta}</CtaLink>
                  </div>
                </div>
              </article>
            </SpotlightCard>
          </Reveal>

          {/* Dentisto */}
          <Reveal className="md:col-span-5" delay={0.18}>
            <SpotlightCard className="h-full">
              <article className="bezel h-full">
                <div className="core relative flex h-full flex-col gap-4 overflow-hidden p-7 md:p-9">
                  <div
                    className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgb(243_239_231/0.18)_1px,transparent_1px)] [background-size:18px_18px]"
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_100%_0%,rgb(20_19_17/0)_0%,var(--ink-2)_70%)]" />
                  <div className="relative z-10 flex flex-col gap-4">
                    <Header name={dentisto.name} />
                    <p className="t-lead max-w-[26ch] text-bone">{dentisto.get}</p>
                    <p className="t-body max-w-[40ch] text-bone-2">{dentisto.what}</p>
                    <CtaLink href={dentisto.href}>{dentisto.cta}</CtaLink>
                  </div>
                </div>
              </article>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Header({ name, status }: { name: string; status?: string }) {
  return (
    <div className="flex items-center gap-3">
      <h3 className="font-display-tight text-[2rem] text-bone md:text-[2.4rem]">{name}</h3>
      {status ? (
        <span className="rounded-full bg-bone/8 px-2.5 py-1 text-[0.7rem] font-medium text-bone-2">
          {status}
        </span>
      ) : null}
    </div>
  );
}

function CtaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={cn(
        "group/cta mt-2 inline-flex w-fit items-center gap-2 text-[0.95rem] font-medium text-accent",
      )}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out)] group-hover/cta:scale-x-100" />
      </span>
      <ArrowUpRight size={16} weight="bold" className="transition-transform duration-500 ease-[var(--ease-out)] group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
    </a>
  );
}
