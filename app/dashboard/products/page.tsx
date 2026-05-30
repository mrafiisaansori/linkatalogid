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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const deferredQuery = useDeferredValue(query);

  const activeCount = useMemo(() => currentProducts.filter((p) => p.isActive).length, [currentProducts]);
  const inactiveCount = currentProducts.length - activeCount;

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    currentProducts.forEach((p) => { if (p.category) cats.add(p.category.trim()); });
    return Array.from(cats).sort();
  }, [currentProducts]);

  const filteredProducts = useMemo(() => {
    return currentProducts.filter((product) => {
      const matchesQuery =
        !deferredQuery ||
        `${product.title} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(deferredQuery.toLowerCase());
      const matchesFilter =
        filter === "all" || (filter === "active" ? product.isActive : !product.isActive);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes((product.category ?? "").trim());

      return matchesQuery && matchesFilter && matchesCategory;
    });
  }, [currentProducts, deferredQuery, filter, selectedCategories]);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function handleCreate() {
    setSelectedProduct(null);
    setModalOpen(true);
  }

  function handleEdit(product: Product) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  const filters: { id: FilterMode; label: string; count: number }[] = [
    { id: "all", label: "Semua", count: currentProducts.length },
    { id: "active", label: "Aktif", count: activeCount },
    { id: "inactive", label: "Nonaktif", count: inactiveCount }
  ];

  return (
    <>
      <section className="space-y-4">
        <Card className="rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold text-foreground">Kelola produk & jasa</p>
                <Badge tone="neutral">{currentProducts.length} item</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                Atur katalog publik kamu, edit detail item, atau matikan produk sementara.
              </p>
            </div>
            <Button onClick={handleCreate} className="w-full sm:w-auto">Tambah produk</Button>
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
                aria-label="Cari produk"
                onChange={(event) => {
                  const value = event.target.value;
                  startTransition(() => setQuery(value));
                }}
              />
            </div>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0" role="tablist" aria-label="Filter status produk">
              {filters.map((item) => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20",
                      active
                        ? "border-brand bg-brand text-white shadow-card"
                        : "border-line bg-background text-muted hover:text-foreground"
                    )}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        active ? "bg-white/20 text-white" : "bg-surface-soft text-muted"
                      )}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {allCategories.length > 0 && (
            <div className="mt-3 -mx-1 flex flex-wrap gap-2 px-1">
              {allCategories.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20",
                      active
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-line bg-background text-muted hover:text-foreground"
                    )}
                    onClick={() => toggleCategory(cat)}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
                    {cat}
                  </button>
                );
              })}
              {selectedCategories.length > 0 && (
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:text-foreground"
                  onClick={() => setSelectedCategories([])}
                >
                  Reset kategori
                </button>
              )}
            </div>
          )}
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
