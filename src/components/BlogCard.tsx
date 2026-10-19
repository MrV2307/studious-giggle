import Link from "next/link";
import EditorialPhoto from "@/components/EditorialPhoto";

type CardPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt?: Date | string;
  authorName: string;
};

export default function BlogCard({ post }: { post: CardPost; variant?: string }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" })
    : "Field notes";

  return (
    <article className="post-card">
      <Link href={`/blogs/${post.slug}`} className="post-card-link">
        <div className="post-art">
          <EditorialPhoto post={post} />
        </div>
        <div className="post-meta">
          <span>{post.category}</span>
          <span>{date}</span>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.excerpt}</p>
      </Link>
      <div className="tag-list">
        {post.tags.slice(0, 3).map(tag => (
          <Link className="tag" key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`}>{tag}</Link>
        ))}
      </div>
      <Link className="read-link" href={`/blogs/${post.slug}`}>Read the story ↗</Link>
    </article>
  );
}