import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) return new NextResponse("Not found", { status: 404 });
  try {
    await connectDB();
    const post = await Post.findById(id).select("+imageData +imageMimeType").lean();
    if (!post?.imageData || !post.imageMimeType) return new NextResponse("Image not found", { status: 404 });
    const bytes = Buffer.from(post.imageData, "base64");
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": post.imageMimeType,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Image unavailable", { status: 503 });
  }
}
