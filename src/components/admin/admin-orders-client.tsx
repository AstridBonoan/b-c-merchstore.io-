"use client";

import * as React from "react";
import { PageHeader } from "@/components/admin/page-header";
import { OrdersTable } from "@/components/admin/orders-table";
import { useAllOrders } from "@/lib/orders/use-orders";

export function AdminOrdersClient() {
  const orders = useAllOrders();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        description={`${orders.length} orders in the demo store (includes checkout orders from this browser)`}
      />
      <OrdersTable orders={orders} />
    </div>
  );
}
