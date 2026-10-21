import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import EditorialPhoto from "@/components/EditorialPhoto";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const ambientParticles = [{"x":"4%","y":"8%","size":2,"tone":"cyan","delay":"-1.3s","duration":"6.9s"},{"x":"11%","y":"23%","size":3,"tone":"violet","delay":"-4.4s","duration":"8.2s"},{"x":"17%","y":"6%","size":2,"tone":"lime","delay":"-2.1s","duration":"7.1s"},{"x":"23%","y":"38%","size":2,"tone":"cyan","delay":"-5.5s","duration":"9.3s"},{"x":"29%","y":"16%","size":4,"tone":"spark","delay":"-3.1s","duration":"10s"},{"x":"33%","y":"72%","size":2,"tone":"violet","delay":"-6s","duration":"7.8s"},{"x":"38%","y":"25%","size":3,"tone":"cyan","delay":"-1.8s","duration":"8.4s"},{"x":"43%","y":"91%","size":2,"tone":"lime","delay":"-4.7s","duration":"6.7s"},{"x":"48%","y":"11%","size":2,"tone":"violet","delay":"-2.9s","duration":"9.5s"},{"x":"53%","y":"47%","size":3,"tone":"cyan","delay":"-6.3s","duration":"8.6s"},{"x":"57%","y":"31%","size":2,"tone":"lime","delay":"-1.1s","duration":"7.5s"},{"x":"62%","y":"82%","size":3,"tone":"violet","delay":"-3.7s","duration":"9.1s"},{"x":"67%","y":"15%","size":2,"tone":"cyan","delay":"-5.1s","duration":"8.8s"},{"x":"71%","y":"62%","size":4,"tone":"spark","delay":"-2.4s","duration":"10.5s"},{"x":"75%","y":"7%","size":2,"tone":"lime","delay":"-4.3s","duration":"7.4s"},{"x":"79%","y":"39%","size":3,"tone":"cyan","delay":"-1.9s","duration":"8s"},{"x":"84%","y":"18%","size":2,"tone":"violet","delay":"-5.8s","duration":"9.8s"},{"x":"88%","y":"75%","size":2,"tone":"cyan","delay":"-2.5s","duration":"7s"},{"x":"93%","y":"29%","size":3,"tone":"lime","delay":"-3.4s","duration":"8.7s"},{"x":"97%","y":"54%","size":2,"tone":"violet","delay":"-6.6s","duration":"9.2s"},{"x":"8%","y":"83%","size":2,"tone":"lime","delay":"-3.9s","duration":"7.7s"},{"x":"19%","y":"57%","size":3,"tone":"cyan","delay":"-2.7s","duration":"8.1s"},{"x":"27%","y":"94%","size":2,"tone":"violet","delay":"-5.2s","duration":"9.4s"},{"x":"36%","y":"54%","size":2,"tone":"lime","delay":"-1.6s","duration":"6.8s"},{"x":"46%","y":"68%","size":3,"tone":"cyan","delay":"-4.8s","duration":"8.9s"},{"x":"59%","y":"4%","size":2,"tone":"violet","delay":"-3.2s","duration":"7.6s"},{"x":"69%","y":"94%","size":2,"tone":"cyan","delay":"-5.9s","duration":"9.6s"},{"x":"82%","y":"89%","size":3,"tone":"lime","delay":"-2.2s","duration":"8.3s"},{"x":"91%","y":"6%","size":2,"tone":"cyan","delay":"-4.6s","duration":"7.3s"},{"x":"55%","y":"96%","size":2,"tone":"violet","delay":"-1.4s","duration":"9.1s"}] as const;

export default async function HomePage() {
  const posts = await getPosts();
  const editorPick = posts.find(post => post.slug === "make-things-badly-on-purpose") || posts[3] || posts[0];
  const heroStory = posts.find(post => post.slug !== editorPick?.slug) || posts[0];

  return (
    <main className="home-page">
      <div className="home-particle-field" aria-hidden="true">
        {ambientParticles.map((particle, index) => (
          <span
            key={index}
            className={`home-particle is-${particle.tone}`}
            style={{
              left: particle.x,
              top: particle.y,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>
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
          <Link className="hero-scroll-cue" href="#manifesto"><span className="hero-scroll-cue-dot" /> SCROLL TO FIND SOMETHING <span aria-hidden="true">↓</span></Link>
        </div>

        <div className="hero-scene" aria-label="An atmospheric view of a glowing nebula and a story from the Margin journal">
          <div className="hero-art">
            <EditorialPhoto post={{ category: "Cosmos", title: "A distant nebula in a dark sky", tags: ["stars"] }} className="hero-photo" priority />
            <span className="hero-image-shade" aria-hidden="true" />
            <span className="hero-light-beam" aria-hidden="true" />
            <span className="hero-scene-index" aria-hidden="true"><span className="hero-index-mark">✳</span> MARGIN / VOL. 04</span>
            <span className="hero-scene-coordinate" aria-hidden="true">A PLACE TO THINK · A PLACE TO BEGIN</span>
          </div>
          <span className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <span className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <span className="hero-orbit-spark" aria-hidden="true">✳</span>
          <span className="hero-orbit-copy" aria-hidden="true">KEEP<br />WONDERING</span>
          <span className="hero-glass-chip hero-glass-chip-top" aria-hidden="true"><span className="glass-pulse-dot" /> CURIOSITY SIGNAL / LIVE</span>
          <span className="hero-glass-chip hero-glass-chip-bottom" aria-hidden="true"><span>FIELD NOTE 004</span><b>KEEP LOOKING CLOSER</b></span>
          {heroStory && (
            <Link className="hero-floating-story" href={`/blogs/${heroStory.slug}`} aria-label={`Read ${heroStory.title}`}>
              <div className="hero-floating-topline"><span>OPEN JOURNAL ENTRY</span><span aria-hidden="true">↗</span></div>
              <div className="hero-floating-content">
                <div className="hero-story-thumb"><EditorialPhoto post={heroStory} className="hero-story-photo" /></div>
                <div className="hero-story-copy">
                  <span className="hero-story-kicker">A PAGE FROM THE JOURNAL</span>
                  <strong>{heroStory.title}</strong>
                  <span className="hero-story-action">READ THE PIECE <span aria-hidden="true">↗</span></span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className="margin-manifesto wrap" id="manifesto" aria-label="The Margin idea">
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

      <section className="section wrap" id="latest">
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
