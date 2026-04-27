"use client";

import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { BoxIcon, PencilIcon, TrashIcon } from "@/components/icons";
import { ProductModal } from "@/components/product-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/components/app-provider";
import { Product } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

type FilterMode = "all" | "active" | "inactive";

function SearchIconInline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="11" cy="11" r="6" />
      <path d="m19 19-3.5-3.5" />
    </svg>
  );
}

export default function DashboardProductsPage() {
  const { currentProducts, deleteProduct, saveProduct, toggleProduct } = useAppState();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const deferredQuery = useDeferredValue(query);

  const filteredProducts = useMemo(() => {
    return currentProducts.filter((product) => {
      const matchesQuery =
        !deferredQuery ||
        `${product.title} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(deferredQuery.toLowerCase());
      const matchesFilter =
        filter === "all" || (filter === "active" ? product.isActive : !product.isActive);

      return matchesQuery && matchesFilter;
    });
  }, [currentProducts, deferredQuery, filter]);

  function handleCreate() {
    setSelectedProduct(null);
    setModalOpen(true);
  }

  function handleEdit(product: Product) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  return (
    <>
      <section className="space-y-4">
        <Card className="rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">Kelola produk & jasa</p>
              <p className="mt-1 text-sm text-muted">
                Atur katalog publik kamu, edit detail item, atau matikan produk sementara.
              </p>
            </div>
            <Button onClick={handleCreate}>Tambah produk</Button>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <SearchIconInline />
              </span>
              <Input
                className="pl-11"
                placeholder="Cari produk, jasa, atau kategori"
                value={query}
                onChange={(event) => {
                  const value = event.target.value;
                  startTransition(() => setQuery(value));
                }}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: "all", label: "Semua" },
                { id: "active", label: "Aktif" },
                { id: "inactive", label: "Nonaktif" }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "rounded-full border px-4 py-3 text-sm font-medium transition",
                    filter === item.id
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-background text-muted hover:text-foreground"
                  )}
                  onClick={() => setFilter(item.id as FilterMode)}
                >
                  {item.label}
                </button>
              ))}
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
                : "Coba ubah kata kunci pencarian atau filter status produk."
            }
            action={<Button onClick={handleCreate}>Tambah produk</Button>}
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="rounded-[2rem] p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img src={product.imageUrl} alt={product.title} className="h-40 w-full rounded-[1.5rem] object-cover sm:h-36 sm:w-36" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-foreground">{product.title}</p>
                          {product.badge ? <Badge className="text-[11px]">{product.badge}</Badge> : null}
                        </div>
                        <p className="mt-1 text-sm text-muted">{product.category}</p>
                      </div>
                      <p className="text-lg font-semibold text-foreground">{formatCurrency(product.price)}</p>
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
