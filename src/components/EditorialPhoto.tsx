"use client";

import Image from "next/image";
import { photoForPost, type EditorialImageInput } from "@/lib/editorial";

export default function EditorialPhoto({
  post,
  className = "",
  priority = false,
}: {
  post: EditorialImageInput;
  className?: string;
  priority?: boolean;
}) {
  const photo = photoForPost(post);

  return (
    <Image
      className={`real-photo ${className}`.trim()}
      src={photo.src}
      alt={photo.alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 42vw"
      unoptimized
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onLoad={(event) => event.currentTarget.classList.add("is-loaded")}
      onError={(event) => event.currentTarget.classList.add("photo-error")}
    />
  );
}
