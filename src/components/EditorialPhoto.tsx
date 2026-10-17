"use client";

import { photoForPost, type EditorialImageInput } from "@/lib/editorial";

export default function EditorialPhoto({ post, className = "", priority = false }: { post: EditorialImageInput; className?: string; priority?: boolean }) {
  const photo = photoForPost(post);
  return <img className={`real-photo ${className}`.trim()} src={photo.src} alt={photo.alt} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : "auto"} onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("photo-error")} />;
}