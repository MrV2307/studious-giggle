import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; const posts = await getPosts(); return [{ url: base, changeFrequency: "weekly", priority: 1 }, { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 }, { url: `${base}/blogs`, changeFrequency: "daily", priority: 0.8 }, ...posts.map(post => ({ url: `${base}/blogs/${post.slug}`, lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()), changeFrequency: "monthly" as const, priority: 0.7 }))]; }