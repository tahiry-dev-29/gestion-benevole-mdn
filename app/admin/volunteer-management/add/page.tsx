import { PageHeader } from "@/components/shared/page-header";
import { VolunteerForm } from "@/features/volunteers/presentation/volunteer-form";

export default function AddVolunteerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add bénévole"
        description="Le choix du rôle est limité par votre matrice de permissions (appliquée côté serveur)."
      />
      <VolunteerForm mode="create" />
    </div>
  );
}
