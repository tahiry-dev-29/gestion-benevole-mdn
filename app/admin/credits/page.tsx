import { PageHeader } from "@/features/admin/page-header";
import { CreditsList } from "@/features/credit/credits-list";
import { listUsersAction } from "@/features/user/user.action";

export default async function CreditsPage() {
  const usersRes = await listUsersAction();
  const benevoles =
    usersRes.success && usersRes.data
      ? usersRes.data.map((u) => ({
          id: u.id,
          nom: u.nom,
          prenom: u.prenom,
        }))
      : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crédits"
        description="Suivez les crédits attribués aux bénévoles et le cumul mensuel."
      />
      <CreditsList benevoles={benevoles} />
    </div>
  );
}
