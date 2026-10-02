import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { PointageFormState } from "./attendance-form.types";

const STATUS_LABELS: Record<string, string> = {
  PRESENT: "Présent",
  RETARD: "En retard",
  ABSENT: "Absent",
};

type AttendanceStatusFieldsProps = {
  value: PointageFormState;
  isPending: boolean;
  isEditing: boolean;
  onChange: (patch: Partial<PointageFormState>) => void;
  onCancelEdit: () => void;
  onSubmit: () => void;
};

export function AttendanceStatusFields({
  value,
  isPending,
  isEditing,
  onChange,
  onCancelEdit,
  onSubmit,
}: AttendanceStatusFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="attendance-status">Statut</Label>
        <Select
          value={value.status}
          onValueChange={(next) => onChange({ status: next ?? "PRESENT" })}
        >
          <SelectTrigger id="attendance-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABELS).map(([code, label]) => (
              <SelectItem key={code} value={code}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="attendance-arrival">Heure d’arrivée</Label>
        <Input
          id="attendance-arrival"
          type="time"
          value={value.arrivee}
          onChange={(event) => onChange({ arrivee: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="attendance-departure">Heure de départ</Label>
        <Input
          id="attendance-departure"
          type="time"
          value={value.depart}
          onChange={(event) => onChange({ depart: event.target.value })}
        />
        {isEditing ? (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onCancelEdit}
            disabled={isPending}
          >
            Annuler la modification
          </Button>
        ) : null}
        <Button
          className="w-full"
          onClick={onSubmit}
          disabled={isPending || !value.userId}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isPending
            ? "Enregistrement…"
            : isEditing
              ? "Mettre à jour le pointage"
              : "Pointer"}
        </Button>
      </div>
    </>
  );
}
