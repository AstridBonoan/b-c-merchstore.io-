import type {
  Category,
  Product,
  ProductImage,
  ProductSize,
  ProductVariant,
} from "@/types";

const now = "2026-01-15T12:00:00.000Z";

export const categories: Category[] = [
  {
    id: "cat-tshirts",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Everyday tees cut for comfort and built to last.",
    image_url: "/images/categories/t-shirts.jpg",
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "cat-hoodies",
    name: "Hoodies",
    slug: "hoodies",
    description: "Layer-ready hoodies with premium hand-feel.",
    image_url: "/images/categories/hoodies.jpg",
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: "cat-hats",
    name: "Hats",
    slug: "hats",
    description: "Caps and beanies with clean A&C branding.",
    image_url: "/images/categories/hats.jpg",
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Small goods that finish the look.",
    image_url: "/images/categories/accessories.jpg",
    sort_order: 4,
    created_at: now,
    updated_at: now,
  },
];

type VariantSeed = {
  size: ProductSize;
  color: string;
  colorHex: string;
  sku: string;
  inventory: number;
  priceCents?: number | null;
};

type ProductSeed = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  compareAtCents?: number | null;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  isActive?: boolean;
  tags?: string[];
  images: Array<{ url: string; alt: string; primary?: boolean }>;
  variants: VariantSeed[];
  createdAt?: string;
};

function buildProduct(seed: ProductSeed): Product {
  const created = seed.createdAt ?? now;
  const images: ProductImage[] = seed.images.map((img, index) => ({
    id: `${seed.id}-img-${index + 1}`,
    product_id: seed.id,
    url: img.url,
    alt: img.alt,
    sort_order: index,
    is_primary: img.primary ?? index === 0,
    created_at: created,
  }));

  const variants: ProductVariant[] = seed.variants.map((v, index) => ({
    id: `${seed.id}-var-${index + 1}`,
    product_id: seed.id,
    sku: v.sku,
    size: v.size,
    color: v.color,
    color_hex: v.colorHex,
    price_cents: v.priceCents ?? null,
    compare_at_cents: null,
    inventory_quantity: v.inventory,
    is_active: true,
    created_at: created,
    updated_at: created,
  }));

  const category = categories.find((c) => c.id === seed.categoryId) ?? null;

  return {
    id: seed.id,
    category_id: seed.categoryId,
    name: seed.name,
    slug: seed.slug,
    description: seed.description,
    price_cents: seed.priceCents,
    compare_at_cents: seed.compareAtCents ?? null,
    is_featured: seed.isFeatured ?? false,
    is_bestseller: seed.isBestseller ?? false,
    is_new: seed.isNew ?? false,
    is_active: seed.isActive ?? true,
    tags: seed.tags ?? [],
    created_at: created,
    updated_at: created,
    category,
    images,
    variants,
  };
}

const apparelSizes: ProductSize[] = ["S", "M", "L", "XL", "XXL"];

function apparelVariants(
  skuPrefix: string,
  colors: Array<{ name: string; hex: string }>,
  inventory = 40,
): VariantSeed[] {
  const variants: VariantSeed[] = [];
  for (const color of colors) {
    for (const size of apparelSizes) {
      const colorCode = color.name.replace(/\s+/g, "").toUpperCase().slice(0, 3);
      variants.push({
        size,
        color: color.name,
        colorHex: color.hex,
        sku: `${skuPrefix}-${colorCode}-${size}`,
        inventory: size === "XXL" ? Math.max(8, Math.floor(inventory / 2)) : inventory,
      });
    }
  }
  return variants;
}

