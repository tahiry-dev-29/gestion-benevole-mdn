"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/features/auth/auth.action";
import {
  type RegisterInput,
  registerSchema,
} from "@/features/auth/auth.schema";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await registerAction(values);

    if (!result.success) {
      if (result.issues && typeof result.issues === "object") {
        const fieldErrors = (
          result.issues as {
            fieldErrors?: Record<string, { message?: string }[]>;
          }
        ).fieldErrors;
        const firstField = (name: string) => fieldErrors?.[name]?.[0]?.message;
        const prenom = firstField("prenom");
        const nom = firstField("nom");
        const email = firstField("email");
        const password = firstField("password");
        const confirm = firstField("confirmPassword");
        if (prenom) setError("prenom", { message: prenom });
        if (nom) setError("nom", { message: nom });
        if (email) setError("email", { message: email });
        if (password) setError("password", { message: password });
        if (confirm) setError("confirmPassword", { message: confirm });
      }
      toast.error(result.error);
      return;
    }

    toast.success("Compte créé ! Vous pouvez maintenant vous connecter.");
    router.push("/admin/login");
  });

  return (
    <div className={className} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Créer un compte bénévole</CardTitle>
          <CardDescription>Inscrivez-vous en tant que bénévole</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form onSubmit={onSubmit} className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  placeholder="Jean"
                  autoComplete="given-name"
                  aria-invalid={!!errors.prenom}
                  {...register("prenom")}
                />
                {errors.prenom ? (
                  <p className="text-xs text-destructive">
                    {errors.prenom.message}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  placeholder="Dupont"
                  autoComplete="family-name"
                  aria-invalid={!!errors.nom}
                  {...register("nom")}
                />
                {errors.nom ? (
                  <p className="text-xs text-destructive">
                    {errors.nom.message}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {isSubmitting ? "Création..." : "S'inscrire"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Déjà un compte ?{" "}
            <a
              href="/admin/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Se connecter
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
