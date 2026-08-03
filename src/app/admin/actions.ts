"use server";

import { redirect } from "next/navigation";
import { clearDemoSession } from "@/lib/auth/session";

/** Signs the demo admin out and returns them to the login screen. */
export async function signOutAction(): Promise<void> {
  await clearDemoSession();
  redirect("/login");
}
