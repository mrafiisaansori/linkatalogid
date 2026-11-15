"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon, CloseIcon, CopyIcon, StoreIcon } from "@/components/icons";

const URL = "https://zonakasir.com/?utm_source=linkatalog&utm_campaign=promo_card&utm_medium=";
const CODE = "LINKATALOG";

function CodeChip() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      aria-label={`Salin kode promo ${CODE}`}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-dashed border-white/70 bg-white/15 px-3 py-1.5 font-mono text-sm font-bold tracking-wider transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      {copied ? "TERSALIN" : CODE}
      {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
    </button>
  );
}

const badge = "rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700";

// Tampil setiap halaman dibuka; ✕ cuma menyembunyikan sampai reload.
export function ZonaKasirPromo({
  medium = "dashboard",
  className = "",
  compact = false
}: {
  medium?: string;
  className?: string;
  compact?: boolean;
}) {
  const [show, setShow] = useState(true);
  if (!show) return null;

  const close = (
    <button
      type="button"
      aria-label="Tutup promo"
      onClick={() => setShow(false)}
      className={`flex shrink-0 items-center justify-center text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
        compact ? "h-7 w-7 rounded-lg" : "absolute right-4 top-4 h-9 w-9 rounded-xl"
      }`}
    >
      <CloseIcon className="h-4 w-4" />
    </button>
  );

  if (compact) {
    return (
      <div className={`${className} bg-orange-700 text-white`}>
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs sm:px-6 sm:text-sm lg:px-8">
          <a href={URL + medium} target="_blank" rel="noopener" className="flex min-w-0 flex-1 items-center gap-2 hover:underline">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/20">
              <StoreIcon className="h-3.5 w-3.5" />
            </span>
            <span className={`${badge} hidden sm:inline`}>Promo</span>
            <span className="leading-snug">
              <span className="block font-semibold">Punya usaha? Coba kasir ZonaKasir →</span>
              <span className="block text-white/90">Kasir digital untuk catat penjualan UMKM</span>
            </span>
          </a>
          {close}
        </div>
      </div>
    );
  }

  return (
    <section className={`${className} relative flex flex-col gap-4 rounded-2xl bg-orange-700 p-5 pr-14 text-white shadow-card sm:flex-row sm:items-center`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
        <StoreIcon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={badge}>Promo khusus seller Linkatalog</span>
        </div>
        <p className="mt-2 font-semibold">Catat penjualan lebih rapi pakai ZonaKasir</p>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm leading-6 text-white/90">
          Masukkan kode <CodeChip /> saat daftar di ZonaKasir.
        </p>
      </div>
      <a
        href={URL + medium}
        target="_blank"
        rel="noopener"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
      >
        Coba ZonaKasir
        <ArrowRightIcon className="h-4 w-4" />
      </a>
      {close}
    </section>
  );
}
