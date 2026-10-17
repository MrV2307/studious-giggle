import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { deletePost, updatePost } from "@/app/actions";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
export const metadata: Metadata = { title: "Edit story", robots: { index: false, follow: false } };
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; if (!auth) redirect("/sign-in?setup=required"); const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect(`/sign-in?callbackURL=/write/${id}`);
  await connectDB(); let post;
  try { post = await Post.findById(id); } catch { notFound(); }
  if (!post) notFound(); if (post.authorId !== session.user.id) redirect(`/blogs/${post.slug}`);
  return <main className="wrap editor-shell"><Link href={`/blogs/${post.slug}`} className="back-link">← Back to story</Link><div className="eyebrow">The writing desk</div><h1>Make it clearer.</h1><p className="editor-sub">A good piece is allowed to change as you do.</p><form action={updatePost.bind(null, id)}><div className="editor-grid"><div className="editor-main"><div className="field"><label htmlFor="title">Title</label><input id="title" name="title" required maxLength={130} defaultValue={post.title}/></div><div className="field"><label htmlFor="excerpt">Short introduction</label><textarea id="excerpt" name="excerpt" required maxLength={260} defaultValue={post.excerpt}/></div><div className="field"><label htmlFor="content">Story body (Markdown supported)</label><textarea id="content" name="content" required maxLength={50000} className="body-input" defaultValue={post.content}/></div></div><aside className="editor-aside"><h3>Story details</h3><div className="field"><label htmlFor="category">Category</label><select id="category" name="category" defaultValue={post.category}><option>Mindful living</option><option>Slow living</option><option>Field notes</option><option>Creative practice</option><option>Reading room</option><option>Personal essay</option></select></div><div className="field"><label htmlFor="tags">Tags (comma-separated)</label><input id="tags" name="tags" defaultValue={post.tags.join(", ")}/></div><button className="btn" type="submit" style={{ width: "100%" }}>Save changes ↗</button><button className="share-btn" type="submit" formAction={deletePost.bind(null, id)} style={{ width: "100%", marginTop: 10 }}>Delete story</button></aside></div></form></main>;
}