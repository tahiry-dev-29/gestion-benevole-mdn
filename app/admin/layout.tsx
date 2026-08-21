import { Toaster } from "@/components/ui/sonner";
import { AdminLayoutWrapper } from "@/features/admin/admin-layout-wrapper";
import { QueryProvider } from "@/features/admin/query-provider";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
