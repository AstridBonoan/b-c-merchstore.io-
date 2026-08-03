import type { Order } from "@/types";

const STORAGE_KEY = "bc-merch-orders";
const CHANGE_EVENT = "bc-merch-orders-change";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readRaw(): Order[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(orders: Order[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Persist a newly placed demo checkout order in the browser. */
export function savePlacedOrder(order: Order): void {
  const existing = readRaw().filter((item) => item.id !== order.id);
  writeRaw([order, ...existing]);
}

export function getPlacedOrders(): Order[] {
  return readRaw().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function getPlacedOrderById(id: string): Order | undefined {
  return readRaw().find((order) => order.id === id);
}

export function getPlacedOrdersByEmail(email: string): Order[] {
  const normalized = email.trim().toLowerCase();
  return getPlacedOrders().filter(
    (order) => order.email.toLowerCase() === normalized,
  );
}

export function subscribePlacedOrders(onStoreChange: () => void): () => void {
  if (!canUseStorage()) return () => undefined;
  const handler = () => onStoreChange();
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
