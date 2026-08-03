import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buildDemoSession, setDemoSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Create account",
};

async function demoSignUpAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("fullName") ?? "").trim();
  if (!email) {
    redirect("/signup?error=missing-email");
  }
  await setDemoSession(buildDemoSession(email, name || undefined));
  redirect("/account");
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f2] px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-[#0c0c0c]/10 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0d5c63] text-sm font-bold text-white">
              AC
            </span>
            <span className="text-base font-semibold">A&C Merch Store</span>
          </Link>
          <h1 className="mt-4 text-xl font-semibold">Create account</h1>
          <p className="mt-1 text-sm text-[#0c0c0c]/60">
            Demo signup creates a local session. Connect Supabase Auth for production.
          </p>
        </div>

        {error === "missing-email" ? (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Email is required.
          </p>
        ) : null}

        <form action={demoSignUpAction} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" required autoComplete="name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit">Create account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#0c0c0c]/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#0d5c63] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
