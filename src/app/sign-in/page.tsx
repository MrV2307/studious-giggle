import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { authConfigured } from "@/lib/auth";
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
export default function SignInPage() { return <main><AuthForm mode="sign-in" configured={authConfigured}/></main>; }