import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteContentHeader } from "@/components/site-content-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { ArrowRightIcon, ClockIcon, SparkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import {
  type BlogBlock,
  formatPostDate,
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts
} from "@/lib/blog";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Artikel tidak ditemukan" };
  }

  const url = `/blog/${post.slug}`;
  return {
    title: post.seoTitle ?? post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.seoTitle ?? post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      images: [{ url: post.coverImage, width: 1200, height: 675, alt: post.coverAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle ?? post.title,
      description: post.description,
      images: [post.coverImage]
    }
  };
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2 className="mt-10 text-2xl font-semibold leading-snug text-foreground">{block.text}</h2>
      ) : (
        <h3 className="mt-7 text-xl font-semibold leading-snug text-foreground">{block.text}</h3>
      );
    case "paragraph":
      return <p className="mt-4 text-[15px] leading-8 text-muted">{block.text}</p>;
    case "list":
      return block.ordered ? (
        <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-[15px] leading-8 text-muted marker:font-semibold marker:text-brand">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="mt-4 space-y-2.5 text-[15px] leading-8 text-muted">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div className="mt-6 rounded-2xl border border-brand/20 bg-brand/[0.07] p-5">
          <div className="flex items-center gap-2 text-brand">
            <SparkIcon className="h-4 w-4" />
            {block.title ? <p className="text-sm font-semibold">{block.title}</p> : null}
          </div>
          <p className="mt-2 text-[15px] leading-7 text-foreground/90">{block.text}</p>
        </div>
      );
    case "quote":
      return (
        <blockquote className="mt-6 border-l-4 border-brand/40 pl-5 text-[15px] italic leading-8 text-foreground/90">
          {block.text}
        </blockquote>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(post.slug, 2);
  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "id-ID",
    articleSection: post.category,
    author: { "@type": "Organization", name: post.author, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` }
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.keywords.join(", ")
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url }
    ]
  };

  const faqJsonLd = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      }
    : null;

  return (
    <div className="page-shell min-h-screen overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      <SiteContentHeader />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <Link href="/" className="transition hover:text-foreground">
            Beranda
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/blog" className="transition hover:text-foreground">
            Blog
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{post.category}</span>
        </nav>

        <article className="mt-6">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 font-semibold uppercase tracking-wide text-brand">
              {post.category}
            </span>
            <span className="text-muted">{formatPostDate(post.publishedAt)}</span>
            <span className="inline-flex items-center gap-1 text-muted">
              <ClockIcon className="h-3.5 w-3.5" />
              {post.readingMinutes} menit baca
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-[2.5rem] sm:leading-[1.15]">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">{post.description}</p>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[1.75rem] border border-line/70 shadow-soft">
            <Image
              src={post.coverImage}
              alt={post.coverAlt}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-4">
            {post.content.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          {post.faq?.length ? (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold text-foreground">Pertanyaan umum</h2>
              <div className="mt-5 space-y-3">
                {post.faq.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-2xl border border-line/80 bg-surface/95 p-5 shadow-soft backdrop-blur-xl"
                  >
                    <h3 className="text-base font-semibold text-foreground">{item.question}</h3>
                    <p className="mt-2 text-[15px] leading-7 text-muted">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-brand/20 bg-gradient-to-br from-brand/15 via-brand/8 to-sky-500/10 p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Mulai bikin katalog onlinemu gratis</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted">
            Susun produk, bagikan satu link, terima order rapi via WhatsApp. Tanpa biaya, tanpa coding.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/auth">
              <Button size="lg">
                Mulai Gratis
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {related.length ? (
          <section className="mt-14">
            <h2 className="text-lg font-semibold text-foreground">Baca juga</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-line/80 bg-surface/95 shadow-soft backdrop-blur-xl transition hover:shadow-card"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={item.coverImage}
                      alt={item.coverAlt}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand">{item.category}</span>
                    <h3 className="text-base font-semibold leading-snug text-foreground">{item.title}</h3>
                    <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-semibold text-brand">
                      Baca
                      <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <MarketingFooter />
    </div>
  );
}
