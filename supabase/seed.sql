-- A&C Merch Store — demo seed data
-- Run after 001_initial_schema.sql
-- Fixed UUIDs keep seeds idempotent across re-runs.

begin;

-- Categories
insert into public.categories (id, name, slug, description, image_url, sort_order)
values
  ('11111111-1111-1111-1111-111111111101', 'T-Shirts', 't-shirts', 'Everyday tees cut for comfort and built to last.', '/images/categories/t-shirts.jpg', 1),
  ('11111111-1111-1111-1111-111111111102', 'Hoodies', 'hoodies', 'Layer-ready hoodies with premium hand-feel.', '/images/categories/hoodies.jpg', 2),
  ('11111111-1111-1111-1111-111111111103', 'Hats', 'hats', 'Caps and beanies with clean A&C branding.', '/images/categories/hats.jpg', 3),
  ('11111111-1111-1111-1111-111111111104', 'Accessories', 'accessories', 'Small goods that finish the look.', '/images/categories/accessories.jpg', 4)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Products
insert into public.products (
  id, category_id, name, slug, description, price_cents, compare_at_cents,
  is_featured, is_bestseller, is_new, is_active, tags, created_at
) values
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'A&C Classic Tee', 'ac-classic-tee',
   'Our flagship crewneck in midweight cotton jersey. Clean chest mark, reinforced shoulder seams, and a slightly relaxed fit that holds its shape wash after wash.',
   3200, null, true, true, false, true, array['essentials','cotton'], '2026-01-15T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', 'A&C Essential Tee', 'ac-essential-tee',
   'A lighter everyday tee with a soft hand and tidy rib collar. Designed as the quiet workhorse of the wardrobe — easy layering, zero fuss.',
   2800, null, false, true, false, true, array['essentials','lightweight'], '2026-01-15T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111101', 'A&C Signature Tee', 'ac-signature-tee',
   'Heavier jersey with a tonal embroidered mark at the chest. Slightly longer sleeve and a structured drape for a sharper street silhouette.',
   3800, 4200, true, false, true, true, array['signature','embroidery'], '2026-03-01T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111102', 'A&C Core Hoodie', 'ac-core-hoodie',
   'Fleece-lined pullover with a roomy hood, kangaroo pocket, and matte drawcords. Built for cool mornings and late studio nights.',
   6800, null, true, true, false, true, array['fleece','layering'], '2026-01-15T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111102', 'A&C Premium Pullover', 'ac-premium-pullover',
   'Brushed French terry with a refined rib hem and covered zipper-free finish. Soft enough for travel, sharp enough for evenings out.',
   7800, null, true, false, false, true, array['premium','french-terry'], '2026-01-15T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111102', 'A&C Tech Hoodie', 'ac-tech-hoodie',
   'Performance midlayer with a smooth face, stretch panels under the arms, and a media-friendly pocket. Moves with you without looking athletic.',
   8800, null, false, false, true, true, array['tech','performance'], '2026-04-12T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111103', 'A&C Classic Cap', 'ac-classic-cap',
   'Structured six-panel cap with a curved brim and tonal A&C embroidery. Adjustable strap for an easy everyday fit.',
   2800, null, false, true, false, true, array['cap','embroidery'], '2026-01-15T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111103', 'A&C Snapback', 'ac-snapback',
   'Flat-brim snapback with contrast underbill and raised mark. Firm structure that keeps its shape between wears.',
   3200, null, true, false, false, true, array['snapback'], '2026-01-15T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222209', '11111111-1111-1111-1111-111111111103', 'A&C Embroidered Beanie', 'ac-embroidered-beanie',
   'Rib-knit cuff beanie with fine embroidered branding. Soft acrylic blend that keeps warmth without bulk.',
   2400, null, false, false, true, true, array['beanie','winter'], '2026-02-20T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111104', 'A&C Tote Bag', 'ac-tote-bag',
   'Heavyweight canvas tote with reinforced handles and an interior slip pocket. Wide enough for a laptop sleeve and a weekend run.',
   3600, null, true, false, false, true, array['tote','canvas'], '2026-01-15T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111104', 'A&C Logo Socks', 'ac-logo-socks',
   'Crew socks with cushioned sole and subtle ankle logo. Sold as a three-pair pack for the week that never ends.',
   1800, null, false, true, false, true, array['socks','pack'], '2026-01-15T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222212', '11111111-1111-1111-1111-111111111104', 'A&C Mug', 'ac-mug',
   'Matte ceramic mug with a deep teal interior and embossed exterior mark. Holds 12 oz — perfect for the first pour of the day.',
   2200, null, false, false, false, true, array['mug','home'], '2026-01-15T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222213', '11111111-1111-1111-1111-111111111104', 'A&C Coach Jacket', 'ac-coach-jacket',
   'Lightweight water-resistant shell with snap front, elastic cuffs, and a hidden zip pocket. Packs small, looks intentional.',
   9800, 11000, true, false, true, true, array['outerwear','jacket'], '2026-05-01T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222214', '11111111-1111-1111-1111-111111111101', 'A&C Weekend Short', 'ac-weekend-short',
   'Mid-length cotton twill short with an elastic waist and side pockets. Easy throw-on for warm days and travel days alike.',
   4200, null, false, false, true, true, array['shorts','summer'], '2026-05-18T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222215', '11111111-1111-1111-1111-111111111103', 'A&C Camp Hat', 'ac-camp-hat',
   'Unstructured five-panel camp hat with a soft brim and metal clasp. Low profile for days when a full snapback feels like too much.',
   3000, null, false, false, false, true, array['camp-hat'], '2026-01-15T12:00:00Z'),
  ('22222222-2222-2222-2222-222222222216', '11111111-1111-1111-1111-111111111104', 'A&C Key Lanyard', 'ac-key-lanyard',
   'Woven lanyard with a metal clasp and detachable key ring. Compact brand detail for studio keys, badges, and bags.',
   1400, null, false, false, false, true, array['lanyard','small-goods'], '2026-01-15T12:00:00Z')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  compare_at_cents = excluded.compare_at_cents,
  is_featured = excluded.is_featured,
  is_bestseller = excluded.is_bestseller,
  is_new = excluded.is_new,
  is_active = excluded.is_active,
  tags = excluded.tags,
  updated_at = now();

