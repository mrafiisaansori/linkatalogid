"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppState } from "@/components/app-provider";

const navItems = [
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#demo", label: "Demo" }
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAppState();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="min-w-0">
            <BrandLockup
              titleClassName="text-sm"
              taglineClassName="text-xs"
            />
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link href={currentUser ? "/dashboard" : "/auth"}>
              <Button variant="secondary">{currentUser ? "Buka Dashboard" : "Masuk"}</Button>
            </Link>
            <Link href="/auth">
              <Button>Mulai Gratis</Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle compact />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-foreground"
              onClick={() => setOpen((current) => !current)}
              aria-label="Buka menu"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-x-4 top-[76px] z-50 rounded-[2rem] border border-line bg-surface/95 p-4 shadow-soft transition md:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        )}
      >
        <div className="flex flex-col gap-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-2xl px-4 py-3 text-sm text-foreground transition hover:bg-surface-soft"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Link href={currentUser ? "/dashboard" : "/auth"} onClick={() => setOpen(false)}>
            <Button variant="secondary" className="w-full">
              {currentUser ? "Buka Dashboard" : "Masuk"}
            </Button>
          </Link>
          <Link href="/auth" onClick={() => setOpen(false)}>
            <Button className="w-full">Mulai Gratis</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
