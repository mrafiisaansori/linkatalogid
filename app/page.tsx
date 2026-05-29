import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";
import { LandingSessionButton } from "@/components/landing-session-button";
import {
  ArrowRightIcon,
  BoltIcon,
  ChevronDownIcon,
  EyeIcon,
  LocationIcon,
  MoonIcon,
  SearchIcon,
  SparkIcon,
  StoreIcon,
  WhatsAppIcon
} from "@/components/icons";
import { MarketingHeader } from "@/components/marketing-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { demoProducts, demoUser } from "@/lib/sample-data";
import { formatCurrency, getAccentPalette } from "@/lib/utils";

const featureItems = [
  "1 link untuk semua produk",
  "Langsung order via WhatsApp",
  "Cocok untuk jasa dan produk",
  "Tanpa ribet bikin website"
];

const steps = [
  "Buat profil",
  "Tambah produk atau jasa",
  "Bagikan link dan mulai terima order"
];

export default function HomePage() {
  const demoAccent = getAccentPalette(demoUser.themeAccent);
  const demoCategories = ["Semua", ...Array.from(new Set(demoProducts.map((item) => item.category).filter(Boolean)))];

  return (
    <main className="page-shell min-h-screen">
      <MarketingHeader />

      <section className="relative mx-auto max-w-7xl overflow-hidden px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-full bg-brand/12 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-16 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pt-10">
          <div className="space-y-7">
            <div className="landing-reveal inline-flex items-center gap-2 rounded-full border border-brand/15 bg-surface/90 px-4 py-2 text-sm text-muted shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
              <SparkIcon className="h-4 w-4 text-brand" />
              Personal catalog page builder untuk seller, UMKM, dan freelancer
            </div>

            <div className="landing-reveal landing-reveal-delay-1 space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Bikin katalog jualan kamu{" "}
                <span className="relative inline-block">
                  dalam 1 menit
                  <span className="absolute inset-x-1 bottom-1 -z-10 h-4 rounded-full bg-brand/15 blur-md sm:bottom-2 sm:h-5" />
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                Tampilkan produk atau jasa kamu dalam 1 link, lalu terima order langsung via WhatsApp.
              </p>
            </div>

            <div className="landing-reveal landing-reveal-delay-2 flex flex-col gap-3 sm:flex-row">
              <LandingSessionButton
                guestLabel="Mulai Gratis"
                userLabel="Buka Dashboard"
                size="lg"
                className="w-full sm:w-auto"
              />
              <a href="#demo">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Lihat Demo
                </Button>
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card
                className="landing-reveal landing-reveal-delay-3 border-brand/10 bg-gradient-to-br from-surface via-surface to-brand/5 p-4 transition duration-300 hover:-translate-y-1"
              >
                <p className="text-2xl font-semibold text-foreground">1 menit</p>
                <p className="mt-1 text-sm text-muted">Untuk bikin halaman katalog pertama</p>
              </Card>
              <Card
                className="landing-reveal landing-reveal-delay-4 border-sky-500/10 bg-gradient-to-br from-surface via-surface to-sky-500/5 p-4 transition duration-300 hover:-translate-y-1"
              >
                <p className="text-2xl font-semibold text-foreground">1 link</p>
                <p className="mt-1 text-sm text-muted">Bisa dibagikan ke bio, story, dan chat</p>
              </Card>
              <Card
                className="landing-reveal landing-reveal-delay-5 border-success/10 bg-gradient-to-br from-surface via-surface to-success/5 p-4 transition duration-300 hover:-translate-y-1"
              >
                <p className="text-2xl font-semibold text-foreground">WhatsApp</p>
                <p className="mt-1 text-sm text-muted">Order masuk langsung tanpa form ribet</p>
              </Card>
            </div>
          </div>

          <div id="demo" className="landing-reveal landing-reveal-delay-2 relative flex justify-center lg:justify-end">
            <div className="landing-orb landing-orb-slow absolute left-1/2 top-8 h-44 w-44 -translate-x-[90%] rounded-full bg-brand/18 blur-3xl" />
            <div className="landing-orb absolute bottom-10 right-4 h-52 w-52 rounded-full bg-sky-500/12 blur-3xl" />
            <div className="pointer-events-none relative w-full max-w-[460px]">
              <div className="mb-4 flex items-center justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-surface/88 px-4 py-2 text-xs font-medium text-muted shadow-soft backdrop-blur">
                  <SparkIcon className="h-3.5 w-3.5 text-brand" />
                  Preview halaman publik versi mobile
                </div>
              </div>

              <div className="relative mx-auto max-w-[390px]">
                <div className="absolute inset-x-7 bottom-1 top-10 rounded-[2.8rem] bg-slate-950/10 blur-2xl" />

                <div className="sm:absolute sm:-left-10 sm:top-24">
                  <div className="landing-float-card rounded-[1.35rem] border border-line/80 bg-surface/90 px-4 py-3 shadow-soft backdrop-blur sm:min-w-[160px]">
                    <div className="flex items-center gap-2 text-success">
                      <WhatsAppIcon className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">Conversion</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-foreground">+128</p>
                    <p className="text-xs leading-5 text-muted">klik WhatsApp dari katalog demo</p>
                  </div>
                </div>

                <div className="sm:absolute sm:-right-12 sm:bottom-16">
                  <div className="landing-float-card landing-float-card-delay rounded-[1.35rem] border border-line/80 bg-surface/90 px-4 py-3 shadow-soft backdrop-blur sm:min-w-[170px]">
                    <div className="flex items-center gap-2 text-brand">
                      <EyeIcon className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">Catalog Ready</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{demoProducts.length} item</p>
                    <p className="text-xs leading-5 text-muted">langsung tampil dalam satu link</p>
                  </div>
                </div>

                <div className="landing-device-float mx-auto w-full max-w-[360px] rounded-[2.95rem] border border-white/55 bg-slate-950 p-3 shadow-[0_48px_120px_rgba(15,23,42,0.24)] dark:border-white/10">
                  <div className="mb-3 flex justify-center">
                    <div className="h-1.5 w-24 rounded-full bg-white/15" />
                  </div>

                  <div className="overflow-hidden rounded-[2.2rem] border border-black/5 bg-background">
                    <div className="flex items-center justify-between border-b border-line/70 bg-background/95 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">
                          LINK KATALOG
                        </p>
                        <p className="text-[10px] text-muted">Demo katalog publik versi mobile</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-foreground">
                          <MoonIcon className="h-4 w-4" />
                        </div>
                        <div className="rounded-full border border-line bg-surface px-3 py-2 text-[11px] font-semibold text-foreground">
                          Buat
                        </div>
                      </div>
                    </div>

                    <div className="max-h-[640px] overflow-hidden">
                      <div className="space-y-4 bg-background p-3">
                        <div
                          className="overflow-hidden rounded-[1.85rem] border border-line/80 p-4"
                          style={{
                            background: `linear-gradient(135deg, ${demoAccent.soft}, rgba(255,255,255,0.55))`
                          }}
                        >
                          <Badge className="w-fit border-0 bg-white/85 text-slate-700 ring-0">
                            Katalog personal siap order
                          </Badge>

                          <div className="mt-4 flex gap-3">
                            <img
                              src={demoUser.profileImage}
                              alt={demoUser.name}
                              className="h-16 w-16 rounded-[1.35rem] object-cover shadow-card"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-lg font-semibold leading-tight text-slate-900">{demoUser.name}</p>
                              <p className="mt-1 text-xs text-slate-600">@{demoUser.username}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Badge className="border-0 bg-white/85 text-slate-700 ring-0">
                                  {demoProducts.length} item aktif
                                </Badge>
                                <Badge className="max-w-full border-0 bg-white/85 text-slate-700 ring-0">
                                  <LocationIcon className="mr-1 h-3.5 w-3.5" />
                                  {demoUser.location}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <p className="mt-4 text-sm leading-6 text-slate-700">{demoUser.bio}</p>

                          <div className="mt-4 grid gap-2">
                            <div
                              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-card"
                              style={{ backgroundColor: demoAccent.primary, color: demoAccent.textOnPrimary }}
                            >
                              <WhatsAppIcon className="h-4 w-4" />
                              Tanya via WhatsApp
                            </div>
                            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-800">
                              <EyeIcon className="h-4 w-4" />
                              Lihat katalog
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-[1.25rem] border border-line bg-surface p-3">
                            <p className="text-[11px] text-muted">Produk aktif</p>
                            <p className="mt-2 text-base font-semibold text-foreground">{demoProducts.length}</p>
                          </div>
                          <div className="rounded-[1.25rem] border border-line bg-surface p-3">
                            <p className="text-[11px] text-muted">Kategori</p>
                            <p className="mt-2 text-base font-semibold text-foreground">{demoCategories.length - 1}</p>
                          </div>
                          <div className="rounded-[1.25rem] border border-line bg-surface p-3">
                            <p className="text-[11px] text-muted">Order</p>
                            <p className="mt-2 text-base font-semibold text-foreground">Langsung</p>
                          </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-line bg-surface p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">Produk dan jasa</p>
                              <p className="mt-1 text-xs text-muted">Cari atau filter kategori</p>
                            </div>
                            <Badge tone="neutral" className="bg-surface-soft text-muted">
                              {demoProducts.length} item
                            </Badge>
                          </div>

                          <div className="mt-3 rounded-[1.25rem] border border-line bg-background px-4 py-3">
                            <div className="flex items-center gap-3 text-sm text-muted">
                              <SearchIcon className="h-4 w-4" />
                              Cari produk favorit
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2 overflow-hidden">
                            {demoCategories.slice(0, 3).map((category, index) => (
                              <div
                                key={category}
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold ${
                                  index === 0
                                    ? "bg-brand text-white"
                                    : "border border-line bg-background text-muted"
                                }`}
                              >
                                {category}
                                {index === 0 ? null : <ChevronDownIcon className="h-3.5 w-3.5" />}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          {demoProducts.slice(0, 3).map((product) => (
                            <div
                              key={product.id}
                              className="overflow-hidden rounded-[1.85rem] border border-line bg-surface"
                            >
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="aspect-[16/10] w-full object-cover"
                              />
                              <div className="space-y-3 p-4">
                                <div className="flex items-start gap-2">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground">{product.title}</p>
                                    <p className="mt-1 text-xs text-muted">{product.category}</p>
                                  </div>
                                  {product.badge ? (
                                    <Badge
                                      className="border-0 px-3 py-1.5 ring-0"
                                      style={{ backgroundColor: demoAccent.soft, color: demoAccent.primary }}
                                    >
                                      {product.badge}
                                    </Badge>
                                  ) : null}
                                </div>
                                <p className="line-clamp-2 text-sm leading-6 text-muted">{product.description}</p>
                                <div className="flex items-end justify-between gap-3">
                                  <p className="text-base font-semibold text-foreground">
                                    {formatCurrency(product.price)}
                                  </p>
                                  <div className="inline-flex items-center gap-2 rounded-full bg-success px-4 py-2.5 text-xs font-semibold text-white">
                                    <WhatsAppIcon className="h-4 w-4" />
                                    Pesan via WhatsApp
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-line/70 bg-slate-950/96 p-2">
                      <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-slate-950/90 px-3 py-3">
                        <img
                          src={demoUser.profileImage}
                          alt={demoUser.name}
                          className="h-11 w-11 rounded-2xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">Order langsung ke {demoUser.name}</p>
                          <p className="truncate text-xs text-white/65">Balas cepat via WhatsApp</p>
                        </div>
                        <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-success px-4 py-3 text-xs font-semibold text-white">
                          <WhatsAppIcon className="h-4 w-4" />
                          Chat
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
                  <div className="rounded-[1.35rem] border border-line/80 bg-surface/90 px-4 py-3 shadow-soft backdrop-blur">
                    <div className="flex items-center gap-2 text-success">
                      <WhatsAppIcon className="h-4 w-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Conversion</span>
                    </div>
                    <p className="mt-2 text-xl font-semibold text-foreground">+128</p>
                    <p className="text-xs leading-5 text-muted">klik WhatsApp demo</p>
                  </div>
                  <div className="rounded-[1.35rem] border border-line/80 bg-surface/90 px-4 py-3 shadow-soft backdrop-blur">
                    <div className="flex items-center gap-2 text-brand">
                      <EyeIcon className="h-4 w-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Catalog</span>
                    </div>
                    <p className="mt-2 text-xl font-semibold text-foreground">{demoProducts.length} item</p>
                    <p className="text-xs leading-5 text-muted">siap tampil di 1 link</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Fitur inti</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            Dibuat untuk jualan yang cepat, rapi, dan langsung closing
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featureItems.map((item, index) => (
            <Card
              key={item}
              className="landing-reveal rounded-[1.75rem] border-line/80 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-card"
              style={{ animationDelay: `${140 + index * 110}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                {index % 2 === 0 ? <BoltIcon /> : <StoreIcon />}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{item}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Tampilan premium, mudah dibagikan, dan fokus supaya calon pembeli cepat ambil tindakan.
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section id="cara-kerja" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[2rem] border-brand/15 bg-gradient-to-br from-brand/18 via-brand/10 to-sky-500/10 dark:border-white/10 dark:from-brand/22 dark:via-brand/16 dark:to-sky-500/14">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand dark:text-white/80">Cara kerja</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground dark:text-white">
              Dari daftar sampai katalog publik, semua alurnya dibuat sesingkat mungkin.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted dark:text-white/80">
              Linkatalog.id bukan marketplace dan bukan website builder rumit. Fokusnya satu: bantu kamu tampilkan
              produk atau jasa dalam satu link dan arahkan order langsung ke WhatsApp.
            </p>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <Card
                key={step}
                className="landing-reveal rounded-[2rem] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-card"
                style={{ animationDelay: `${160 + index * 110}ms` }}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-soft text-lg font-semibold text-brand">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{step}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {index === 0
                    ? "Tulis nama brand, bio singkat, nomor WhatsApp, dan pilih aksen tampilan."
                    : index === 1
                      ? "Masukkan foto, harga, badge promo, kategori, dan status aktif produk."
                      : "Bagikan link ke bio, status, atau chat. Pembeli tinggal klik pesan via WhatsApp."}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="landing-reveal rounded-[2rem] bg-hero-mesh p-7 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Siap dipakai hari ini</p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
                Bikin halaman jualan yang enak dilihat dan enak di-share.
              </h2>
              <p className="mt-3 text-base leading-7 text-muted">
                Cocok untuk reseller, UMKM makanan, jasa desain, sampai freelancer yang butuh katalog simple tapi tetap
                terlihat premium.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LandingSessionButton guestLabel="Mulai Gratis" userLabel="Buka Dashboard" size="lg" />
              <a href="#demo">
                <Button variant="secondary" size="lg">
                  Lihat Preview Demo
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </section>

      <footer className="border-t border-line/70 bg-surface/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <BrandLockup />
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
              Halaman katalog personal untuk produk dan jasa, dengan alur order yang langsung masuk ke WhatsApp.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Navigasi</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <a href="#fitur" className="block transition hover:text-foreground">
                Fitur
              </a>
              <a href="#cara-kerja" className="block transition hover:text-foreground">
                Cara kerja
              </a>
              <Link href="/auth" className="block transition hover:text-foreground">
                Masuk / Daftar
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Legal</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <a href="#" className="block transition hover:text-foreground">
                Kebijakan privasi
              </a>
              <a href="#" className="block transition hover:text-foreground">
                Syarat layanan
              </a>
              <a href="#" className="block transition hover:text-foreground">
                Bantuan
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Sosial</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <a href="#" className="block transition hover:text-foreground">
                Instagram
              </a>
              <a href="#" className="block transition hover:text-foreground">
                TikTok
              </a>
              <a href="#" className="block transition hover:text-foreground">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>

      <div className="sticky bottom-4 z-30 px-4 md:hidden">
        <Card className="mx-auto flex max-w-md items-center justify-between rounded-full px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Siap bikin katalog?</p>
            <p className="text-xs text-muted">Gratis untuk mulai</p>
          </div>
          <LandingSessionButton guestLabel="Mulai Gratis" userLabel="Dashboard" size="sm" />
        </Card>
      </div>
    </main>
  );
}
