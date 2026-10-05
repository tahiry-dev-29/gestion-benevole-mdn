import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { UsersTable } from "@/features/user/components/users-table";
import { listUsersAction } from "@/features/user/user.action";

export default async function UsersPage() {
  const result = await listUsersAction();
  const users = result.success && result.data ? result.data : [];

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-8 sm:px-6">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Utilisateurs" },
        ]}
      />
      <UsersTable initialUsers={users} />
    </div>
  );
}
