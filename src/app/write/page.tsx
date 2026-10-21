import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import StoryComposer from "@/components/StoryComposer";
import { createPost } from "@/app/actions";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Write a story", robots: { index: false, follow: false } };

export default async function WritePage() {
  if (!auth) redirect("/sign-in?setup=required");
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in?callbackURL=/write");

  return (
    <main className="write-story-page editor-shell">
      <Link href="/blogs" className="back-link">← Back to journal</Link>
      <section className="write-story-heading" aria-labelledby="write-title">
        <div className="write-story-heading-art" aria-hidden="true">
          <span className="write-art-ring write-art-ring-one" />
          <span className="write-art-ring write-art-ring-two" />
          <span className="write-art-spark">✳</span>
        </div>
        <div className="eyebrow">The writing desk · open edition 04</div>
        <h1 id="write-title">Make room for<br /><em>a thought.</em></h1>
        <p className="editor-sub">Start with the bit you can&apos;t stop thinking about. It doesn&apos;t have to be polished to be worth sharing.</p>
        <div className="write-story-signals" aria-label="Writing desk features">
          <span><i aria-hidden="true">✳</i> Live word count</span>
          <span><i aria-hidden="true">◌</i> Markdown preview</span>
          <span><i aria-hidden="true">↗</i> Cover image preview</span>
        </div>
      </section>
      <StoryComposer action={createPost} />
      <p className="write-story-footer-note"><span aria-hidden="true">✳</span> There is no perfect first draft. There is only the next sentence.</p>
    </main>
  );
}
