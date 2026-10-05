"use client";

import { Filter, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type Props = {
  search: string;
  status: "ALL" | "BROUILLON" | "PUBLIE";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "ALL" | "BROUILLON" | "PUBLIE") => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export function PartageToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onRefresh,
  isRefreshing,
}: Props) {
  return (
    <div className="glass-sm flex w-full min-w-0 flex-col gap-2 rounded-xl p-2 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1 sm:min-w-48 sm:max-w-sm">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher un partage…"
          className="h-9 border-transparent bg-muted/50 pl-8 focus-visible:border-input"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 gap-2">
            <Filter className="size-4" aria-hidden="true" />
            Filtres
            {status !== "ALL" ? (
              <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-xs text-primary">
                1
              </span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Publication</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={status === "ALL"}
            onCheckedChange={() => onStatusChange("ALL")}
          >
            Tous les statuts
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={status === "BROUILLON"}
            onCheckedChange={() => onStatusChange("BROUILLON")}
          >
            Brouillon
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={status === "PUBLIE"}
            onCheckedChange={() => onStatusChange("PUBLIE")}
          >
            Publié
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <Button
            variant="ghost"
            className="h-8 w-full"
            onClick={() => onStatusChange("ALL")}
          >
            Réinitialiser
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        size="icon"
        className="size-9 shrink-0"
        onClick={onRefresh}
        disabled={isRefreshing}
        aria-label="Actualiser les partages"
        title="Actualiser"
      >
        <RefreshCw
          className={isRefreshing ? "size-4 animate-spin" : "size-4"}
          aria-hidden="true"
        />
      </Button>
    </div>
  );
}
