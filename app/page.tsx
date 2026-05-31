import type { Metadata } from "next";
import { CatalogPreviewMock } from "@/components/catalog-preview-mock";
import {
  ArrowRightIcon,
  BoltIcon,
  CartIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  EyeIcon,
  GlobeIcon,
  ShieldIcon,
  SparkIcon,
  StoreIcon,
  UsersIcon,
  WhatsAppIcon
} from "@/components/icons";
import { LandingSessionButton } from "@/components/landing-session-button";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = "Katalog Online untuk Jualan Lebih Rapi | Checkout via WhatsApp";
const PAGE_DESCRIPTION =
  "Buat katalog produk online dalam satu link. Pelanggan pilih produk, masukkan ke keranjang, lalu checkout langsung via WhatsApp. Cocok untuk UMKM, reseller, dan toko online.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    locale: "id_ID"
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION
  }
};

const trustPoints = ["UMKM", "Reseller", "Toko rumahan", "Penjual online"];

const problems = [
  "Kirim foto dan harga satu per satu lewat chat — melelahkan dan makan waktu.",
  "Pelanggan bingung memilih karena tak ada etalase yang jelas.",
  "Rekap pesanan berantakan, gampang salah hitung dan salah catat.",
  "Belum punya katalog yang rapi dan layak dibagikan ke pelanggan."
];

const solutions = [
  "Semua produk tampil rapi dalam satu katalog yang mudah dibuka.",
  "Pelanggan menelusuri dan memilih sendiri produk yang diinginkan.",
  "Pilihan masuk ke keranjang dulu, baru dikirim sebagai satu pesanan.",
  "Checkout via WhatsApp dengan rincian pesanan yang otomatis tersusun rapi."
];

const features = [
  {
    icon: StoreIcon,
    title: "Katalog dalam satu link",
    desc: "Kumpulkan semua produk di satu halaman yang siap dibagikan ke mana pun."
  },
  {
    icon: EyeIcon,
    title: "Tampilan yang meyakinkan",
    desc: "Foto, harga, kategori, dan deskripsi tampil rapi agar toko kamu terlihat tepercaya."
  },
  {
    icon: CartIcon,
    title: "Keranjang multi-produk",
    desc: "Pelanggan bisa memilih beberapa produk sekaligus sebelum memesan."
  },
  {
    icon: WhatsAppIcon,
    title: "Checkout via WhatsApp",
    desc: "Isi keranjang langsung jadi pesan WhatsApp yang rapi ke nomor kamu."
  },
  {
    icon: BoltIcon,
    title: "Gampang dikelola",
    desc: "Tambah, ubah, atau hapus produk kapan saja — tanpa perlu keahlian teknis."
  },
  {
    icon: GlobeIcon,
    title: "Sebar ke mana saja",
    desc: "Satu link untuk bio Instagram, TikTok, status WhatsApp, sampai chat pelanggan."
  }
];

const steps = [
  {
    title: "Tambahkan produk",
    desc: "Unggah foto, atur harga, kategori, dan badge promo untuk tiap produk."
  },
  {
    title: "Bagikan link katalog",
    desc: "Sebarkan satu link ke bio, story, status WhatsApp, atau langsung ke chat."
  },
  {
    title: "Pelanggan pilih sendiri",
    desc: "Pelanggan menelusuri katalog, memilih produk, lalu memasukkannya ke keranjang."
  },
  {
    title: "Order masuk via WhatsApp",
    desc: "Pelanggan checkout dan pesanan langsung mampir ke WhatsApp kamu, sudah rapi."
  }
];

const benefits = [
  {
    icon: ClockIcon,
    title: "Hemat waktu melayani",
    desc: "Stop mengirim foto dan harga satu per satu — pelanggan cukup buka katalog."
  },
  {
    icon: ShieldIcon,
    title: "Pesanan minim salah",
    desc: "Tiap order masuk dengan rincian produk dan total yang jelas, jadi jarang keliru."
  },
  {
    icon: UsersIcon,
    title: "Belanja lebih nyaman",
    desc: "Pelanggan bebas memilih sendiri, jadi lebih yakin menyelesaikan pesanan."
  },
  {
    icon: SparkIcon,
    title: "Toko tampil profesional",
    desc: "Katalog yang rapi bikin usaha kamu terlihat meyakinkan, sekalipun skala rumahan."
  }
];

