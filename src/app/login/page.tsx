import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_ADMIN_EMAIL } from "@/lib/auth/session";
import { demoLoginAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Sign in | A&C Merch Store",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const nextPath = next && next.startsWith("/") ? next : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f2] px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-[#0c0c0c]/10 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0d5c63] text-sm font-bold text-white">
              AC
            </span>
            <span className="text-base font-semibold text-[#0c0c0c]">
              A&C Merch Store
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-[#0c0c0c]">Sign in</h1>
          <p className="mt-1 text-sm text-[#0c0c0c]/60">
            Demo mode — no password required. Sign in as{" "}
            <span className="font-medium text-[#0c0c0c]">{DEMO_ADMIN_EMAIL}</span>{" "}
            for admin dashboard access.
          </p>
        </div>

        {error === "missing-email" ? (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Enter an email address to continue.
          </p>
        ) : null}

        <form action={demoLoginAction} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={nextPath} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name (optional)</Label>
            <Input id="name" name="name" type="text" placeholder="Jamie Rivera" autoComplete="name" />
          </div>
          <Button type="submit" className="mt-1">
            Continue
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-wide text-[#0c0c0c]/40">
          <span className="h-px flex-1 bg-[#0c0c0c]/10" />
          Quick demo access
          <span className="h-px flex-1 bg-[#0c0c0c]/10" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <form action={demoLoginAction}>
            <input type="hidden" name="email" value={DEMO_ADMIN_EMAIL} />
            <input type="hidden" name="name" value="Admin" />
            <input type="hidden" name="next" value={nextPath || "/admin"} />
            <Button type="submit" variant="secondary" className="w-full">
              Admin demo
            </Button>
          </form>
          <form action={demoLoginAction}>
            <input type="hidden" name="email" value="jordan.blake@example.com" />
            <input type="hidden" name="name" value="Jordan Blake" />
            <input type="hidden" name="next" value={nextPath || "/account"} />
            <Button type="submit" variant="outline" className="w-full">
              Customer demo
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
