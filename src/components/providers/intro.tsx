"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type IntroState = {
  /** True once the intro overlay has left (or was skipped). Sections wait on
      this before running their entrance animations. */
  ready: boolean;
  /** Whether the overlay should play at all this load. */
  play: boolean;
  finish: () => void;
};

const Ctx = createContext<IntroState>({ ready: true, play: false, finish: () => {} });

export const INTRO_KEY = "cinq-intro-seen";

export function IntroProvider({ children }: { children: ReactNode }) {
  // Server and first client render agree: nothing plays until we have looked
  // at sessionStorage and reduced-motion, so there is no hydration mismatch.
  const [play, setPlay] = useState(false);
  const [ready, setReady] = useState(false);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    // Decided one frame after mount, so the decision reads client-only state
    // (sessionStorage, reduced motion) without a hydration mismatch.
    const id = requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let seen = false;
      try {
        seen = sessionStorage.getItem(INTRO_KEY) === "1";
      } catch {}
      const shouldPlay = !reduce && !seen;
      setPlay(shouldPlay);
      setReady(!shouldPlay);
      setDecided(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({ ready: decided && ready, play, finish }),
    [decided, ready, play, finish],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useIntro() {
  return useContext(Ctx);
}
