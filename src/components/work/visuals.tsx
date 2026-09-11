"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Browser, Phone } from "./devices";

/* ─── Qeemat: the real product ───────────────────────────────────────────── */

export function QeematVisual() {
  const reduce = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);

  // The video is always in the markup so server and client agree; under
  // reduced motion it simply never plays and the poster stays.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (reduce) {
      v.pause();
      v.removeAttribute("autoplay");
    } else {
      v.play().catch(() => {});
    }
  }, [reduce]);

  return (
    <div className="relative flex h-full w-full items-end justify-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_70%,rgb(255_77_31/0.32),transparent_70%)]" />
      <Phone className="relative z-10 translate-y-[8%] -rotate-[4deg] md:w-[14rem] lg:w-[15.5rem]">
        <Image
          src="/products/qeemat/dashboard.jpg"
          alt="The Qeemat home screen: balance across all accounts, income and spend, and shortcuts to scan a receipt or add an entry."
          width={576}
          height={1160}
          className="h-full w-full object-cover"
          sizes="260px"
        />
      </Phone>
      <Phone className="relative z-20 -ml-10 translate-y-[2%] rotate-[5deg] md:w-[14rem] lg:w-[15.5rem]">
        <video
          ref={video}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/products/qeemat/capture-poster.jpg"
          aria-label="Qeemat detecting a bank alert and offering to add the transaction."
        >
          <source src="/products/qeemat/capture.webm" type="video/webm" />
          <source src="/products/qeemat/capture.mp4" type="video/mp4" />
        </video>
      </Phone>
    </div>
  );
}

/* ─── Cinq RMS: a working slice of the floor board ───────────────────────── */

type OrderState = "new" | "kitchen" | "ready" | "served";
const STATES: OrderState[] = ["new", "kitchen", "ready", "served"];
const stateLabel: Record<OrderState, string> = {
  new: "New",
  kitchen: "In kitchen",
  ready: "Ready",
  served: "Served",
};

const seedOrders = [
  { id: "T4", items: "2× Karahi, naan ×4", state: 1 },
  { id: "T9", items: "Biryani, raita", state: 0 },
  { id: "T2", items: "Seekh kebab ×6", state: 2 },
  { id: "D1", items: "Delivery, 3 items", state: 0 },
  { id: "T7", items: "Chai ×3", state: 3 },
];

