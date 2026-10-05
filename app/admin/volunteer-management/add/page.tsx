import { UserPlus } from "lucide-react";

import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VolunteerForm } from "@/features/volunteers/presentation/volunteer-form";

export default function AddVolunteerPage() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Bénévoles", href: "/admin/volunteer-management" },
          { label: "Nouveau bénévole" },
        ]}
      />
      <PageHeader
        title="Nouveau compte bénévole"
        description="Créez un accès pour un bénévole ou un compte d'administration."
      />

      <Card className="glass-sm max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Informations du compte</CardTitle>
              <CardDescription>
                Renseignez l&apos;identité et les accès. La matrice de
                permissions s&apos;applique automatiquement à la création.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <VolunteerForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
