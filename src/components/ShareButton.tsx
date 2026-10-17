"use client";
import { useState } from "react";
export default function ShareButton({ slug }: { slug: string }) {
  const [label, setLabel] = useState("↗ Share");
  async function share() {
    const url = `${window.location.origin}/blogs/${encodeURIComponent(slug)}`;
    try { await navigator.clipboard.writeText(url); setLabel("✓ Link copied"); }
    catch { window.prompt("Copy this story link:", url); }
    window.setTimeout(() => setLabel("↗ Share"), 1600);
  }
  return <button className="share-btn" type="button" onClick={share}>{label}</button>;
}