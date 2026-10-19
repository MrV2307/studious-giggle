import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import MotionEnhancements from "@/components/MotionEnhancements";
import "./globals.css";
import "./image-cleanup.css";
import "./homepage-redesign.css";
import "./midnight-editorial.css";
export const metadata: Metadata = {
  title: { default: "Margin — A journal for the curious", template: "%s · Margin" },
  description: "Thoughtful notes on creativity, slow living, and the small things that make a life.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { type: "website", title: "Margin — A journal for the curious", description: "Room to think. Space to notice." },
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#101828", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className="margin-body"><div className="announcement-root"><Header/>{children}<MotionEnhancements/><footer className="wrap footer"><a className="brand" href="/"><span className="brand-mark">m.</span><span>margin<span className="rust-dot">.</span></span></a><span>Made slowly, with attention. © {new Date().getFullYear()} Margin Journal.</span><div className="footer-links"><a href="/about">Our story</a><a href="/blogs">The journal</a><a href="/sign-in">Your account</a></div></footer></div></body></html>;
}