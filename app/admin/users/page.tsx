import { UsersTable } from "@/features/user/components/users-table";
import { listUsersAction } from "@/features/user/user.action";

export default async function UsersPage() {
  const result = await listUsersAction();
  const users = result.success && result.data ? result.data : [];

  return <UsersTable initialUsers={users} />;
}
