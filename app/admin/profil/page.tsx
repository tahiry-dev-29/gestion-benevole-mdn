import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/features/admin/page-header";

export default function ProfilPage() {
  const profil = {
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@asso.fr",
    role: "Administratrice",
    date_entree: "12 janvier 2026",
  };

  const rows = [
    { label: "Nom", value: profil.nom },
    { label: "Prénom", value: profil.prenom },
    { label: "Email", value: profil.email },
    { label: "Rôle", value: profil.role },
    { label: "Date d'entrée", value: profil.date_entree },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mon profil"
        description="Fiche personnelle du bénévole (nom, contact, rôle, date d'entrée)."
      />

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                MD
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-base font-semibold">
                {profil.prenom} {profil.nom}
              </div>
              <Badge variant="secondary" className="mt-0.5">
                {profil.role}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 py-2.5 text-sm"
              >
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
