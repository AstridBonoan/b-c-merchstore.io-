/** Re-export demo session helpers for shared typing. Cookie-based server auth is unused on GitHub Pages. */

export {
  DEMO_ADMIN_EMAIL,
  DEMO_SESSION_STORAGE_KEY as DEMO_SESSION_COOKIE,
  buildDemoSession,
  type DemoSession,
} from "@/lib/auth/client-session";

/** @deprecated Prefer client-session helpers for the static GitHub Pages demo. */
export async function getDemoSession() {
  return null;
}

/** @deprecated Prefer RequireAuth client gate for the static GitHub Pages demo. */
export async function requireAdminSession(): Promise<never> {
  throw new Error("Server session guards are unavailable in the static GitHub Pages demo.");
}

/** @deprecated Prefer RequireAuth client gate for the static GitHub Pages demo. */
export async function requireCustomerSession(): Promise<never> {
  throw new Error("Server session guards are unavailable in the static GitHub Pages demo.");
}

/** @deprecated Prefer setClientSession for the static GitHub Pages demo. */
export async function setDemoSession(): Promise<void> {
  return;
}

/** @deprecated Prefer clearClientSession for the static GitHub Pages demo. */
export async function clearDemoSession(): Promise<void> {
  return;
}
