import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VolunteerForm } from "@/features/volunteers/presentation/volunteer-form";

export default function AddVolunteerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nouveau compte bénévole"
        description="Créez un accès pour un bénévole ou un compte d'administration."
        action={
          <Button asChild variant="outline" size="sm" className="gap-2 shadow-xs">
            <Link href="/admin/volunteer-management">
              <ArrowLeft className="size-4" /> Retour à la liste
            </Link>
          </Button>
        }
      />

      <Card className="max-w-3xl border shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Informations du compte</CardTitle>
              <CardDescription>
                Renseignez l&apos;identité et les accès. La matrice de permissions s&apos;applique automatiquement à la création.
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
