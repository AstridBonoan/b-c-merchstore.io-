import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | A&C Merch Store",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f2] px-4 py-12">
      <Suspense
        fallback={
          <div className="text-sm text-[#0c0c0c]/55">Loading sign in…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
