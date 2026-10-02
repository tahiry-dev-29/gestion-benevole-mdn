import { getServerSession } from "next-auth";

import { PageHeader } from "@/features/admin/page-header";
import { ObservationsList } from "@/features/observation/observations-list";
import { listVolunteersAction } from "@/features/volunteers/volunteer.action";
import { authOptions } from "@/lib/auth-options";

export default async function ObservationsPage() {
  const [session, volunteersRes] = await Promise.all([
    getServerSession(authOptions),
    listVolunteersAction({
      role: "VOLUNTEER",
      statut: "ACTIF",
      pageSize: 1000,
    }),
  ]);

  const benevoles =
    volunteersRes.success && volunteersRes.data
      ? volunteersRes.data.data.map((u) => ({
          id: u.id,
          nom: u.nom,
          prenom: u.prenom,
        }))
      : [];

  const currentUserId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Observations mensuelles"
        description="Notes et suivis mensuels des bénévoles par le responsable."
      />
      <ObservationsList
        benevoles={benevoles}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />
    </div>
  );
}
