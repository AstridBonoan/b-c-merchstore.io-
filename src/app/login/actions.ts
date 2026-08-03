"use server";

import { redirect } from "next/navigation";
import { buildDemoSession, setDemoSession } from "@/lib/auth/session";

function safeNextPath(next: FormDataEntryValue | null): string | null {
  const value = typeof next === "string" ? next.trim() : "";
  return value.startsWith("/") ? value : null;
}

/**
 * Demo-only "login": no password check, just assigns a role based on the
 * `admin@acmerch.store` allow-list and stores it in the `ac-demo-session`
 * cookie. Real deployments would replace this with Supabase auth.
 */
export async function demoLoginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const next = safeNextPath(formData.get("next"));

  if (!email) {
    const query = next ? `&next=${encodeURIComponent(next)}` : "";
    redirect(`/login?error=missing-email${query}`);
  }

  const session = buildDemoSession(email, name);
  await setDemoSession(session);

  redirect(next ?? (session.role === "admin" ? "/admin" : "/"));
}
