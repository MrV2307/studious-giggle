"use client";

import Link from "next/link";

export default function StardanceDispatch() {
  return (
    <section className="stardance-dispatch wrap" aria-labelledby="stardance-title">
      <div className="stardance-topline">
        <span>HACK CLUB / STARDANCE</span>
        <span>FIELD LOG 001 <i aria-hidden="true">✳</i> CURIOSITY ACTIVE</span>
      </div>

      <div className="stardance-layout">
        <div className="stardance-orbit-scene" aria-hidden="true">
          <span className="stardance-coordinate stardance-coordinate--top">SIGNAL / FOUND</span>
          <div className="stardance-orbit stardance-orbit--one">
            <span className="stardance-node stardance-node--nasa">N</span>
          </div>
          <div className="stardance-orbit stardance-orbit--two">
            <span className="stardance-node stardance-node--amd">A</span>
          </div>
          <div className="stardance-orbit stardance-orbit--three">
            <span className="stardance-node stardance-node--github">GH</span>
          </div>
          <div className="stardance-core">
            <span>✳</span>
            <strong>LOOK<br />CLOSER</strong>
            <small>THEN BUILD</small>
          </div>
          <span className="stardance-coordinate stardance-coordinate--bottom">OBSERVE / EXPERIMENT / SHARE</span>
        </div>

        <div className="stardance-copy">
          <div className="stardance-kicker"><span /> A DIFFERENT KIND OF FIELD NOTE</div>
          <h2 id="stardance-title">Look up.<br />Build something.<br /><em>Leave a trace.</em></h2>
          <p className="stardance-lede">Margin is an independent, student-built journal for turning observations into ideas and ideas into stories.</p>
          <p>Stardance is the nudge to connect those instincts: science that sparks questions, engineering that gives them form, and open work that lets the next person learn from the process.</p>
          <Link className="stardance-brief" href="https://stardance.hackclub.com/missions/blog/guide#step-121" target="_blank" rel="noreferrer">
            Open the Stardance brief <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div className="stardance-pillars" aria-label="Three ideas behind the Stardance inspiration">
        <article className="stardance-pillar stardance-pillar--nasa">
          <span className="stardance-pillar-index">01 / OBSERVE</span>
          <h3>NASA</h3>
          <p>Start with a real question. Public science stories and mission material make the universe feel a little closer.</p>
          <a href="https://science.nasa.gov/" target="_blank" rel="noreferrer">Explore science <span aria-hidden="true">↗</span></a>
        </article>
        <article className="stardance-pillar stardance-pillar--amd">
          <span className="stardance-pillar-index">02 / EXPERIMENT</span>
          <h3>AMD</h3>
          <p>Give the weird idea a test run. Hardware and compute are part of how imagination becomes an experiment.</p>
          <a href="https://www.amd.com/" target="_blank" rel="noreferrer">Explore technology <span aria-hidden="true">↗</span></a>
        </article>
        <article className="stardance-pillar stardance-pillar--github">
          <span className="stardance-pillar-index">03 / SHARE</span>
          <h3>GitHub</h3>
          <p>Leave the trail visible. Notes, code, mistakes, and revisions give other people something to build on.</p>
          <a href="https://github.com/" target="_blank" rel="noreferrer">Explore open source <span aria-hidden="true">↗</span></a>
        </article>
      </div>

      <div className="stardance-footline">
        <span>BUILT FOR HACK CLUB'S STARDANCE CHALLENGE</span>
        <span>INDEPENDENT STUDENT PROJECT · NOT AN OFFICIAL PARTNER PRODUCT</span>
      </div>
    </section>
  );
}
