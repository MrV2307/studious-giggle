"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.documentElement.dataset.theme = "dark"; localStorage.removeItem("margin-theme"); }, []);
  async function logout() { await authClient.signOut(); window.location.href = "/"; }
  return <><div className="announcement">A field journal for life on the edge of ordinary ✳ now in its neon era</div><header className="topbar wrap"><Link className="brand" href="/" aria-label="Margin home"><span className="brand-mark">m<span>.</span></span><span>margin<span className="rust-dot">/</span></span></Link><button className="mobile-menu-toggle" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? "×" : "☰"}</button><nav className={`nav ${menuOpen ? "nav-open" : ""}`}><Link className={pathname.startsWith("/blogs") ? "active" : ""} href="/blogs" onClick={() => setMenuOpen(false)}>Journal <span className="nav-index">01</span></Link><Link className={pathname === "/about" ? "active" : ""} href="/about" onClick={() => setMenuOpen(false)}>About</Link><a href="/#newsletter" onClick={() => setMenuOpen(false)}>Letters</a><Link className="surprise-link" href="/blogs/make-things-badly-on-purpose" onClick={() => setMenuOpen(false)}>Surprise me ✳</Link>{session?.user ? <><Link className="write" href="/write" onClick={() => setMenuOpen(false)}>Write a story ↗</Link><button className="signin" onClick={logout}>Sign out</button></> : <Link className="signin" href="/sign-in" onClick={() => setMenuOpen(false)}>Sign in ↗</Link>}</nav></header><nav className="topic-rail wrap" aria-label="Browse journal themes"><span className="topic-kicker">FOLLOW A THREAD</span><Link href="/blogs?tag=Creativity">✳ Making &amp; ideas</Link><Link href="/blogs?tag=Mindfulness">Attention / rituals</Link><Link href="/blogs?tag=Travel">Places &amp; people</Link><Link href="/blogs?tag=Wellbeing">Soft living</Link></nav></>;
}