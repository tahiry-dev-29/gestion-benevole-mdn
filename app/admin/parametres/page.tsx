import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/features/admin/page-header";

const settings = [
  {
    title: "Général",
    items: ["Nom de l'association", "Logo et couleurs", "Langue (Français)"],
  },
  {
    title: "Présences",
    items: ["Heure limite de pointage", "Tolérance de retard (minutes)"],
  },
  {
    title: "Notifications",
    items: ["Rappels de présence", "Alertes témoignages à modérer"],
  },
];

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramètres"
        description="Configuration de l'espace d'administration."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settings.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}