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
  id: "user-demo-kopi-arunika",
  name: "Kopi Arunika Roastery",
  username: "kopiarunika",
  email: "demo@linkatalog.id",
  bio: "Roastery kopi lokal dengan pilihan single origin, house blend, dan paket langganan mingguan. Cocok untuk rumahan, kantor, dan coffee corner kecil.",
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
    id: "kopiarunika-gayo-washed-250gr",
    userId: demoUser.id,
    ownerName: demoUser.name,
    ownerUsername: demoUser.username,
    title: "Gayo Washed 250gr",
    price: 85000,
    description: "Biji kopi arabica dengan karakter citrus, brown sugar, dan body ringan. Fresh roast setiap minggu.",
    imageUrl: "/demo/nasi-box.svg",
    badge: "Best Seller",
    category: "Coffee beans",
    isActive: true,
    createdAt: "2026-04-02T09:00:00.000Z",
    updatedAt: "2026-04-02T09:00:00.000Z"
  },
  {
    id: "kopiarunika-flores-bajawa-natural-250gr",
    userId: demoUser.id,
    ownerName: demoUser.name,
    ownerUsername: demoUser.username,
    title: "Flores Bajawa Natural 250gr",
    price: 98000,
    description: "Profil rasa red berries dan dark chocolate untuk manual brew atau espresso rumahan.",
    imageUrl: "/demo/serum.svg",
    badge: "Promo",
    category: "Single origin",
    isActive: true,
    createdAt: "2026-04-08T09:00:00.000Z",
    updatedAt: "2026-04-08T09:00:00.000Z"
  },
  {
    id: "kopiarunika-house-blend-espresso-1kg",
    userId: demoUser.id,
    ownerName: demoUser.name,
    ownerUsername: demoUser.username,
    title: "House Blend Espresso 1kg",
    price: 285000,
    description: "Blend cokelat, karamel, dan hint spice yang stabil untuk kebutuhan cafe kecil dan kantor.",
    imageUrl: "/demo/design-service.svg",
    badge: "Baru",
    category: "Blend espresso",
    isActive: true,
    createdAt: "2026-04-12T09:00:00.000Z",
    updatedAt: "2026-04-12T09:00:00.000Z"
  },
  {
    id: "kopiarunika-subscription-weekly-brews",
    userId: demoUser.id,
    ownerName: demoUser.name,
    ownerUsername: demoUser.username,
    title: "Weekly Brew Subscription",
    price: 320000,
    description: "Langganan 4 pack coffee beans pilihan roaster per bulan untuk rumah, studio, atau kantor tim kecil.",
    imageUrl: "/demo/web-service.svg",
    badge: "",
    category: "Subscription",
    isActive: true,
    createdAt: "2026-04-18T09:00:00.000Z",
    updatedAt: "2026-04-18T09:00:00.000Z"
  }
];

export const productBadgeOptions = ["", "Best Seller", "Promo", "Baru"] as const;
export const productCategorySuggestions = [
  "Coffee beans",
  "Single origin",
  "Blend espresso",
  "Subscription",
  "Cold brew",
  "Drip bag",
  "Alat seduh"
];

export const demoImageOptions = [
  "/demo/nasi-box.svg",
  "/demo/serum.svg",
  "/demo/design-service.svg",
  "/demo/web-service.svg"
];

export const avatarOptions = ["/demo/avatar-rara.svg"];