const faqItems = [
  {
    question: "Apa itu Linkatalog?",
    answer:
      "Linkatalog adalah layanan untuk membuat katalog produk online dalam satu link. Pelanggan bisa memilih produk, memasukkannya ke keranjang, lalu checkout langsung via WhatsApp."
  },
  {
    question: "Apakah pelanggan perlu mengunduh aplikasi?",
    answer:
      "Tidak. Pelanggan cukup membuka link katalog kamu lewat browser, memilih produk, dan menyelesaikan pesanan melalui WhatsApp tanpa memasang aplikasi apa pun."
  },
  {
    question: "Bagaimana cara pesanan masuk ke saya?",
    answer:
      "Saat pelanggan checkout, isi keranjang otomatis tersusun menjadi pesan WhatsApp yang rapi dan dikirim ke nomor WhatsApp yang kamu daftarkan."
  },
  {
    question: "Apakah cocok untuk UMKM dan reseller?",
    answer:
      "Cocok. Linkatalog dirancang untuk UMKM, reseller, toko rumahan, dan penjual online yang ingin etalase sederhana namun tetap terlihat profesional."
  },
  {
    question: "Jenis produk apa saja yang bisa ditampilkan?",
    answer:
      "Kamu bisa menampilkan produk maupun jasa, lengkap dengan foto, harga, kategori, dan deskripsi singkat agar pelanggan mudah memahaminya."
  }
];

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "id-ID"
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: SITE_DESCRIPTION,
  inLanguage: "id-ID"
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

