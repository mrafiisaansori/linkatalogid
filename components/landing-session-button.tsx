"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/components/app-provider";

type LandingSessionButtonProps = {
  guestLabel: string;
  userLabel: string;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "whatsapp";
  size?: "sm" | "md" | "lg";
  className?: string;
  fullWidth?: boolean;
};

export function LandingSessionButton({
  guestLabel,
  userLabel,
  variant = "primary",
  size = "lg",
  className,
  fullWidth = false
}: LandingSessionButtonProps) {
  const { currentUser } = useAppState();
  const href = currentUser ? "/dashboard" : "/auth";

  return (
    <Link href={href} className={fullWidth ? "w-full" : undefined}>
      <Button variant={variant} size={size} className={className}>
        {currentUser ? userLabel : guestLabel}
      </Button>
    </Link>
  );
}
