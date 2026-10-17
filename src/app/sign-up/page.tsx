import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { authConfigured } from "@/lib/auth";
export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: false } };
export default function SignUpPage() { return <main><AuthForm mode="sign-up" configured={authConfigured}/></main>; }