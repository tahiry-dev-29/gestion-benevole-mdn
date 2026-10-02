import { Toaster } from "@/components/ui/sonner";
import { AdminLayoutWrapper } from "@/features/admin/admin-layout-wrapper";
import { QueryProvider } from "@/features/admin/query-provider";
import { AuthProvider } from "@/features/auth/auth-provider";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <QueryProvider>
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </AuthProvider>
  );
}
