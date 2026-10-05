import { getServerSession } from "next-auth";

import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
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
    <div className="mx-auto grid w-full max-w-7xl gap-4">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Observations" },
        ]}
      />
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
