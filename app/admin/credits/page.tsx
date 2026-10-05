import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { PageHeader } from "@/features/admin/page-header";
import { CreditsList } from "@/features/credit/credits-list";
import { listVolunteersAction } from "@/features/volunteers/volunteer.action";

export default async function CreditsPage() {
  const usersRes = await listVolunteersAction({
    role: "VOLUNTEER",
    statut: "ACTIF",
    pageSize: 1000,
  });
  const benevoles =
    usersRes.success && usersRes.data
      ? usersRes.data.data.map((u) => ({
          id: u.id,
          nom: u.nom,
          prenom: u.prenom,
        }))
      : [];

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Crédits" },
        ]}
      />
      <PageHeader
        title="Crédits"
        description="Suivez les crédits attribués aux bénévoles et le cumul mensuel."
      />
      <CreditsList benevoles={benevoles} />
    </div>
  );
}
