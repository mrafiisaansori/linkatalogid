"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { getProductQuotaStatus } from "@/lib/plans";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const {
    copyPublicLink,
    currentAnalytics,
    currentProducts,
    currentUser,
    profileCompletion,
    isProfileComplete,
    pushToast,
    saveProduct
  } = useAppState();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  if (!currentUser) return null;

  const productQuota = getProductQuotaStatus(currentUser.plan, currentProducts.length);

  // Penjual harus melengkapi profil dulu sebelum boleh menambah produk.
  function handleAddProduct() {
    if (!isProfileComplete) {
      pushToast({
        title: "Lengkapi profil dulu",
        description: "Isi semua data profil sebelum menambahkan produk.",
        tone: "default"
      });
      router.push("/dashboard/profile");
      return;
    }
    if (productQuota.isAtLimit) {
      pushToast({
        title: "Limit item tercapai",
        description: `Akses ${productQuota.definition.name} bisa menyimpan maksimal ${productQuota.limit} item.`,
        tone: "warning"
      });
      return;
    }
    setOpenModal(true);
  }

  const activeProducts = currentProducts.filter((item) => item.isActive);
  const hasAnalytics = currentAnalytics.views > 0 || currentAnalytics.whatsappClicks > 0;

  const stats = [
    {
      label: "Total produk",
      value: String(currentProducts.length),
      hint:
        productQuota.limit === null
          ? `${activeProducts.length} produk aktif tampil di katalog`
          : `${activeProducts.length} aktif, ${productQuota.remaining} slot tersisa`,
      icon: BoxIcon,
      tone: "brand" as const
    },
    {
      label: "Total views",
      value: formatCompactNumber(currentAnalytics.views),
      hint: "Naik tiap kali halaman publik kamu dibuka",
      icon: ChartIcon,
      tone: "brand" as const
    },
    {
      label: "WhatsApp clicks",
      value: formatCompactNumber(currentAnalytics.whatsappClicks),
      hint: "Klik CTA order dari halaman publik kamu",
      icon: WhatsAppIcon,
      tone: "success" as const
    }
  ];

  return (
    <>
      {/* Hero + public link */}
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="relative overflow-hidden rounded-[2rem] bg-hero-mesh p-6 sm:p-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            <SparkIcon className="h-4 w-4" />
            Halo, {currentUser.name}
          </span>
          <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            Semua yang kamu butuhkan untuk bagikan katalog dalam satu link sudah siap.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Edit profil, tambah produk atau jasa, lalu arahkan calon pembeli ke halaman publik yang langsung bisa order
            via WhatsApp.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleAddProduct}>
              Tambah produk
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Link href="/dashboard/profile">
              <Button variant="secondary">Edit profil</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col rounded-[2rem] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Link publik kamu</p>
              <p className="mt-1 text-sm text-muted">Siap dibagikan ke bio Instagram, story, atau chat.</p>
            </div>
            <Badge tone="success" className="gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Live
            </Badge>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-[1.5rem] border border-line bg-background p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <EyeIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted">Link katalog</p>
              <p className="truncate font-semibold text-foreground">linkatalog.id/{currentUser.username}</p>
            </div>
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

      <section>
        <Card className="rounded-[2rem] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                  Akses {productQuota.definition.name}
                </p>
                <Badge tone={productQuota.isAtLimit ? "warning" : "success"}>
                  {productQuota.limit === null
                    ? "Item tanpa batas"
                    : `${productQuota.used}/${productQuota.limit} item`}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                {productQuota.limit === null
                  ? "Semua fitur inti katalog dibuka gratis permanen tanpa biaya bulanan."
                  : `${productQuota.remaining} slot item tersisa.`}
              </p>
            </div>
            <Button variant="secondary" onClick={handleAddProduct}>
              Tambah item
            </Button>
          </div>
          {productQuota.limit !== null ? (
            <div
              className="mt-4 h-2 overflow-hidden rounded-full bg-surface-soft"
              role="progressbar"
              aria-valuenow={productQuota.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${productQuota.percentage}%` }} />
            </div>
          ) : null}
        </Card>
      </section>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="rounded-[2rem] p-5 transition hover:shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">{stat.label}</p>
                <span
                  className={
                    stat.tone === "success"
                      ? "flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success"
                      : "flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand"
                  }
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{stat.hint}</p>
            </Card>
          );
        })}
      </section>

      {/* Progress + latest products */}
      <section className={`grid gap-4 ${profileCompletion.percentage < 100 ? "xl:grid-cols-[0.85fr_1.15fr]" : ""}`}>
        {profileCompletion.percentage < 100 && (
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">Progress profil</p>
              <p className="mt-1 text-sm text-muted">Lengkapi profil agar calon pembeli lebih percaya.</p>
            </div>
            <Badge className="text-sm">{profileCompletion.percentage}%</Badge>
          </div>
          <div
            className="mt-5 h-3 overflow-hidden rounded-full bg-surface-soft"
            role="progressbar"
            aria-valuenow={profileCompletion.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${profileCompletion.percentage}%` }} />
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
        )}

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
                action={<Button size="sm" onClick={handleAddProduct}>Tambah produk</Button>}
              />
            ) : (
              currentProducts.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-line bg-background p-4 transition hover:border-brand/40 sm:flex-row sm:items-center"
                >
                  <img src={product.imageUrl} alt={product.title} className="h-24 w-full rounded-2xl object-cover sm:h-20 sm:w-20" />
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
