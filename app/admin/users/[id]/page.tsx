import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserDetailsAction } from "@/features/user/user.action";
import { gravatarUrl } from "@/lib/gravatar";

import { ApproveCertificateButton } from "./_components/approve-certificate-button";
import { CertificatBadge } from "./_components/certificat-badge";
import { RejectDialog } from "./_components/reject-dialog";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: Props) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) notFound();

  const result = await getUserDetailsAction(userId);
  if (!result.success || !result.data) notFound();

  const u = result.data;
  const avatarUrl = gravatarUrl(u.email, 200);
  const disponibilites = u.disponibilites
    ? JSON.stringify(u.disponibilites)
    : "—";

  const formattedDate = (d: Date | string | null | undefined) =>
    d
      ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
          new Date(d)
        )
      : "—";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-slate-100"
          >
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-100">
            {u.prenom} {u.nom}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Fiche utilisateur</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Link href={`/admin/users/${userId}/update`}>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
            >
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      {/* Profil & Gravatar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex gap-6 items-start">
        <Image
          src={avatarUrl}
          alt={`${u.prenom} ${u.nom}`}
          width={80}
          height={80}
          sizes="80px"
          className="rounded-full border-2 border-slate-700 shrink-0"
        />
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="text-xs">
              {u.role}
            </Badge>
            <Badge
              variant={u.statut === "ACTIF" ? "default" : "secondary"}
              className="text-xs"
            >
              {u.statut}
            </Badge>
            <CertificatBadge statut={u.certificatStatut} />
          </div>
          <div className="flex items-center gap-2 text-sm text-cyan-400">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{u.email}</span>
          </div>
          {u.telephone && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Phone className="size-3.5 shrink-0" />
              <span>{u.telephone}</span>
            </div>
          )}
          {u.matricule && (
            <p className="text-xs text-slate-400">
              Matricule :{" "}
              <strong className="text-slate-200">#{u.matricule}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Certificat — actions admin */}
      {u.certificatStatut === "EN_ATTENTE" &&
        u.certificatUrl &&
        u.role === "USER" && (
          <div className="rounded-xl border border-amber-800/60 bg-amber-950/20 p-5 space-y-3">
            <p className="text-sm font-medium text-amber-300">
              Conversion USER → VOLUNTEER
            </p>
            <a
              href={u.certificatUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 underline"
            >
              Voir le certificat PDF
            </a>
            <div className="flex gap-3">
              <ApproveCertificateButton userId={userId} />
              <RejectDialog userId={userId} />
            </div>
          </div>
        )}

      {u.certificatStatut === "APPROUVE" && (
        <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/20 p-4 text-sm text-emerald-300">
          ✅ Certificat approuvé le {formattedDate(u.certificatValidatedAt)} —
          compte converti en VOLUNTEER.
        </div>
      )}

      {u.certificatStatut === "REJETE" && (
        <div className="rounded-xl border border-red-800/60 bg-red-950/20 p-4 text-sm text-red-300">
          <X className="size-4 inline mr-1" />
          Certificat rejeté.{" "}
          {u.certificatMotifRejet ? `Motif : ${u.certificatMotifRejet}` : ""}
        </div>
      )}

      {/* Informations détaillées */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <Field label="Prénom" value={u.prenom} />
        <Field label="Nom" value={u.nom} />
        <Field label="Genre" value={u.sexe} />
        <Field label="Âge" value={u.age ? `${u.age} ans` : undefined} />
        <Field
          label="Date de naissance"
          value={formattedDate(u.dateNaissance)}
        />
        <Field label="Catégorie" value={u.categorie} />
        <Field label="Contact / WhatsApp" value={u.contact} />
        <Field label="École" value={u.etablissement} />
        <Field label="Société" value={u.societe} />
        <Field label="Spinneret" value={u.spinneret} />
        <Field label="Contact d'urgence" value={u.contactUrgence} />
        <Field label="Site web" value={u.siteWeb} />
        <Field label="Profil social" value={u.socialProfile} />
        <div className="col-span-2">
          <Field
            label="Jours disponibles"
            value={u.joursDisponibles?.join(", ") || "—"}
          />
        </div>
        <div className="col-span-2 min-w-0">
          <Field label="Disponibilités horaires" value={disponibilites} />
        </div>
        <div className="col-span-2">
          <Field
            label="CV"
            value={
              u.cvUrl ? (
                <a
                  href={u.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline text-xs"
                >
                  Télécharger le CV
                </a>
              ) : undefined
            }
          />
        </div>
        <Field label="Matériel PC" value={u.materielPC ? "Oui" : "Non"} />
        <Field
          label="Règles acceptées"
          value={
            u.accepteRegles
              ? `Oui (${formattedDate(u.reglesAccepteesAt)})`
              : "Non"
          }
        />
        <Field label="Entrée" value={formattedDate(u.date_entree)} />
        <Field label="Inscrit le" value={formattedDate(u.createdAt)} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | React.ReactNode;
}) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
        {label}
      </span>
      <span className="text-slate-200 mt-0.5 block text-sm">
        {value ?? "—"}
      </span>
    </div>
  );
}
