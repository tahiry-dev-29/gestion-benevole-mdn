import { Badge } from "@/components/ui/badge";

type CertificatStatut = "NON_DEMANDE" | "EN_ATTENTE" | "APPROUVE" | "REJETE";

const CONFIG: Record<CertificatStatut, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  NON_DEMANDE: { label: "Certificat non demandé", variant: "outline" },
  EN_ATTENTE: { label: "Certificat en attente", variant: "secondary" },
  APPROUVE: { label: "Certificat approuvé", variant: "default" },
  REJETE: { label: "Certificat rejeté", variant: "destructive" },
};

export function CertificatBadge({ statut }: { statut?: CertificatStatut | null }) {
  const key: CertificatStatut = statut ?? "NON_DEMANDE";
  const { label, variant } = CONFIG[key];
  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  );
}
