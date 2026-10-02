import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
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
        description="Fiche détaillée, modification et gestion du compte bénévole."
        action={
          <Button asChild variant="outline" size="sm" className="gap-2 shadow-xs">
            <Link href="/admin/volunteer-management">
              <ArrowLeft className="size-4" /> Retour aux bénévoles
            </Link>
          </Button>
        }
      />
      <VolunteerDetail volunteer={volunteer} />
    </div>
  );
}
