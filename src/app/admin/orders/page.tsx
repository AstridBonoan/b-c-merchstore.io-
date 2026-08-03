import type { Metadata } from "next";
import { getDemoOrders } from "@/lib/orders/demo-orders";
import { PageHeader } from "@/components/admin/page-header";
import { OrdersTable } from "@/components/admin/orders-table";

export const metadata: Metadata = {
  title: "Orders | Admin",
};

export default function AdminOrdersPage() {
  const orders = getDemoOrders();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        description={`${orders.length} orders in the demo store`}
      />
      <OrdersTable orders={orders} />
    </div>
  );
}