-- Primary images
insert into public.product_images (id, product_id, url, alt, sort_order, is_primary)
values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '/images/products/classic-tee-front.jpg', 'A&C Classic Tee front view in black', 0, true),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202', '/images/products/essential-tee-front.jpg', 'A&C Essential Tee in bone', 0, true),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222203', '/images/products/signature-tee-front.jpg', 'A&C Signature Tee with embroidered mark', 0, true),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222204', '/images/products/core-hoodie-front.jpg', 'A&C Core Hoodie in black', 0, true),
  ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222205', '/images/products/premium-pullover-front.jpg', 'A&C Premium Pullover in bone', 0, true),
  ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222206', '/images/products/tech-hoodie-front.jpg', 'A&C Tech Hoodie in charcoal', 0, true),
  ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222207', '/images/products/classic-cap.jpg', 'A&C Classic Cap in black', 0, true),
  ('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222208', '/images/products/snapback.jpg', 'A&C Snapback in black and teal', 0, true),
  ('33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222209', '/images/products/beanie.jpg', 'A&C Embroidered Beanie in charcoal', 0, true),
  ('33333333-3333-3333-3333-333333333310', '22222222-2222-2222-2222-222222222210', '/images/products/tote-bag.jpg', 'A&C Tote Bag in bone canvas', 0, true),
  ('33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222211', '/images/products/logo-socks.jpg', 'A&C Logo Socks three-pack', 0, true),
  ('33333333-3333-3333-3333-333333333312', '22222222-2222-2222-2222-222222222212', '/images/products/mug.jpg', 'A&C Mug with teal interior', 0, true),
  ('33333333-3333-3333-3333-333333333313', '22222222-2222-2222-2222-222222222213', '/images/products/coach-jacket.jpg', 'A&C Coach Jacket in black', 0, true),
  ('33333333-3333-3333-3333-333333333314', '22222222-2222-2222-2222-222222222214', '/images/products/weekend-short.jpg', 'A&C Weekend Short in stone', 0, true),
  ('33333333-3333-3333-3333-333333333315', '22222222-2222-2222-2222-222222222215', '/images/products/camp-hat.jpg', 'A&C Camp Hat in bone', 0, true),
  ('33333333-3333-3333-3333-333333333316', '22222222-2222-2222-2222-222222222216', '/images/products/key-lanyard.jpg', 'A&C Key Lanyard in teal', 0, true)
on conflict (id) do update set
  url = excluded.url,
  alt = excluded.alt,
  sort_order = excluded.sort_order,
  is_primary = excluded.is_primary;

