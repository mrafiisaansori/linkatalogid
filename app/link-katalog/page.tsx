import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import {
  ArrowRightIcon,
  CartIcon,
  CheckIcon,
  ClockIcon,
  GlobeIcon,
  SearchIcon,
  SparkIcon,
  StoreIcon,
  WhatsAppIcon
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = "Link Katalog Gratis untuk Jualan Online via WhatsApp";
const PAGE_DESCRIPTION =
  "Buat link katalog gratis untuk menampilkan produk dan jasa dalam satu halaman. Cocok untuk UMKM, reseller, toko online, dan seller yang ingin menerima order via WhatsApp.";
const SAMPLE_CATALOG_URL = "/alatkopimalang";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "link katalog",
    "link katalog gratis",
    "buat link katalog",
    "katalog online gratis",
    "katalog produk online",
    "katalog jualan online",
    "link katalog whatsapp",
    "katalog UMKM"
  ],
  alternates: { canonical: "/link-katalog" },
  openGraph: {
    type: "website",
    url: "/link-katalog",
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    locale: "id_ID",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: PAGE_TITLE }]
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/og-image.png"]
  }
};

const benefits = [
  "Semua produk dan jasa terkumpul dalam satu link yang mudah dibagikan.",
  "Pelanggan bisa melihat foto, harga, deskripsi, dan kategori tanpa bertanya satu per satu.",
  "Pesanan masuk ke WhatsApp dengan rincian item yang sudah tersusun rapi.",
  "Cocok untuk bio Instagram, TikTok, status WhatsApp, chat pelanggan, dan komunitas."
];

const steps = [
  {
    icon: StoreIcon,
    title: "Lengkapi profil toko",
    desc: "Isi nama usaha, bio singkat, lokasi bila perlu, dan nomor WhatsApp aktif untuk menerima order."
  },
  {
    icon: CartIcon,
    title: "Tambahkan produk atau jasa",
    desc: "Unggah foto, kategori, harga, deskripsi, dan badge seperti Promo atau Best Seller."
  },
  {
    icon: GlobeIcon,
    title: "Bagikan satu link katalog",
    desc: "Pasang link di bio, status, story, katalog chat, atau materi promosi agar pelanggan mudah membuka etalase."
  },
  {
    icon: WhatsAppIcon,
    title: "Terima order via WhatsApp",
    desc: "Pelanggan memilih item, checkout, lalu detail pesanan otomatis masuk ke WhatsApp kamu."
  }
];

const useCases = [
  "UMKM makanan, minuman, fashion, skincare, hampers, dan produk rumahan.",
  "Reseller yang menjual banyak item dari beberapa kategori.",
  "Penyedia jasa seperti desain, fotografi, servis, kelas, booking, atau konsultasi.",
  "Toko lokal yang ingin katalog mobile-friendly tanpa membuat website penuh."
];

const comparisons = [
  {
    label: "Kirim foto manual di chat",
    pain: "Repot membalas pertanyaan harga dan stok berulang.",
    gain: "Link katalog membuat pelanggan melihat sendiri sebelum chat."
  },
  {
    label: "Katalog WhatsApp Business saja",
    pain: "Bagus untuk kontak yang sudah masuk, tetapi kurang fleksibel sebagai halaman promosi publik.",
    gain: "Linkatalog memberi halaman katalog yang mudah dipasang di bio dan dibagikan ke mana saja."
  },
  {
    label: "Marketplace",
    pain: "Ada kompetitor, aturan platform, dan potensi biaya tambahan.",
    gain: "Link katalog menjaga transaksi tetap personal lewat WhatsApp."
  }
];

const faqItems = [
  {
    question: "Apa itu link katalog?",
    answer:
      "Link katalog adalah alamat online yang berisi daftar produk atau jasa dalam satu halaman. Pelanggan bisa membuka link, melihat detail item, lalu memesan tanpa perlu menerima foto satu per satu di chat."
  },
  {
    question: "Apakah Linkatalog gratis?",
    answer:
      "Ya. Linkatalog gratis permanen untuk membuat katalog, menambahkan produk atau jasa, membagikan link, dan menerima order via WhatsApp."
  },
  {
    question: "Apakah cocok untuk jasa, bukan hanya produk?",
    answer:
      "Cocok. Kamu bisa menampilkan jasa dengan harga mulai dari, harga custom, tombol booking, konsultasi, atau pesan sesuai kebutuhan layanan."
  },
  {
    question: "Di mana link katalog sebaiknya dibagikan?",
    answer:
      "Pasang di bio Instagram dan TikTok, status WhatsApp, caption, story, grup komunitas, balasan cepat, dan chat pelanggan yang menanyakan katalog lengkap."
  }
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Link Katalog", item: `${SITE_URL}/link-katalog` }
  ]
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: PAGE_TITLE,
  url: `${SITE_URL}/link-katalog`,
  description: PAGE_DESCRIPTION,
  inLanguage: "id-ID",
  isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL }
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  }))
};

