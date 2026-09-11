import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "bone";

type Props = {
  variant?: Variant;
  icon?: "up-right" | "right" | "none";
  children: ReactNode;
  className?: string;
};

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  bone: "btn-bone",
};

function Icon({ kind }: { kind: NonNullable<Props["icon"]> }) {
  if (kind === "none") return null;
  const I = kind === "right" ? ArrowRight : ArrowUpRight;
  return (
    <span className="btn-ico" aria-hidden>
      <I size={16} weight="bold" />
    </span>
  );
}

export function ButtonLink({
  variant = "primary",
  icon = "up-right",
  children,
  className,
  ...rest
}: Props & Omit<ComponentProps<"a">, keyof Props>) {
  return (
    <a className={cn("btn", variantClass[variant], className)} {...rest}>
      <span>{children}</span>
      <Icon kind={icon} />
    </a>
  );
}

export function Button({
  variant = "primary",
  icon = "up-right",
  children,
  className,
  ...rest
}: Props & Omit<ComponentProps<"button">, keyof Props>) {
  return (
    <button className={cn("btn", variantClass[variant], className)} {...rest}>
      <span>{children}</span>
      <Icon kind={icon} />
    </button>
  );
}
