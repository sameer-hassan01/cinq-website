"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * A soft pool of vermilion light that follows the pointer across the whole
 * page, so every section feels lit from where you are. Fixed, non-interactive,
 * and absent on touch devices where there is no pointer to follow.
 */
export function CursorGlow() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 60, damping: 20, mass: 0.8 });
  const sy = useSpring(y, { stiffness: 60, damping: 20, mass: 0.8 });
  const opacity = useMotionValue(0);
  const so = useSpring(opacity, { stiffness: 80, damping: 20 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const id = requestAnimationFrame(() => setEnabled(true));
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    };
    const leave = () => opacity.set(0);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y, opacity]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[5] size-[52vmax] rounded-full mix-blend-screen"
      style={{
        x: sx,
        y: sy,
        opacity: so,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(closest-side, rgb(255 77 31 / 0.16), rgb(255 77 31 / 0.05) 45%, transparent 70%)",
      }}
    />
  );
}
