"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

/**
 * Bouton de connexion SSO via Auth0.
 * Auth0 héberge sa propre page de connexion : c'est sur cette page que les
 * boutons Google / GitHub apparaissent (configurés en "Connections" dans le
 * dashboard Auth0). Ce bouton redirige simplement vers Auth0.
 */
export function OAuthButtons({
  enabled,
  callbackUrl = "/admin",
}: {
  enabled: boolean;
  callbackUrl?: string;
}) {
  if (!enabled) return null;

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signIn("auth0", { callbackUrl })}
      >
        <img
          src="/brands/auth0.svg"
          alt="Auth0"
          aria-hidden="true"
          className="size-4"
        />
        Continuer avec Auth0
      </Button>
    </div>
  );
}