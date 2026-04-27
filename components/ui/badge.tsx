import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "brand" | "success" | "warning" | "neutral";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  brand: "bg-brand/10 text-brand ring-1 ring-brand/10",
  success: "bg-success/10 text-success ring-1 ring-success/10",
  warning: "bg-warning/10 text-warning ring-1 ring-warning/10",
  neutral: "bg-surface-soft text-muted ring-1 ring-line"
};

export function Badge({ className, tone = "brand", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-center text-xs font-semibold leading-none whitespace-nowrap",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
