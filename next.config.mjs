/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  outputFileTracingIncludes: {
    "/*": ["./prisma/dev.db", "./prisma/dev.db-journal", "./prisma/schema.prisma", "./node_modules/.prisma/client/**/*"]
  }
};

export default nextConfig;
