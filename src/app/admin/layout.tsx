import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { signOutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin | A&C Merch Store",
  description: "A&C Merch Store admin dashboard.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side role check — never trust the client. Redirects to /login
  // (no session) or / (authenticated but not admin).
  const session = await requireAdminSession();

  return (
    <div className="flex min-h-screen w-full bg-[#f4f4f2]">
      <AdminSidebar session={session} signOutAction={signOutAction} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
