import { notFound } from "next/navigation";

import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { VolunteerDetail } from "@/features/volunteers/presentation/volunteer-detail";
import { getVolunteerAction } from "@/features/volunteers/volunteer.action";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VolunteerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const volunteerId = Number.parseInt(id, 10);

  if (!Number.isFinite(volunteerId)) {
    notFound();
  }

  const res = await getVolunteerAction(volunteerId);
  if (!res.success) {
    notFound();
  }

  const volunteer = res.data;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Bénévoles", href: "/admin/volunteer-management" },
          { label: `${volunteer.prenom} ${volunteer.nom}` },
        ]}
      />
      <VolunteerDetail volunteer={volunteer} />
    </div>
  );
}
