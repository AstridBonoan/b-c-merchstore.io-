# Database

PostgreSQL via Supabase.

## Apply schema

1. Open the Supabase SQL editor (or use the CLI).
2. Run `supabase/migrations/001_initial_schema.sql`.
3. Run `supabase/seed.sql`.

## Core tables

- `profiles` — extends auth users (role, name, phone)
- `categories`
- `products`
- `product_images`
- `product_variants` — size/color/SKU/inventory/price override
- `cart_items`
- `orders` / `order_items`
- `addresses`
- `wishlists` / `wishlist_items`

## Design notes

- Prices stored as integer **cents**
- Variants hold inventory (not the parent product)
- Orders snapshot product name/SKU/price at purchase time
- Indexes on slugs, FKs, and common filter columns
- RLS policies restrict customers to their own rows; admins elevated via role claim/profile

## Seed catalog

~16 products across T-Shirts, Hoodies, Hats, Accessories — mirrored in `src/lib/products/seed-data.ts` for demo mode.
