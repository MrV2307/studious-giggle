import type { Metadata } from "next";
import { Suspense } from "react";
import BlogCard from "@/components/BlogCard";
import StorySearch from "@/components/StorySearch";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "The journal", description: "Browse essays and notes on creativity, slow living, mindful observation, and everyday life." };
type Search = { q?: string; tag?: string };
export default async function BlogsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q = "", tag = "" } = await searchParams;
  const [posts, allPosts] = await Promise.all([getPosts(q, tag), getPosts()]);
  const tags = [...new Set(allPosts.flatMap(post => post.tags || []))].sort();
  return <main className="wrap"><div className="page-intro"><div className="eyebrow">The reading room</div><h1>The <em>journal.</em></h1><p>Notes, essays, and little reminders to live with your eyes open. Browse by mood, follow a thread, or see where a title takes you.</p></div><Suspense fallback={<div className="toolbar">Loading search…</div>}><StorySearch tags={tags} query={q}/></Suspense><div className="result-count">Showing {posts.length} {posts.length === 1 ? "story" : "stories"}{q ? ` matching “${q}”` : ""}{tag ? ` tagged ${tag}` : ""}</div>{posts.length ? <div className="posts-grid archive-grid">{posts.map((post, i) => <BlogCard key={String(post._id)} post={{ ...post, slug: post.slug, tags: post.tags }} variant={["sun", "mug", "city"][i % 3]}/>)}</div> : <div className="empty-state"><h2>No stories found — yet.</h2><p>Try another word or clear the filters to wander around.</p><a className="btn ghost" href="/blogs">Clear filters</a></div>}</main>;
}