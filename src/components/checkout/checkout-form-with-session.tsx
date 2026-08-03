"use client";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { useDemoSession } from "@/lib/auth/client-session";

/** Prefills checkout contact fields from the demo session when signed in. */
export function CheckoutFormWithSession() {
  const session = useDemoSession();
  return (
    <CheckoutForm
      defaultEmail={session?.email ?? ""}
      defaultName={session?.name ?? ""}
    />
  );
}
