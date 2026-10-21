import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlogCard from "@/components/BlogCard";
import EditorialPhoto from "@/components/EditorialPhoto";
import Engagement from "@/components/Engagement";
import SaveStoryButton from "@/components/SaveStoryButton";
import { deletePost } from "@/app/actions";
import { auth } from "@/lib/auth";
import { getPostBySlug, getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const post = await getPostBySlug(slug);
  if (!post) return { title: "Story not found" };
  return { title: post.title, description: post.excerpt, openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: new Date(post.publishedAt || post.createdAt || "2026-01-01T00:00:00.000Z").toISOString(), authors: [post.authorName], tags: post.tags } };
}
export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = await getPostBySlug(slug); if (!post) notFound();
  const session = auth ? await auth.api.getSession({ headers: await headers() }) : null;
  const owner = !!session?.user?.id && session.user.id === post.authorId;
  const suggestions = (await getPosts()).filter(p => String(p._id) !== String(post._id)).slice(0, 3);
  return <main className="wrap"><article><div className="article-top"><Link className="back-link" href="/blogs">← Back to the journal</Link><div className="eyebrow">{post.category} · {post.tags.join(" / ")}</div><h1>{post.title}</h1><p className="article-deck">{post.excerpt}</p><div className="article-meta"><span className="avatar">m.</span><span>Words by {post.authorName}<br/><span className="sub-meta">{new Date(post.publishedAt || post.createdAt || "2026-01-01T00:00:00.000Z").toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" })} · {Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read</span></span></div><SaveStoryButton slug={post.slug} title={post.title} /></div><div className="article-hero"><EditorialPhoto post={post} priority/><span className="article-photo-label">{post.imageUrl ? "COVER IMAGE / BY THE AUTHOR" : "FIELD PHOTO / MARGIN ARCHIVE"}</span></div><div className="article-body" id="article-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div>{owner && <div className="owner-actions"><Link className="share-btn" href={`/write/${String(post._id)}`}>Edit story ↗</Link><form action={deletePost.bind(null, String(post._id))}><button className="share-btn" type="submit">Delete story</button></form></div>}<Engagement id={String(post._id)} slug={post.slug} likes={post.likes} comments={post.comments.map((c: { _id: unknown; authorName: string; body: string; createdAt?: Date }) => ({ _id: c._id, authorName: c.authorName, body: c.body, createdAt: c.createdAt }))} signedIn={!!session?.user} currentUserId={session?.user?.id}/></article><section className="section"><div className="section-head"><div><div className="eyebrow">Keep wandering</div><h2>More to sit with</h2></div><Link href="/blogs" className="text-link">All stories ↗</Link></div><div className="posts-grid">{suggestions.map((p, i) => <BlogCard key={String(p._id)} post={{ ...p, slug: p.slug, tags: p.tags }} variant={["mug", "city", "sun"][i % 3]}/>)}</div></section></main>;
}