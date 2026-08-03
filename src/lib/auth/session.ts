import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";
import { isAdmin } from "@/lib/auth/roles";

/** Cookie name shared across demo auth surfaces (login, account, admin). */
export const DEMO_SESSION_COOKIE = "ac-demo-session";

/** The only email treated as an administrator in demo mode. */
export const DEMO_ADMIN_EMAIL = "admin@acmerch.store";

export interface DemoSession {
  email: string;
  role: UserRole;
  name: string;
}

const DEMO_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function parseDemoSession(raw: string | undefined): DemoSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<DemoSession>;
    if (!parsed || typeof parsed.email !== "string") return null;
    const role: UserRole = parsed.role === "admin" ? "admin" : "customer";
    return {
      email: parsed.email,
      role,
      name: typeof parsed.name === "string" && parsed.name ? parsed.name : parsed.email,
    };
  } catch {
    return null;
  }
}

/**
 * Reads the demo session cookie (`ac-demo-session`), a JSON payload of
 * `{ email, role, name }`. Safe to call from Server Components — read only.
 */
export async function getDemoSession(): Promise<DemoSession | null> {
  const cookieStore = await cookies();
  return parseDemoSession(cookieStore.get(DEMO_SESSION_COOKIE)?.value);
}

/**
 * Server-side guard for `/admin/*` routes. Redirects to `/login` whenever
 * there is no session, or the session is not an admin — the role check
 * always happens on the server, never trusting client state.
 */
export async function requireAdminSession(): Promise<DemoSession> {
  const session = await getDemoSession();

  if (!session || !isAdmin(session)) {
    redirect("/login?next=/admin");
  }

  return session;
}

/**
 * Server-side guard for `/account/*` routes. Redirects unauthenticated users
 * to login while preserving the intended destination.
 */
export async function requireCustomerSession(
  nextPath = "/account",
): Promise<DemoSession> {
  const session = await getDemoSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return session;
}

/**
 * Writes the demo session cookie. Only callable from a Server Function
 * (Server Action) or Route Handler — cookies cannot be set during render.
 */
export async function setDemoSession(session: DemoSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DEMO_SESSION_MAX_AGE_SECONDS,
  });
}

/** Clears the demo session cookie (sign out). Server Function / Route Handler only. */
export async function clearDemoSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
}

/** Builds a demo session payload for a given email, applying the admin allow-list. */
export function buildDemoSession(email: string, name?: string): DemoSession {
  const normalizedEmail = email.trim().toLowerCase();
  const role: UserRole =
    normalizedEmail === DEMO_ADMIN_EMAIL ? "admin" : "customer";
  return {
    email: normalizedEmail,
    role,
    name: name?.trim() || (role === "admin" ? "Admin" : normalizedEmail),
  };
}
