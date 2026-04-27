import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-line/80 bg-surface/95 p-5 shadow-soft backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
