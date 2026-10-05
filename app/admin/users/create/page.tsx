import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { CreateUserForm } from "@/features/user/components/create-user-form";

export default function CreateUserPage() {
  return (
    <main className="mx-auto grid w-full max-w-4xl gap-5 pb-8">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Utilisateurs", href: "/admin/users" },
          { label: "Nouvelle préinscription" },
        ]}
      />
      <header className="flex items-start gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Compte USER</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground">
            Nouvelle préinscription
          </h1>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Renseignez les coordonnées et les informations utiles au suivi du
            dossier.
          </p>
        </div>
      </header>

      <CreateUserForm />
    </main>
  );
}
