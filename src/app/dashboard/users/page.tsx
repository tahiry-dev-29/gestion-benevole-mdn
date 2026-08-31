import { getUsersAction } from '@/features/users/application/user.actions';
import { UserTable } from '@/features/users/presentation/user-table';
import { CreateUserForm } from '@/features/users/presentation/create-user-form';

export default async function UsersPage() {
  const result = await getUsersAction();
  const users = result.success && result.data ? result.data : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
        <CreateUserForm />
      </div>
      <UserTable users={users} />
    </div>
  );
}