export default function LinkKatalogPage() {
  return (
    <div className="page-shell min-h-screen overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <MarketingHeader />

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-24 lg:pt-16">
          <div className="space-y-7">
            <nav aria-label="Breadcrumb" className="text-xs text-muted">
              <Link href="/" className="transition hover:text-foreground">
                Beranda
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-foreground">Link katalog</span>
            </nav>

            <div className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-surface px-4 py-2 text-sm text-muted shadow-soft">
              <SearchIcon className="h-4 w-4 text-brand" />
              Panduan dan tools untuk seller online
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.25] text-foreground sm:text-5xl lg:text-[3.35rem]">
                Link katalog gratis untuk jualan online via WhatsApp
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                Buat satu halaman katalog yang rapi untuk produk dan jasa. Pelanggan tinggal membuka link, memilih
                item, lalu checkout langsung ke WhatsApp tanpa perlu aplikasi tambahan.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Buat Link Katalog Gratis
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={SAMPLE_CATALOG_URL}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Lihat Contoh Katalog
                </Button>
              </Link>
            </div>

            <ul className="grid gap-3 text-sm leading-6 text-foreground sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <Card className="rounded-[2rem] border-brand/20 bg-gradient-to-br from-surface via-surface to-brand/5 p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <SparkIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Contoh katalog</p>
                <h2 className="text-xl font-semibold text-foreground">Alat Kopi Malang</h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-muted">
              Contoh katalog publik yang bisa dipakai sebagai referensi: profil toko jelas, kategori produk rapi,
              tampilan mobile-friendly, dan pelanggan diarahkan untuk order via WhatsApp.
            </p>

            <div className="mt-6 grid gap-3">
              {["Profil toko terlihat jelas", "Produk mudah dipindai", "Link siap dibagikan", "Order diarahkan ke WhatsApp"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-line/80 bg-background/70 p-3">
                    <CheckIcon className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                )
              )}
            </div>

            <Link href={SAMPLE_CATALOG_URL} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
              Buka linkatalog.id/alatkopimalang
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Card>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Definisi</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Apa itu link katalog?
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Link katalog adalah satu URL yang memuat etalase produk atau jasa: foto, nama item, harga, kategori,
              deskripsi, dan tombol order. Untuk seller, link ini menggantikan kebiasaan mengirim foto satu per satu.
              Untuk pembeli, link katalog membuat proses memilih produk lebih cepat, jelas, dan nyaman dari HP.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Cara membuat</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Dari produk pertama sampai order masuk
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.title} className="rounded-[1.75rem] border-line/80 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold text-muted">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.desc}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Perbandingan</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                Kenapa pakai link katalog, bukan chat manual?
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                Chat tetap penting untuk closing, tetapi katalog membantu calon pembeli paham dulu sebelum bertanya.
                Hasilnya, percakapan masuk lebih rapi dan seller tidak terus mengulang info dasar.
              </p>
            </div>

            <div className="grid gap-4">
              {comparisons.map((item) => (
                <Card key={item.label} className="rounded-[1.5rem] border-line/80 p-5">
                  <h3 className="text-base font-semibold text-foreground">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.pain}</p>
                  <p className="mt-3 text-sm font-medium leading-6 text-foreground">{item.gain}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Cocok untuk</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Dipakai seller kecil sampai toko lokal
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {useCases.map((item) => (
              <Card key={item} className="rounded-[1.5rem] border-line/80 p-5">
                <div className="flex gap-3 text-sm leading-7 text-foreground">
                  <CheckIcon className="mt-1 h-4 w-4 text-success" />
                  <span>{item}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Pertanyaan tentang link katalog
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-[1.5rem] border border-line/80 bg-surface p-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-foreground marker:content-['']">
                  {item.question}
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Card className="rounded-[2rem] border-brand/20 bg-gradient-to-br from-surface via-surface to-brand/5 p-7 text-center sm:p-10">
            <div className="mx-auto max-w-2xl">
              <ClockIcon className="mx-auto h-8 w-8 text-brand" />
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                Buat link katalog pertamamu hari ini
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                Gratis untuk mulai. Susun produk, bagikan link, lalu arahkan pelanggan checkout via WhatsApp.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Mulai Gratis
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/blog/link-katalog-gratis">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Baca Panduan
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
