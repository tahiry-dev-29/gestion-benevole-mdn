import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SeatGrid } from "@/features/places/places.schema";

import type { PointageFormState } from "./attendance-form.types";
import { AttendancePlaceFields } from "./attendance-place-fields";
import { AttendanceStatusFields } from "./attendance-status-fields";

export type { PointageFormState } from "./attendance-form.types";

type AttendanceFormProps = {
  volunteers: { id: number; nom: string; prenom: string }[];
  tables: SeatGrid[];
  busySeatIds: Set<number>;
  value: PointageFormState;
  isPending: boolean;
  isEditing: boolean;
  onChange: (patch: Partial<PointageFormState>) => void;
  onCancelEdit: () => void;
  onSubmit: () => void;
};

export function AttendanceForm({
  volunteers,
  tables,
  busySeatIds,
  value,
  isPending,
  isEditing,
  onChange,
  onCancelEdit,
  onSubmit,
}: AttendanceFormProps) {
  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">
          {isEditing ? "Modifier le pointage" : "Nouveau pointage"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choisissez la personne, puis sa place pour la journée.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <AttendancePlaceFields
          volunteers={volunteers}
          tables={tables}
          busySeatIds={busySeatIds}
          value={value}
          onChange={onChange}
        />
        <AttendanceStatusFields
          value={value}
          isPending={isPending}
          isEditing={isEditing}
          onChange={onChange}
          onCancelEdit={onCancelEdit}
          onSubmit={onSubmit}
        />
        {!volunteers.length ? (
          <p className="text-sm text-muted-foreground sm:col-span-2 xl:col-span-6">
            Aucun bénévole actif à pointer.
          </p>
        ) : null}
        {!tables.length ? (
          <p className="text-sm text-muted-foreground sm:col-span-2 xl:col-span-6">
            Aucune place disponible. Créez d’abord une table dans « Tables et
            sièges ».
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
