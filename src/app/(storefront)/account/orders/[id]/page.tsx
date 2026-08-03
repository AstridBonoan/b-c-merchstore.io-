import { getDemoOrders } from "@/lib/orders/demo-orders";
import { AccountOrderDetailClient } from "@/components/account/order-detail-client";

export function generateStaticParams() {
  return getDemoOrders().map((order) => ({ id: order.id }));
}

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AccountOrderDetailClient orderId={id} />;
}
