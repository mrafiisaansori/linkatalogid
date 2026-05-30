"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import {
  BoxIcon,
  ChartIcon,
  CloseIcon,
  CopyIcon,
  EyeIcon,
  LogoutIcon,
  MenuIcon,
  StoreIcon,
  UserIcon
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppState } from "@/components/app-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: ChartIcon, hint: "Ringkasan toko" },
  { href: "/dashboard/products", label: "Produk", icon: BoxIcon, hint: "Kelola katalog" },
  { href: "/dashboard/profile", label: "Profil", icon: UserIcon, hint: "Profil & toko" }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isDemoMode, isHydrated, copyPublicLink, profileCompletion, signOut } = useAppState();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeLabel = useMemo(
    () => navItems.find((item) => pathname === item.href)?.label ?? "Dashboard",
    [pathname]
  );

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (!isHydrated) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="mt-4 text-sm text-muted">Menyiapkan dashboard kamu...</p>
        </Card>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl rounded-[2rem] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <StoreIcon className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-foreground">Masuk dulu untuk buka dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Dashboard Linkatalog.id dipakai untuk mengelola profil, katalog, dan link publik kamu.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth">
              <Button>Masuk / Daftar</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Kembali ke landing page</Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  const handleSignOut = () => {
    signOut();
    router.push("/auth");
  };

  const userCard = (
    <div className="flex items-center gap-3 rounded-[1.5rem] bg-surface-soft p-3">
      {currentUser.profileImage ? (
        <img
          src={currentUser.profileImage}
          alt={currentUser.name}
          className="h-14 w-14 rounded-2xl object-cover ring-1 ring-line"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <UserIcon className="h-6 w-6" />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{currentUser.name}</p>
        <p className="truncate text-sm text-muted">@{currentUser.username}</p>
      </div>
    </div>
  );

  const progressBlock = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Progress profil</p>
        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
          {profileCompletion.percentage}%
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-surface-soft"
        role="progressbar"
        aria-valuenow={profileCompletion.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${profileCompletion.percentage}%` }}
        />
      </div>
      <p className="text-xs leading-5 text-muted">
        Rapikan profil untuk bikin katalog lebih meyakinkan.
      </p>
      <Link href="/dashboard/profile" className="inline-block">
        <Button variant="secondary" size="sm">
          Lengkapi profil
        </Button>
      </Link>
    </div>
  );

  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-4 space-y-4">
            <Card className="rounded-[2rem] p-5">
              <Link href="/" className="inline-block min-w-0">
                <BrandLockup size="lg" />
              </Link>
              <div className="mt-6">{userCard}</div>
            </Card>

            <Card className="space-y-3 rounded-[2rem] p-4">
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Navigasi</p>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20",
                        active
                          ? "bg-brand text-white shadow-card"
                          : "text-muted hover:bg-surface-soft hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl transition",
                          active ? "bg-white/15 text-white" : "bg-surface-soft text-muted group-hover:text-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span>{item.label}</span>
                        <span className={cn("text-xs font-normal", active ? "text-white/70" : "text-muted")}>
                          {item.hint}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </Card>

            {profileCompletion.percentage < 100 && (
              <Card className="rounded-[2rem] p-5">{progressBlock}</Card>
            )}
          </div>
        </aside>

        {/* Main column */}
        <div className="space-y-6 pb-28 lg:pb-8">
          {isDemoMode ? (
            <Card className="rounded-[1.75rem] border-brand/20 bg-brand/5 px-5 py-4">
              <p className="text-sm font-semibold text-foreground">Mode demo Vercel aktif</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                Perubahan profil dan produk disimpan sementara di browser ini agar flow demo tetap terasa hidup.
              </p>
            </Card>
          ) : null}

          {/* Topbar */}
          <header className="sticky top-4 z-30 flex items-center justify-between gap-3 rounded-[2rem] border border-line bg-surface/85 p-3 shadow-soft backdrop-blur-xl sm:p-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Buka menu"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface text-foreground transition hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 lg:hidden"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Dashboard</p>
                <h1 className="truncate text-xl font-semibold text-foreground sm:text-2xl">{activeLabel}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/${currentUser.username}`} target="_blank" className="hidden sm:inline-block">
                <Button variant="secondary" size="sm">
                  <EyeIcon className="h-4 w-4" />
                  Buka Link
                </Button>
              </Link>
              <Button variant="secondary" size="sm" className="hidden sm:inline-flex" onClick={() => copyPublicLink()}>
                <CopyIcon className="h-4 w-4" />
                Salin link
              </Button>
              <ThemeToggle compact />
              <Button variant="ghost" size="sm" className="hidden lg:inline-flex" onClick={handleSignOut}>
                <LogoutIcon className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </header>

          {children}
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-3 bottom-3 z-40 lg:hidden" aria-label="Navigasi utama">
        <Card className="grid grid-cols-3 gap-1 rounded-[1.75rem] p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20",
                  active ? "bg-brand text-white shadow-card" : "text-muted hover:bg-surface-soft"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </Card>
      </nav>

      {/* Mobile drawer (secondary actions) */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu penjual">
          <div
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-xs flex-col gap-4 overflow-y-auto bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <Link href="/" className="min-w-0">
                <BrandLockup size="md" />
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Tutup menu"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line text-foreground transition hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {userCard}

            <nav className="space-y-1.5" aria-label="Navigasi">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active ? "bg-brand text-white shadow-card" : "text-muted hover:bg-surface-soft hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {profileCompletion.percentage < 100 && (
              <div className="rounded-[1.5rem] border border-line bg-surface-soft p-4">{progressBlock}</div>
            )}

            <div className="mt-auto space-y-2">
              <Link href={`/${currentUser.username}`} target="_blank" className="block">
                <Button variant="secondary" className="w-full">
                  <EyeIcon className="h-4 w-4" />
                  Buka Link
                </Button>
              </Link>
              <Button variant="secondary" className="w-full" onClick={() => copyPublicLink()}>
                <CopyIcon className="h-4 w-4" />
                Salin link
              </Button>
              <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                <LogoutIcon className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
