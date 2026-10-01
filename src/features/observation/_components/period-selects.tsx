"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  MOIS_LABELS,
  MONTHS,
  YEARS,
} from "../observation.constants";

interface PeriodSelectsProps {
  onMoisChange: (mois: number) => void;
  onAnneeChange: (annee: number) => void;
}

export function PeriodSelects({
  onMoisChange,
  onAnneeChange,
}: PeriodSelectsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label>Mois</Label>
        <Select
          defaultValue={String(CURRENT_MONTH)}
          onValueChange={(val) => {
            if (typeof val === "string") {
              onMoisChange(parseInt(val, 10));
            }
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m} value={String(m)}>
                {MOIS_LABELS[m]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label>Année</Label>
        <Select
          defaultValue={String(CURRENT_YEAR)}
          onValueChange={(val) => {
            if (typeof val === "string") {
              onAnneeChange(parseInt(val, 10));
            }
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
