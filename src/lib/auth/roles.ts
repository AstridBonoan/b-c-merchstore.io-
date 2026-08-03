import type { Profile, UserRole } from "@/types";

export function isAdmin(
  profile: Pick<Profile, "role"> | { role?: UserRole | null } | null | undefined,
): boolean {
  return profile?.role === "admin";
}

export function requireAdmin(
  profile: Pick<Profile, "role"> | null | undefined,
): asserts profile is Profile & { role: "admin" } {
  if (!isAdmin(profile)) {
    throw new Error("Admin access required.");
  }
}
