/** Demo card helpers for the static GitHub Pages checkout path. */

const DECLINE_NUMBERS = new Set([
  "4000000000000002", // generic decline
  "4000000000009995", // insufficient funds
]);

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCardNumber(value: string): string {
  return digitsOnly(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

export function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Luhn check for demo card validation. */
export function isValidCardNumber(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function isExpired(expiry: string): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry.trim());
  if (!match) return true;
  const month = Number(match[1]);
  const year = Number(match[2]) + 2000;
  if (month < 1 || month > 12) return true;
  const now = new Date();
  const exp = new Date(year, month, 0, 23, 59, 59);
  return exp < now;
}

export type DemoChargeResult =
  | { ok: true; paymentIntentId: string }
  | { ok: false; error: string };

/**
 * Simulate a Stripe test-mode charge in the browser.
 * Accepts Stripe-style test cards (e.g. 4242…) and declines known fail numbers.
 */
export async function processDemoPayment(input: {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}): Promise<DemoChargeResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!input.cardName.trim()) {
    return { ok: false, error: "Enter the name on the card." };
  }
  if (!isValidCardNumber(input.cardNumber)) {
    return { ok: false, error: "Enter a valid card number." };
  }
  if (isExpired(input.expiry)) {
    return { ok: false, error: "Card is expired." };
  }
  if (!/^\d{3,4}$/.test(digitsOnly(input.cvc))) {
    return { ok: false, error: "Enter a valid CVC." };
  }

  const number = digitsOnly(input.cardNumber);
  if (DECLINE_NUMBERS.has(number)) {
    return {
      ok: false,
      error: "Your card was declined. Try 4242 4242 4242 4242 for a successful demo payment.",
    };
  }

  return {
    ok: true,
    paymentIntentId: `pi_demo_${number.slice(-4)}_${Date.now().toString(36)}`,
  };
}
