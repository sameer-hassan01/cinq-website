import { cn } from "@/lib/utils";
import { Mark } from "./mark";

/** "cinq" in the display face. Lowercase on purpose: the descender of the q
    is the only thing in the word that drops below the line, and it gives the
    wordmark its shape. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn("font-display-tight inline-block leading-none", className)}
      translate="no"
    >
      cinq
    </span>
  );
}

export function Lockup({
  className,
  markClassName,
  textClassName,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Mark className={cn("size-6", markClassName)} />
      <Wordmark
        className={cn("text-[1.45rem] translate-y-[-0.06em]", textClassName)}
      />
    </span>
  );
}
