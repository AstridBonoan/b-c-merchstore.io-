# Deployment

## Vercel (primary)

1. Push this repository to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Framework preset: Next.js.
4. Add environment variables from `.env.example`.
5. Deploy.
6. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
7. In Stripe Dashboard → Webhooks, add:
   `https://YOUR_DOMAIN/api/webhooks/stripe`
   Events: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`.
8. In Supabase Auth, allow the production redirect URL.
9. Disable demo mode (`DEMO_MODE=false`) once Supabase + Stripe are live.

## GitHub Pages (static demo only)

The full app depends on server features:

- Route handlers (`/api/checkout`, webhooks)
- Server Components with protected sessions
- Stripe + Supabase server SDKs

GitHub Pages cannot host that runtime. Use Pages only for a static marketing/export snapshot if you intentionally generate one. The workflow in `.github/workflows/pages.yml` is scaffolded but disabled (`if: false`) until an `out/` artifact strategy is chosen.

## Production checklist

- [ ] Secrets only in Vercel/Supabase/Stripe dashboards
- [ ] Stripe **test** vs **live** keys clearly separated
- [ ] Webhook signature verification enabled
- [ ] RLS enabled and verified
- [ ] Admin role cannot be set from the client
- [ ] Image CDN / Supabase Storage configured
