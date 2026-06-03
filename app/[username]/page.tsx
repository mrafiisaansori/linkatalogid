import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicCatalogPayload } from "@/lib/server/seller-data";
import { PublicCatalogPage } from "@/components/public-catalog-page";
import { buildCatalogKeywords, buildCatalogSeoDescription } from "@/lib/catalog-seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface UsernamePageProps {
  params: Promise<{ username: string }>;
}

function catalogUrl(username: string) {
  return `${SITE_URL}/${encodeURIComponent(username)}`;
}

export async function generateMetadata({ params }: UsernamePageProps): Promise<Metadata> {
  const { username } = await params;
  const catalog = await getPublicCatalogPayload(username);

  if (!catalog?.user) {
    return {
      title: "Katalog tidak ditemukan",
      robots: { index: false, follow: false }
    };
  }

  const { user, products } = catalog;
  const title = `${user.name} - Katalog Produk & Jasa via WhatsApp`;
  const description = buildCatalogSeoDescription(user, products);
  const url = catalogUrl(user.username);
  const image = user.profileImage || "/og-image.png";

  return {
    title,
    description,
    keywords: buildCatalogKeywords(user, products),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "id_ID",
      images: [
        {
          url: image,
          alt: `${user.name} di ${SITE_NAME}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true }
    }
  };
}

export default async function UsernamePage({ params }: UsernamePageProps) {
  const { username } = await params;
  const catalog = await getPublicCatalogPayload(username);

  if (!catalog?.user) {
    notFound();
  }

  const publicUrl = catalogUrl(catalog.user.username);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: catalog.user.name,
    url: publicUrl,
    description: buildCatalogSeoDescription(catalog.user, catalog.products),
    image: catalog.user.profileImage || `${SITE_URL}/og-image.png`,
    address: catalog.user.location
      ? {
          "@type": "PostalAddress",
          addressLocality: catalog.user.location,
          addressCountry: "ID"
        }
      : undefined,
    sameAs: [publicUrl],
    makesOffer: catalog.products.slice(0, 12).map((product) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": product.type === "service" ? "Service" : "Product",
        name: product.title,
        description: product.description,
        image: product.imageUrl || undefined
      },
      price: product.priceMode === "custom" ? undefined : product.price,
      priceCurrency: "IDR",
      availability: product.isActive ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: publicUrl
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PublicCatalogPage username={username} initialCatalog={catalog} />
    </>
  );
}
