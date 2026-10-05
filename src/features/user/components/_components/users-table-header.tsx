import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImportExportButtons } from "@/features/excel/import-export-buttons";

export function UsersTableHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Comptes USER
        </h2>
        <p className="mt-1 max-w-prose text-sm text-muted-foreground">
          Préinscriptions et suivi des certificats.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ImportExportButtons dataset="users" />
        <Button asChild className="min-h-11 gap-2">
          <Link href="/admin/users/create">
            <Plus aria-hidden="true" className="size-4" />
            Ajouter un compte
          </Link>
        </Button>
      </div>
    </div>
  );
}
