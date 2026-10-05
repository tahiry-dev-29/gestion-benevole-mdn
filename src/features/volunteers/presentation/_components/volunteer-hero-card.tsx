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
    <Card className="glass overflow-hidden">
      <div className="h-2 w-full bg-linear-to-r from-primary via-primary/70 to-accent" />
      <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border-2 border-background shadow-md">
            <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
              {getInitials(volunteer.prenom, volunteer.nom)}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">
                {formatFullName(volunteer)}
              </h2>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  volunteer.role === "SUPER_ADMIN" &&
                    "border-primary/30 bg-primary/10 text-primary",
                  volunteer.role === "ADMIN" &&
                    "bg-secondary text-secondary-foreground",
                  volunteer.role === "VOLUNTEER" &&
                    "bg-accent text-accent-foreground"
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
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-muted bg-muted/60 text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isActif ? "bg-primary" : "bg-muted-foreground"
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
