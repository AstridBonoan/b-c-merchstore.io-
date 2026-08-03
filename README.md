# A&C Merch Store

Premium streetwear e-commerce demo built for **B&C Software & Web** portfolio showcases.

**Wear the brand. Build the culture.**

> Production host: **Vercel** (full dynamic app).  
> GitHub Pages: optional static/demo fallback only — not a replacement for Supabase Auth, Stripe, or API routes.

## Features

- Storefront: home, shop, product detail, about, contact
- Search, category/price/size/color filters, sorting via URL params
- Persistent guest cart + wishlist
- Demo auth + protected customer account (orders, wishlist)
- Stripe Checkout + webhook endpoint (test mode)
- Admin dashboard: revenue, products, orders, customers, inventory signals
- Supabase schema + RLS-ready SQL migrations and seed data
- Vitest unit/component tests, Playwright smoke tests
- GitHub Actions CI (lint, typecheck, test, build)

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style UI |
| Backend | Server Components, Route Handlers, Server Actions |
| Database / Auth / Storage | Supabase (PostgreSQL, Auth, Storage) |
| Payments | Stripe Checkout + webhooks |
| Forms | React Hook Form + Zod |
| Testing | Vitest, Testing Library, Playwright |
| CI/CD | GitHub Actions |
| Hosting | Vercel (primary), GitHub Pages (static demo only) |

## Architecture

```
app/                 Next.js routes (storefront, account, admin, api)
components/          UI by domain (layout, products, cart, checkout, admin)
lib/                 Business logic (products, cart, stripe, supabase, auth)
supabase/            SQL migrations + seed
tests/               unit, component, e2e
docs/                deeper documentation
.github/workflows/   CI + Pages scaffolding
```

See [docs/architecture.md](docs/architecture.md).

## Local development

```bash
git clone https://github.com/AstridBonoan/b-c-merchstore.io-.git
cd b-c-merchstore.io-
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo mode is enabled by default when Supabase keys are placeholders.

### Demo accounts

| Role | How |
| --- | --- |
| Admin | Login → **Admin demo** (`admin@acmerch.store`) |
| Customer | Login → **Customer demo** (`jordan.blake@example.com`) |

## Environment variables

Copy `.env.example` → `.env.local`. Never commit secrets.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_DEMO_MODE` / `DEMO_MODE` | Force demo/seed data mode |

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql`.
3. Run `supabase/seed.sql`.
4. Configure Auth redirect URLs to your site URL.
5. Create a Storage bucket for product images.
6. Set env vars and disable demo mode.

Details: [docs/database.md](docs/database.md).

## Stripe setup

1. Create a Stripe account and use **test mode**.
2. Add test publishable + secret keys to `.env.local`.
3. Forward webhooks locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
4. Set `STRIPE_WEBHOOK_SECRET`.
5. On Vercel, add the live webhook endpoint for `/api/webhooks/stripe`.

Without Stripe keys, checkout completes via a **safe demo success path** (no card charge).

## Scripts

```bash
npm run dev          # local server
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run test         # Vitest unit + component
npm run test:e2e     # Playwright
npm run build        # production build
```

## Git workflow

```
main
 └── develop
      ├── feature/homepage
      ├── feature/product-catalog
      ├── feature/cart
      ├── feature/checkout
      ├── feature/admin-dashboard
      └── feature/testing
```

Feature branches open PRs into `develop`. When stable, PR `develop` → `main`.  
Full details: [docs/git-workflow.md](docs/git-workflow.md).

## GitHub Actions

On push/PR: install → typecheck → lint → test → build. Failures block merge.

## GitHub Pages vs Vercel

| Capability | Vercel | GitHub Pages |
| --- | --- | --- |
| Full Next.js server features | Yes | No |
| Supabase Auth / Stripe webhooks | Yes | No |
| Static marketing/demo snapshot | Optional | Possible with caveats |

Deploy the real store to Vercel. Treat Pages as a static brochure/demo only.  
See [docs/deployment.md](docs/deployment.md).

## Testing

See [docs/testing.md](docs/testing.md).

## Production considerations

- Never expose Stripe secret / Supabase service role to the browser
- Revalidate prices + inventory server-side before Checkout
- Enable RLS on all customer data tables
- Configure Stripe webhook idempotency in the database for production
- Keep demo mode off in production once Supabase + Stripe are live

## License

Portfolio / demo project for B&C Software & Web.
