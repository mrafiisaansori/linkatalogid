import { PrismaClient } from "@prisma/client";

declare global {
  var __linkatalogPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__linkatalogPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.__linkatalogPrisma = prisma;
}
