"use client";

import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

type QueryErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export function QueryError({
  message = "Impossible de charger les données.",
  onRetry,
}: QueryErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
    >
      <p className="flex items-center gap-2 text-destructive">
        <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
        {message}
      </p>
      {onRetry ? (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Réessayer
        </Button>
      ) : null}
    </div>
  );
}
