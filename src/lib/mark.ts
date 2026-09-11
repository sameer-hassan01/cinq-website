/**
 * The Cinq mark: a C built from five arcs.
 *
 * Cinq is French for five and there are five founders. The letter the name
 * starts with is drawn as a ring cut into five equal segments with one wide
 * opening. At 16px the gaps close up and it reads as a bold C. At poster size
 * you can count the five.
 *
 * Everything that draws the mark (the React component, the logo build, the
 * Open Graph image) reads its geometry from here.
 */
export const MARK = {
  size: 100,
  cx: 50,
  cy: 50,
  r: 33,
  stroke: 20,
  /** degrees of open mouth on the right-hand side */
  opening: 78,
  /** degrees between segments */
  gap: 7,
  segments: 5,
} as const;

function pt(angleDeg: number, r: number = MARK.r) {
  const a = (angleDeg * Math.PI) / 180;
  return [MARK.cx + r * Math.cos(a), MARK.cy - r * Math.sin(a)] as const;
}

const f = (n: number) => Number(n.toFixed(3));

/** One SVG path `d` per segment, in order from the top of the C to the bottom. */
export function markSegments(): string[] {
  const sweep = 360 - MARK.opening;
  const seg = (sweep - MARK.gap * (MARK.segments - 1)) / MARK.segments;
  const start0 = MARK.opening / 2;
  const out: string[] = [];
  for (let i = 0; i < MARK.segments; i++) {
    const a0 = start0 + i * (seg + MARK.gap);
    const a1 = a0 + seg;
    const [x0, y0] = pt(a0);
    const [x1, y1] = pt(a1);
    out.push(`M ${f(x0)} ${f(y0)} A ${MARK.r} ${MARK.r} 0 0 0 ${f(x1)} ${f(y1)}`);
  }
  return out;
}

/** Arc length of one segment, for stroke-dash draw-on animations. */
export function markSegmentLength(): number {
  const sweep = 360 - MARK.opening;
  const seg = (sweep - MARK.gap * (MARK.segments - 1)) / MARK.segments;
  return (seg / 360) * 2 * Math.PI * MARK.r;
}
