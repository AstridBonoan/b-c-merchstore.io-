"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  clearClientSession,
  useDemoSession,
  type DemoSession,
} from "@/lib/auth/client-session";
import { Button } from "@/components/ui/button";

export function RequireAuth({
  children,
  role,
  nextPath,
}: {
  children: React.ReactNode | ((session: DemoSession) => React.ReactNode);
  role?: "admin" | "customer";
  nextPath: string;
}) {
  const session = useDemoSession();
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = React.useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  React.useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace(`/login/?next=${encodeURIComponent(nextPath || pathname)}`);
      return;
    }
    if (role === "admin" && session.role !== "admin") {
      router.replace("/login/?next=/admin/");
    }
  }, [hydrated, session, role, router, nextPath, pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[#0c0c0c]/55">
        Loading…
      </div>
    );
  }

  if (!session) return null;
  if (role === "admin" && session.role !== "admin") return null;

  return <>{typeof children === "function" ? children(session) : children}</>;
}

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={() => {
        clearClientSession();
        router.push("/login/");
      }}
    >
      Sign out
    </Button>
  );
}

export function AuthLinks() {
  const session = useDemoSession();
  if (!session) {
    return (
      <Link href="/login/" className="text-sm font-medium hover:underline">
        Sign in
      </Link>
    );
  }
  return (
    <Link href="/account/" className="text-sm font-medium hover:underline">
      Account
    </Link>
  );
}
