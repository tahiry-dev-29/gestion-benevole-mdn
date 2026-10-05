import { notFound } from "next/navigation";

import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { getUserDetailsAction } from "@/features/user/user.action";

import { UserUpdateForm } from "./_components/user-update-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserUpdatePage({ params }: Props) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) notFound();

  const result = await getUserDetailsAction(userId);
  if (!result.success || !result.data) notFound();

  return (
    <main className="mx-auto grid w-full max-w-4xl gap-5 pb-8">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Utilisateurs", href: "/admin/users" },
          {
            label: `${result.data.prenom} ${result.data.nom}`,
            href: `/admin/users/${userId}`,
          },
          { label: "Modifier" },
        ]}
      />
      <header className="flex items-start gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Compte USER</p>
          <h1 className="mt-0.5 truncate text-2xl font-semibold tracking-tight text-foreground">
            Modifier {result.data.prenom} {result.data.nom}
          </h1>
        </div>
      </header>

      <UserUpdateForm userId={userId} initialData={result.data} />
    </main>
  );
}
