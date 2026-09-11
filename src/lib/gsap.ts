import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export const EASE = "expo.out";
export const EASE_IO = "power3.inOut";

export { gsap, ScrollTrigger, SplitText, useGSAP };
