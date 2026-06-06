import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteContentHeader } from "@/components/site-content-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { formatPostDate, formatPostTime, getAllPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog Link Katalog Gratis & Tips Jualan via WhatsApp",
  description:
    "Tips dan panduan seputar link katalog gratis, katalog online, jualan via WhatsApp, dan strategi promosi untuk UMKM, reseller, serta toko online.",
  keywords: [
    "blog katalog online",
    "tips jualan online",
    "cara bikin katalog online gratis",
    "link katalog gratis",
    "checkout via whatsapp"
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: `Blog Link Katalog Gratis & Tips Jualan | ${SITE_NAME}`,
    description:
      "Panduan praktis membuat link katalog gratis, jualan via WhatsApp, dan tips pertumbuhan untuk UMKM dan reseller."
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog Link Katalog Gratis & Tips Jualan | ${SITE_NAME}`,
    description:
      "Panduan praktis membuat link katalog gratis, jualan via WhatsApp, dan tips pertumbuhan untuk UMKM dan reseller."
  }
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const [featured, ...rest] = posts;

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog ${SITE_NAME}`,
    url: `${SITE_URL}/blog`,
    description:
      "Tips dan panduan seputar link katalog gratis, katalog online, dan jualan via WhatsApp untuk UMKM dan reseller.",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      image: `${SITE_URL}${post.coverImage}`,
      author: { "@type": "Organization", name: post.author }
    }))
  };

  return (
    <div className="page-shell min-h-screen overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <SiteContentHeader />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <Link href="/" className="transition hover:text-foreground">
            Beranda
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Blog</span>
        </nav>

        <div className="mt-6 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Blog</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Tips link katalog gratis & jualan via WhatsApp
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Panduan praktis untuk membuat link katalog gratis, menjangkau lebih banyak pembeli, dan menerima order
            rapi lewat WhatsApp. Cocok untuk UMKM, reseller, dan toko online.
          </p>
        </div>

        {featured ? (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-10 grid overflow-hidden rounded-[2rem] border border-line/80 bg-surface/95 shadow-soft backdrop-blur-xl transition hover:shadow-card md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
              <Image
                src={featured.coverImage}
                alt={featured.coverAlt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                priority
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-7 sm:p-9">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 font-semibold uppercase tracking-wide text-brand">
                  {featured.category}
                </span>
                <span className="text-muted">{formatPostDate(featured.publishedAt)}</span>
                <span className="inline-flex items-center gap-1 text-muted">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {formatPostTime(featured)}
                </span>
              </div>
              <h2 className="text-2xl font-semibold leading-snug text-foreground sm:text-3xl">{featured.title}</h2>
              <p className="text-sm leading-7 text-muted">{featured.excerpt}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                Baca selengkapnya
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ) : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-line/80 bg-surface/95 shadow-soft backdrop-blur-xl transition hover:shadow-card"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.coverAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-1 font-semibold uppercase tracking-wide text-brand">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {formatPostTime(post)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold leading-snug text-foreground">{post.title}</h3>
                <p className="line-clamp-3 text-sm leading-6 text-muted">{post.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-semibold text-brand">
                  Baca
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-14 overflow-hidden rounded-[2rem] border border-brand/20 bg-gradient-to-br from-brand/15 via-brand/8 to-sky-500/10 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Siap bikin katalog onlinemu sendiri?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">
            Gratis, tanpa coding. Susun produk, bagikan satu link, dan terima order rapi via WhatsApp.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Mulai Gratis Sekarang
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/link-katalog">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Panduan Link Katalog
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
