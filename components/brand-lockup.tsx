import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandSize = "md" | "lg";

interface BrandMarkProps {
  size?: BrandSize;
  className?: string;
}

interface BrandLockupProps extends BrandMarkProps {
  tagline?: boolean;
  titleClassName?: string;
  taglineClassName?: string;
}

const markSizeClasses: Record<BrandSize, string> = {
  md: "h-10 w-10 rounded-2xl",
  lg: "h-11 w-11 rounded-2xl"
};

export function BrandMark({ size = "md", className }: BrandMarkProps) {
  const pixels = size === "lg" ? 44 : 40;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden shadow-card ring-1 ring-black/5",
        markSizeClasses[size],
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="LINK KATALOG"
        width={pixels}
        height={pixels}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function BrandLockup({
  size = "md",
  tagline = true,
  className,
  titleClassName,
  taglineClassName
}: BrandLockupProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <BrandMark size={size} />
      <div className="min-w-0">
        <p
          className={cn(
            "truncate font-semibold uppercase tracking-[0.18em] text-foreground",
            titleClassName
          )}
        >
          LINK KATALOG
        </p>
        {tagline ? (
          <p className={cn("text-xs text-muted sm:text-sm", taglineClassName)}>
            Katalog jualan dalam 1 link
          </p>
        ) : null}
      </div>
    </div>
  );
}
