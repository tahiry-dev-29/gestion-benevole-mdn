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
  onView: (item: ObservationItem) => void;
  onEdit: (item: ObservationItem) => void;
  onDelete: (id: number) => void;
}

export function ObservationTable({
  observations,
  isLoading,
  currentUserId,
  isAdmin,
  onView,
  onEdit,
  onDelete,
}: ObservationTableProps) {
  const columns = React.useMemo(
    () =>
      createObservationColumns({
        currentUserId,
        isAdmin,
        onView,
        onEdit,
        onDelete,
      }),
    [currentUserId, isAdmin, onView, onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={observations}
      isLoading={isLoading}
      hiddenColumnsOnMobile={["auteur"]}
      emptyMessage="Aucune observation pour les filtres sélectionnés."
    />
  );
}
