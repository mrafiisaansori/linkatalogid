"use client";

import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BrandLockup } from "@/components/brand-lockup";
import {
  ActivityIcon,
  BoxIcon,
  ChartIcon,
  CloseIcon,
  GlobeIcon,
  LogoutIcon,
  MenuIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/be-admin/dashboard", label: "Dashboard", icon: ChartIcon },
  { href: "/be-admin/users", label: "Users", icon: UsersIcon },
  { href: "/be-admin/products", label: "Products", icon: BoxIcon },
  { href: "/be-admin/analytics", label: "Analytics", icon: ActivityIcon },
  { href: "/be-admin/settings", label: "Settings", icon: SettingsIcon }
];

function pathLabel(pathname: string) {
  if (pathname.startsWith("/be-admin/users/")) return "User Detail";
  return navItems.find((item) => pathname === item.href)?.label ?? "Admin Panel";
}

export function AdminPanelShell({
  admin,
  children
}: {
  admin: {
    id: string;
    username: string;
    role: string;
    isActive: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const activeLabel = useMemo(() => pathLabel(pathname), [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "same-origin"
      });
    } finally {
      router.push("/be-admin");
      router.refresh();
      setLoggingOut(false);
    }
  }

  const navigation = (
    <div className="space-y-4">
      <Card className="rounded-[2rem] p-5">
        <Link href="/be-admin/dashboard" className="min-w-0">
          <BrandLockup size="lg" tagline={false} />
        </Link>
        <div className="mt-5 rounded-[1.5rem] bg-surface-soft p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <ShieldIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{admin.username}</p>
              <p className="text-sm text-muted">{admin.role}</p>
            </div>
          </div>
          <Badge className="mt-4 w-fit" tone="success">
            Akses internal aktif
          </Badge>
        </div>
      </Card>

      <Card className="rounded-[2rem] p-4">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Navigasi</p>
        <div className="mt-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setNavOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-brand text-white shadow-card"
                    : "text-muted hover:bg-surface-soft hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </Card>

      <Card className="rounded-[2rem] p-5">
        <p className="text-sm font-semibold text-foreground">Panel privat Linkatalog</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Akses admin tetap tersembunyi dari area publik dan hanya berjalan lewat URL langsung.
        </p>
        <Link href="/" target="_blank" className="mt-4 inline-block">
          <Button variant="secondary" size="sm">
            <GlobeIcon className="h-4 w-4" />
            Buka app publik
          </Button>
        </Link>
      </Card>
    </div>
  );

  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-[300px] shrink-0 lg:block">
          <div className="sticky top-4">{navigation}</div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4 pb-24 lg:space-y-6 lg:pb-8">
          <header className="sticky top-4 z-30 rounded-[2rem] border border-line bg-surface/90 p-4 shadow-soft backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-background text-foreground lg:hidden"
                  onClick={() => setNavOpen(true)}
                  aria-label="Buka navigasi admin"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-sm text-muted">Private Admin Panel</p>
                  <h1 className="text-2xl font-semibold text-foreground">{activeLabel}</h1>
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                <ThemeToggle compact />
                <Link href="/" target="_blank">
                  <Button variant="secondary" size="sm">
                    <GlobeIcon className="h-4 w-4" />
                    App
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} loading={loggingOut}>
                  <LogoutIcon className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto lg:hidden">
              <div className="flex min-w-max gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                        active
                          ? "bg-brand text-white"
                          : "border border-line bg-background text-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>

          <div>{children}</div>
        </div>
      </div>

      {navOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden">
          <div className="absolute inset-y-0 left-0 w-full max-w-xs p-4">
            <div className="flex h-full flex-col rounded-[2rem] border border-line bg-background p-4 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <BrandLockup tagline={false} />
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-surface text-foreground"
                  onClick={() => setNavOpen(false)}
                  aria-label="Tutup navigasi admin"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">{navigation}</div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
