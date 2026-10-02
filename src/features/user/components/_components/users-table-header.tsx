import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UsersTableHeaderProps {
  onOpenCreate: () => void;
}

export function UsersTableHeader({ onOpenCreate }: UsersTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Comptes USER
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Gérez les pré-inscriptions, leurs informations et certificats de
          conversion.
        </p>
      </div>

      <Button
        onClick={onOpenCreate}
        className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm font-medium gap-2 self-start sm:self-auto"
      >
        <Plus className="size-4" />
        Ajouter un utilisateur
      </Button>
    </div>
  );
}
