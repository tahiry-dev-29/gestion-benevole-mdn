import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/features/admin/page-header";

const sprints = [
  { id: "Sprint 0", titre: "Initialisation & Setup", statut: "TERMINE" },
  {
    id: "Sprint 1",
    titre: "Authentification & Fondations",
    statut: "EN_COURS",
  },
  {
    id: "Sprint 2",
    titre: "Admin : Info perso & Présence journalière",
    statut: "A_FAIRE",
  },
  {
    id: "Sprint 3",
    titre: "Admin : Observation mensuelle & Liste crédit",
    statut: "A_FAIRE",
  },
  { id: "Sprint 4", titre: "Public : Activité & Partage", statut: "A_FAIRE" },
  {
    id: "Sprint 5",
    titre: "Public : Témoignage & Finalisation PWA",
    statut: "A_FAIRE",
  },
  { id: "Sprint 6", titre: "Mise en production", statut: "A_FAIRE" },
];

function statusBadge(statut: string) {
  if (statut === "TERMINE") return <Badge variant="default">Terminé</Badge>;
  if (statut === "EN_COURS") return <Badge variant="secondary">En cours</Badge>;
  return <Badge variant="outline">À faire</Badge>;
}

export default function SprintsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Suivi du projet"
        description="Avancement des sprints du cahier des charges (suivi interne)."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {sprints.map((sprint) => (
          <Card key={sprint.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-semibold">
                {sprint.id} — {sprint.titre}
              </CardTitle>
              {statusBadge(sprint.statut)}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Tâches détaillées dans le fichier
                <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[0.7rem]">
                  todos/sprints/{sprint.id.toLowerCase()}
                </code>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