export function RmsVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [orders, setOrders] = useState(seedOrders);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => {
      setOrders((prev) => {
        const next = prev.map((o) => ({ ...o }));
        const i = tick % next.length;
        next[i].state = (next[i].state + 1) % STATES.length;
        return next;
      });
      setTick((t) => t + 1);
    }, 1500);
    return () => clearInterval(id);
  }, [inView, reduce, tick]);

  const tables = Array.from({ length: 12 }, (_, i) => i + 1);
  const busy = new Set(orders.filter((o) => o.state < 3 && o.id.startsWith("T")).map((o) => Number(o.id.slice(1))));

  return (
    <div ref={ref} className="flex h-full w-full items-center justify-center">
      <Browser title="Cinq RMS  /  Floor  /  Branch 1" className="aspect-[16/10] max-w-[640px]">
        <div className="grid h-full grid-cols-[1.1fr_1fr]">
          <div className="border-r border-line p-4">
            <p className="t-mono mb-3 text-bone-3">Tables</p>
            <div className="grid grid-cols-4 gap-2">
              {tables.map((t) => (
                <div
                  key={t}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-xl text-[0.8rem] font-medium transition-colors duration-700",
                    busy.has(t) ? "bg-accent text-ink" : "bg-bone/6 text-bone-2",
                  )}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4">
            <p className="t-mono mb-3 text-bone-3">Orders</p>
            <ul className="flex flex-col gap-2">
              {orders.map((o) => {
                const s = STATES[o.state];
                return (
                  <motion.li
                    key={o.id}
                    layout
                    className="flex items-center justify-between gap-3 rounded-xl bg-bone/5 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[0.8rem] font-medium">{o.id}</p>
                      <p className="truncate text-[0.7rem] text-bone-3">{o.items}</p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium transition-colors duration-500",
                        s === "new" && "bg-bone/10 text-bone",
                        s === "kitchen" && "bg-amber/20 text-amber",
                        s === "ready" && "bg-accent/20 text-accent",
                        s === "served" && "bg-bone/6 text-bone-3",
                      )}
                    >
                      {stateLabel[s]}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </Browser>
    </div>
  );
}

/* ─── Dentisto: the diary and the chart ───────────────────────────────────── */

const diary = [
  { time: "09:00", who: "Patient A", what: "Check-up" },
  { time: "09:40", who: "Patient B", what: "Filling, upper left" },
  { time: "10:30", who: "Patient C", what: "Scaling" },
  { time: "11:15", who: "Patient D", what: "Root canal, visit 2" },
  { time: "12:00", who: "Patient E", what: "Crown fitting" },
];

export function DentistoVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % diary.length), 1800);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const treated = new Set([3, 4, 12, 21, 27]);
  const upper = Array.from({ length: 16 }, (_, i) => i + 1);
  const lower = Array.from({ length: 16 }, (_, i) => i + 17);
  const current = active === 1 ? new Set([12]) : active === 3 ? new Set([27]) : active === 4 ? new Set([4]) : new Set<number>();

  return (
    <div ref={ref} className="flex h-full w-full items-center justify-center">
      <Browser title="Dentisto  /  Today" className="aspect-[16/10] max-w-[640px]">
        <div className="grid h-full grid-cols-[1fr_1fr]">
          <ul className="flex flex-col border-r border-line">
            {diary.map((d, i) => (
              <li
                key={d.time}
                className={cn(
                  "flex items-center gap-3 border-b border-line px-4 py-2.5 transition-colors duration-500 last:border-b-0",
                  i === active ? "bg-accent/12" : "",
                )}
              >
                <span className="t-mono w-10 text-bone-3">{d.time}</span>
                <div className="min-w-0">
                  <p className="truncate text-[0.8rem] font-medium">{d.who}</p>
                  <p className="truncate text-[0.7rem] text-bone-3">{d.what}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col justify-center gap-4 p-4">
            <p className="t-mono text-bone-3">Chart</p>
            {[upper, lower].map((row, r) => (
              <div key={r} className="grid grid-cols-8 gap-1.5">
                {row.map((n) => (
                  <span
                    key={n}
                    className={cn(
                      "block aspect-[3/4] rounded-[35%_35%_45%_45%] transition-colors duration-500",
                      current.has(n)
                        ? "bg-accent"
                        : treated.has(n)
                          ? "bg-amber/70"
                          : "bg-bone/15",
                    )}
                  />
                ))}
              </div>
            ))}
            <p className="text-[0.7rem] text-bone-3">{diary[active].who}: {diary[active].what}</p>
          </div>
        </div>
      </Browser>
    </div>
  );
}

/* ─── SpiceHUT: five products, one system ────────────────────────────────── */

const spiceApps = [
  { name: "Customer app", os: "iOS", rows: ["Butter chicken", "Garlic naan", "Mango lassi"] },
  { name: "Customer app", os: "Android", rows: ["Butter chicken", "Garlic naan", "Mango lassi"] },
  { name: "Staff app", os: "iOS", rows: ["Order 412  ·  Ready", "Order 413  ·  Cooking", "Order 414  ·  New"] },
  { name: "Staff app", os: "Android", rows: ["Order 412  ·  Ready", "Order 413  ·  Cooking", "Order 414  ·  New"] },
];

export function SpiceHutVisual() {
  return (
    <div className="relative flex h-full w-full items-end justify-center overflow-visible">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_80%,rgb(255_176_32/0.22),transparent_70%)]" />
      <Browser title="spicehut.ca" className="absolute bottom-[38%] z-0 aspect-[16/9] w-[78%] max-w-[520px] opacity-90">
        <div className="grid h-full grid-cols-3 gap-3 p-4">
          {["Menu", "Order online", "Locations"].map((t, i) => (
            <div key={t} className={cn("rounded-lg p-3", i === 1 ? "bg-accent text-ink" : "bg-bone/6")}>
              <p className="text-[0.75rem] font-medium">{t}</p>
              <div className="mt-2 space-y-1">
                <span className="block h-1.5 w-full rounded bg-current opacity-30" />
                <span className="block h-1.5 w-2/3 rounded bg-current opacity-30" />
              </div>
            </div>
          ))}
        </div>
      </Browser>
      <div className="relative z-10 flex items-end gap-[-1rem]">
        {spiceApps.map((a, i) => (
          <Phone
            key={i}
            className={cn(
              "w-[7.5rem] md:w-[8.5rem]",
              i === 0 && "translate-y-[18%] -rotate-[9deg]",
              i === 1 && "-ml-6 translate-y-[6%] -rotate-[3deg]",
              i === 2 && "-ml-6 translate-y-[6%] rotate-[3deg]",
              i === 3 && "-ml-6 translate-y-[18%] rotate-[9deg]",
            )}
          >
            <div className="flex h-full flex-col gap-2 p-3 pt-8">
              <p className="text-[0.6rem] font-medium text-bone">{a.name}</p>
              <p className="t-mono text-[0.55rem] text-bone-3">{a.os}</p>
              <div className="mt-1 space-y-1.5">
                {a.rows.map((r) => (
                  <div key={r} className="rounded-md bg-bone/6 px-2 py-1.5 text-[0.55rem] text-bone-2">
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </Phone>
        ))}
      </div>
    </div>
  );
}
