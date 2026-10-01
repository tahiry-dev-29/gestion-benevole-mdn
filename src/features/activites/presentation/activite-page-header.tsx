"use client";

import { Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

type Props = { onAdd: () => void };

export function ActivitePageHeader({ onAdd }: Props) {
  return (
    <PageHeader
      title="Activités"
      description="Gérez les activités et formations de l'association."
      action={
        <Button onClick={onAdd} className="gap-2">
          <Plus className="size-4" /> Ajouter
        </Button>
      }
    />
  );
}
