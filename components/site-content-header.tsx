import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

/** Header ringkas untuk halaman konten (blog, legal) — selaras dengan marketing header. */
export function SiteContentHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0">
          <BrandLockup titleClassName="text-sm" taglineClassName="text-xs" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/blog" className="hidden text-sm text-muted transition hover:text-foreground sm:block">
            Blog
          </Link>
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
  );
}
