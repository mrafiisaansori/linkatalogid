import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "whatsapp";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand text-white shadow-card hover:bg-brand-strong focus-visible:ring-brand/40",
  secondary:
    "bg-surface text-foreground shadow-soft ring-1 ring-line hover:bg-surface-soft focus-visible:ring-brand/20",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-soft focus-visible:ring-brand/20",
  outline:
    "bg-transparent text-foreground ring-1 ring-line hover:bg-surface-soft focus-visible:ring-brand/20",
  whatsapp:
    "bg-success text-white shadow-card hover:bg-success-strong focus-visible:ring-success/40"
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-10 px-4 py-2 text-sm",
  md: "min-h-11 px-5 py-2.5 text-sm sm:text-[15px]",
  lg: "min-h-12 px-6 py-3 text-[15px]"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading = false, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-w-0 max-w-full items-center justify-center gap-2 rounded-full text-center font-medium leading-tight whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 [&>svg]:shrink-0",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Memproses...
        </>
      ) : (
        children
      )}
    </button>
  );
});
