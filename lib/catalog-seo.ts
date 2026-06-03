import { Product, User } from "@/lib/types";

function compactText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function buildCatalogSeoDescription(user: User, products: Product[]) {
  const name = compactText(user.name || user.username);
  const bio = compactText(user.bio || "");
  const location = compactText(user.location || "");
  const categories = Array.from(
    new Set(products.map((product) => compactText(product.category)).filter(Boolean))
  ).slice(0, 3);

  const categoryText = categories.length > 0 ? ` Temukan ${categories.join(", ")} dari ${name}.` : "";
  const locationText = location ? ` Berlokasi di ${location}.` : "";
  const bioText = bio ? ` ${bio}` : "";

  return compactText(
    `${name} adalah katalog online resmi di Linkatalog. Lihat produk dan jasa terbaru, pilih item, lalu pesan langsung via WhatsApp.${categoryText}${locationText}${bioText}`
  ).slice(0, 300);
}

export function buildCatalogKeywords(user: User, products: Product[]) {
  const name = compactText(user.name || user.username);
  const username = compactText(user.username);
  const categories = products.map((product) => compactText(product.category)).filter(Boolean);
  const productTitles = products.map((product) => compactText(product.title)).filter(Boolean);

  return Array.from(
    new Set([
      name,
      username,
      `${name} Linkatalog`,
      `${name} katalog`,
      `${name} katalog online`,
      `${name} WhatsApp`,
      ...categories,
      ...productTitles.slice(0, 8)
    ].filter(Boolean))
  );
}
