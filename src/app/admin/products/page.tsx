import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getSeedProducts } from "@/lib/products/seed-data";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { ProductsTable } from "@/components/admin/products-table";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Products | Admin",
};

export default function AdminProductsPage() {
  const products = getSeedProducts();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description={`${products.length} products in the demo catalog`}
        actions={
          <Link href="/admin/products/new" className={cn(buttonVariants())}>
            <Plus className="h-4 w-4" />
            New product
          </Link>
        }
      />
      <ProductsTable products={products} />
    </div>
  );
}
