import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSeedCategories,
  getSeedProductById,
  getSeedProducts,
} from "@/lib/products/seed-data";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Edit product | Admin",
};

export function generateStaticParams() {
  return getSeedProducts().map((product) => ({ id: product.id }));
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getSeedProductById(id);

  if (!product) {
    notFound();
  }

  const categories = getSeedCategories();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit ${product.name}`}
        description="Demo mode validates your input but doesn't write to a database."
      />
      <ProductForm mode="edit" categories={categories} product={product} />
    </div>
  );
}