-- Representative variants (full matrix lives in TypeScript seed for demo mode)
insert into public.product_variants (
  id, product_id, sku, size, color, color_hex, inventory_quantity, is_active
) values
  ('44444444-4444-4444-4444-444444444001', '22222222-2222-2222-2222-222222222201', 'AC-CT-BLA-M', 'M', 'Black', '#0c0c0c', 40, true),
  ('44444444-4444-4444-4444-444444444002', '22222222-2222-2222-2222-222222222201', 'AC-CT-BNE-L', 'L', 'Bone', '#f4f4f2', 40, true),
  ('44444444-4444-4444-4444-444444444003', '22222222-2222-2222-2222-222222222201', 'AC-CT-TEL-XL', 'XL', 'Teal', '#0d5c63', 40, true),
  ('44444444-4444-4444-4444-444444444004', '22222222-2222-2222-2222-222222222202', 'AC-ET-BNE-M', 'M', 'Bone', '#f4f4f2', 55, true),
  ('44444444-4444-4444-4444-444444444005', '22222222-2222-2222-2222-222222222202', 'AC-ET-STO-L', 'L', 'Stone', '#8a857c', 55, true),
  ('44444444-4444-4444-4444-444444444006', '22222222-2222-2222-2222-222222222203', 'AC-ST-BLA-M', 'M', 'Black', '#0c0c0c', 28, true),
  ('44444444-4444-4444-4444-444444444007', '22222222-2222-2222-2222-222222222203', 'AC-ST-NAV-L', 'L', 'Navy', '#1a2332', 28, true),
  ('44444444-4444-4444-4444-444444444008', '22222222-2222-2222-2222-222222222204', 'AC-CH-BLA-L', 'L', 'Black', '#0c0c0c', 35, true),
  ('44444444-4444-4444-4444-444444444009', '22222222-2222-2222-2222-222222222204', 'AC-CH-HEA-M', 'M', 'Heather Gray', '#9b9b9b', 35, true),
  ('44444444-4444-4444-4444-444444444010', '22222222-2222-2222-2222-222222222205', 'AC-PP-BNE-M', 'M', 'Bone', '#f4f4f2', 22, true),
  ('44444444-4444-4444-4444-444444444011', '22222222-2222-2222-2222-222222222206', 'AC-TH-CHA-L', 'L', 'Charcoal', '#2f2f2f', 18, true),
  ('44444444-4444-4444-4444-444444444012', '22222222-2222-2222-2222-222222222207', 'AC-CC-BLK-OS', 'ONE_SIZE', 'Black', '#0c0c0c', 60, true),
  ('44444444-4444-4444-4444-444444444013', '22222222-2222-2222-2222-222222222207', 'AC-CC-TEL-OS', 'ONE_SIZE', 'Teal', '#0d5c63', 30, true),
  ('44444444-4444-4444-4444-444444444014', '22222222-2222-2222-2222-222222222208', 'AC-SB-BLK-OS', 'ONE_SIZE', 'Black', '#0c0c0c', 40, true),
  ('44444444-4444-4444-4444-444444444015', '22222222-2222-2222-2222-222222222209', 'AC-EB-CHR-OS', 'ONE_SIZE', 'Charcoal', '#2f2f2f', 50, true),
  ('44444444-4444-4444-4444-444444444016', '22222222-2222-2222-2222-222222222210', 'AC-TB-BNE-OS', 'ONE_SIZE', 'Bone', '#f4f4f2', 70, true),
  ('44444444-4444-4444-4444-444444444017', '22222222-2222-2222-2222-222222222211', 'AC-LS-MIX-M', 'M', 'Mixed', '#8a857c', 80, true),
  ('44444444-4444-4444-4444-444444444018', '22222222-2222-2222-2222-222222222212', 'AC-MG-BNE-OS', 'ONE_SIZE', 'Bone', '#f4f4f2', 90, true),
  ('44444444-4444-4444-4444-444444444019', '22222222-2222-2222-2222-222222222213', 'AC-CJ-BLA-M', 'M', 'Black', '#0c0c0c', 16, true),
  ('44444444-4444-4444-4444-444444444020', '22222222-2222-2222-2222-222222222214', 'AC-WS-STO-M', 'M', 'Stone', '#8a857c', 30, true),
  ('44444444-4444-4444-4444-444444444021', '22222222-2222-2222-2222-222222222215', 'AC-CP-BNE-OS', 'ONE_SIZE', 'Bone', '#f4f4f2', 38, true),
  ('44444444-4444-4444-4444-444444444022', '22222222-2222-2222-2222-222222222216', 'AC-KL-TEL-OS', 'ONE_SIZE', 'Teal', '#0d5c63', 120, true)
on conflict (sku) do update set
  inventory_quantity = excluded.inventory_quantity,
  color = excluded.color,
  color_hex = excluded.color_hex,
  size = excluded.size,
  is_active = excluded.is_active,
  updated_at = now();

commit;
