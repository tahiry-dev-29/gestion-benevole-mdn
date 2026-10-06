import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/features/admin/page-header";

const settings = [
  {
    id: "general",
    title: "Général",
    items: ["Nom de l'association", "Logo et couleurs", "Langue (Français)"],
  },
  {
    id: "presences",
    title: "Présences",
    items: ["Heure limite de pointage", "Tolérance de retard (minutes)"],
  },
  {
    id: "notifications",
    title: "Notifications",
    items: ["Rappels de présence", "Alertes témoignages à modérer"],
  },
];

export default function ParametresPage() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Paramètres" },
        ]}
      />
      <PageHeader
        title="Paramètres"
        description="Configuration de l'espace d'administration."
      />

      <Tabs defaultValue={settings[0].id} className="gap-4">
        <TabsList className="glass-sm h-auto max-w-full flex-wrap justify-start gap-1">
          {settings.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="px-3 py-2"
            >
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {settings.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <Card className="glass-sm">
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
