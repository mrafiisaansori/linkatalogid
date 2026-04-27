import bcrypt from "bcrypt";
import { PrismaClient, AnalyticsEventType } from "@prisma/client";

const prisma = new PrismaClient();

function daysAgo(days, hour = 9) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, Math.floor((days * 17) % 60), 0, 0);
  return date;
}

async function main() {
  const adminPasswordHash = await bcrypt.hash("rahasia", 10);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {
      passwordHash: adminPasswordHash,
      role: "superadmin",
      isActive: true
    },
    create: {
      username: "admin",
      passwordHash: adminPasswordHash,
      role: "superadmin",
      isActive: true
    }
  });

  const demoUser = await prisma.user.upsert({
    where: { username: "raracommerce" },
    update: {
      name: "Rara Commerce Lab",
      bio: "Katalog jualan praktis untuk produk fisik, digital, dan jasa custom. Semua order masuk langsung ke WhatsApp tanpa ribet.",
      whatsapp: "6281234567890",
      profileImage: "/demo/avatar-rara.svg",
      location: "Bandung, Jawa Barat",
      themePreference: "light",
      themeAccent: "emerald",
      isActive: true
    },
    create: {
      name: "Rara Commerce Lab",
      username: "raracommerce",
      bio: "Katalog jualan praktis untuk produk fisik, digital, dan jasa custom. Semua order masuk langsung ke WhatsApp tanpa ribet.",
      whatsapp: "6281234567890",
      profileImage: "/demo/avatar-rara.svg",
      location: "Bandung, Jawa Barat",
      themePreference: "light",
      themeAccent: "emerald",
      isActive: true,
      createdAt: daysAgo(30, 10)
    }
  });

  const demoSellerPasswordHash = await bcrypt.hash("demo12345", 10);
  await prisma.userAccount.upsert({
    where: { email: "demo@linkatalog.id" },
    update: {
      userId: demoUser.id,
      passwordHash: demoSellerPasswordHash
    },
    create: {
      userId: demoUser.id,
      email: "demo@linkatalog.id",
      passwordHash: demoSellerPasswordHash
    }
  });

  const seededProducts = [
    {
      title: "Nasi Box Premium Nusantara",
      price: 35000,
      description:
        "Paket makan siap kirim untuk meeting, acara kantor, dan hampers komunitas. Minimal order 20 box.",
      imageUrl: "/demo/nasi-box.svg",
      badge: "Best Seller",
      category: "Makanan",
      createdAt: daysAgo(22, 11)
    },
    {
      title: "Glow Serum Booster 15ml",
      price: 129000,
      description:
        "Serum harian dengan tekstur ringan, aman untuk kulit sensitif, dan cocok untuk reseller kecil.",
      imageUrl: "/demo/serum.svg",
      badge: "Promo",
      category: "Skincare",
      createdAt: daysAgo(18, 12)
    },
    {
      title: "Desain Feed Instagram 9 Post",
      price: 450000,
      description:
        "Paket desain konten promo untuk brand UMKM, lengkap dengan revisi ringan dan file siap upload.",
      imageUrl: "/demo/design-service.svg",
      badge: "Baru",
      category: "Jasa desain",
      createdAt: daysAgo(14, 13)
    },
    {
      title: "Landing Page Bisnis Kilat",
      price: 2500000,
      description:
        "Jasa pembuatan landing page ringan untuk promosi produk, event, atau katalog bisnis kecil.",
      imageUrl: "/demo/web-service.svg",
      badge: "",
      category: "Jasa pembuatan website",
      createdAt: daysAgo(8, 15)
    }
  ];

  const productRecords = [];
  for (const product of seededProducts) {
    const record = await prisma.product.upsert({
      where: {
        id: `${demoUser.username}-${product.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}`
      },
      update: {
        userId: demoUser.id,
        title: product.title,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        badge: product.badge,
        category: product.category,
        isActive: true
      },
      create: {
        id: `${demoUser.username}-${product.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}`,
        userId: demoUser.id,
        title: product.title,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        badge: product.badge,
        category: product.category,
        isActive: true,
        createdAt: product.createdAt
      }
    });

    productRecords.push(record);
  }

  await prisma.analyticsEvent.deleteMany({
    where: { ownerUserId: demoUser.id }
  });

  const analyticsEvents = [];
  for (let day = 0; day < 21; day += 1) {
    const basePath = `/${demoUser.username}`;
    const pageViews = 6 + ((day * 3) % 8);
    for (let index = 0; index < pageViews; index += 1) {
      analyticsEvents.push({
        eventType: AnalyticsEventType.PAGE_VIEW,
        ownerUserId: demoUser.id,
        productId: null,
        path: basePath,
        referrer: day % 3 === 0 ? "https://instagram.com/" : day % 4 === 0 ? "https://wa.me/" : "Direct",
        userAgent: "Mozilla/5.0 (Linkatalog Seed)",
        ipHash: `seed-ip-${day}-${index}`,
        createdAt: daysAgo(day, 8 + (index % 10))
      });
    }

    for (const [productIndex, product] of productRecords.entries()) {
      const productViews = 1 + ((day + productIndex) % 4);
      for (let index = 0; index < productViews; index += 1) {
        analyticsEvents.push({
          eventType: AnalyticsEventType.PRODUCT_VIEW,
          ownerUserId: demoUser.id,
          productId: product.id,
          path: basePath,
          referrer: day % 2 === 0 ? "https://instagram.com/" : "Direct",
          userAgent: "Mozilla/5.0 (Linkatalog Seed)",
          ipHash: `seed-product-ip-${day}-${productIndex}-${index}`,
          createdAt: daysAgo(day, 10 + ((productIndex + index) % 8))
        });
      }

      const clickCount = ((21 - day + productIndex) % 3 === 0 ? 2 : 1) + (productIndex === 0 ? 1 : 0);
      for (let index = 0; index < clickCount; index += 1) {
        analyticsEvents.push({
          eventType: AnalyticsEventType.WHATSAPP_CLICK,
          ownerUserId: demoUser.id,
          productId: product.id,
          path: basePath,
          referrer: day % 2 === 0 ? "https://instagram.com/" : "https://wa.me/",
          userAgent: "Mozilla/5.0 (Linkatalog Seed)",
          ipHash: `seed-click-ip-${day}-${productIndex}-${index}`,
          createdAt: daysAgo(day, 12 + ((productIndex + index) % 8))
        });
      }
    }
  }

  if (analyticsEvents.length > 0) {
    await prisma.analyticsEvent.createMany({
      data: analyticsEvents
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
