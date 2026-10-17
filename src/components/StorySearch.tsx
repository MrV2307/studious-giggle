"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
export default function StorySearch({ tags, query }: { tags: string[]; query: string }) {
  const router = useRouter(); const params = useSearchParams(); const [value, setValue] = useState(query);
  function search(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const next = new URLSearchParams(params.toString()); value.trim() ? next.set("q", value.trim()) : next.delete("q"); router.push(`/blogs?${next.toString()}`); }
  function choose(tag: string) { const next = new URLSearchParams(params.toString()); tag === "All stories" ? next.delete("tag") : next.set("tag", tag); router.push(`/blogs?${next.toString()}`); }
  const selected = params.get("tag") || "All stories";
  return <div className="toolbar"><form className="searchbox" onSubmit={search}><span className="search-icon">⌕</span><input value={value} onChange={e => setValue(e.target.value)} placeholder="Search titles, ideas, tags…" aria-label="Search stories"/><button className="search-submit" type="submit">Search</button></form><div className="filters">{["All stories", ...tags].map(tag => <button key={tag} className={`tag ${selected === tag ? "active" : ""}`} onClick={() => choose(tag)}>{tag}</button>)}</div></div>;
}