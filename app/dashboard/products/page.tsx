"use client";

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// Filter status produk dihilangkan sesuai permintaan; pencarian tetap tersedia.
import { BoxIcon, PencilIcon, TrashIcon } from "@/components/icons";
import { ProductModal } from "@/components/product-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/components/app-provider";
import { getProductQuotaStatus } from "@/lib/plans";
import { Product } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

function SearchIconInline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="11" cy="11" r="6" />
      <path d="m19 19-3.5-3.5" />
    </svg>
  );
}

export default function DashboardProductsPage() {
  const {
    currentProducts,
    deleteProduct,
    saveProduct,
    toggleProduct,
    isProfileComplete,
    isHydrated,
    currentUser,
    pushToast
  } = useAppState();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const deferredQuery = useDeferredValue(query);
  const productQuota = getProductQuotaStatus(currentUser?.plan, currentProducts.length);

  // Penjual wajib melengkapi profil dulu sebelum boleh menambah/mengelola produk.
  useEffect(() => {
    if (isHydrated && currentUser && !isProfileComplete) {
      pushToast({
        title: "Lengkapi profil dulu",
        description: "Isi semua data profil sebelum menambahkan produk.",
        tone: "default"
      });
      router.replace("/dashboard/profile");
    }
  }, [isHydrated, currentUser, isProfileComplete, pushToast, router]);

  const filteredProducts = useMemo(() => {
    return currentProducts.filter((product) => {
      return (
        !deferredQuery ||
        `${product.title} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(deferredQuery.toLowerCase())
      );
    });
  }, [currentProducts, deferredQuery]);

  function handleCreate() {
    if (productQuota.isAtLimit) {
      pushToast({
        title: "Limit item tercapai",
        description: `Akses ${productQuota.definition.name} bisa menyimpan maksimal ${productQuota.limit} item.`,
        tone: "warning"
      });
      return;
    }
    setSelectedProduct(null);
    setModalOpen(true);
  }

  function handleEdit(product: Product) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  // Hindari kedip konten produk saat sedang diarahkan ke halaman profil.
  if (isHydrated && currentUser && !isProfileComplete) {
    return null;
  }

  return (
    <>
      <section className="space-y-4">
        <Card className="rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold text-foreground">Kelola produk & jasa</p>
                <Badge tone="neutral">{currentProducts.length} item</Badge>
                <Badge tone={productQuota.isAtLimit ? "warning" : "success"}>
                  {productQuota.limit === null
                    ? `${productQuota.definition.name}: tanpa batas`
                    : `${productQuota.definition.name}: ${productQuota.used}/${productQuota.limit}`}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                Atur katalog publik kamu, edit detail item, atau matikan produk sementara.
                {productQuota.limit !== null ? ` Sisa slot item: ${productQuota.remaining}.` : ""}
              </p>
            </div>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              Tambah produk
            </Button>
          </div>

          <div className="mt-5">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <SearchIconInline />
              </span>
              <Input
                className="pl-11"
                placeholder="Cari produk, jasa, atau kategori"
                value={query}
                aria-label="Cari produk"
                onChange={(event) => {
                  const value = event.target.value;
                  startTransition(() => setQuery(value));
                }}
              />
            </div>
          </div>

        </Card>

        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={<BoxIcon className="h-6 w-6" />}
            title={currentProducts.length === 0 ? "Belum ada produk" : "Tidak ada hasil yang cocok"}
            description={
              currentProducts.length === 0
                ? "Mulai isi katalog dengan produk atau jasa pertama kamu."
                : "Coba ubah kata kunci pencarian."
            }
            action={<Button onClick={handleCreate}>Tambah produk</Button>}
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="rounded-[2rem] p-4 transition hover:shadow-card">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative">
                    <img src={product.imageUrl} alt={product.title} className="h-44 w-full rounded-[1.5rem] object-cover sm:h-36 sm:w-36" />
                    <span className="absolute left-3 top-3 sm:hidden">
                      <Badge tone={product.isActive ? "success" : "warning"} className="gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", product.isActive ? "bg-success" : "bg-warning")} />
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-foreground">{product.title}</p>
                          {product.badge ? <Badge className="text-[11px]">{product.badge}</Badge> : null}
                          <span className="hidden sm:inline-flex">
                            <Badge tone={product.isActive ? "success" : "warning"} className="gap-1.5 text-[11px]">
                              <span className={cn("h-1.5 w-1.5 rounded-full", product.isActive ? "bg-success" : "bg-warning")} />
                              {product.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted">{product.category}</p>
                      </div>
                      <p className="shrink-0 text-lg font-semibold text-foreground">{formatCurrency(product.price)}</p>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{product.description}</p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-line bg-background px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Switch checked={product.isActive} onChange={() => toggleProduct(product.id)} />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {product.isActive ? "Aktif di halaman publik" : "Sedang disembunyikan"}
                          </p>
                          <p className="text-xs text-muted">
                            {product.isActive
                              ? "Pembeli bisa klik pesan via WhatsApp"
                              : "Produk tetap tersimpan di dashboard"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(product)}>
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.id)}>
                          <TrashIcon className="h-4 w-4" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={saveProduct}
        product={selectedProduct}
      />
    </>
  );
}
