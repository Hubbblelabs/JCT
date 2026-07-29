import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { AdminShell } from "@/components/admin/shell/AdminShell";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import "@/styles/admin.css";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <ConfirmProvider>
          <div className="admin-layout">
            <AdminShell>{children}</AdminShell>
          </div>
        </ConfirmProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
