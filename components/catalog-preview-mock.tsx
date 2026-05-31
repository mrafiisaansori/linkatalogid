import { BrandLockup } from "@/components/brand-lockup";
import {
  CartIcon,
  ChevronDownIcon,
  EyeIcon,
  LocationIcon,
  SearchIcon,
  WhatsAppIcon
} from "@/components/icons";
import { demoProducts, demoUser } from "@/lib/sample-data";
import { cn, formatCurrency, getAccentPalette } from "@/lib/utils";

/**
 * Mockup tampilan katalog publik versi mobile.
 * Presentational saja (tanpa state/logic) — gaya disamakan dengan komponen
 * katalog publik existing agar konsisten secara visual.
 */
export function CatalogPreviewMock({ className }: { className?: string }) {
  const accent = getAccentPalette(demoUser.themeAccent);
  const categories = ["Semua", ...Array.from(new Set(demoProducts.map((item) => item.category).filter(Boolean)))];
  const previewProducts = demoProducts.slice(0, 2);

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[340px] rounded-[2.8rem] border border-white/55 bg-slate-950 p-2.5 shadow-[0_48px_120px_rgba(15,23,42,0.24)] dark:border-white/10",
        className
      )}
    >
      <div className="mb-2 flex justify-center">
        <div className="h-1.5 w-20 rounded-full bg-white/15" />
      </div>

      <div className="overflow-hidden rounded-[2.15rem] border border-black/5 bg-background">
        {/* Header toko */}
        <div className="flex items-center justify-between border-b border-line/70 bg-background/95 px-3.5 py-2.5">
          <BrandLockup titleClassName="text-[11px]" tagline={false} />
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-full border border-line bg-background px-2.5 py-1.5 text-[10px] font-semibold text-foreground">
              <CartIcon className="h-3.5 w-3.5" />
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ backgroundColor: accent.primary }}
              >
                2
              </span>
            </div>
            <div className="rounded-full border border-line bg-surface px-2.5 py-1.5 text-[10px] font-semibold text-foreground">
              Buat
            </div>
          </div>
        </div>

        <div className="max-h-[560px] overflow-hidden">
          <div className="space-y-3 bg-background p-3">
            {/* Hero toko */}
            <div
              className="overflow-hidden rounded-[1.6rem] border border-line/70 p-4"
              style={{ background: `linear-gradient(150deg, ${accent.soft} 0%, rgba(255,255,255,0.3) 100%)` }}
            >
              <div className="flex items-start gap-3">
                <img
                  src={demoUser.profileImage}
                  alt={`Foto profil toko ${demoUser.name} pada katalog online`}
                  className="h-16 w-16 rounded-2xl object-cover shadow-md ring-2 ring-white/80"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold leading-tight text-slate-900">{demoUser.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">@{demoUser.username}</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-slate-600 shadow-sm">
                    <LocationIcon className="h-3 w-3" />
                    {demoUser.location}
                  </span>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-slate-700">{demoUser.bio}</p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div
                  className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-[11px] font-semibold shadow-sm"
                  style={{ backgroundColor: accent.primary, color: accent.textOnPrimary }}
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  Tanya WA
                </div>
                <div className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/60 bg-white/75 px-3 py-2.5 text-[11px] font-semibold text-slate-700">
                  <EyeIcon className="h-3.5 w-3.5" />
                  Katalog
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 divide-x divide-line overflow-hidden rounded-[1.4rem] border border-line bg-surface">
              <div className="flex flex-col items-center justify-center py-3">
                <p className="text-lg font-bold text-foreground">{demoProducts.length}</p>
                <p className="text-[10px] text-muted">Produk</p>
              </div>
              <div className="flex flex-col items-center justify-center py-3">
                <p className="text-lg font-bold text-foreground">{categories.length - 1}</p>
                <p className="text-[10px] text-muted">Kategori</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-background px-3.5 py-2.5 text-[11px] text-muted">
              <SearchIcon className="h-3.5 w-3.5" />
              Cari nama produk, kategori…
            </div>

            {/* Kategori */}
            <div className="flex gap-1.5 overflow-hidden">
              {categories.slice(0, 3).map((category, index) =>
                index === 0 ? (
                  <span
                    key={category}
                    className="inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-[10px] font-semibold"
                    style={{ backgroundColor: accent.primary, color: accent.textOnPrimary }}
                  >
                    {category}
                  </span>
                ) : (
                  <span
                    key={category}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-background px-3 py-1.5 text-[10px] font-semibold text-muted"
                  >
                    {category}
                    <ChevronDownIcon className="h-3 w-3" />
                  </span>
                )
              )}
            </div>

            {/* Kartu produk */}
            <div className="space-y-2.5">
              {previewProducts.map((product) => (
                <div key={product.id} className="flex overflow-hidden rounded-2xl border border-line bg-surface">
                  <div className="relative w-[108px] shrink-0 overflow-hidden bg-surface-soft">
                    <img
                      src={product.imageUrl}
                      alt={`Foto produk ${product.title} di katalog ${demoUser.name}`}
                      className="h-full w-full object-cover"
                    />
                    {product.badge ? (
                      <span
                        className="absolute bottom-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold"
                        style={{ backgroundColor: accent.soft, color: accent.primary }}
                      >
                        {product.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5">
                    <div className="space-y-1">
                      <p className="line-clamp-1 text-[12px] font-semibold leading-snug text-foreground">
                        {product.title}
                      </p>
                      <p className="flex items-center gap-1 text-[10px] text-muted">
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: accent.primary }}
                        />
                        {product.category}
                      </p>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[13px] font-bold text-foreground">{formatCurrency(product.price)}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="inline-flex items-center justify-center rounded-lg border border-line bg-background py-1.5 text-foreground">
                          <CartIcon className="h-3.5 w-3.5" />
                        </div>
                        <div
                          className="inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-[10px] font-semibold text-white"
                          style={{ backgroundColor: "#25D366" }}
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5" />
                          Pesan
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating bar checkout */}
        <div className="border-t border-line/70 bg-slate-950 p-1.5">
          <div className="flex items-center gap-2 rounded-2xl px-2 py-1.5">
            <img
              src={demoUser.profileImage}
              alt=""
              aria-hidden="true"
              className="h-9 w-9 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-white">2 item di keranjang</p>
              <p className="truncate text-[10px] text-white/55">Total {formatCurrency(183000)}</p>
            </div>
            <div
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-[10px] font-semibold text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
