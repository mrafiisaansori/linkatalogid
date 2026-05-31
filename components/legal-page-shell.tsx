import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import { ArrowRightIcon } from "@/components/icons";
import { MarketingFooter } from "@/components/marketing-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface LegalPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt?: string;
  children: ReactNode;
}

export function LegalPageShell({ eyebrow, title, description, updatedAt, children }: LegalPageShellProps) {
  return (
    <div className="page-shell min-h-screen overflow-x-clip">
      <header className="sticky top-0 z-40 border-b border-line/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="min-w-0">
            <BrandLockup titleClassName="text-sm" taglineClassName="text-xs" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle compact />
            <Link href="/auth" className="hidden sm:block">
              <Button variant="secondary" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="sm">Mulai Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <Link href="/" className="transition hover:text-foreground">
            Beranda
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{eyebrow}</span>
        </nav>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{title}</h1>
          <p className="mt-4 text-base leading-7 text-muted">{description}</p>
          {updatedAt ? (
            <p className="mt-4 inline-flex items-center rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted">
              Terakhir diperbarui: {updatedAt}
            </p>
          ) : null}
        </div>

        <div className="mt-10 space-y-5">{children}</div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/">
            <Button variant="secondary" className="w-full sm:w-auto">
              Kembali ke beranda
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="w-full sm:w-auto">
              Mulai buat katalog
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

/** Kartu section konten untuk halaman legal/bantuan. */
export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-line/80 bg-surface/95 p-6 shadow-soft backdrop-blur-xl sm:p-7">
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-muted">{children}</div>
    </section>
  );
}
