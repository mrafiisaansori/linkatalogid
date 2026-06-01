import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const posts = await getAllPosts();

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7
  }));

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...blogEntries,
    { url: `${SITE_URL}/kebijakan`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/syarat-layanan`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/bantuan`, lastModified, changeFrequency: "monthly", priority: 0.6 }
  ];
}
