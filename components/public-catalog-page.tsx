"use client";

import Link from "next/link";
import * as React from "react";
import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef
} from "react";
import { BrandLockup, BrandMark } from "@/components/brand-lockup";
import {
  ArrowRightIcon,
  BoltIcon,
  BoxIcon,
  ChevronDownIcon,
  CloseIcon,
  EyeIcon,
  LocationIcon,
  SearchIcon,
  StoreIcon,
  UserIcon,
  WhatsAppIcon
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PublicCatalogPayload, Product, User } from "@/lib/types";
import { formatCurrency, getAccentPalette, getWhatsappLink } from "@/lib/utils";

interface PublicCatalogPageProps {
  username: string;
  initialCatalog: PublicCatalogPayload | null;
}

async function trackAnalyticsEvent(input: {
  eventType: "PAGE_VIEW" | "PRODUCT_VIEW" | "WHATSAPP_CLICK";
  ownerUserId: string;
  productId?: string;
  path: string;
}) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });
  } catch {
    // Tracking should not block catalog usage.
  }
}

function CatalogProductCard({
  product,
  user,
  path,
  accentPrimary,
  accentSoft,
  onProductViewed,
  onWhatsappClick
}: {
  product: Product;
  user: User;
  path: string;
  accentPrimary: string;
  accentSoft: string;
  onProductViewed: (productId: string) => void;
  onWhatsappClick: (productId?: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (!visible) return;
        onProductViewed(product.id);
        observer.disconnect();
      },
      { threshold: 0.65 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onProductViewed, product.id]);

  const whatsappLink = getWhatsappLink(user.whatsapp, product.title);

  return (
    <div ref={containerRef}>
      <Card className="group flex h-full overflow-hidden rounded-[2rem] p-0 transition duration-300 hover:-translate-y-1">
        <div className="flex h-full w-full flex-col">
          <div className="relative aspect-[16/11] overflow-hidden bg-surface-soft">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col space-y-4 p-4 sm:p-5">
            <div className="flex flex-wrap items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-foreground sm:text-lg">{product.title}</p>
                <p className="mt-1 text-sm text-muted">{product.category}</p>
              </div>
              {product.badge ? (
                <Badge
                  className="shrink-0 px-3.5 py-1.5 ring-0"
                  style={{ backgroundColor: accentSoft, color: accentPrimary }}
                >
                  {product.badge}
                </Badge>
              ) : null}
            </div>
            <p className="line-clamp-3 text-sm leading-7 text-muted">{product.description}</p>
            <div className="mt-auto space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Mulai dari</p>
                  <p className="mt-1 text-xl font-semibold text-foreground">{formatCurrency(product.price)}</p>
                </div>
                <Badge tone="neutral" className="bg-surface-soft text-muted">
                  Siap diorder
                </Badge>
              </div>
              {user.whatsapp ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-success px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-success-strong"
                  onClick={() => onWhatsappClick(product.id)}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Pesan via WhatsApp
                </a>
              ) : (
                <div className="rounded-[1.25rem] border border-line bg-surface-soft px-5 py-3 text-center text-sm text-muted">
                  Nomor WhatsApp belum tersedia
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function PublicCatalogPage({ username, initialCatalog }: PublicCatalogPageProps) {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Semua");
  const deferredQuery = useDeferredValue(query);
  const trackedProductsRef = useRef(new Set<string>());
  const user = initialCatalog?.user ?? null;
  const products = initialCatalog?.products ?? [];

  useEffect(() => {
    setQuery("");
    setSelectedCategory("Semua");
    trackedProductsRef.current = new Set<string>();
  }, [username, user?.id]);

  const categories = useMemo(() => {
    const items = Array.from(new Set(products.map((item) => item.category).filter(Boolean)));
    return ["Semua", ...items.sort((left, right) => left.localeCompare(right, "id-ID"))];
  }, [products]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory("Semua");
    }
  }, [categories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return products.filter((item) => {
      const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${item.title} ${item.description} ${item.category} ${item.badge}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [deferredQuery, products, selectedCategory]);

  const hasActiveFilter = Boolean(deferredQuery.trim()) || selectedCategory !== "Semua";

  useEffect(() => {
    if (!user || typeof window === "undefined") return;

    const pageKey = `linkatalog_page_view_${user.id}`;
    if (sessionStorage.getItem(pageKey)) return;
    sessionStorage.setItem(pageKey, "1");

    void trackAnalyticsEvent({
      eventType: "PAGE_VIEW",
      ownerUserId: user.id,
      path: `/${user.username}`
    });
  }, [user]);

  const onProductViewed = useCallback(
    (productId: string) => {
      if (!user || trackedProductsRef.current.has(productId)) return;
      trackedProductsRef.current.add(productId);

      void trackAnalyticsEvent({
        eventType: "PRODUCT_VIEW",
        ownerUserId: user.id,
        productId,
        path: `/${user.username}`
      });
    },
    [user]
  );

  const onWhatsappClick = useCallback(
    (productId?: string) => {
      if (!user) return;

      void trackAnalyticsEvent({
        eventType: "WHATSAPP_CLICK",
        ownerUserId: user.id,
        productId,
        path: `/${user.username}`
      });
    },
    [user]
  );

  if (!user) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl rounded-[2rem] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <UserIcon className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-foreground">Halaman tidak ditemukan</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Username katalog ini belum tersedia atau sudah diubah. Coba cek kembali link yang kamu buka.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button>Ke landing page</Button>
            </Link>
            <Link href="/auth">
              <Button variant="secondary">Bikin katalog kamu</Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  const accent = getAccentPalette(user.themeAccent);
  const generalWhatsappLink = getWhatsappLink(user.whatsapp);
  const categoryCount = new Set(products.map((item) => item.category)).size;
  const summaryItems = [
    {
      icon: BoxIcon,
      label: "Produk aktif",
      value: `${products.length}`,
      description: "Siap ditampilkan"
    },
    {
      icon: StoreIcon,
      label: "Kategori",
      value: `${categoryCount}`,
      description: "Produk dan jasa"
    },
    {
      icon: BoltIcon,
      label: "Order",
      value: "Langsung",
      description: "Masuk ke WhatsApp"
    }
  ];

  return (
    <main className="page-shell min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="min-w-0">
            <BrandLockup titleClassName="text-sm" taglineClassName="hidden text-sm sm:block" />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle compact />
            <Link href="/auth">
              <Button variant="secondary" size="sm">
                <span className="hidden sm:inline">Buat katalog</span>
                <span className="sm:hidden">Buat</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-32 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-24">
        <Card className="overflow-hidden rounded-[2rem] p-0">
          <div
            className="relative overflow-hidden p-5 sm:p-8"
            style={{
              background: `linear-gradient(135deg, ${accent.soft}, rgba(255,255,255,0.4))`
            }}
          >
            <div
              className="absolute left-0 top-0 h-40 w-40 rounded-full blur-3xl"
              style={{ backgroundColor: `${accent.primary}22` }}
            />
            <div
              className="absolute bottom-0 right-0 h-48 w-48 rounded-full blur-3xl"
              style={{ backgroundColor: `${accent.secondary}1f` }}
            />

            <div className="relative max-w-4xl space-y-5">
              <Badge className="w-fit border-0 bg-white/85 text-slate-700 shadow-sm ring-0">
                Katalog personal siap order
              </Badge>

              <div className="flex flex-col gap-4 text-center sm:flex-row sm:text-left">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="mx-auto h-24 w-24 rounded-[1.75rem] object-cover shadow-card sm:mx-0 sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white/80 text-slate-700 shadow-card sm:mx-0 sm:h-28 sm:w-28">
                    <UserIcon className="h-8 w-8" />
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                      {user.name}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">@{user.username}</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                    <Badge className="border-0 bg-white/85 text-slate-700 ring-0">
                      <BoxIcon className="mr-1 h-3.5 w-3.5" />
                      {products.length} item aktif
                    </Badge>
                    <Badge className="border-0 bg-white/85 text-slate-700 ring-0">
                      <StoreIcon className="mr-1 h-3.5 w-3.5" />
                      {categoryCount} kategori
                    </Badge>
                    {user.location ? (
                      <Badge className="max-w-full border-0 bg-white/85 text-slate-700 ring-0">
                        <LocationIcon className="mr-1 h-3.5 w-3.5" />
                        {user.location}
                      </Badge>
                    ) : null}
                  </div>

                  <p className="max-w-2xl text-sm leading-7 text-slate-700">{user.bio}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:flex sm:flex-wrap">
                {user.whatsapp ? (
                  <a
                    href={generalWhatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full px-5 py-3.5 text-sm font-semibold shadow-card sm:w-auto"
                    style={{ backgroundColor: accent.primary, color: accent.textOnPrimary }}
                    onClick={() => onWhatsappClick()}
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Tanya via WhatsApp
                  </a>
                ) : null}
                <a href="#catalog" className="block w-full sm:w-auto">
                  <Button variant="secondary" className="w-full bg-white/80 text-slate-800 hover:bg-white">
                    <EyeIcon className="h-4 w-4" />
                    Lihat katalog
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-line p-5 sm:grid-cols-3 sm:p-6">
            {summaryItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`rounded-[1.5rem] border border-line bg-background p-4 ${index === 2 ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-soft text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-muted">{item.label}</p>
                      <p className="mt-1 text-xl font-semibold text-foreground">{item.value}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted">{item.description}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <section id="catalog" className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Katalog</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Produk dan jasa</h2>
            </div>
            <div className="flex items-center gap-2 rounded-[1.25rem] border border-line bg-surface px-4 py-3 text-sm text-muted sm:w-auto">
              <EyeIcon className="h-4 w-4" />
              Klik tombol hijau untuk mulai order
            </div>
          </div>

          {products.length > 0 ? (
            <Card className="overflow-hidden rounded-[2rem] p-0">
              <div
                className="border-b border-line/70 p-5"
                style={{
                  background: `linear-gradient(135deg, ${accent.soft}88, rgba(255,255,255,0.35))`
                }}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-2">
                    <Badge className="w-fit border-0 bg-white/80 text-slate-700 ring-0">
                      Temukan produk lebih cepat
                    </Badge>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        Cari berdasarkan nama, kategori, atau kata kunci
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Filter katalog supaya calon pembeli langsung ketemu produk yang dicari.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/50 bg-white/75 px-4 py-3 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Menampilkan</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">
                      {filteredProducts.length} / {products.length} item
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Cari produk</label>
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={query}
                      onChange={(event) => {
                        const value = event.target.value;
                        startTransition(() => setQuery(value));
                      }}
                      placeholder="Contoh: serum, paket website, nasi box"
                      className="h-12 w-full rounded-[1.25rem] border border-line bg-background pl-11 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
                    />
                    {query ? (
                      <button
                        type="button"
                        aria-label="Bersihkan pencarian"
                        className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-surface-soft hover:text-foreground"
                        onClick={() => setQuery("")}
                      >
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Kategori</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(event) => {
                        const value = event.target.value;
                        startTransition(() => setSelectedCategory(value));
                      }}
                      className="h-12 w-full appearance-none rounded-[1.25rem] border border-line bg-background px-4 pr-10 text-sm text-foreground outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "Semua" ? "Semua kategori" : category}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral" className="bg-surface-soft text-muted">
                    {selectedCategory === "Semua" ? "Semua kategori" : selectedCategory}
                  </Badge>
                  <Badge tone="neutral" className="bg-surface-soft text-muted">
                    {deferredQuery.trim() ? `Kata kunci: ${deferredQuery.trim()}` : "Tanpa kata kunci"}
                  </Badge>
                </div>
                {hasActiveFilter ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-soft"
                    onClick={() => {
                      setQuery("");
                      setSelectedCategory("Semua");
                    }}
                  >
                    <CloseIcon className="h-4 w-4" />
                    Reset filter
                  </button>
                ) : (
                  <p className="text-sm text-muted">Siap bantu pembeli menemukan produk dengan lebih cepat.</p>
                )}
              </div>
            </Card>
          ) : null}

          {products.length === 0 ? (
            <EmptyState
              icon={<BoxIcon className="h-6 w-6" />}
              title="Belum ada produk aktif"
              description="Pemilik katalog ini belum menampilkan produk atau jasanya untuk publik."
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon={<SearchIcon className="h-6 w-6" />}
              title="Produk tidak ditemukan"
              description="Coba ubah kata kunci pencarian atau pilih kategori lain supaya produk yang dicari lebih cepat ketemu."
              action={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-strong"
                  onClick={() => {
                    setQuery("");
                    setSelectedCategory("Semua");
                  }}
                >
                  Reset pencarian
                </button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <CatalogProductCard
                  key={product.id}
                  product={product}
                  user={user}
                  path={`/${user.username}`}
                  accentPrimary={accent.primary}
                  accentSoft={accent.soft}
                  onProductViewed={onProductViewed}
                  onWhatsappClick={onWhatsappClick}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <Card className="rounded-[2rem] p-6 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                  Butuh halaman seperti ini?
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
                  Bikin katalog jualan kamu sendiri di Linkatalog.id
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Tampilkan produk atau jasa dalam satu link, kelola dari dashboard sederhana, lalu terima order
                  langsung via WhatsApp.
                </p>
              </div>
              <Link href="/auth">
                <Button size="lg">
                  Mulai Gratis
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </section>

      {user.whatsapp ? (
        <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/88 p-2 shadow-card backdrop-blur-xl">
            <div className="flex items-center gap-3">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="h-11 w-11 rounded-2xl object-cover" />
              ) : (
                <BrandMark size="lg" className="h-11 w-11 rounded-2xl shadow-none ring-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">Order langsung ke {user.name}</p>
                <p className="truncate text-xs text-white/65">Balas cepat via WhatsApp</p>
              </div>
              <a
                href={generalWhatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-white"
                onClick={() => onWhatsappClick()}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chat
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
