"use client";

import { useState, useTransition } from "react";
import { Clock, Loader2,LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  pointerArriveeAction,
  pointerDepartAction,
} from "../presence.action";

interface PointageButtonProps {
  /** Présence du jour : null = pas encore pointé */
  presenceDuJour: {
    id: number;
    heure_arrivee: string | null;
    heure_depart: string | null;
    statut: string;
  } | null;
}

export function PointageButton({ presenceDuJour }: PointageButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [presence, setPresence] = useState(presenceDuJour);

  const hasArrivee = !!presence?.heure_arrivee;
  const hasDepart = !!presence?.heure_depart;

  const handlePointerArrivee = () => {
    startTransition(async () => {
      const res = await pointerArriveeAction();
      if (res.success && res.data) {
        setPresence(res.data);
        toast.success("Arrivée enregistrée !");
      } else {
        toast.error(res.error ?? "Erreur lors du pointage.");
      }
    });
  };

  const handlePointerDepart = () => {
    startTransition(async () => {
      const res = await pointerDepartAction();
      if (res.success && res.data) {
        setPresence(res.data);
        toast.success("Départ enregistré !");
      } else {
        toast.error(res.error ?? "Erreur lors du pointage.");
      }
    });
  };

  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
        <div className="flex items-center gap-3 flex-1">
          <Clock className="size-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Pointage du jour</p>
            <p className="text-xs text-muted-foreground">
              {!hasArrivee && "Vous n'avez pas encore pointé aujourd'hui."}
              {hasArrivee && !hasDepart && (
                <>
                  Arrivée à{" "}
                  <span className="font-semibold">
                    {presence?.heure_arrivee}
                  </span>
                  {" — En cours"}
                </>
              )}
              {hasArrivee && hasDepart && (
                <>
                  Arrivée{" "}
                  <span className="font-semibold">
                    {presence?.heure_arrivee}
                  </span>
                  {" → Départ "}
                  <span className="font-semibold">
                    {presence?.heure_depart}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!hasArrivee && (
            <Button
              onClick={handlePointerArrivee}
              disabled={isPending}
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogIn className="size-4" />
              )}
              Pointer arrivée
            </Button>
          )}

          {hasArrivee && !hasDepart && (
            <Button
              onClick={handlePointerDepart}
              disabled={isPending}
              variant="secondary"
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              Pointer départ
            </Button>
          )}

          {hasArrivee && hasDepart && (
            <Button variant="outline" disabled className="gap-2">
              <Clock className="size-4" />
              Journée terminée
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
