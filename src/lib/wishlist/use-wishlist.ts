"use client";

import * as React from "react";

const STORAGE_KEY = "ac-merch-wishlist";

let cache: string[] | null = null;
const listeners = new Set<() => void>();

function readWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeWishlist(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage may be unavailable (private browsing, quota exceeded); fail silently.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string[] {
  if (cache === null) cache = readWishlist();
  return cache;
}

function getServerSnapshot(): string[] {
  return [];
}

function setWishlist(ids: string[]) {
  cache = ids;
  writeWishlist(ids);
  listeners.forEach((listener) => listener());
}

/** Lightweight guest wishlist toggle backed by localStorage, keyed by product id. */
export function useWishlist(productId: string) {
  const ids = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isWishlisted = ids.includes(productId);

  const toggle = React.useCallback(() => {
    const current = getSnapshot();
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    setWishlist(next);
  }, [productId]);

  return { isWishlisted, toggle };
}
