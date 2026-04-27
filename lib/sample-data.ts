import { Product, ThemeAccent, User } from "@/lib/types";

export const accentOptions: {
  id: ThemeAccent;
  name: string;
  color: string;
  soft: string;
  buttonText: string;
}[] = [
  { id: "emerald", name: "Emerald", color: "#0f766e", soft: "#ccfbf1", buttonText: "#f8fafc" },
  { id: "sky", name: "Sky", color: "#0369a1", soft: "#dbeafe", buttonText: "#f8fafc" },
  { id: "coral", name: "Coral", color: "#c2410c", soft: "#ffedd5", buttonText: "#fff7ed" },
  { id: "amber", name: "Amber", color: "#b45309", soft: "#fef3c7", buttonText: "#fffaf0" }
];

export const demoUser: User = {
  id: "user-demo-rara",
  name: "Rara Commerce Lab",
  username: "raracommerce",
  email: "demo@linkatalog.id",
  bio: "Katalog jualan praktis untuk produk fisik, digital, dan jasa custom. Semua order masuk langsung ke WhatsApp tanpa ribet.",
  whatsapp: "6281234567890",
  profileImage: "/demo/avatar-rara.svg",
  location: "Bandung, Jawa Barat",
  themePreference: "light",
  themeAccent: "emerald",
  isActive: true,
  createdAt: "2026-03-25T10:00:00.000Z",
  updatedAt: "2026-04-24T09:00:00.000Z"
};

export const demoProducts: Product[] = [
  {
    id: "raracommerce-nasi-box-premium-nusantara",
    userId: demoUser.id,
    ownerName: demoUser.name,
    ownerUsername: demoUser.username,
    title: "Nasi Box Premium Nusantara",
    price: 35000,
    description: "Paket makan siap kirim untuk meeting, acara kantor, dan hampers komunitas. Minimal order 20 box.",
    imageUrl: "/demo/nasi-box.svg",
    badge: "Best Seller",
    category: "Makanan",
    isActive: true,
    createdAt: "2026-04-02T09:00:00.000Z",
    updatedAt: "2026-04-02T09:00:00.000Z"
  },
  {
    id: "raracommerce-glow-serum-booster-15ml",
    userId: demoUser.id,
    ownerName: demoUser.name,
    ownerUsername: demoUser.username,
    title: "Glow Serum Booster 15ml",
    price: 129000,
    description: "Serum harian dengan tekstur ringan, aman untuk kulit sensitif, dan cocok untuk reseller kecil.",
    imageUrl: "/demo/serum.svg",
    badge: "Promo",
    category: "Skincare",
    isActive: true,
    createdAt: "2026-04-08T09:00:00.000Z",
    updatedAt: "2026-04-08T09:00:00.000Z"
  },
  {
    id: "raracommerce-desain-feed-instagram-9-post",
    userId: demoUser.id,
    ownerName: demoUser.name,
    ownerUsername: demoUser.username,
    title: "Desain Feed Instagram 9 Post",
    price: 450000,
    description: "Paket desain konten promo untuk brand UMKM, lengkap dengan revisi ringan dan file siap upload.",
    imageUrl: "/demo/design-service.svg",
    badge: "Baru",
    category: "Jasa desain",
    isActive: true,
    createdAt: "2026-04-12T09:00:00.000Z",
    updatedAt: "2026-04-12T09:00:00.000Z"
  },
  {
    id: "raracommerce-landing-page-bisnis-kilat",
    userId: demoUser.id,
    ownerName: demoUser.name,
    ownerUsername: demoUser.username,
    title: "Landing Page Bisnis Kilat",
    price: 2500000,
    description: "Jasa pembuatan landing page ringan untuk promosi produk, event, atau katalog bisnis kecil.",
    imageUrl: "/demo/web-service.svg",
    badge: "",
    category: "Jasa pembuatan website",
    isActive: true,
    createdAt: "2026-04-18T09:00:00.000Z",
    updatedAt: "2026-04-18T09:00:00.000Z"
  }
];

export const productBadgeOptions = ["", "Best Seller", "Promo", "Baru"] as const;
export const productCategorySuggestions = [
  "Makanan",
  "Skincare",
  "Jasa desain",
  "Jasa pembuatan website",
  "Kopi literan",
  "Kue rumahan",
  "Jasa foto produk"
];

export const demoImageOptions = [
  "/demo/nasi-box.svg",
  "/demo/serum.svg",
  "/demo/design-service.svg",
  "/demo/web-service.svg"
];

export const avatarOptions = ["/demo/avatar-rara.svg"];
