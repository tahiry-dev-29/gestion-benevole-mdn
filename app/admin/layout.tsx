import { Toaster } from "@/components/ui/sonner";
import { AdminShell } from "@/features/admin/admin-shell";
import { QueryProvider } from "@/features/admin/query-provider";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
