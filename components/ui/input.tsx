import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-line bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10",
          className
        )}
        {...props}
      />
    );
  }
);
