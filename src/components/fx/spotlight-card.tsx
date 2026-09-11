"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A card that tilts toward the cursor and whose border lights up where the
 * cursor is. Motion values only: nothing here re-renders on pointer move.
 */
export function SpotlightCard({
  children,
  className,
  tilt = 6,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const hover = useMotionValue(0);

  const rx = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), { stiffness: 140, damping: 18 });
  const glow = useSpring(hover, { stiffness: 120, damping: 20 });
  const glowPct = useTransform(glow, (v) => Math.round(v * 100));

  const border = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, color-mix(in srgb, var(--accent) ${glowPct}%, transparent), transparent 65%)`;
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, color-mix(in srgb, var(--bone) 6%, transparent), transparent 60%)`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    px.set(x / r.width);
    py.set(y / r.height);
    hover.set(0.9);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className={cn("group relative rounded-card", className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card p-px"
        style={{
          background: border,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card"
        style={{ background: sheen }}
      />
      {children}
    </motion.div>
  );
}
