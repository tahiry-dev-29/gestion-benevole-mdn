import Image from "next/image";
import { Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { UserDetailsView } from "@/features/user/user-details.types";
import { gravatarUrl } from "@/lib/gravatar";

import { CertificatBadge } from "./certificat-badge";

function displayDate(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(value)
    : "—";
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-sm rounded-lg border bg-card p-4 sm:p-5">
      <h2 className="border-b pb-3 text-sm font-semibold text-foreground">
        {title}
      </h2>
      <dl className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function DetailField({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm text-foreground">
        {value || "—"}
      </dd>
    </div>
  );
}

export function UserDetailsContent({ user }: { user: UserDetailsView }) {
  const avatarUrl = gravatarUrl(user.email, 160);
  const timeSlots = user.disponibilites
    ? JSON.stringify(user.disponibilites)
    : "—";

  return (
    <div className="grid gap-4">
      <section className="glass flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:p-5">
        <Image
          src={avatarUrl}
          alt={`Photo de ${user.prenom} ${user.nom}`}
          width={72}
          height={72}
          sizes="72px"
          className="size-[72px] rounded-full border object-cover"
        />
        <div className="min-w-0 flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Préinscrit</Badge>
            <Badge variant={user.statut === "ACTIF" ? "secondary" : "outline"}>
              {user.statut === "ACTIF" ? "Actif" : "Inactif"}
            </Badge>
            <CertificatBadge statut={user.certificatStatut} />
          </div>
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <Mail aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.telephone ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone aria-hidden="true" className="size-4 shrink-0" />
              <span>{user.telephone}</span>
            </div>
          ) : null}
        </div>
        <div className="rounded-md bg-muted px-3 py-2 sm:text-right">
          <p className="text-xs text-muted-foreground">Matricule</p>
          <p className="mt-0.5 font-medium text-foreground">
            {user.matricule || "À renseigner"}
          </p>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailSection title="Identité et organisation">
          <DetailField label="Prénom" value={user.prenom} />
          <DetailField label="Nom" value={user.nom} />
          <DetailField label="Genre" value={user.sexe} />
          <DetailField
            label="Âge"
            value={user.age ? `${user.age} ans` : null}
          />
          <DetailField
            label="Date de naissance"
            value={displayDate(user.dateNaissance)}
          />
          <DetailField label="Catégorie" value={user.categorie} />
          <DetailField label="École" value={user.etablissement} />
          <DetailField label="Société" value={user.societe} />
          <DetailField label="Spinneret" value={user.spinneret} />
        </DetailSection>

        <DetailSection title="Contact et disponibilités">
          <DetailField
            label="Téléphone / WhatsApp"
            value={user.telephone || user.contact}
          />
          <DetailField label="Contact d’urgence" value={user.contactUrgence} />
          <DetailField label="Site web" value={user.siteWeb} />
          <DetailField label="Profil social" value={user.socialProfile} />
          <DetailField
            label="Jours disponibles"
            value={user.joursDisponibles.join(", ")}
          />
          <DetailField
            label="Créneaux horaires"
            value={timeSlots}
            className="sm:col-span-2"
          />
        </DetailSection>

        <DetailSection title="Documents et règles">
          <DetailField
            label="CV"
            value={
              user.cvUrl ? (
                <a
                  className="font-medium text-primary underline underline-offset-4"
                  href={user.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Télécharger le CV
                </a>
              ) : null
            }
          />
          <DetailField
            label="Certificat"
            value={
              user.certificatUrl ? (
                <a
                  className="font-medium text-primary underline underline-offset-4"
                  href={user.certificatUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Consulter le certificat
                </a>
              ) : null
            }
          />
          <DetailField
            label="Ordinateur personnel"
            value={user.materielPC ? "Oui" : "Non"}
          />
          <DetailField
            label="Règles acceptées"
            value={
              user.accepteRegles
                ? `Oui, le ${displayDate(user.reglesAccepteesAt)}`
                : "Non"
            }
          />
          <DetailField
            label="Compte créé le"
            value={displayDate(user.createdAt)}
          />
          <DetailField
            label="Date d’entrée"
            value={displayDate(user.date_entree)}
          />
        </DetailSection>
      </div>
    </div>
  );
}
