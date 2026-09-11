import { MARK, markSegments } from "@/lib/mark";
import { cn } from "@/lib/utils";

const segments = markSegments();

type Props = {
  className?: string;
  /** Adds a class to every arc so GSAP can address them. */
  segmentClassName?: string;
  title?: string;
};

/** The five-segment C. Inherits `currentColor`. */
export function Mark({ className, segmentClassName, title }: Props) {
  return (
    <svg
      viewBox={`0 0 ${MARK.size} ${MARK.size}`}
      className={cn("block shrink-0", className)}
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {segments.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={MARK.stroke}
          strokeLinecap="butt"
          className={segmentClassName}
          data-seg={i}
        />
      ))}
    </svg>
  );
}
