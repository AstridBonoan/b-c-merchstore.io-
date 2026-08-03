import { Suspense } from "react";
import AccountOrderViewClient from "./view-client";

export default function AccountOrderViewPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-[#0c0c0c]/55">
          Loading order…
        </div>
      }
    >
      <AccountOrderViewClient />
    </Suspense>
  );
}
