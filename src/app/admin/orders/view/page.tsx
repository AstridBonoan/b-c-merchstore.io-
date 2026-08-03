import { Suspense } from "react";
import AdminOrderViewClient from "./view-client";

export default function AdminOrderViewPage() {
  return (
    <Suspense
      fallback={
        <div className="py-10 text-sm text-[#0c0c0c]/55">Loading order…</div>
      }
    >
      <AdminOrderViewClient />
    </Suspense>
  );
}
