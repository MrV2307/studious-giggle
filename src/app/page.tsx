import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import EditorialPhoto from "@/components/EditorialPhoto";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPosts();
  const editorPick = posts.find(post => post.slug === "make-things-badly-on-purpose") || posts[3] || posts[0];

  return (
    <main className="home-page">
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> An independent journal / issue 04</div>
          <h1>The world is loud.<br />Keep a little room for <em>wonder</em><span className="headline-period" aria-hidden="true">.</span></h1>
          <p className="hero-copy-text">Margin is a journal for the things that almost slip past: half-formed ideas, small discoveries, creative detours, and the details that make an ordinary day feel a little less ordinary.</p>
          <div className="hero-actions">
            <Link className="btn" href="/blogs">Wander through the journal <span aria-hidden="true">↗</span></Link>
            <Link className="text-link" href="/about">The story behind Margin <span>↗</span></Link>
          </div>
          <div className="hero-aside-note"><span className="signal">✳</span><span>A living notebook for curious minds.<br />No final answers required.</span></div>
        </div>
        <div className="hero-art" aria-label="A quiet landscape, a reminder to notice the world">
          <EditorialPhoto post={{}} className="hero-photo" priority />
          <div className="margin-photo-note" aria-hidden="true"><span>LOOK CLOSER</span><span>there is always more here</span></div>
          <span className="margin-orbit-label" aria-hidden="true">M / 04</span>
        </div>
      </section>

      <section className="margin-manifesto wrap" aria-label="The Margin idea">
        <div className="manifesto-index"><span>FIELD NOTE 001</span><span>WHY WE’RE HERE</span></div>
        <p>Not everything needs to become a side hustle, a hot take, or a perfectly finished thing.</p>
        <div className="manifesto-foot"><span className="manifesto-star">✳</span><span>Sometimes noticing is enough.</span><span className="manifesto-rule" /></div>
      </section>


      <nav className="topic-rail wrap" aria-label="Browse journal themes">
        <span className="topic-kicker">PICK A THREAD</span>
        <Link href="/blogs?tag=Creativity">01 / Making &amp; ideas</Link>
        <Link href="/blogs?tag=Mindfulness">02 / Attention &amp; rituals</Link>
        <Link href="/blogs?tag=Travel">03 / Places &amp; people</Link>
        <Link href="/blogs?tag=Wellbeing">04 / Soft living</Link>
        <Link className="topic-rail-cta" href="/blogs/make-things-badly-on-purpose">Open a random page ↗</Link>
      </nav>

      <section className="section wrap">
        <div className="section-head">
          <div><div className="eyebrow">Fresh ink / still unfolding <span className="section-spark">✳</span></div><h2>Things we’ve been thinking about<span className="neon-period">.</span></h2></div>
          <p>Not the whole story.<br />Just a place to begin.</p>
        </div>
        {posts.length ? <div className="posts-grid">{posts.slice(0, 4).map(post => <BlogCard key={String(post._id)} post={{ ...post, slug: post.slug, tags: post.tags }} />)}</div> : <div className="empty-state"><h2>The first page is still blank.</h2><p>Leave a thought here when you’re ready. Every good journal starts somewhere.</p></div>}
        <div className="center-actions"><Link className="btn ghost" href="/blogs">Browse every story <span aria-hidden="true">↗</span></Link></div>
      </section>

      {editorPick && <section className="editorial-feature wrap">
        <Link className="editorial-image" href={`/blogs/${editorPick.slug}`} aria-label={`Read ${editorPick.title}`}><EditorialPhoto post={editorPick} className="editorial-photo" /></Link>
        <div className="editorial-copy">
          <div className="eyebrow">Pulled from the notebook / 04</div>
          <p className="scribble">keep this one close</p>
          <h2>{editorPick.title}<span className="neon-period">.</span></h2>
          <p>{editorPick.excerpt}</p>
          <div className="editorial-actions"><Link className="btn" href={`/blogs/${editorPick.slug}`}>Spend a few minutes here ↗</Link><span className="editorial-minutes">{Math.max(1, Math.ceil(editorPick.content.split(/\s+/).length / 200))} MIN READ · FIELD NOTE</span></div>
          <div className="photo-credit">{editorPick.imageUrl ? "COVER / UPLOADED BY THE AUTHOR" : "A NOTE FROM THE MARGIN ARCHIVE"}</div>
        </div>
      </section>}

      <section className="margin-principles wrap" aria-label="What Margin believes">
        <div className="principles-heading"><span className="eyebrow">A tiny set of beliefs</span><span className="principles-index">NO RULEBOOK / JUST ROOM</span></div>
        <div className="principles-grid">
          <article><span>01</span><h3>Stay curious.</h3><p>Ask the second question. Follow the odd link. Let a small thing become an interesting thing.</p></article>
          <article><span>02</span><h3>Make a mess.</h3><p>Good ideas rarely arrive polished. Drafts, detours, and experiments belong here too.</p></article>
          <article><span>03</span><h3>Leave some space.</h3><p>We don’t need to fill every silence. A little room can be where the good stuff happens.</p></article>
        </div>
      </section>

      <section className="feature-band">
        <div className="feature-inner wrap">
          <div><div className="eyebrow">A note to take with you</div><h2>You don’t have to turn every moment into something<span className="neon-period">.</span></h2><p>Some things can simply be noticed, enjoyed, and left alone. Margin is a reminder to make a little room for that kind of living.</p><Link href="/about" className="text-link">Why this place exists ↗</Link></div>
          <div><div className="quote-mark">“</div><div className="quote">The ordinary is not the opposite of wonder. It is where wonder learns to live.</div><div className="quote-by"><span className="quote-byline">A MARGIN FIELD NOTE</span><span className="quote-issue">NO. 04</span></div></div>
        </div>
      </section>

      <section className="newsletter wrap" id="newsletter">
        <div className="eyebrow justify-center">Letters, not noise</div><h2>A slower kind of inbox<span className="neon-period">.</span></h2>
        <p>Occasional notes on things worth noticing. No hustle, no daily drip.</p>
        <p className="newsletter-note">Bring a thought, a question, or a story of your own. There’s room for it here.</p>
        <Link className="btn" href="/sign-up">Add your page to the journal ↗</Link>
      </section>
    </main>
  );
}
