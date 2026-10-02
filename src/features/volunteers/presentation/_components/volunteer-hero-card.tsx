"use client";

import { Loader2, Mail, Shield, UserCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { Volunteer } from "../../volunteer.entity";
import { formatFullName, roleLabel, statutLabel } from "../labels";

interface VolunteerHeroCardProps {
  volunteer: Volunteer;
  canManage: boolean;
  isPending: boolean;
  onToggleStatut: () => void;
}

function getInitials(prenom: string, nom: string): string {
  const first = prenom?.trim().charAt(0) ?? "";
  const last = nom?.trim().charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "U";
}

export function VolunteerHeroCard({
  volunteer,
  canManage,
  isPending,
  onToggleStatut,
}: VolunteerHeroCardProps) {
  const isActif = volunteer.statut === "ACTIF";

  return (
    <Card className="overflow-hidden border shadow-xs">
      <div className="h-2 w-full bg-linear-to-r from-primary via-indigo-500 to-teal-500" />
      <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border-2 border-background shadow-md">
            <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
              {getInitials(volunteer.prenom, volunteer.nom)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">
                {formatFullName(volunteer)}
              </h2>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  volunteer.role === "SUPER_ADMIN" &&
                    "border-purple-300 bg-purple-500/10 text-purple-700 dark:border-purple-800 dark:text-purple-300",
                  volunteer.role === "ADMIN" &&
                    "border-blue-300 bg-blue-500/10 text-blue-700 dark:border-blue-800 dark:text-blue-300",
                  volunteer.role === "VOLUNTEER" &&
                    "border-teal-300 bg-teal-500/10 text-teal-700 dark:border-teal-800 dark:text-teal-300"
                )}
              >
                <Shield className="mr-1 size-3" />
                {roleLabel(volunteer.role)}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 font-medium",
                  isActif
                    ? "border-emerald-300 bg-emerald-500/10 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                    : "border-muted bg-muted/60 text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isActif ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                  )}
                />
                {statutLabel(volunteer.statut)}
              </Badge>
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="size-3.5" />
              <a href={`mailto:${volunteer.email}`} className="hover:underline">
                {volunteer.email}
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isActif ? "outline" : "default"}
            size="sm"
            className="gap-2 shadow-xs"
            disabled={!canManage || isPending}
            onClick={onToggleStatut}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserCheck className="size-4" />
            )}
            {isActif ? "Désactiver le compte" : "Activer le compte"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
