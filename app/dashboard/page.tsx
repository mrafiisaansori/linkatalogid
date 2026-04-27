"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRightIcon,
  BoxIcon,
  ChartIcon,
  CopyIcon,
  EyeIcon,
  PencilIcon,
  SparkIcon,
  WhatsAppIcon
} from "@/components/icons";
import { ProductModal } from "@/components/product-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppState } from "@/components/app-provider";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const {
    copyPublicLink,
    currentAnalytics,
    currentProducts,
    currentUser,
    profileCompletion,
    saveProduct
  } = useAppState();
  const [openModal, setOpenModal] = useState(false);

  if (!currentUser) return null;

  const activeProducts = currentProducts.filter((item) => item.isActive);
  const hasAnalytics = currentAnalytics.views > 0 || currentAnalytics.whatsappClicks > 0;

  return (
    <>
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[2rem] bg-hero-mesh p-6 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Halo, {currentUser.name}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-foreground">
            Semua yang kamu butuhkan untuk bagikan katalog dalam satu link sudah siap.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Edit profil, tambah produk atau jasa, lalu arahkan calon pembeli ke halaman publik yang langsung bisa order
            via WhatsApp.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => setOpenModal(true)}>
              Tambah produk
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Link href="/dashboard/profile">
              <Button variant="secondary">Edit profil</Button>
            </Link>
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Link publik kamu</p>
              <p className="mt-1 text-sm text-muted">Siap dibagikan ke bio Instagram, story, atau chat.</p>
            </div>
            <Badge>Live</Badge>
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-line bg-background p-4">
            <p className="text-sm text-muted">Link katalog</p>
            <p className="mt-1 font-semibold text-foreground">linkatalog.id/{currentUser.username}</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link href={`/${currentUser.username}`} target="_blank" className="block w-full">
              <Button variant="secondary" className="w-full">
                <EyeIcon className="h-4 w-4" />
                Buka Link
              </Button>
            </Link>
            <Button className="w-full" onClick={() => copyPublicLink()}>
              <CopyIcon className="h-4 w-4" />
              Salin link
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[2rem] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Total produk</p>
            <BoxIcon className="h-5 w-5 text-brand" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">{currentProducts.length}</p>
          <p className="mt-2 text-sm text-muted">{activeProducts.length} produk aktif tampil di katalog</p>
        </Card>

        <Card className="rounded-[2rem] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Total views</p>
            <ChartIcon className="h-5 w-5 text-brand" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">{formatCompactNumber(currentAnalytics.views)}</p>
          <p className="mt-2 text-sm text-muted">Placeholder analytics yang akan naik saat halaman publik dibuka</p>
        </Card>

        <Card className="rounded-[2rem] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">WhatsApp clicks</p>
            <WhatsAppIcon className="h-5 w-5 text-success" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {formatCompactNumber(currentAnalytics.whatsappClicks)}
          </p>
          <p className="mt-2 text-sm text-muted">Klik CTA order dari halaman publik kamu</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">Progress profil</p>
              <p className="mt-1 text-sm text-muted">Lengkapi profil agar calon pembeli lebih percaya.</p>
            </div>
            <Badge className="text-sm">
              {profileCompletion.percentage}%
            </Badge>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-surface-soft">
            <div className="h-full rounded-full bg-brand" style={{ width: `${profileCompletion.percentage}%` }} />
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-line bg-surface-soft p-4">
            <p className="text-sm font-medium text-foreground">
              {profileCompletion.completed} dari {profileCompletion.total} bagian sudah lengkap
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Tambahkan foto, bio, lokasi, dan nomor WhatsApp supaya katalog terasa lebih siap closing.
            </p>
            <Link href="/dashboard/profile" className="mt-4 inline-block">
              <Button variant="secondary" size="sm">
                Edit profil
              </Button>
            </Link>
          </div>

          {hasAnalytics ? (
            <div className="mt-5 rounded-[1.5rem] border border-line bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Performa terbaru</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-surface-soft p-4">
                  <p className="text-sm text-muted">Pengunjung minggu ini</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{currentAnalytics.views}</p>
                </div>
                <div className="rounded-2xl bg-surface-soft p-4">
                  <p className="text-sm text-muted">Klik WhatsApp</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{currentAnalytics.whatsappClicks}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState
                icon={<SparkIcon className="h-6 w-6" />}
                title="Belum ada analytics"
                description="Setelah link katalog mulai dibuka dan CTA WhatsApp diklik, statistik akan tampil di sini."
                action={
                  <Link href={`/${currentUser.username}`} target="_blank" className="inline-block">
                    <Button variant="secondary" size="sm">
                      Lihat halamanku
                    </Button>
                  </Link>
                }
              />
            </div>
          )}
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-foreground">Produk & jasa terbaru</p>
              <p className="mt-1 text-sm text-muted">Kelola item yang tampil di katalog publik kamu.</p>
            </div>
            <Link href="/dashboard/products">
              <Button variant="secondary" size="sm">
                Kelola semua
              </Button>
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {currentProducts.length === 0 ? (
              <EmptyState
                icon={<BoxIcon className="h-6 w-6" />}
                title="Belum ada produk"
                description="Tambahkan produk atau jasa pertamamu supaya halaman publik langsung terlihat hidup."
                action={<Button size="sm" onClick={() => setOpenModal(true)}>Tambah produk</Button>}
              />
            ) : (
              currentProducts.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-line bg-background p-4 sm:flex-row sm:items-center"
                >
                  <img src={product.imageUrl} alt={product.title} className="h-24 w-full rounded-2xl object-cover sm:w-28" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{product.title}</p>
                      {product.badge ? <Badge className="text-[11px]">{product.badge}</Badge> : null}
                      {!product.isActive ? <Badge tone="warning" className="text-[11px]">Nonaktif</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-muted">{product.category}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <p className="text-lg font-semibold text-foreground">{formatCurrency(product.price)}</p>
                    <Link href="/dashboard/products" className="inline-block">
                      <Button variant="secondary" size="sm">
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <ProductModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={saveProduct} />
    </>
  );
}
