import Link from "next/link";
import { photoForPost } from "@/lib/editorial";
type CardPost = { slug: string; title: string; excerpt: string; category: string; tags: string[]; publishedAt?: Date | string; authorName: string; };
export default function BlogCard({ post }: { post: CardPost; variant?: string }) {
  const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" }) : "Field notes";
  const photo = photoForPost(post);
  return <article className="post-card"><Link href={`/blogs/${post.slug}`} className="post-card-link"><div className="post-art"><img className="real-photo" src={photo.src} alt={photo.alt} loading="lazy" decoding="async" onLoad={event => event.currentTarget.classList.add("is-loaded")} onError={event => event.currentTarget.classList.add("photo-error")}/><span className="art-word">{post.category}</span><span className="photo-index">M / FIELD NOTE</span></div><div className="post-meta"><span>{post.category}</span><span>{date}</span></div><h3 className="post-title">{post.title}</h3><p className="post-excerpt">{post.excerpt}</p></Link><div className="tag-list">{post.tags.slice(0, 3).map(tag => <Link className="tag" key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div><Link className="read-link" href={`/blogs/${post.slug}`}>Read the story ↗</Link></article>;
}