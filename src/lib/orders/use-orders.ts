"use client";

import * as React from "react";
import type { Order } from "@/types";
import {
  getDemoOrderById,
  getDemoOrders,
  getDemoOrdersByEmail,
} from "@/lib/orders/demo-orders";
import {
  getPlacedOrderById,
  getPlacedOrders,
  getPlacedOrdersByEmail,
  subscribePlacedOrders,
} from "@/lib/orders/local-orders";

function mergeOrders(seed: Order[], placed: Order[]): Order[] {
  const byId = new Map<string, Order>();
  for (const order of seed) byId.set(order.id, order);
  for (const order of placed) byId.set(order.id, order);
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

/** Seed demo orders plus any checkout orders saved in this browser. */
export function useAllOrders(): Order[] {
  return React.useSyncExternalStore(
    subscribePlacedOrders,
    () => mergeOrders(getDemoOrders(), getPlacedOrders()),
    () => getDemoOrders(),
  );
}

export function useOrdersByEmail(email: string): Order[] {
  const normalized = email.trim().toLowerCase();
  return React.useSyncExternalStore(
    subscribePlacedOrders,
    () =>
      mergeOrders(
        getDemoOrdersByEmail(normalized),
        getPlacedOrdersByEmail(normalized),
      ),
    () => getDemoOrdersByEmail(normalized),
  );
}

export function useOrderById(orderId: string): Order | undefined {
  return React.useSyncExternalStore(
    subscribePlacedOrders,
    () => getPlacedOrderById(orderId) ?? getDemoOrderById(orderId),
    () => getDemoOrderById(orderId),
  );
}
