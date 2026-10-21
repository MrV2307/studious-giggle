"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.documentElement.dataset.theme = "dark"; localStorage.removeItem("margin-theme"); }, []);
  async function logout() { await authClient.signOut(); router.replace("/"); }
  return <header className="topbar wrap"><Link className="brand" href="/" aria-label="Margin home"><span className="brand-mark">m<span>.</span></span><span>margin<span className="rust-dot">/</span></span></Link><button className="mobile-menu-toggle" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? "×" : "☰"}</button><nav className={`nav ${menuOpen ? "nav-open" : ""}`}><Link className={pathname.startsWith("/blogs") ? "active" : ""} href="/blogs" onClick={() => setMenuOpen(false)}>Journal</Link><Link className={pathname === "/about" ? "active" : ""} href="/about" onClick={() => setMenuOpen(false)}>About</Link><Link href="/#newsletter" onClick={() => setMenuOpen(false)}>Letters</Link>{session?.user ? <><Link className="write" href="/write" onClick={() => setMenuOpen(false)}>Write a story ↗</Link><button className="signin" onClick={logout}>Sign out</button></> : <Link className="signin" href="/sign-in" onClick={() => setMenuOpen(false)}>Sign in ↗</Link>}</nav></header>;
}
