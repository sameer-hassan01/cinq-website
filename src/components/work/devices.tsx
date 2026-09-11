import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A phone bezel. Screen is 9:19.5, matching the Qeemat captures. */
export function Phone({
  children,
  className,
  screenClassName,
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-[13rem] rounded-[2.6rem] bg-ink-4 p-[6px] shadow-[0_40px_80px_-20px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(243_239_231/0.18)]",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-[6px] z-10 mx-auto h-[22px] w-[34%] rounded-b-2xl bg-ink-4" />
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[2.2rem] bg-ink",
          screenClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** A browser window. */
export function Browser({
  children,
  className,
  title,
  dark = true,
}: {
  children: ReactNode;
  className?: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-[1.25rem] shadow-[0_40px_80px_-24px_rgb(0_0_0/0.6)]",
        dark ? "bg-ink-2 text-bone" : "bg-bone text-ink",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-9 shrink-0 items-center gap-3 border-b px-4",
          dark ? "border-line bg-ink-3" : "border-ink/10 bg-bone",
        )}
      >
        <span className={cn("t-mono truncate", dark ? "text-bone-3" : "text-ink/50")}>{title}</span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
