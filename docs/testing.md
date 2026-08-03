# Testing

## Unit tests (Vitest)

```bash
npm run test
```

Covers:

- Pricing helpers
- Cart calculations
- Inventory validation
- Zod form schemas

## Component tests (Testing Library)

Product card rendering and other UI interactions under `tests/components`.

## End-to-end (Playwright)

```bash
npx playwright install chromium
npm run test:e2e
```

Smoke coverage:

- Homepage / shop / product navigation
- Empty cart
- Admin auth gate + demo admin login

Checkout does **not** require real card details. Demo mode completes without Stripe keys; with Stripe test mode, use Stripe test cards outside automated CI unless secrets are provided.

## CI

GitHub Actions runs typecheck, lint, Vitest, and `next build` on every push/PR.
