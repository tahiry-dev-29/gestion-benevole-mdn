'use client';

import { useState } from 'react';
import { createUserAction } from '../application/user.actions';
import { UserRole } from '../domain/user.entity';

export function CreateUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    const res = await createUserAction({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as UserRole,
    });

    if (!res.success) {
      setError(res.error || 'Erreur lors de la création');
    } else {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Nouvel utilisateur
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Créer un utilisateur</h2>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rôle</label>
          <select
            name="role"
            defaultValue="BENEVOLE"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="BENEVOLE">Bénévole</option>
            <option value="RESPONSABLE">Responsable</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}