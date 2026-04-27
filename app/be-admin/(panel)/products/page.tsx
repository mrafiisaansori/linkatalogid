import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { BoxIcon, EyeIcon, WhatsAppIcon } from "@/components/icons";
import { getAdminProductsData } from "@/lib/server/admin-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

function normalizeStatus(value?: string) {
  return value === "active" || value === "inactive" ? value : "all";
}

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const status = normalizeStatus(params.status);
  const products = await getAdminProductsData({ query, status });

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Badge className="w-fit" tone="brand">
              Product monitoring
            </Badge>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Pantau semua produk dan jasa</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              Lihat item terbaru, performa klik WhatsApp, jumlah product views, dan pemilik katalog dari tiap produk.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-background px-4 py-3">
            <p className="text-sm text-muted">Total hasil</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{products.length}</p>
          </div>
        </div>

        <form className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Cari judul produk, kategori, nama owner, atau username"
              className="pl-11"
            />
          </div>
          <select
            name="status"
            defaultValue={status}
            className="h-12 w-full rounded-2xl border border-line bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          >
            <option value="all">Semua status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 lg:flex-none">
              Terapkan
            </Button>
            <Link href="/be-admin/products">
              <Button type="button" variant="secondary" className="w-full lg:w-auto">
                Reset
              </Button>
            </Link>
          </div>
        </form>
      </Card>

      {products.length === 0 ? (
        <EmptyState
          icon={<BoxIcon className="h-6 w-6" />}
          title="Produk tidak ditemukan"
          description="Belum ada produk yang cocok dengan filter ini."
        />
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="rounded-[2rem] p-5">
              <div className="flex flex-col gap-4 xl:flex-row">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-32 w-full rounded-[1.5rem] object-cover xl:w-40"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-foreground">{product.title}</p>
                    {product.badge ? <Badge>{product.badge}</Badge> : null}
                    <Badge tone={product.isActive ? "success" : "warning"}>
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    @{product.ownerUsername ?? "unknown"} • {product.ownerName ?? "Tanpa owner"} •{" "}
                    {product.category || "Tanpa kategori"}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted">{product.description}</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.25rem] border border-line bg-background px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">Harga</p>
                      <p className="mt-2 text-lg font-semibold text-foreground">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-line bg-background px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">Product views</p>
                      <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-foreground">
                        <EyeIcon className="h-4 w-4 text-brand" />
                        {product.views}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-line bg-background px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">WA clicks</p>
                      <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-foreground">
                        <WhatsAppIcon className="h-4 w-4 text-success" />
                        {product.clicks}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted">Dibuat {formatDateTime(product.createdAt)}</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
                  <Link href={`/be-admin/users/${product.userId}`}>
                    <Button variant="secondary" className="w-full sm:w-auto xl:w-full">
                      Buka owner
                    </Button>
                  </Link>
                  {product.ownerUsername ? (
                    <Link href={`/${product.ownerUsername}`} target="_blank">
                      <Button variant="secondary" className="w-full sm:w-auto xl:w-full">
                        Buka katalog
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
