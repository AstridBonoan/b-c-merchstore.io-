/** Prices throughout the app are stored as integer cents (USD). */

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "ONE_SIZE";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type UserRole = "customer" | "admin";

export type AddressType = "shipping" | "billing";

export type ProductSortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: ProductSize;
  color: string;
  color_hex: string;
  price_cents: number | null;
  compare_at_cents: number | null;
  inventory_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  compare_at_cents: number | null;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  /** Joined relations (optional depending on query) */
  category?: Category | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: AddressType;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product | null;
  variant?: ProductVariant | null;
}

/** Client-side / zustand cart line (guest + auth hydrated carts). */
export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
  /** Snapshot for display; server revalidates price at checkout */
  name: string;
  slug: string;
  imageUrl: string;
  size: ProductSize;
  color: string;
  unitPriceCents: number;
  maxQuantity: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  email: string;
  status: OrderStatus;
  subtotal_cents: number;
  tax_cents: number;
  shipping_cents: number;
  total_cents: number;
  currency: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  shipping_address: AddressSnapshot | null;
  billing_address: AddressSnapshot | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_slug: string;
  sku: string;
  size: ProductSize;
  color: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
  image_url: string | null;
  created_at: string;
}

export interface AddressSnapshot {
  full_name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string | null;
}

export interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  items?: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  variant_id: string | null;
  created_at: string;
  product?: Product | null;
  variant?: ProductVariant | null;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: ProductSize[];
  colors?: string[];
  inStockOnly?: boolean;
  featured?: boolean;
  sort?: ProductSortOption;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CartSummary {
  itemCount: number;
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
}

export interface CheckoutCustomerInput {
  email: string;
  fullName: string;
  phone?: string;
}

export interface CheckoutShippingInput {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
