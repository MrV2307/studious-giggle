"use client";

import { useEffect, useState } from "react";

type SavedStory = { slug: string; title: string; savedAt: number };
const STORAGE_KEY = "margin:saved-stories:v1";

function readSaved(): SavedStory[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is SavedStory =>
        !!item &&
        typeof item.slug === "string" &&
        /^[a-z0-9-]+$/i.test(item.slug) &&
        typeof item.title === "string" &&
        typeof item.savedAt === "number",
    );
  } catch {
    return [];
  }
}

export default function SaveStoryButton({ slug, title }: { slug: string; title: string }) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => setSaved(readSaved().some((story) => story.slug === slug));
    refresh();
    setReady(true);
    window.addEventListener("storage", refresh);
    window.addEventListener("margin:saved-stories-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("margin:saved-stories-change", refresh);
    };
  }, [slug]);

  function toggle() {
    const current = readSaved();
    const exists = current.some((story) => story.slug === slug);
    const next = exists
      ? current.filter((story) => story.slug !== slug)
      : [{ slug, title, savedAt: Date.now() }, ...current];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(!exists);
      window.dispatchEvent(new Event("margin:saved-stories-change"));
    } catch {
      setSaved(false);
    }
  }

  return (
    <button
      type="button"
      className={`save-story-button ${saved ? "is-saved" : ""}`}
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved stories` : `Save ${title} for later`}
      title={ready ? (saved ? "Remove from reading list" : "Save for later") : "Save for later"}
    >
      <span aria-hidden="true">{saved ? "★" : "☆"}</span>
      {saved ? "Saved" : "Save for later"}
    </button>
  );
}
