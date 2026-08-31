'use client';

import { UserEntity } from '../domain/user.entity';
import { deleteUserAction } from '../application/user.actions';

interface UserTableProps {
  users: UserEntity[];
}

export function UserTable({ users }: UserTableProps) {
  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      await deleteUserAction(id);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Nom</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Rôle</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Statut</th>
            <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3 font-medium text-gray-900">{user.name || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{user.email}</td>
              <td className="px-4 py-3">
                <span className="inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="font-medium text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}