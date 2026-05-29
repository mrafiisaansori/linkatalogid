/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  outputFileTracingIncludes: {
    "/*": ["./prisma/dev.db", "./prisma/dev.db-journal", "./prisma/schema.prisma", "./node_modules/.prisma/client/**/*"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "linkatalog.raftechsolution.web.id",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