export default function HomePage() {
  return (
    <div className="page-shell min-h-screen overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <MarketingHeader />

      <main>
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-7xl overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24">
          <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-full bg-brand/12 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-16 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-8">
            <div className="space-y-7">
              <div className="landing-reveal inline-flex items-center gap-2 rounded-full border border-brand/15 bg-surface/90 px-4 py-2 text-sm text-muted shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <SparkIcon className="h-4 w-4 text-brand" />
                Katalog online untuk UMKM &amp; penjual online
              </div>

              <div className="landing-reveal landing-reveal-delay-1 space-y-5">
                <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl lg:text-[3.4rem]">
                  Jualan cukup satu link,{" "}
                  <span className="relative inline-block">
                    order masuk via WhatsApp
                    <span className="absolute inset-x-1 bottom-1 -z-10 h-4 rounded-full bg-brand/15 blur-md sm:bottom-2 sm:h-5" />
                  </span>
                </h1>
                <p className="max-w-xl text-lg leading-8 text-muted sm:text-xl">
                  Tampilkan seluruh produk dalam satu katalog online yang rapi. Pelanggan tinggal pilih, masukkan ke
                  keranjang, lalu checkout lewat WhatsApp — tanpa ribet bikin website.
                </p>
              </div>

              <div className="landing-reveal landing-reveal-delay-2 flex flex-col gap-3 sm:flex-row">
                <LandingSessionButton
                  guestLabel="Mulai Buat Katalog"
                  userLabel="Buka Dashboard"
                  size="lg"
                  className="w-full sm:w-auto"
                />
                <a href="#preview">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Lihat Tampilan Katalog
                  </Button>
                </a>
              </div>

              <div className="landing-reveal landing-reveal-delay-3 space-y-3">
                <p className="text-sm font-medium text-muted">Cocok untuk:</p>
                <div className="flex flex-wrap gap-2">
                  {trustPoints.map((point) => (
                    <span
                      key={point}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      <CheckIcon className="h-3.5 w-3.5 text-success" />
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile catalog preview */}
            <div className="landing-reveal landing-reveal-delay-2 relative flex justify-center lg:justify-end">
              <div className="landing-orb landing-orb-slow absolute left-1/2 top-8 h-44 w-44 -translate-x-[90%] rounded-full bg-brand/18 blur-3xl" />
              <div className="landing-orb absolute bottom-10 right-4 h-52 w-52 rounded-full bg-sky-500/12 blur-3xl" />

              <div className="relative w-full max-w-[400px]">
                <div className="absolute -left-4 top-28 z-10 hidden sm:block">
                  <div className="landing-float-card rounded-2xl border border-line/80 bg-surface/95 px-3.5 py-2.5 shadow-soft backdrop-blur">
                    <div className="flex items-center gap-1.5 text-success">
                      <WhatsAppIcon className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">Checkout WA</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-foreground">Otomatis</p>
                  </div>
                </div>

                <div className="absolute -right-5 bottom-24 z-10 hidden sm:block">
                  <div className="landing-float-card landing-float-card-delay rounded-2xl border border-line/80 bg-surface/95 px-3.5 py-2.5 shadow-soft backdrop-blur">
                    <div className="flex items-center gap-1.5 text-brand">
                      <CartIcon className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">Keranjang</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-foreground">Multi-item</p>
                  </div>
                </div>

                <div className="landing-device-float">
                  <CatalogPreviewMock />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Problem / Solution ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Kenapa Linkatalog</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Ubah jualan yang berantakan jadi rapi dan terarah
            </h2>
            <p className="mt-3 text-base leading-7 text-muted">
              Jualan lewat chat sering bikin penjual repot dan pelanggan bingung. Linkatalog merapikannya jadi satu
              alur yang jelas: buka katalog, pilih produk, checkout via WhatsApp.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-[1.75rem] border-line/80 p-6 sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1.5 text-sm font-semibold text-warning">
                <CloseIcon className="h-4 w-4" />
                Tanpa katalog
              </div>
              <ul className="mt-5 space-y-3">
                {problems.map((problem) => (
                  <li key={problem} className="flex items-start gap-3 text-sm leading-6 text-muted">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
                      <CloseIcon className="h-3 w-3" />
                    </span>
                    {problem}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="rounded-[1.75rem] border-brand/20 bg-gradient-to-br from-surface via-surface to-brand/5 p-6 sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">
                <CheckIcon className="h-4 w-4" />
                Dengan Linkatalog
              </div>
              <ul className="mt-5 space-y-3">
                {solutions.map((solution) => (
                  <li key={solution} className="flex items-start gap-3 text-sm leading-6 text-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {solution}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        {/* ── Fitur ──────────────────────────────────────────────────────── */}
        <section id="fitur" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Fitur utama</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Semua kebutuhan jualan online kamu, dalam satu link
            </h2>
            <p className="mt-3 text-base leading-7 text-muted">
              Mulai dari memajang produk, mengatur keranjang, sampai checkout via WhatsApp — semuanya rapi dan mudah
              dipakai.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="landing-reveal rounded-[1.75rem] border-line/80 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-card"
                  style={{ animationDelay: `${140 + index * 90}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{feature.desc}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── Cara kerja ─────────────────────────────────────────────────── */}
        <section id="cara-kerja" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Cara kerja</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Empat langkah, dari produk sampai order masuk
            </h2>
            <p className="mt-3 text-base leading-7 text-muted">
              Tanpa website rumit. Cukup susun produk, bagikan link, dan biarkan pelanggan memesan sendiri.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className="landing-reveal rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-card"
                style={{ animationDelay: `${160 + index * 110}ms` }}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-soft text-lg font-semibold text-brand">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Preview katalog ────────────────────────────────────────────── */}
        <section id="preview" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Preview katalog</p>
              <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                Inilah tampilan katalog di mata pelanggan
              </h2>
              <p className="text-base leading-7 text-muted">
                Halaman katalog publik menampilkan profil toko, kategori, pencarian, kartu produk berikut harga, tombol
                tambah ke keranjang, sampai checkout via WhatsApp — semuanya dalam tampilan mobile yang nyaman.
              </p>
              <ul className="space-y-3">
                {[
                  "Profil toko, kategori, dan pencarian produk",
                  "Kartu produk lengkap dengan harga dan badge promo",
                  "Tombol tambah ke keranjang di setiap produk",
                  "Keranjang mengambang dan checkout via WhatsApp"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <LandingSessionButton guestLabel="Mulai Buat Katalog" userLabel="Buka Dashboard" size="lg" />
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="landing-orb absolute left-10 top-6 h-44 w-44 rounded-full bg-brand/14 blur-3xl" />
              <CatalogPreviewMock />
            </div>
          </div>
        </section>

        {/* ── Benefit untuk seller ───────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Manfaat untuk seller</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Bukan sekadar etalase — bikin jualan lebih efisien
            </h2>
            <p className="mt-3 text-base leading-7 text-muted">
              Katalog yang rapi menghemat waktu, menekan salah pesan, dan membuat pelanggan lebih nyaman berbelanja.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={benefit.title}
                  className="landing-reveal rounded-[1.75rem] border-line/80 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-card"
                  style={{ animationDelay: `${140 + index * 90}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{benefit.desc}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────────── */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Pertanyaan yang sering ditanyakan
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-[1.5rem] border border-line/80 bg-surface/95 p-5 shadow-soft backdrop-blur transition open:shadow-card"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-foreground marker:content-['']">
                  {item.question}
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA akhir ──────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Card className="landing-reveal rounded-[2rem] bg-hero-mesh p-7 sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Siap dipakai hari ini</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                  Bikin katalog rapi, jualan lebih cepat closing
                </h2>
                <p className="mt-3 text-base leading-7 text-muted">
                  Pas untuk reseller, UMKM, toko rumahan, dan penjual online yang butuh etalase simpel tapi tetap
                  profesional. Pelanggan masukkan ke keranjang, kamu terima order via WhatsApp.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <LandingSessionButton guestLabel="Mulai Buat Katalog" userLabel="Buka Dashboard" size="lg" />
                <a href="#preview">
                  <Button variant="secondary" size="lg">
                    Lihat Tampilan Katalog
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <MarketingFooter />

      {/* ── Sticky CTA (mobile) ──────────────────────────────────────────── */}
      <div className="sticky bottom-4 z-30 px-4 md:hidden">
        <Card className="mx-auto flex max-w-md items-center justify-between rounded-full px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Siap bikin katalog?</p>
            <p className="text-xs text-muted">Gratis untuk mulai</p>
          </div>
          <LandingSessionButton guestLabel="Mulai Gratis" userLabel="Dashboard" size="sm" />
        </Card>
      </div>
    </div>
  );
}
