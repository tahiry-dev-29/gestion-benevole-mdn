import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { PageHeader } from "@/features/admin/page-header";
import { ProfileForm } from "@/features/user/components/profile-form";
import { getProfileAction } from "@/features/user/user.action";
import { authOptions } from "@/lib/auth-options";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = parseInt(session.user.id, 10);
  const res = await getProfileAction(userId);

  if (!res.success || !res.data) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mon profil"
        description="Consultez et modifiez vos informations personnelles."
      />
      <ProfileForm user={res.data} />
    </div>
  );
}
