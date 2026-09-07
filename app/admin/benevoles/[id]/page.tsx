import { notFound } from "next/navigation";

import { PageHeader } from "@/features/admin/page-header";
import { ProfileForm } from "@/features/user/components/profile-form";
import { getProfileAction } from "@/features/user/user.action";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BenevoleProfilePage({ params }: PageProps) {
  const { id } = await params;
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    notFound();
  }

  const res = await getProfileAction(userId);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Profil de ${res.data.prenom} ${res.data.nom}`}
        description="Consultez et modifiez les informations du bénévole."
      />
      <ProfileForm user={res.data} />
    </div>
  );
}