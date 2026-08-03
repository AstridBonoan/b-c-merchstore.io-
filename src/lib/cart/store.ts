"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { CartLine } from "@/types";
import {
  findCartLine,
  removeCartLine,
  summarizeCart,
  updateCartLineQuantity,
  upsertCartLine,
} from "@/lib/cart/calculations";

/**
 * Guest-friendly cart store persisted to localStorage.
 *
 * Reuses the `CartLine` shape from `@/types` and the pure helpers in
 * `@/lib/cart/calculations` so line-merging, quantity caps, and totals stay
 * consistent with the rest of the app (checkout revalidates prices server-side).
 */
export interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  addItem: (line: CartLine) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      addItem: (line) =>
        set((state) => ({
          lines: upsertCartLine(state.lines, line),
          isOpen: true,
        })),
      removeItem: (productId, variantId) =>
        set((state) => ({
          lines: removeCartLine(state.lines, productId, variantId),
        })),
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          lines: updateCartLineQuantity(state.lines, productId, variantId, quantity),
        })),
      clearCart: () => set({ lines: [] }),
      setOpen: (open) => set({ isOpen: open }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "ac-merch-cart",
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export function useCartLine(productId: string, variantId: string) {
  return useCartStore((state) => findCartLine(state.lines, productId, variantId));
}

export function useCartSummary() {
  // `summarizeCart` builds a fresh object every call, so the selector needs a
  // shallow-equality check — otherwise useSyncExternalStore sees a "new"
  // snapshot on every render and loops forever.
  return useCartStore(useShallow((state) => summarizeCart(state.lines)));
}
