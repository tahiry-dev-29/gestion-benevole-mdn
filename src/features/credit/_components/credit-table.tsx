"use client";

import * as React from "react";

import { DataTable } from "@/components/shared/data-table";

import { createCreditColumns, type CreditItem } from "./credit-columns";

export type { CreditItem };

interface CreditTableProps {
  credits: CreditItem[];
  isLoading?: boolean;
  onDeleteClick: (creditId: number) => void;
}

export function CreditTable({
  credits,
  isLoading = false,
  onDeleteClick,
}: CreditTableProps) {
  const columns = React.useMemo(
    () => createCreditColumns({ onDelete: onDeleteClick }),
    [onDeleteClick]
  );

  return (
    <DataTable
      columns={columns}
      data={credits}
      isLoading={isLoading}
      emptyMessage="Aucun crédit pour les filtres sélectionnés."
    />
  );
}
