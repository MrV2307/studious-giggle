"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { slugify } from "@/lib/slug";

async function currentUser() {
  if (!auth) throw new Error("Publishing is not enabled on this preview. Configure MongoDB and Better Auth in the hosting environment first.");
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Please sign in to do that.");
  return { id: session.user.id, name: session.user.name || "Margin writer" };
}
function requiredString(form: FormData, key: string, max: number) {
  const value = String(form.get(key) || "").trim();
  if (!value || value.length > max) throw new Error(`${key} is required and must be under ${max} characters.`);
  return value;
}
async function uniqueSlug(title: string, ignoreId?: string) {
  const base = slugify(title);
  let slug = base, counter = 2;
  while (await Post.exists({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) slug = `${base}-${counter++}`;
  return slug;
}

export async function createPost(form: FormData) {
  const user = await currentUser(); await connectDB();
  const title = requiredString(form, "title", 130);
  const excerpt = requiredString(form, "excerpt", 260);
  const content = requiredString(form, "content", 50000);
  const category = String(form.get("category") || "Field notes").slice(0, 60);
  const tags = String(form.get("tags") || "").split(",").map(t => t.trim()).filter(Boolean).slice(0, 8).map(t => t.slice(0, 32));
  const slug = await uniqueSlug(title);
  await Post.create({ title, slug, excerpt, content, category, tags, authorId: user.id, authorName: user.name });
  revalidatePath("/"); revalidatePath("/blogs"); redirect(`/blogs/${slug}`);
}

export async function updatePost(id: string, form: FormData) {
  const user = await currentUser(); await connectDB();
  const post = await Post.findById(id);
  if (!post) throw new Error("Story not found.");
  if (post.authorId !== user.id) throw new Error("You can only edit your own stories.");
  post.title = requiredString(form, "title", 130);
  post.excerpt = requiredString(form, "excerpt", 260);
  post.content = requiredString(form, "content", 50000);
  post.category = String(form.get("category") || "Field notes").slice(0, 60);
  post.tags = String(form.get("tags") || "").split(",").map(t => t.trim()).filter(Boolean).slice(0, 8).map(t => t.slice(0, 32));
  post.slug = await uniqueSlug(post.title, post.id);
  await post.save();
  revalidatePath("/"); revalidatePath("/blogs"); revalidatePath(`/blogs/${post.slug}`); redirect(`/blogs/${post.slug}`);
}

export async function deletePost(id: string) {
  const user = await currentUser(); await connectDB();
  const post = await Post.findById(id);
  if (!post) redirect("/blogs");
  if (post.authorId !== user.id) throw new Error("You can only delete your own stories.");
  await post.deleteOne();
  revalidatePath("/"); revalidatePath("/blogs"); redirect("/blogs");
}

export async function toggleLike(id: string) {
  const user = await currentUser(); await connectDB();
  const post = await Post.findById(id);
  if (!post) throw new Error("Story not found.");
  post.likes = post.likes.includes(user.id) ? post.likes.filter(value => value !== user.id) : [...post.likes, user.id];
  await post.save(); revalidatePath(`/blogs/${post.slug}`);
}

export async function addComment(id: string, form: FormData) {
  const user = await currentUser(); await connectDB();
  const body = requiredString(form, "body", 1200);
  const post = await Post.findById(id);
  if (!post) throw new Error("Story not found.");
  post.comments.push({ userId: user.id, authorName: user.name, body });
  await post.save(); revalidatePath(`/blogs/${post.slug}`);
}