"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import {
  BoxIcon,
  ChartIcon,
  CopyIcon,
  EyeIcon,
  StoreIcon,
  UserIcon
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppState } from "@/components/app-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: ChartIcon },
  { href: "/dashboard/products", label: "Produk", icon: BoxIcon },
  { href: "/dashboard/profile", label: "Profil", icon: UserIcon }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isDemoMode, isHydrated, copyPublicLink, profileCompletion, signOut } = useAppState();

  const activeLabel = useMemo(
    () => navItems.find((item) => pathname === item.href)?.label ?? "Dashboard",
    [pathname]
  );

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

  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-4 space-y-4">
            <Card className="rounded-[2rem] p-5">
              <Link href="/" className="min-w-0">
                <BrandLockup size="lg" />
              </Link>
              <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] bg-surface-soft p-3">
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.name}
                    className="h-14 w-14 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <UserIcon className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">{currentUser.name}</p>
                  <p className="text-sm text-muted">@{currentUser.username}</p>
                </div>
              </div>
            </Card>

            <Card className="space-y-2 rounded-[2rem] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Navigasi</p>
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
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
              </div>
            </Card>

            <Card className="rounded-[2rem] p-5">
              <p className="text-sm font-semibold text-foreground">Progress profil</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-soft">
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${profileCompletion.percentage}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-muted">
                {profileCompletion.percentage}% lengkap. Rapikan profil untuk bikin katalog lebih meyakinkan.
              </p>
              <Link href="/dashboard/profile" className="mt-4 inline-block">
                <Button variant="secondary" size="sm">
                  Lengkapi profil
                </Button>
              </Link>
            </Card>
          </div>
        </aside>

        <div className="space-y-6 pb-24 lg:pb-8">
          {isDemoMode ? (
            <Card className="rounded-[1.75rem] border-brand/20 bg-brand/5 px-5 py-4">
              <p className="text-sm font-semibold text-foreground">Mode demo Vercel aktif</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                Perubahan profil dan produk disimpan sementara di browser ini agar flow demo tetap terasa hidup.
              </p>
            </Card>
          ) : null}

          <header className="sticky top-4 z-30 flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-line bg-surface/85 p-4 shadow-soft backdrop-blur-xl">
            <div>
              <p className="text-sm text-muted">Dashboard</p>
              <h1 className="text-2xl font-semibold text-foreground">{activeLabel}</h1>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                <Link href={`/${currentUser.username}`} target="_blank" className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    <EyeIcon className="h-4 w-4" />
                    Buka Link
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full sm:w-auto" onClick={() => copyPublicLink()}>
                  <CopyIcon className="h-4 w-4" />
                  Salin link
                </Button>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
                <ThemeToggle compact />
                <Button variant="ghost" className="flex-1 sm:flex-none" onClick={() => {
                  signOut();
                  router.push("/auth");
                }}>
                  Keluar
                </Button>
              </div>
            </div>
          </header>

          {children}
        </div>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-40 lg:hidden">
        <Card className="grid grid-cols-3 rounded-full p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium transition",
                  active ? "bg-brand text-white" : "text-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </Card>
      </nav>
    </main>
  );
}
