"use client";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
export default function AuthForm({ mode, configured = false }: { mode: "sign-in" | "sign-up"; configured?: boolean }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const signup = mode === "sign-up";
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if (!configured) { setError("Accounts are not connected on this preview yet. The public journal works, but login and publishing need MongoDB + Better Auth environment settings."); return; }
      const result = signup
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password, callbackURL: "/write" })
        : await authClient.signIn.email({ email: email.trim(), password, callbackURL: "/" });
      if (result.error) setError(result.error.message || "We couldn't complete that request. Check your details and try again.");
      else window.location.href = signup ? "/write" : "/";
    } catch { setError("Something went wrong. Please try again in a moment."); }
    finally { setBusy(false); }
  }
  return <section className="wrap auth-shell"><form className="auth-card" onSubmit={submit}><div className="eyebrow">{signup ? "Make yourself at home" : "Welcome back"}</div><h1>{signup ? "Join the journal." : "Good to see you."}</h1><p>{signup ? "Make an account to publish your own stories and join the conversation." : "Sign in to write, edit, and join the conversation."}</p>{error && <div className="error" role="alert">{error}</div>}{signup && <div className="field"><label htmlFor="name">Your name</label><input id="name" value={name} onChange={e => setName(e.target.value)} required maxLength={80} autoComplete="name" placeholder="What should we call you?"/></div>}<div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com"/></div><div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={10} autoComplete={signup ? "new-password" : "current-password"} placeholder={signup ? "At least 10 characters" : "Your password"}/>{signup && <small>Use 10 or more characters.</small>}</div><button className="btn" type="submit" disabled={busy}>{busy ? "One moment…" : signup ? "Create my account ↗" : "Sign in ↗"}</button><div className="form-bottom">{signup ? <>Already have an account? <Link href="/sign-in">Sign in</Link></> : <>New around here? <Link href="/sign-up">Create an account</Link></>}</div></form></section>;
}