"use client";

import { Calendar, Clock, KeyRound, Shield } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Volunteer } from "../../volunteer.entity";
import { formatDate, formatFullName } from "../labels";

interface VolunteerMetadataCardProps {
  volunteer: Volunteer;
}

export function VolunteerMetadataCard({
  volunteer,
}: VolunteerMetadataCardProps) {
  return (
    <Card className="glass-sm lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Métadonnées & Audit
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="size-3.5" /> Date d&apos;entrée
          </span>
          <p className="text-sm font-medium">
            {formatDate(volunteer.dateEntree)}
          </p>
        </div>
        <div className="grid gap-1">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="size-3.5" /> Compte créé le
          </span>
          <p className="text-sm font-medium">
            {formatDate(volunteer.createdAt)}
          </p>
        </div>
        <div className="grid gap-1">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Shield className="size-3.5" /> Créé par
          </span>
          <p className="text-sm font-medium">
            {volunteer.createdBy ? formatFullName(volunteer.createdBy) : "—"}
          </p>
        </div>
        <div className="grid gap-1">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <KeyRound className="size-3.5" /> ID interne
          </span>
          <p className="text-sm font-mono text-muted-foreground">
            #{volunteer.id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
