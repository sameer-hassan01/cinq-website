import { cn } from "@/lib/utils";

/**
 * Text that rolls upward on hover, letter by letter, revealing a second copy
 * from below. Pure CSS; the parent needs the `group` class.
 */
export function RollText({
  children,
  className,
  delayStep = 18,
}: {
  children: string;
  className?: string;
  delayStep?: number;
}) {
  const letters = children.split("");
  return (
    <span className={cn("relative inline-block overflow-hidden align-bottom", className)} aria-label={children}>
      <span className="flex" aria-hidden>
        {letters.map((ch, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * delayStep}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
      <span className="absolute inset-0 flex" aria-hidden>
        {letters.map((ch, i) => (
          <span
            key={i}
            className="inline-block translate-y-full transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:translate-y-0"
            style={{ transitionDelay: `${i * delayStep}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  );
}
