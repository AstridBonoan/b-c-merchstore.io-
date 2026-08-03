export const CHECKOUT_SUCCESS_STORAGE_KEY = "bc-merch-checkout-success";

export type CheckoutSuccessPayload = {
  sessionId: string;
  orderId: string;
  email: string;
  totalCents: number;
  isDemo: boolean;
  savedAt: string;
};

export function saveCheckoutSuccess(payload: Omit<CheckoutSuccessPayload, "savedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const record: CheckoutSuccessPayload = {
      ...payload,
      savedAt: new Date().toISOString(),
    };
    window.sessionStorage.setItem(
      CHECKOUT_SUCCESS_STORAGE_KEY,
      JSON.stringify(record),
    );
  } catch {
    // Ignore quota / private mode failures — confirmation page has a fallback UI.
  }
}

export function readCheckoutSuccess(): CheckoutSuccessPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_SUCCESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CheckoutSuccessPayload>;
    if (
      typeof parsed.sessionId !== "string" ||
      typeof parsed.orderId !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.totalCents !== "number"
    ) {
      return null;
    }
    return {
      sessionId: parsed.sessionId,
      orderId: parsed.orderId,
      email: parsed.email,
      totalCents: parsed.totalCents,
      isDemo: Boolean(parsed.isDemo),
      savedAt:
        typeof parsed.savedAt === "string"
          ? parsed.savedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
