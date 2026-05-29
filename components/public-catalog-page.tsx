"use client";

import Link from "next/link";
import * as React from "react";
import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BrandLockup, BrandMark } from "@/components/brand-lockup";
import {
  ArrowRightIcon,
  BoltIcon,
  BoxIcon,
  CartIcon,
  ChevronDownIcon,
  CloseIcon,
  EyeIcon,
  LocationIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  StoreIcon,
  TrashIcon,
  UserIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { DEMO_DRAFT_STORAGE_KEY, parseDemoDraft, toPublicCatalogPayload } from "@/lib/demo-draft";
import { PublicCatalogPayload, Product, User } from "@/lib/types";
import { cn, formatCurrency, getAccentPalette, getWhatsappLink, normalizePublicUsername } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */

interface CartItem {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
}

interface PublicCatalogPageProps {
  username: string;
  initialCatalog: PublicCatalogPayload | null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Cart hook — sessionStorage per seller
───────────────────────────────────────────────────────────────────────────── */

function useCart(sellerUsername: string) {
  const key = `linkatalog_cart_${sellerUsername}`;
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load dari sessionStorage saat mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch { /* ignore */ }
    setHydrated(true);
  }, [key]);

  // Simpan ke sessionStorage setiap kali items berubah
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items, key, hydrated]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalQty   = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return { items, addItem, updateQty, removeItem, clearCart, totalQty, totalPrice };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Build WhatsApp checkout message
───────────────────────────────────────────────────────────────────────────── */

function buildCartMessage(sellerName: string, items: CartItem[], totalPrice: number): string {
  const lines: string[] = [];

  lines.push(`Halo ${sellerName}! 👋`);
  lines.push("");
  lines.push("Saya ingin memesan dari katalog Anda:");
  lines.push("");

  items.forEach((item, idx) => {
    const subtotal = item.price * item.quantity;
    const harga    = item.price > 0 ? formatCurrency(item.price) : "Harga sesuai kesepakatan";
    const sub      = item.price > 0 ? ` = ${formatCurrency(subtotal)}` : "";
    lines.push(`${idx + 1}. *${item.title}*`);
    if (item.price > 0) {
      lines.push(`   ${harga} × ${item.quantity}${sub}`);
    } else {
      lines.push(`   Jumlah: ${item.quantity}`);
    }
  });

  if (totalPrice > 0) {
    lines.push("");
    lines.push(`*Total: ${formatCurrency(totalPrice)}*`);
  }

  lines.push("");
  lines.push("Mohon konfirmasi ketersediaan dan info selanjutnya. Terima kasih! 🙏");

  return lines.join("\n");
}

/* ─────────────────────────────────────────────────────────────────────────────
   Cart Drawer
───────────────────────────────────────────────────────────────────────────── */

