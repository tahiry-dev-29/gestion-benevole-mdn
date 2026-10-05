"use client";

import * as React from "react";

import { DataTable } from "@/components/shared/data-table";
import type { ObservationItem } from "@/features/observation/observation-queries.action";

import { createObservationColumns } from "./observation-columns";

interface ObservationTableProps {
  observations: ObservationItem[];
  isLoading: boolean;
  currentUserId: number;
  isAdmin: boolean;
  onEdit: (item: ObservationItem) => void;
  onDelete: (id: number) => void;
}

export function ObservationTable({
  observations,
  isLoading,
  currentUserId,
  isAdmin,
  onEdit,
  onDelete,
}: ObservationTableProps) {
  const columns = React.useMemo(
    () =>
      createObservationColumns({
        currentUserId,
        isAdmin,
        onEdit,
        onDelete,
      }),
    [currentUserId, isAdmin, onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={observations}
      isLoading={isLoading}
      emptyMessage="Aucune observation pour les filtres sélectionnés."
    />
  );
}
