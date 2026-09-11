import { Mark } from "./mark";
import { cn } from "@/lib/utils";

/**
 * The mark as a loading indicator: the five segments light up in turn while
 * the ring turns slowly. Drop it anywhere something is buffering.
 */
export function Loader({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className={cn("inline-block text-accent", className)}>
      <Mark className="mark-loader size-full" />
    </span>
  );
}