function CartDrawer({
  open,
  onClose,
  items,
  totalQty,
  totalPrice,
  sellerName,
  sellerWhatsapp,
  accentPrimary,
  onUpdateQty,
  onRemove,
  onClear,
  onWhatsappClick,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  totalQty: number;
  totalPrice: number;
  sellerName: string;
  sellerWhatsapp: string;
  accentPrimary: string;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onWhatsappClick: () => void;
}) {
  // Tutup drawer dengan tombol Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Kunci scroll body saat drawer terbuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleCheckout = () => {
    const message = buildCartMessage(sellerName, items, totalPrice);
    const waUrl   = `https://wa.me/${sellerWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    onWhatsappClick();
    window.open(waUrl, "_blank", "noreferrer");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <CartIcon className="h-5 w-5 text-brand" />
            <div>
              <p className="font-semibold text-foreground">Keranjang</p>
              <p className="text-xs text-muted">{totalQty} item dipilih</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClear}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-soft hover:text-foreground"
              >
                Kosongkan
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-soft hover:text-foreground"
              aria-label="Tutup keranjang"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-surface-soft text-muted">
                <CartIcon className="h-8 w-8" />
              </div>
              <p className="font-semibold text-foreground">Keranjang kosong</p>
              <p className="text-sm leading-6 text-muted">
                Tambahkan produk dari katalog ke keranjang, lalu checkout sekaligus via WhatsApp.
              </p>
              <button
                onClick={onClose}
                className="mt-2 rounded-full border border-line bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-soft"
              >
                Lihat katalog
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 rounded-[1.5rem] border border-line bg-background p-3"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <p className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{item.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.price > 0 ? formatCurrency(item.price * item.quantity) : "Harga sesuai kesepakatan"}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      {/* Qty control */}
                      <div className="flex items-center gap-1 rounded-full border border-line bg-surface-soft">
                        <button
                          onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-background hover:text-foreground"
                          aria-label="Kurangi"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-background hover:text-foreground"
                          aria-label="Tambah"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {/* Hapus */}
                      <button
                        onClick={() => onRemove(item.productId)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-500"
                        aria-label="Hapus dari keranjang"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — ringkasan & tombol checkout */}
        {items.length > 0 && (
          <div className="border-t border-line px-5 py-4 space-y-4">
            <div className="space-y-1.5">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-muted">
                    {item.title} ×{item.quantity}
                  </span>
                  <span className="shrink-0 font-medium text-foreground">
                    {item.price > 0 ? formatCurrency(item.price * item.quantity) : "—"}
                  </span>
                </div>
              ))}
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-lg font-semibold text-foreground">
                  {totalPrice > 0 ? formatCurrency(totalPrice) : "Sesuai kesepakatan"}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-success px-5 py-4 text-sm font-semibold text-white shadow-card transition hover:bg-success-strong active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Checkout via WhatsApp
            </button>
            <p className="text-center text-xs text-muted">
              Pesan akan otomatis terisi di WhatsApp penjual
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Analytics helper
───────────────────────────────────────────────────────────────────────────── */

async function trackAnalyticsEvent(input: {
  eventType: "PAGE_VIEW" | "PRODUCT_VIEW" | "WHATSAPP_CLICK";
  ownerUserId: string;
  productId?: string;
  path: string;
}) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch { /* Tracking tidak boleh mengganggu katalog. */ }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Product card
───────────────────────────────────────────────────────────────────────────── */

function CatalogProductCard({
  product,
  user,
  path,
  accentPrimary,
  accentSoft,
  cartQty,
  onProductViewed,
  onWhatsappClick,
  onAddToCart,
}: {
  product: Product;
  user: User;
  path: string;
  accentPrimary: string;
  accentSoft: string;
  cartQty: number;
  onProductViewed: (productId: string) => void;
  onWhatsappClick: (productId?: string) => void;
  onAddToCart: (product: Product) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        onProductViewed(product.id);
        observer.disconnect();
      },
      { threshold: 0.65 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [onProductViewed, product.id]);

  return (
    <div ref={containerRef}>
      <Card className="group flex h-full overflow-hidden rounded-[2rem] p-0 transition duration-300 hover:-translate-y-1">
        <div className="flex h-full w-full flex-col">
          {/* Gambar */}
          <div className="relative aspect-[16/11] overflow-hidden bg-surface-soft">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {/* Badge qty di keranjang */}
            {cartQty > 0 && (
              <div
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-card"
                style={{ backgroundColor: accentPrimary }}
              >
                {cartQty}
              </div>
            )}
          </div>

          {/* Info */}
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

            <div className="mt-auto space-y-3">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Mulai dari</p>
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <Badge tone="neutral" className="bg-surface-soft text-muted">
                  Siap diorder
                </Badge>
              </div>

              {/* Tombol aksi */}
              <div className="grid grid-cols-2 gap-2">
                {/* Tambah ke keranjang */}
                <button
                  onClick={() => onAddToCart(product)}
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-2.5 text-sm font-semibold transition active:scale-95",
                    cartQty > 0
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-line bg-background text-foreground hover:border-brand hover:bg-brand/5 hover:text-brand"
                  )}
                >
                  <CartIcon className="h-4 w-4" />
                  {cartQty > 0 ? `Ditambah (${cartQty})` : "Keranjang"}
                </button>

                {/* Pesan via WA */}
                {user.whatsapp ? (
                  <a
                    href={getWhatsappLink(user.whatsapp, product.title)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-success px-3 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-success-strong active:scale-95"
                    onClick={() => onWhatsappClick(product.id)}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Pesan
                  </a>
                ) : (
                  <div className="rounded-full border border-line bg-surface-soft px-3 py-2.5 text-center text-xs text-muted">
                    WA belum tersedia
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────────────────────── */

export function PublicCatalogPage({ username, initialCatalog }: PublicCatalogPageProps) {
  const [query, setQuery]                   = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [draftCatalog, setDraftCatalog]     = useState<PublicCatalogPayload | null>(null);
  const [draftResolved, setDraftResolved]   = useState(Boolean(initialCatalog));
  const [cartOpen, setCartOpen]             = useState(false);
  const [addedToast, setAddedToast]         = useState<string | null>(null);

  const deferredQuery       = useDeferredValue(query);
  const trackedProductsRef  = useRef(new Set<string>());

  // ── Draft preview (mode demo) ────────────────────────────────────────────
  useEffect(() => {
    setDraftResolved(Boolean(initialCatalog));
    if (typeof window === "undefined") return;

    const draft = parseDemoDraft(localStorage.getItem(DEMO_DRAFT_STORAGE_KEY));
    if (draft && normalizePublicUsername(draft.user.username) === normalizePublicUsername(username)) {
      setDraftCatalog({
        ...toPublicCatalogPayload(draft),
        products: draft.products.filter((p) => p.isActive),
      });
    } else {
      setDraftCatalog(null);
    }
    setDraftResolved(true);
  }, [initialCatalog, username]);

  const catalog       = draftCatalog ?? initialCatalog;
  const isDraftPreview = Boolean(draftCatalog);
  const user          = catalog?.user ?? null;
  const products      = (catalog?.products ?? []).filter((p) => p.isActive);

  // ── Cart ─────────────────────────────────────────────────────────────────
  const cart = useCart(username);

  // ── Reset saat ganti seller ───────────────────────────────────────────────
  useEffect(() => {
    setQuery("");
    setSelectedCategory("Semua");
    trackedProductsRef.current = new Set<string>();
  }, [username, user?.id]);

  // ── Categories ───────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const items = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ["Semua", ...items.sort((a, b) => a.localeCompare(b, "id-ID"))];
  }, [products]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) setSelectedCategory("Semua");
  }, [categories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return products.filter((p) => {
      const cat = selectedCategory === "Semua" || p.category === selectedCategory;
      const kw  = !q || `${p.title} ${p.description} ${p.category} ${p.badge}`.toLowerCase().includes(q);
      return cat && kw;
    });
  }, [deferredQuery, products, selectedCategory]);

  const hasActiveFilter = Boolean(deferredQuery.trim()) || selectedCategory !== "Semua";

  // ── Analytics ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || typeof window === "undefined") return;
    const pageKey = `linkatalog_page_view_${user.id}`;
    if (sessionStorage.getItem(pageKey)) return;
    sessionStorage.setItem(pageKey, "1");
    void trackAnalyticsEvent({ eventType: "PAGE_VIEW", ownerUserId: user.id, path: `/${user.username}` });
  }, [user]);

  const onProductViewed = useCallback((productId: string) => {
    if (!user || trackedProductsRef.current.has(productId)) return;
    trackedProductsRef.current.add(productId);
    void trackAnalyticsEvent({ eventType: "PRODUCT_VIEW", ownerUserId: user.id, productId, path: `/${user.username}` });
  }, [user]);

  const onWhatsappClick = useCallback((productId?: string) => {
    if (!user) return;
    void trackAnalyticsEvent({ eventType: "WHATSAPP_CLICK", ownerUserId: user.id, productId, path: `/${user.username}` });
  }, [user]);

  // ── Add to cart + mini toast ───────────────────────────────────────────────
  const handleAddToCart = useCallback((product: Product) => {
    cart.addItem(product);
    setAddedToast(product.title);
    window.setTimeout(() => setAddedToast(null), 2000);
  }, [cart]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render states
  // ─────────────────────────────────────────────────────────────────────────

  if (!user && !draftResolved) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl rounded-[2rem] p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="mt-4 text-sm text-muted">Menyiapkan preview katalog...</p>
        </Card>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl rounded-[2rem] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <UserIcon className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-foreground">Halaman tidak ditemukan</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Username katalog ini belum tersedia atau sudah diubah.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/"><Button>Ke landing page</Button></Link>
            <Link href="/auth"><Button variant="secondary">Bikin katalog kamu</Button></Link>
          </div>
        </Card>
      </main>
    );
  }

  const accent             = getAccentPalette(user.themeAccent);
  const generalWhatsappLink = getWhatsappLink(user.whatsapp);
  const categoryCount      = new Set(products.map((p) => p.category)).size;

  const summaryItems = [
    { icon: BoxIcon,   label: "Produk aktif", value: `${products.length}`, description: "Siap ditampilkan" },
    { icon: StoreIcon, label: "Kategori",      value: `${categoryCount}`,   description: "Produk dan jasa" },
    { icon: BoltIcon,  label: "Order",         value: "Langsung",            description: "Masuk ke WhatsApp" },
  ];

  return (
    <main className="page-shell min-h-screen">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-line/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="min-w-0">
            <BrandLockup titleClassName="text-sm" taglineClassName="hidden text-sm sm:block" />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle compact />
            {/* Tombol keranjang di header */}
            {user.whatsapp && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 rounded-full border border-line bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-surface-soft"
                aria-label="Buka keranjang"
              >
                <CartIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Keranjang</span>
                {cart.totalQty > 0 && (
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: accent.primary }}
                  >
                    {cart.totalQty}
                  </span>
                )}
              </button>
            )}
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
        {/* ── Hero card seller ──────────────────────────────────────────────── */}
        <Card className="overflow-hidden rounded-[2rem] p-0">
          <div
            className="relative overflow-hidden p-5 sm:p-8"
            style={{ background: `linear-gradient(135deg, ${accent.soft}, rgba(255,255,255,0.4))` }}
          >
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full blur-3xl" style={{ backgroundColor: `${accent.primary}22` }} />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full blur-3xl" style={{ backgroundColor: `${accent.secondary}1f` }} />

            <div className="relative max-w-4xl space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge className="w-fit border-0 bg-white/85 text-slate-700 shadow-sm ring-0">Katalog personal siap order</Badge>
                {isDraftPreview && (
                  <Badge className="w-fit border-0 bg-slate-900 text-white shadow-sm ring-0">Preview draft browser ini</Badge>
                )}
              </div>

              <div className="flex flex-col gap-4 text-center sm:flex-row sm:text-left">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="mx-auto h-24 w-24 rounded-[1.75rem] object-cover shadow-card sm:mx-0 sm:h-28 sm:w-28" />
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white/80 text-slate-700 shadow-card sm:mx-0 sm:h-28 sm:w-28">
                    <UserIcon className="h-8 w-8" />
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">{user.name}</h1>
                    <p className="mt-1 text-sm text-slate-600">@{user.username}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                    <Badge className="border-0 bg-white/85 text-slate-700 ring-0"><BoxIcon className="mr-1 h-3.5 w-3.5" />{products.length} item aktif</Badge>
                    <Badge className="border-0 bg-white/85 text-slate-700 ring-0"><StoreIcon className="mr-1 h-3.5 w-3.5" />{categoryCount} kategori</Badge>
                    {user.location && (
                      <Badge className="max-w-full border-0 bg-white/85 text-slate-700 ring-0"><LocationIcon className="mr-1 h-3.5 w-3.5" />{user.location}</Badge>
                    )}
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-slate-700">{user.bio}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:flex sm:flex-wrap">
                {user.whatsapp && (
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
                )}
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
            {summaryItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`rounded-[1.5rem] border border-line bg-background p-4 ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`}>
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

        {/* ── Katalog ───────────────────────────────────────────────────────── */}
        <section id="catalog" className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Katalog</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Produk dan jasa</h2>
            </div>
            <div className="flex items-center gap-2 rounded-[1.25rem] border border-line bg-surface px-4 py-3 text-sm text-muted sm:w-auto">
              <CartIcon className="h-4 w-4" />
              Tambah ke keranjang lalu checkout sekaligus
            </div>
          </div>

          {/* Filter */}
          {products.length > 0 && (
            <Card className="overflow-hidden rounded-[2rem] p-0">
              <div
                className="border-b border-line/70 p-5"
                style={{ background: `linear-gradient(135deg, ${accent.soft}88, rgba(255,255,255,0.35))` }}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-2">
                    <Badge className="w-fit border-0 bg-white/80 text-slate-700 ring-0">Temukan produk lebih cepat</Badge>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">Cari berdasarkan nama, kategori, atau kata kunci</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">Filter katalog supaya produk yang dicari langsung ketemu.</p>
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/50 bg-white/75 px-4 py-3 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Menampilkan</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{filteredProducts.length} / {products.length} item</p>
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
                      onChange={(e) => startTransition(() => setQuery(e.target.value))}
                      placeholder="Contoh: serum, paket website, nasi box"
                      className="h-12 w-full rounded-[1.25rem] border border-line bg-background pl-11 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
                    />
                    {query && (
                      <button type="button" aria-label="Bersihkan" className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-surface-soft" onClick={() => setQuery("")}>
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Kategori</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => startTransition(() => setSelectedCategory(e.target.value))}
                      className="h-12 w-full appearance-none rounded-[1.25rem] border border-line bg-background px-4 pr-10 text-sm text-foreground outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c === "Semua" ? "Semua kategori" : c}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral" className="bg-surface-soft text-muted">{selectedCategory === "Semua" ? "Semua kategori" : selectedCategory}</Badge>
                  <Badge tone="neutral" className="bg-surface-soft text-muted">{deferredQuery.trim() ? `Kata kunci: ${deferredQuery.trim()}` : "Tanpa kata kunci"}</Badge>
                </div>
                {hasActiveFilter ? (
                  <button type="button" className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-soft" onClick={() => { setQuery(""); setSelectedCategory("Semua"); }}>
                    <CloseIcon className="h-4 w-4" />
                    Reset filter
                  </button>
                ) : (
                  <p className="text-sm text-muted">Siap bantu pembeli menemukan produk lebih cepat.</p>
                )}
              </div>
            </Card>
          )}

          {/* Grid produk */}
          {products.length === 0 ? (
            <EmptyState icon={<BoxIcon className="h-6 w-6" />} title="Belum ada produk aktif" description="Pemilik katalog ini belum menampilkan produk atau jasanya untuk publik." />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon={<SearchIcon className="h-6 w-6" />}
              title="Produk tidak ditemukan"
              description="Coba ubah kata kunci pencarian atau pilih kategori lain."
              action={
                <button type="button" className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-strong" onClick={() => { setQuery(""); setSelectedCategory("Semua"); }}>
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
                  cartQty={cart.items.find((i) => i.productId === product.id)?.quantity ?? 0}
                  onProductViewed={onProductViewed}
                  onWhatsappClick={onWhatsappClick}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── CTA bikin katalog ─────────────────────────────────────────────── */}
        <section className="mt-8">
          <Card className="rounded-[2rem] p-6 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Butuh halaman seperti ini?</p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">Bikin katalog jualan kamu sendiri di Linkatalog.id</h2>
                <p className="mt-3 text-sm leading-7 text-muted">Tampilkan produk atau jasa dalam satu link, kelola dari dashboard sederhana, lalu terima order langsung via WhatsApp.</p>
              </div>
              <Link href="/auth">
                <Button size="lg">Mulai Gratis <ArrowRightIcon className="h-4 w-4" /></Button>
              </Link>
            </div>
          </Card>
        </section>
      </section>

      {/* ── Floating bottom bar (mobile) ──────────────────────────────────── */}
      {user.whatsapp && (
        <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/88 p-2 shadow-card backdrop-blur-xl">
            <div className="flex items-center gap-3">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="h-11 w-11 rounded-2xl object-cover" />
              ) : (
                <BrandMark size="lg" className="h-11 w-11 rounded-2xl shadow-none ring-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {cart.totalQty > 0 ? `${cart.totalQty} item di keranjang` : `Order ke ${user.name}`}
                </p>
                <p className="truncate text-xs text-white/65">
                  {cart.totalQty > 0 && cart.totalPrice > 0
                    ? `Total ${formatCurrency(cart.totalPrice)}`
                    : "Balas cepat via WhatsApp"}
                </p>
              </div>
              {/* Tombol keranjang */}
              {cart.totalQty > 0 && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative flex h-12 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <CartIcon className="h-4 w-4" />
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                    style={{ backgroundColor: accent.primary }}
                  >
                    {cart.totalQty}
                  </span>
                </button>
              )}
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
      )}

      {/* ── Mini toast "ditambahkan" ───────────────────────────────────────── */}
      <div
        className={cn(
          "pointer-events-none fixed left-1/2 top-20 z-50 -translate-x-1/2 transition-all duration-300",
          addedToast ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        )}
      >
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface/95 px-4 py-2.5 shadow-card backdrop-blur">
          <CartIcon className="h-4 w-4 text-brand" />
          <p className="max-w-[200px] truncate text-sm font-medium text-foreground">
            {addedToast} ditambahkan
          </p>
        </div>
      </div>

      {/* ── Cart Drawer ───────────────────────────────────────────────────── */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        totalQty={cart.totalQty}
        totalPrice={cart.totalPrice}
        sellerName={user.name}
        sellerWhatsapp={user.whatsapp}
        accentPrimary={accent.primary}
        onUpdateQty={cart.updateQty}
        onRemove={cart.removeItem}
        onClear={cart.clearCart}
        onWhatsappClick={() => onWhatsappClick()}
      />
    </main>
  );
}
