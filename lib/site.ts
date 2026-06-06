/**
 * Konfigurasi situs terpusat untuk metadata, SEO, footer, dan internal linking.
 * Ubah NEXT_PUBLIC_SITE_URL di environment untuk menyetel domain produksi.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://linkatalog.id").replace(/\/$/, "");

export const SITE_NAME = "Linkatalog";

export const SITE_TAGLINE = "Link katalog gratis untuk jualan lebih rapi";

export const SITE_DESCRIPTION =
  "Buat link katalog gratis untuk produk dan jasa dalam satu halaman yang mudah dibagikan. Pelanggan bisa memilih produk, memasukkannya ke keranjang, lalu checkout langsung via WhatsApp. Cocok untuk UMKM, reseller, toko online, dan merchant.";

export const SITE_KEYWORDS = [
  "link katalog gratis",
  "katalog online",
  "katalog online gratis",
  "katalog produk online",
  "link katalog",
  "katalog jualan",
  "katalog UMKM",
  "jualan online",
  "toko online",
  "etalase produk online",
  "checkout via WhatsApp",
  "keranjang belanja",
  "katalog produk untuk WhatsApp",
  "link produk untuk pelanggan",
  "katalog digital untuk seller",
  "katalog WhatsApp gratis"
];

/** Navigasi utama (anchor diawali "/" agar tetap bekerja dari halaman mana pun). */
export const FOOTER_NAV = [
  { href: "/link-katalog", label: "Link katalog" },
  { href: "/#fitur", label: "Fitur" },
  { href: "/#cara-kerja", label: "Cara kerja" },
  { href: "/#preview", label: "Preview katalog" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" }
];

export const FEATURED_PUBLIC_CATALOGS = [
  {
    username: "alatkopimalang",
    url: `${SITE_URL}/alatkopimalang`
  }
];

export const FOOTER_LEGAL = [
  { href: "/kebijakan", label: "Kebijakan" },
  { href: "/syarat-layanan", label: "Syarat Layanan" },
  { href: "/bantuan", label: "Bantuan" }
];

/** Hanya Instagram & TikTok yang ditampilkan. */
export const SOCIAL_LINKS = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/linkatalogid/" },
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@linkatalog" }
];
