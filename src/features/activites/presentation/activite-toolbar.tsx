"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  search: string;
  status: "ALL" | "BROUILLON" | "PUBLIE";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "ALL" | "BROUILLON" | "PUBLIE") => void;
};

export function ActiviteToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher une activité…"
          className="pl-8"
        />
      </div>
      <Select
        value={status}
        onValueChange={(value) => {
          if (value === "ALL" || value === "BROUILLON" || value === "PUBLIE") {
            onStatusChange(value);
          }
        }}
      >
        <SelectTrigger
          className="w-full sm:w-48"
          aria-label="Filtrer par publication"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tous les statuts</SelectItem>
          <SelectItem value="BROUILLON">Brouillon</SelectItem>
          <SelectItem value="PUBLIE">Publié</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
