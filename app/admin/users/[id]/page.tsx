import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, FileText, Pencil, X } from "lucide-react";

import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { Button } from "@/components/ui/button";
import { getUserDetailsAction } from "@/features/user/user.action";

import { ApproveCertificateButton } from "./_components/approve-certificate-button";
import { RejectDialog } from "./_components/reject-dialog";
import { UserDetailsContent } from "./_components/user-details-content";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: Props) {
  const { id } = await params;
  const userId = Number.parseInt(id, 10);
  if (!Number.isSafeInteger(userId) || userId <= 0) notFound();

  const result = await getUserDetailsAction(userId);
  if (!result.success || !result.data) notFound();

  const user = result.data;

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-5 pb-8">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Utilisateurs", href: "/admin/users" },
          { label: `${user.prenom} ${user.nom}` },
        ]}
      />
      <header className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">Compte USER</p>
          <h1 className="mt-0.5 truncate text-2xl font-semibold tracking-tight text-foreground">
            {user.prenom} {user.nom}
          </h1>
        </div>
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`/admin/users/${userId}/update`}>
            <Pencil data-icon="inline-start" aria-hidden="true" />
            Modifier
          </Link>
        </Button>
      </header>

      {user.certificatStatut === "EN_ATTENTE" && user.certificatUrl ? (
        <section
          aria-labelledby="certificate-review-title"
          className="glass-sm rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="certificate-review-title"
                className="font-semibold text-foreground"
              >
                Certificat à vérifier
              </h2>
              <a
                href={user.certificatUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"
              >
                <FileText aria-hidden="true" className="size-4" />
                Ouvrir le document PDF
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <ApproveCertificateButton userId={userId} />
              <RejectDialog userId={userId} />
            </div>
          </div>
        </section>
      ) : null}

      {user.certificatStatut === "APPROUVE" ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-emerald-600/30 bg-emerald-500/5 p-4 text-sm text-foreground"
        >
          <Check
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-emerald-600"
          />
          Certificat approuvé; le compte a été converti en bénévole.
        </p>
      ) : null}

      {user.certificatStatut === "REJETE" ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground"
        >
          <X
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-destructive"
          />
          <span>
            Certificat rejeté.
            {user.certificatMotifRejet
              ? ` Motif : ${user.certificatMotifRejet}`
              : ""}
          </span>
        </p>
      ) : null}

      <UserDetailsContent user={user} />
    </main>
  );
}
