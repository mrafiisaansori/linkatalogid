import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-3xl border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10",
        className
      )}
      {...props}
    />
  );
});
