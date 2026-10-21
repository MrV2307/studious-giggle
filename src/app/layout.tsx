import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import MotionEnhancements from "@/components/MotionEnhancements";
import "./globals.css";
import "./image-cleanup.css";
import "./homepage-redesign.css";
import "./midnight-editorial.css";
import "./refined-editorial.css";
import "./margin-story.css";
import "./revolution.css";
import "./homepage-polish.css";

export const metadata: Metadata = {
  title: { default: "Margin — A journal for the curious", template: "%s · Margin" },
  description: "A living notebook for half-formed ideas, creative detours, and the small details that make an ordinary day feel extraordinary.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { type: "website", title: "Margin — A journal for the curious", description: "The space between the lines. Room to think, make a mess, and notice more." },
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#0d1420", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className="margin-body"><div className="announcement-root"><Header />{children}<MotionEnhancements /><footer className="wrap footer"><Link className="brand" href="/"><span className="brand-mark">m.</span><span>margin<span className="rust-dot">/</span></span></Link><span>Made slowly, with attention. © {new Date().getFullYear()} Margin Journal.</span><div className="footer-links"><Link href="/about">Our story</Link><Link href="/blogs">The journal</Link><Link href="/sign-in">Your account</Link></div></footer></div></body></html>;
}
