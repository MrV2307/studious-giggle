"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function StorySearch({ tags, query }: { tags: string[]; query: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(query);

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams(params.toString());
    const trimmed = value.trim();

    if (trimmed) {
      next.set("q", trimmed);
    } else {
      next.delete("q");
    }

    router.push(`/blogs?${next.toString()}`);
  }

  function choose(tag: string) {
    const next = new URLSearchParams(params.toString());

    if (tag === "All stories") {
      next.delete("tag");
    } else {
      next.set("tag", tag);
    }

    router.push(`/blogs?${next.toString()}`);
  }

  const selected = params.get("tag") || "All stories";

  return (
    <div className="toolbar">
      <form className="searchbox" onSubmit={search}>
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search titles, ideas, tags…"
          aria-label="Search stories"
        />
        <button className="search-submit" type="submit">Search</button>
      </form>
      <div className="filters">
        {["All stories", ...tags].map((tag) => (
          <button
            key={tag}
            type="button"
            className={`tag ${selected === tag ? "active" : ""}`}
            onClick={() => choose(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
