"use client";

import * as React from "react";
import type { UserRole } from "@/types";

export const DEMO_ADMIN_EMAIL = "admin@bcmerch.store";
export const DEMO_SESSION_STORAGE_KEY = "bc-demo-session";

export interface DemoSession {
  email: string;
  role: UserRole;
  name: string;
}

let cache: DemoSession | null | undefined;
const listeners = new Set<() => void>();

function parseSession(raw: string | null): DemoSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<DemoSession>;
    if (!parsed || typeof parsed.email !== "string") return null;
    return {
      email: parsed.email,
      role: parsed.role === "admin" ? "admin" : "customer",
      name:
        typeof parsed.name === "string" && parsed.name
          ? parsed.name
          : parsed.email,
    };
  } catch {
    return null;
  }
}

function readSession(): DemoSession | null {
  try {
    return parseSession(window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY));
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

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

export function setClientSession(session: DemoSession): void {
  try {
    window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
  cache = session;
  emit();
}

export function clearClientSession(): void {
  try {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
  cache = null;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): DemoSession | null {
  if (cache === undefined) cache = readSession();
  return cache;
}

function getServerSnapshot(): DemoSession | null {
  return null;
}

/** Client-side demo session (GitHub Pages / static export compatible). */
export function useDemoSession() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getClientSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  return readSession();
}
