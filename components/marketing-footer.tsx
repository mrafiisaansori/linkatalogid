import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons";
import { FOOTER_LEGAL, FOOTER_NAV, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";

const socialIcon: Record<string, typeof InstagramIcon> = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon
};

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line/70 bg-surface/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <BrandLockup />
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
            Katalog online untuk produk dan jasa. Bagikan satu link katalog, biarkan pelanggan memilih dan memasukkan
            produk ke keranjang, lalu terima pesanan rapi lewat checkout via WhatsApp.
          </p>
        </div>

        <nav aria-label="Navigasi produk">
          <p className="text-sm font-semibold text-foreground">Produk</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/auth" className="transition hover:text-foreground">
                Masuk / Daftar
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Bantuan dan ketentuan">
          <p className="text-sm font-semibold text-foreground">Bantuan & Legal</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {FOOTER_LEGAL.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold text-foreground">Sosial media</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {SOCIAL_LINKS.map((social) => {
              const Icon = socialIcon[social.id];
              return (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 transition hover:text-foreground"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-background text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    {social.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {SITE_NAME}. Katalog online untuk UMKM, seller &amp; toko online.
          </p>
          <p className="flex items-center gap-1.5">
            Pesanan rapi lewat checkout WhatsApp
            <WhatsAppIcon className="h-3.5 w-3.5 text-success" />
          </p>
        </div>
      </div>
    </footer>
  );
}
