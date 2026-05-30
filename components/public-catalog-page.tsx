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
import { BrandLockup } from "@/components/brand-lockup";
import {
  ArrowRightIcon,
  BoxIcon,
  CartIcon,
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
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-background shadow-2xl transition-transform duration-300 sm:max-w-sm",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
              <CartIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Keranjang</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{totalQty} item dipilih</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                onClick={onClear}
                className="rounded-full px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-surface-soft hover:text-foreground dark:text-slate-400"
              >
                Kosongkan
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-surface-soft hover:text-foreground"
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
          <div className="border-t border-line bg-background px-5 pb-6 pt-4 space-y-3">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 px-4 py-3 space-y-1.5">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-slate-600 dark:text-slate-400">
                    {item.title} ×{item.quantity}
                  </span>
                  <span className="shrink-0 font-medium text-slate-800 dark:text-slate-200">
                    {item.price > 0 ? formatCurrency(item.price * item.quantity) : "—"}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
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
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Pesan akan otomatis terisi di WhatsApp penjual
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Product Detail Sheet
───────────────────────────────────────────────────────────────────────────── */

function ProductDetailSheet({
  product,
  user,
  open,
  onClose,
  accentPrimary,
  accentSoft,
  cartQty,
  onAddToCart,
  onWhatsappClick,
}: {
  product: Product | null;
  user: User;
  open: boolean;
  onClose: () => void;
  accentPrimary: string;
  accentSoft: string;
  cartQty: number;
  onAddToCart: (product: Product) => void;
  onWhatsappClick: (productId?: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!product) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed z-50 overflow-hidden bg-background shadow-2xl",
          "transition-[transform,opacity] duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          // Mobile: full-width bottom sheet
          "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[2rem]",
          // Desktop: centered modal
          "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:rounded-2xl",
          open
            ? "translate-y-0 opacity-100 sm:-translate-y-1/2"
            : "translate-y-full opacity-0 pointer-events-none sm:translate-y-[-48%]"
        )}
      >
        {/* Handle — mobile only */}
        <div className="flex justify-center pb-1 pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Scrollable content — di-key per produk supaya animasi reveal main ulang tiap buka */}
        <div key={product.id} className="detail-animate overflow-y-auto">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform"
            />
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              aria-label="Tutup"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            {/* Badge */}
            {product.badge && (
              <span
                className="absolute bottom-3 left-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
                style={{ backgroundColor: accentSoft, color: accentPrimary }}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4 p-5">
            {/* Category + title */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: accentPrimary }} />
                <p className="text-xs font-medium text-muted">{product.category}</p>
              </div>
              <h3 className="mt-1.5 text-xl font-bold leading-snug text-foreground">{product.title}</h3>
            </div>

            {/* Price */}
            <div>
              {product.price > 0 ? (
                <p className="text-2xl font-bold text-foreground">{formatCurrency(product.price)}</p>
              ) : (
                <p className="text-base font-medium text-muted">Harga sesuai kesepakatan</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm leading-6 text-muted">{product.description}</p>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pb-2 pt-1">
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition active:scale-95",
                  cartQty > 0
                    ? "border border-brand/40 bg-brand/10 text-brand"
                    : "border border-line bg-background text-foreground hover:bg-surface-soft"
                )}
              >
                <CartIcon className="h-4 w-4" />
                {cartQty > 0 ? `Di keranjang ×${cartQty}` : "Ke Keranjang"}
              </button>
              {user.whatsapp && (
                <a
                  href={getWhatsappLink(user.whatsapp, product.title)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition active:scale-95"
                  style={{ backgroundColor: "#25D366" }}
                  onClick={() => onWhatsappClick(product.id)}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Pesan Sekarang
                </a>
              )}
            </div>
          </div>
        </div>
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
  onOpenDetail,
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
  onOpenDetail: (product: Product) => void;
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
    <div ref={containerRef} className="h-full">
      {/* Seluruh card bisa diklik untuk buka detail.
          Pakai div+onClick (bukan button) karena di dalam card ada <a> dan <button>,
          nested interactive elements = invalid HTML → browser memindahkannya keluar. */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpenDetail(product)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpenDetail(product); }}
        className="block h-full w-full cursor-pointer transition-transform duration-150 active:scale-[0.97]"
      >
        <Card className="group flex h-full overflow-hidden rounded-2xl p-0 transition-all duration-300 hover:shadow-lg hover:ring-2 sm:rounded-[1.75rem]"
          style={{ ["--tw-ring-color" as string]: `${accentPrimary}40` }}
        >
          <div className="flex h-full w-full flex-row sm:flex-col">

            {/* Gambar */}
            <div className="relative w-[130px] flex-shrink-0 overflow-hidden bg-surface-soft sm:w-full sm:aspect-[4/3]">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 hidden h-10 bg-gradient-to-t from-black/20 to-transparent sm:block" />

              {cartQty > 0 && (
                <div
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-md"
                  style={{ backgroundColor: accentPrimary }}
                >
                  {cartQty}
                </div>
              )}

              {product.badge && (
                <div className="absolute bottom-2 left-2 hidden sm:block">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{ backgroundColor: accentSoft, color: accentPrimary }}
                  >
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
              <div className="space-y-1 sm:space-y-1.5">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-[0.9375rem]">
                  {product.title}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted">
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentPrimary }} />
                  {product.category}
                </p>
                {product.badge && (
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold sm:hidden"
                    style={{ backgroundColor: accentSoft, color: accentPrimary }}
                  >
                    {product.badge}
                  </span>
                )}
                {product.description && (
                  <p className="hidden text-xs leading-5 text-muted line-clamp-2 sm:block sm:text-sm sm:leading-6">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Price + Actions */}
              <div className="mt-2.5 space-y-2 sm:mt-3">
                <p className="text-base font-bold text-foreground sm:text-lg">
                  {product.price > 0
                    ? formatCurrency(product.price)
                    : <span className="text-xs font-medium text-muted">Sesuai kesepakatan</span>
                  }
                </p>

                <div className="grid grid-cols-2 gap-1.5">
                  {/* Keranjang — icon only */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition active:scale-95 sm:rounded-full sm:py-2.5",
                      cartQty > 0
                        ? "border border-brand/40 bg-brand/10 text-brand"
                        : "border border-line bg-background text-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
                    )}
                  >
                    <CartIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                    {cartQty > 0 && <span className="text-[10px] font-bold sm:text-xs">×{cartQty}</span>}
                  </button>

                  {/* Pesan WA */}
                  {user.whatsapp ? (
                    <a
                      href={getWhatsappLink(user.whatsapp, product.title)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => { e.stopPropagation(); onWhatsappClick(product.id); }}
                      className="inline-flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-semibold text-white transition active:scale-95 sm:gap-1.5 sm:rounded-full sm:py-2.5"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                      Pesan
                    </a>
                  ) : (
                    <div className="flex items-center justify-center rounded-xl border border-line bg-surface-soft py-2 text-[10px] text-muted sm:rounded-full">
                      Tanpa WA
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const CATEGORY_PILL_LIMIT = 5; // tampilkan max 5 pills, sisanya di "X lainnya"

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

      <section className="mx-auto max-w-6xl px-4 pb-36 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-24">
        {/* ── Hero card seller ──────────────────────────────────────────────── */}
        <Card className="overflow-hidden rounded-2xl p-0 sm:rounded-[2rem]">
          <div
            className="relative overflow-hidden px-4 py-5 sm:px-8 sm:py-8"
            style={{ background: `linear-gradient(150deg, ${accent.soft} 0%, rgba(255,255,255,0.25) 100%)` }}
          >
            {/* Decorative blobs */}
            <div className="absolute -left-8 -top-8 h-48 w-48 rounded-full blur-3xl" style={{ backgroundColor: `${accent.primary}18` }} />
            <div className="absolute -bottom-8 -right-8 h-56 w-56 rounded-full blur-3xl" style={{ backgroundColor: `${accent.secondary}14` }} />

            <div className="relative space-y-4">
              {/* Draft badge */}
              {isDraftPreview && (
                <div className="inline-flex">
                  <Badge className="border-0 bg-slate-900 text-white shadow-sm ring-0">Preview draft</Badge>
                </div>
              )}

              {/* Profile row */}
              <div className="flex items-start gap-4">
                {/* Avatar */}
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-[72px] w-[72px] flex-shrink-0 rounded-2xl object-cover shadow-md ring-2 ring-white/80 sm:h-24 sm:w-24 sm:rounded-[1.5rem]"
                  />
                ) : (
                  <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-2xl bg-white/80 text-slate-600 shadow-md ring-2 ring-white/80 sm:h-24 sm:w-24 sm:rounded-[1.5rem]">
                    <UserIcon className="h-7 w-7 sm:h-9 sm:w-9" />
                  </div>
                )}

                {/* Name + username + meta */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <h1 className="text-xl font-bold leading-tight text-slate-900 sm:text-3xl">{user.name}</h1>
                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">@{user.username}</p>

                  {/* Meta pills — hanya lokasi */}
                  {user.location && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
                        <LocationIcon className="h-3 w-3" />
                        <span className="max-w-[160px] truncate">{user.location}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="max-w-2xl text-sm leading-6 text-slate-700">{user.bio}</p>
              )}

              {/* CTA buttons */}
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {user.whatsapp && (
                  <a
                    href={generalWhatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold shadow-md transition hover:opacity-90 active:scale-95 sm:w-auto"
                    style={{ backgroundColor: accent.primary, color: accent.textOnPrimary }}
                    onClick={() => onWhatsappClick()}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Tanya via WhatsApp
                  </a>
                )}
                <a href="#catalog" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/75 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white active:scale-95">
                  <EyeIcon className="h-4 w-4" />
                  Lihat katalog
                </a>
              </div>
            </div>
          </div>

          {/* Stats bar — 2 kolom */}
          <div className="grid grid-cols-2 divide-x divide-line border-t border-line bg-background">
            <div className="flex flex-col items-center justify-center gap-0.5 py-4 sm:py-5">
              <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{products.length}</p>
              <p className="text-[11px] text-muted sm:text-xs">Produk</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 py-4 sm:py-5">
              <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{categoryCount}</p>
              <p className="text-[11px] text-muted sm:text-xs">Kategori</p>
            </div>
          </div>
        </Card>

        {/* ── Katalog ───────────────────────────────────────────────────────── */}
        <section id="catalog" className="mt-5 space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand">Katalog</p>
              <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">Produk &amp; Jasa</h2>
            </div>
            {products.length > 0 && (
              <div className="shrink-0 text-right">
                <p className="text-xl font-bold text-foreground sm:text-2xl">{filteredProducts.length}</p>
                <p className="text-[11px] text-muted sm:text-xs">{hasActiveFilter ? "hasil filter" : "item"}</p>
              </div>
            )}
          </div>

          {/* ── Filter bar ─────────────────────────────────────────────────── */}
          {products.length > 0 && (
            <div className="space-y-2.5">
              {/* Search input */}
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => startTransition(() => setQuery(e.target.value))}
                  placeholder="Cari nama produk, deskripsi, kategori…"
                  className="h-11 w-full rounded-2xl border border-line bg-background pl-11 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Bersihkan"
                    className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-surface-soft hover:text-foreground"
                    onClick={() => setQuery("")}
                  >
                    <CloseIcon className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Category pills — dengan overflow handling */}
              {categories.length > 2 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {/* Pills yang terlihat */}
                    {(showAllCategories ? categories : categories.slice(0, CATEGORY_PILL_LIMIT)).map((c) => {
                      const active = selectedCategory === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => startTransition(() => setSelectedCategory(c))}
                          className={cn(
                            "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 sm:px-4 sm:py-2 sm:text-sm",
                            active
                              ? "text-white shadow-sm"
                              : "border border-line bg-background text-foreground hover:bg-surface-soft"
                          )}
                          style={active ? { backgroundColor: accent.primary } : undefined}
                        >
                          {c === "Semua" ? "Semua" : c}
                        </button>
                      );
                    })}

                    {/* Tombol "X lainnya" jika masih ada */}
                    {!showAllCategories && categories.length > CATEGORY_PILL_LIMIT && (
                      <button
                        type="button"
                        onClick={() => setShowAllCategories(true)}
                        className="rounded-full border border-dashed border-line bg-background px-3.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-surface-soft hover:text-foreground active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
                      >
                        +{categories.length - CATEGORY_PILL_LIMIT} lainnya
                      </button>
                    )}

                    {/* Tombol "Sembunyikan" jika semua sudah tampil */}
                    {showAllCategories && categories.length > CATEGORY_PILL_LIMIT && (
                      <button
                        type="button"
                        onClick={() => setShowAllCategories(false)}
                        className="rounded-full border border-line bg-background px-3.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-surface-soft hover:text-foreground active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
                      >
                        Sembunyikan
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
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
                  onOpenDetail={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── CTA bikin katalog ─────────────────────────────────────────────── */}
        <section className="mt-8">
          <div className="overflow-hidden rounded-2xl sm:rounded-[2rem]" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
            <div className="relative px-5 py-7 sm:px-8 sm:py-9">
              {/* Decorative */}
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-lg">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Linkatalog.id</p>
                  <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl lg:text-3xl">Bikin katalog jualan kamu sendiri — gratis!</h2>
                  <p className="mt-2.5 text-sm leading-6 text-slate-400">Satu link untuk semua produk. Kelola lewat dashboard, terima order via WhatsApp.</p>
                </div>
                <Link href="/auth" className="shrink-0">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 active:scale-95">
                    Mulai Gratis
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* ── Floating bottom bar (mobile) ──────────────────────────────────── */}
      {user.whatsapp && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 px-3 md:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div
            className="rounded-[1.25rem] p-1.5 shadow-2xl"
            style={{ backgroundColor: "rgba(2, 6, 23, 0.97)" }}
          >
            <div className="flex items-center gap-2">
              {/* Avatar / Brand */}
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="h-10 w-10 flex-shrink-0 rounded-[0.75rem] object-cover" />
              ) : (
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[0.75rem]"
                  style={{ backgroundColor: accent.primary }}
                >
                  <StoreIcon className="h-5 w-5 text-white" />
                </div>
              )}

              {/* Teks info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-tight" style={{ color: "#ffffff" }}>
                  {cart.totalQty > 0 ? `${cart.totalQty} item di keranjang` : user.name}
                </p>
                <p className="truncate text-xs leading-tight" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {cart.totalQty > 0 && cart.totalPrice > 0
                    ? `Total ${formatCurrency(cart.totalPrice)}`
                    : "Chat langsung via WhatsApp"}
                </p>
              </div>

              {/* Keranjang — muncul jika ada item */}
              {cart.totalQty > 0 && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition active:scale-95"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <CartIcon className="h-4 w-4" />
                  <span
                    className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-bold text-white"
                    style={{ backgroundColor: accent.primary }}
                  >
                    {cart.totalQty}
                  </span>
                </button>
              )}

              {/* Chat WA */}
              <a
                href={generalWhatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white transition active:scale-95"
                style={{ backgroundColor: "#25D366" }}
                onClick={() => onWhatsappClick()}
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>Chat</span>
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

      {/* ── Product Detail Sheet ─────────────────────────────────────────── */}
      <ProductDetailSheet
        product={selectedProduct}
        user={user}
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        accentPrimary={accent.primary}
        accentSoft={accent.soft}
        cartQty={selectedProduct ? (cart.items.find((i) => i.productId === selectedProduct.id)?.quantity ?? 0) : 0}
        onAddToCart={handleAddToCart}
        onWhatsappClick={onWhatsappClick}
      />

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
