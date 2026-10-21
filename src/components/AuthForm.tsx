"use client";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({ mode, configured = false }: { mode: "sign-in" | "sign-up"; configured?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const signup = mode === "sign-up";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (!configured) {
        setError("The journal is open to read, but accounts aren't connected on this deployment yet. The site owner needs to check the authentication environment settings.");
        return;
      }
      const result = signup
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password, callbackURL: "/write" })
        : await authClient.signIn.email({ email: email.trim(), password, callbackURL: "/" });
      if (result.error) setError(result.error.message || "That didn't work. Check your details and give it another try.");
      else window.location.href = signup ? "/write" : "/";
    } catch {
      setError("We hit an unexpected bump. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="wrap auth-shell">
      <div className="auth-orbit" aria-hidden="true"><span>✳</span><i /><b /></div>
      <div className="auth-story">
        <div className="auth-story-kicker"><span className="auth-live-dot" /> A SMALL PLACE FOR BIG CURIOSITY</div>
        <p className="auth-side-index">MARGIN FIELD GUIDE / 00{signup ? "2" : "1"}</p>
        <h1>{signup ? <>Leave a little<br /><em>trace.</em></> : <>Your corner<br />of the <em>in-between.</em></>}</h1>
        <p className="auth-story-copy">{signup
          ? "Start a notebook that belongs to you. Publish the thing you can't stop thinking about, the experiment that went sideways, the tiny detail everyone else walked past."
          : "Your drafts, your odd little discoveries, your unfinished thoughts. They're right where you left them."}</p>
        <div className="auth-manifesto"><span>THE MARGIN RULE</span><p>“You don&apos;t need a niche. You need a point of view.”</p><i>— a note to self</i></div>
        <div className="auth-side-foot"><span>INDEPENDENT BY NATURE</span><span>EST. IN CURIOSITY ↗</span></div>
      </div>

      <form className="auth-card" onSubmit={submit}>
        <div className="auth-card-top"><span className="auth-card-mark">m<span>.</span></span><span>{signup ? "NEW NOTEBOOK" : "BACK IN THE MARGINS"}</span></div>
        <div className="eyebrow">{signup ? "No perfect drafts required" : "The door was left open"}</div>
        <h2>{signup ? "Make room." : "Pick up your thread."}</h2>
        <p className="auth-intro">{signup ? "Create your account. Bring the unfinished idea." : "Good ideas don't mind a little time away."}</p>
        {error && <div className="error" role="alert">{error}</div>}
        {signup && <div className="field"><label htmlFor="name">NAME / HANDLE</label><input id="name" value={name} onChange={e => setName(e.target.value)} required maxLength={80} autoComplete="name" placeholder="What should we call you?" /></div>}
        <div className="field"><label htmlFor="email">EMAIL ADDRESS</label><input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" /></div>
        <div className="field"><label htmlFor="password">PASSWORD</label><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={signup ? 8 : undefined} autoComplete={signup ? "new-password" : "current-password"} placeholder="Your password" /><label className="show-password"><input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} /> <span>Show password</span></label>{signup && <small>Use at least 8 characters. A longer passphrase is often easier to remember and harder to guess.</small>}</div>
        <button className="btn auth-submit" type="submit" disabled={busy}>{busy ? "Opening the notebook…" : signup ? "Start my notebook ↗" : "Step back inside ↗"}</button>
        <div className="form-bottom">{signup ? <>Already have a place here? <Link href="/sign-in">Sign in</Link></> : <>First time in the margins? <Link href="/sign-up">Make an account</Link></>}</div>
        <div className="auth-card-foot"><span>NO NOISE. JUST IDEAS.</span><span>✳</span></div>
      </form>
    </section>
  );
}
