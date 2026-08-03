import type { Metadata } from "next";
import { getSeedCategories } from "@/lib/products/seed-data";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "New product | Admin",
};

export default function NewProductPage() {
  const categories = getSeedCategories();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New product"
        description="Demo mode validates your input but doesn't write to a database."
      />
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
