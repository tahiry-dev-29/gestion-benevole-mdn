import { getServerSession } from "next-auth";

import { PageHeader } from "@/features/admin/page-header";
import {
  getPresenceDuJourAction,
} from "@/features/presence/presence.action";
import { PointageButton } from "@/features/presence/presentation/pointage-button";
import { PresenceHistorique } from "@/features/presence/presentation/presence-historique";
import { authOptions } from "@/lib/auth-options";

export default async function PresencesPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  // Récupérer le pointage du jour pour l'utilisateur connecté
  const presenceRes = await getPresenceDuJourAction();
  const presenceDuJour = presenceRes.success ? (presenceRes.data ?? null) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Présences"
        description="Pointage quotidien et historique des présences."
      />

      {/* Bouton de pointage pour l'utilisateur connecté */}
      <PointageButton presenceDuJour={presenceDuJour} />

      {/* Historique des présences */}
      <PresenceHistorique isAdmin={isAdmin} />
    </div>
  );
}
