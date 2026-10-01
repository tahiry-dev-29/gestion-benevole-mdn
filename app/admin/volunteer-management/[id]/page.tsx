import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
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
    <div className="space-y-6">
      <PageHeader
        title={`${volunteer.prenom} ${volunteer.nom}`}
        description="Fiche détaillée, modification et suppression (soft delete)."
      />
      <VolunteerDetail volunteer={volunteer} />
    </div>
  );
}
