"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { Role } from "@prisma/client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { VOLUNTEER_ROLES } from "../../volunteer.schema";
import { roleLabel, statutLabel } from "../labels";

import type { VolunteerFormValues } from "./volunteer-form-schema";

interface VolunteerFieldsProps {
  register: UseFormRegister<VolunteerFormValues>;
  control: Control<VolunteerFormValues>;
  errors: FieldErrors<VolunteerFormValues>;
  isEdit: boolean;
  allowed: Role[];
  actorRole: Role | undefined;
}

export function VolunteerFields({
  register,
  control,
  errors,
  isEdit,
  allowed,
  actorRole,
}: VolunteerFieldsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input
            id="prenom"
            {...register("prenom")}
            aria-invalid={!!errors.prenom}
          />
          {errors.prenom ? (
            <p className="text-xs text-destructive">{errors.prenom.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" {...register("nom")} aria-invalid={!!errors.nom} />
          {errors.nom ? (
            <p className="text-xs text-destructive">{errors.nom.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email ? (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">
          Mot de passe{isEdit ? " (laisser vide pour ne pas changer)" : ""}
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password ? (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Rôle</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-label="Rôle">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {VOLUNTEER_ROLES.map((role) => {
                  const canPick = allowed.includes(role);
                  return (
                    <SelectItem key={role} value={role} disabled={!canPick}>
                      {roleLabel(role)}
                      {canPick ? "" : " (non autorisé)"}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role ? (
          <p className="text-xs text-destructive">{errors.role.message}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {actorRole
            ? `Un compte ${roleLabel(actorRole)} peut créer : ${
                allowed.length
                  ? allowed.map((role) => roleLabel(role)).join(", ")
                  : "aucun rôle"
              }.`
            : "Chargement des permissions…"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="dateEntree">Date d&apos;entrée</Label>
          <Input id="dateEntree" type="date" {...register("dateEntree")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Statut</Label>
          <Controller
            control={control}
            name="statut"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Statut">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIF">{statutLabel("ACTIF")}</SelectItem>
                  <SelectItem value="INACTIF">
                    {statutLabel("INACTIF")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </>
  );
}