const productSeeds: ProductSeed[] = [
  {
    id: "prod-classic-tee",
    categoryId: "cat-tshirts",
    name: "A&C Classic Tee",
    slug: "ac-classic-tee",
    description:
      "Our flagship crewneck in midweight cotton jersey. Clean chest mark, reinforced shoulder seams, and a slightly relaxed fit that holds its shape wash after wash.",
    priceCents: 3200,
    isFeatured: true,
    isBestseller: true,
    tags: ["essentials", "cotton"],
    images: [
      {
        url: "/images/products/classic-tee-front.jpg",
        alt: "A&C Classic Tee front view in black",
        primary: true,
      },
      {
        url: "/images/products/classic-tee-back.jpg",
        alt: "A&C Classic Tee back view",
      },
    ],
    variants: apparelVariants("AC-CT", [
      { name: "Black", hex: "#0c0c0c" },
      { name: "Bone", hex: "#f4f4f2" },
      { name: "Teal", hex: "#0d5c63" },
    ]),
  },
  {
    id: "prod-essential-tee",
    categoryId: "cat-tshirts",
    name: "A&C Essential Tee",
    slug: "ac-essential-tee",
    description:
      "A lighter everyday tee with a soft hand and tidy rib collar. Designed as the quiet workhorse of the wardrobe — easy layering, zero fuss.",
    priceCents: 2800,
    isBestseller: true,
    tags: ["essentials", "lightweight"],
    images: [
      {
        url: "/images/products/essential-tee-front.jpg",
        alt: "A&C Essential Tee in bone",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "AC-ET",
      [
        { name: "Bone", hex: "#f4f4f2" },
        { name: "Stone", hex: "#8a857c" },
        { name: "Black", hex: "#0c0c0c" },
      ],
      55,
    ),
  },
  {
    id: "prod-signature-tee",
    categoryId: "cat-tshirts",
    name: "A&C Signature Tee",
    slug: "ac-signature-tee",
    description:
      "Heavier jersey with a tonal embroidered mark at the chest. Slightly longer sleeve and a structured drape for a sharper street silhouette.",
    priceCents: 3800,
    compareAtCents: 4200,
    isFeatured: true,
    isNew: true,
    tags: ["signature", "embroidery"],
    createdAt: "2026-03-01T12:00:00.000Z",
    images: [
      {
        url: "/images/products/signature-tee-front.jpg",
        alt: "A&C Signature Tee with embroidered mark",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "AC-ST",
      [
        { name: "Black", hex: "#0c0c0c" },
        { name: "Navy", hex: "#1a2332" },
      ],
      28,
    ),
  },
  {
    id: "prod-core-hoodie",
    categoryId: "cat-hoodies",
    name: "A&C Core Hoodie",
    slug: "ac-core-hoodie",
    description:
      "Fleece-lined pullover with a roomy hood, kangaroo pocket, and matte drawcords. Built for cool mornings and late studio nights.",
    priceCents: 6800,
    isFeatured: true,
    isBestseller: true,
    tags: ["fleece", "layering"],
    images: [
      {
        url: "/images/products/core-hoodie-front.jpg",
        alt: "A&C Core Hoodie in black",
        primary: true,
      },
      {
        url: "/images/products/core-hoodie-detail.jpg",
        alt: "A&C Core Hoodie pocket detail",
      },
    ],
    variants: apparelVariants(
      "AC-CH",
      [
        { name: "Black", hex: "#0c0c0c" },
        { name: "Heather Gray", hex: "#9b9b9b" },
        { name: "Teal", hex: "#0d5c63" },
      ],
      35,
    ),
  },
  {
    id: "prod-premium-pullover",
    categoryId: "cat-hoodies",
    name: "A&C Premium Pullover",
    slug: "ac-premium-pullover",
    description:
      "Brushed French terry with a refined rib hem and covered zipper-free finish. Soft enough for travel, sharp enough for evenings out.",
    priceCents: 7800,
    isFeatured: true,
    tags: ["premium", "french-terry"],
    images: [
      {
        url: "/images/products/premium-pullover-front.jpg",
        alt: "A&C Premium Pullover in bone",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "AC-PP",
      [
        { name: "Bone", hex: "#f4f4f2" },
        { name: "Black", hex: "#0c0c0c" },
      ],
      22,
    ),
  },
  {
    id: "prod-tech-hoodie",
    categoryId: "cat-hoodies",
    name: "A&C Tech Hoodie",
    slug: "ac-tech-hoodie",
    description:
      "Performance midlayer with a smooth face, stretch panels under the arms, and a media-friendly pocket. Moves with you without looking athletic.",
    priceCents: 8800,
    isNew: true,
    tags: ["tech", "performance"],
    createdAt: "2026-04-12T12:00:00.000Z",
    images: [
      {
        url: "/images/products/tech-hoodie-front.jpg",
        alt: "A&C Tech Hoodie in charcoal",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "AC-TH",
      [
        { name: "Charcoal", hex: "#2f2f2f" },
        { name: "Teal", hex: "#0d5c63" },
      ],
      18,
    ),
  },
  {
    id: "prod-classic-cap",
    categoryId: "cat-hats",
    name: "A&C Classic Cap",
    slug: "ac-classic-cap",
    description:
      "Structured six-panel cap with a curved brim and tonal A&C embroidery. Adjustable strap for an easy everyday fit.",
    priceCents: 2800,
    isBestseller: true,
    tags: ["cap", "embroidery"],
    images: [
      {
        url: "/images/products/classic-cap.jpg",
        alt: "A&C Classic Cap in black",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0c0c0c",
        sku: "AC-CC-BLK-OS",
        inventory: 60,
      },
      {
        size: "ONE_SIZE",
        color: "Bone",
        colorHex: "#f4f4f2",
        sku: "AC-CC-BNE-OS",
        inventory: 45,
      },
      {
        size: "ONE_SIZE",
        color: "Teal",
        colorHex: "#0d5c63",
        sku: "AC-CC-TEL-OS",
        inventory: 30,
      },
    ],
  },
  {
    id: "prod-snapback",
    categoryId: "cat-hats",
    name: "A&C Snapback",
    slug: "ac-snapback",
    description:
      "Flat-brim snapback with contrast underbill and raised mark. Firm structure that keeps its shape between wears.",
    priceCents: 3200,
    isFeatured: true,
    tags: ["snapback"],
    images: [
      {
        url: "/images/products/snapback.jpg",
        alt: "A&C Snapback in black and teal",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0c0c0c",
        sku: "AC-SB-BLK-OS",
        inventory: 40,
      },
      {
        size: "ONE_SIZE",
        color: "Teal",
        colorHex: "#0d5c63",
        sku: "AC-SB-TEL-OS",
        inventory: 25,
      },
    ],
  },
  {
    id: "prod-beanie",
    categoryId: "cat-hats",
    name: "A&C Embroidered Beanie",
    slug: "ac-embroidered-beanie",
    description:
      "Rib-knit cuff beanie with fine embroidered branding. Soft acrylic blend that keeps warmth without bulk.",
    priceCents: 2400,
    isNew: true,
    tags: ["beanie", "winter"],
    createdAt: "2026-02-20T12:00:00.000Z",
    images: [
      {
        url: "/images/products/beanie.jpg",
        alt: "A&C Embroidered Beanie in charcoal",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Charcoal",
        colorHex: "#2f2f2f",
        sku: "AC-EB-CHR-OS",
        inventory: 50,
      },
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0c0c0c",
        sku: "AC-EB-BLK-OS",
        inventory: 50,
      },
      {
        size: "ONE_SIZE",
        color: "Bone",
        colorHex: "#f4f4f2",
        sku: "AC-EB-BNE-OS",
        inventory: 35,
      },
    ],
  },
  {
    id: "prod-tote",
    categoryId: "cat-accessories",
    name: "A&C Tote Bag",
    slug: "ac-tote-bag",
    description:
      "Heavyweight canvas tote with reinforced handles and an interior slip pocket. Wide enough for a laptop sleeve and a weekend run.",
    priceCents: 3600,
    isFeatured: true,
    tags: ["tote", "canvas"],
    images: [
      {
        url: "/images/products/tote-bag.jpg",
        alt: "A&C Tote Bag in bone canvas",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Bone",
        colorHex: "#f4f4f2",
        sku: "AC-TB-BNE-OS",
        inventory: 70,
      },
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0c0c0c",
        sku: "AC-TB-BLK-OS",
        inventory: 55,
      },
    ],
  },
  {
    id: "prod-socks",
    categoryId: "cat-accessories",
    name: "A&C Logo Socks",
    slug: "ac-logo-socks",
    description:
      "Crew socks with cushioned sole and subtle ankle logo. Sold as a three-pair pack for the week that never ends.",
    priceCents: 1800,
    isBestseller: true,
    tags: ["socks", "pack"],
    images: [
      {
        url: "/images/products/logo-socks.jpg",
        alt: "A&C Logo Socks three-pack",
        primary: true,
      },
    ],
    variants: [
      {
        size: "S",
        color: "Mixed",
        colorHex: "#8a857c",
        sku: "AC-LS-MIX-S",
        inventory: 40,
      },
      {
        size: "M",
        color: "Mixed",
        colorHex: "#8a857c",
        sku: "AC-LS-MIX-M",
        inventory: 80,
      },
      {
        size: "L",
        color: "Mixed",
        colorHex: "#8a857c",
        sku: "AC-LS-MIX-L",
        inventory: 60,
      },
    ],
  },
  {
    id: "prod-mug",
    categoryId: "cat-accessories",
    name: "A&C Mug",
    slug: "ac-mug",
    description:
      "Matte ceramic mug with a deep teal interior and embossed exterior mark. Holds 12 oz — perfect for the first pour of the day.",
    priceCents: 2200,
    tags: ["mug", "home"],
    images: [
      {
        url: "/images/products/mug.jpg",
        alt: "A&C Mug with teal interior",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Bone",
        colorHex: "#f4f4f2",
        sku: "AC-MG-BNE-OS",
        inventory: 90,
      },
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0c0c0c",
        sku: "AC-MG-BLK-OS",
        inventory: 75,
      },
    ],
  },
  {
    id: "prod-coach-jacket",
    categoryId: "cat-accessories",
    name: "A&C Coach Jacket",
    slug: "ac-coach-jacket",
    description:
      "Lightweight water-resistant shell with snap front, elastic cuffs, and a hidden zip pocket. Packs small, looks intentional.",
    priceCents: 9800,
    compareAtCents: 11000,
    isFeatured: true,
    isNew: true,
    tags: ["outerwear", "jacket"],
    createdAt: "2026-05-01T12:00:00.000Z",
    images: [
      {
        url: "/images/products/coach-jacket.jpg",
        alt: "A&C Coach Jacket in black",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "AC-CJ",
      [
        { name: "Black", hex: "#0c0c0c" },
        { name: "Stone", hex: "#8a857c" },
      ],
      16,
    ),
  },
  {
    id: "prod-weekend-short",
    categoryId: "cat-tshirts",
    name: "A&C Weekend Short",
    slug: "ac-weekend-short",
    description:
      "Mid-length cotton twill short with an elastic waist and side pockets. Easy throw-on for warm days and travel days alike.",
    priceCents: 4200,
    isNew: true,
    tags: ["shorts", "summer"],
    createdAt: "2026-05-18T12:00:00.000Z",
    images: [
      {
        url: "/images/products/weekend-short.jpg",
        alt: "A&C Weekend Short in stone",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "AC-WS",
      [
        { name: "Stone", hex: "#8a857c" },
        { name: "Black", hex: "#0c0c0c" },
        { name: "Teal", hex: "#0d5c63" },
      ],
      30,
    ),
  },
  {
    id: "prod-camp-hat",
    categoryId: "cat-hats",
    name: "A&C Camp Hat",
    slug: "ac-camp-hat",
    description:
      "Unstructured five-panel camp hat with a soft brim and metal clasp. Low profile for days when a full snapback feels like too much.",
    priceCents: 3000,
    tags: ["camp-hat"],
    images: [
      {
        url: "/images/products/camp-hat.jpg",
        alt: "A&C Camp Hat in bone",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Bone",
        colorHex: "#f4f4f2",
        sku: "AC-CP-BNE-OS",
        inventory: 38,
      },
      {
        size: "ONE_SIZE",
        color: "Olive",
        colorHex: "#556b2f",
        sku: "AC-CP-OLV-OS",
        inventory: 28,
      },
    ],
  },
  {
    id: "prod-key-lanyard",
    categoryId: "cat-accessories",
    name: "A&C Key Lanyard",
    slug: "ac-key-lanyard",
    description:
      "Woven lanyard with a metal clasp and detachable key ring. Compact brand detail for studio keys, badges, and bags.",
    priceCents: 1400,
    tags: ["lanyard", "small-goods"],
    images: [
      {
        url: "/images/products/key-lanyard.jpg",
        alt: "A&C Key Lanyard in teal",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Teal",
        colorHex: "#0d5c63",
        sku: "AC-KL-TEL-OS",
        inventory: 120,
      },
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0c0c0c",
        sku: "AC-KL-BLK-OS",
        inventory: 120,
      },
    ],
  },
];

export const products: Product[] = productSeeds.map(buildProduct);

export function getSeedCategories(): Category[] {
  return categories;
}

export function getSeedProducts(): Product[] {
  return products;
}

export function getSeedProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.is_active);
}

/** Admin lookup — unlike {@link getSeedProductBySlug}, includes inactive products. */
export function getSeedProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
