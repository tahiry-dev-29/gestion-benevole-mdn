import Link from "next/link";
import {
  CalendarDays,
  Eye,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Volunteer } from "../../volunteer.entity";
import { formatDate, formatFullName, roleLabel, statutLabel } from "../labels";

export function VolunteerMobileCard({
  volunteer,
  onDelete,
}: {
  volunteer: Volunteer;
  onDelete: (volunteer: Volunteer) => void;
}) {
  const name = formatFullName(volunteer);
  const initials = `${volunteer.prenom.charAt(0)}${volunteer.nom.charAt(0)}`;

  return (
    <article className="glass-sm grid min-w-0 gap-4 rounded-xl p-4">
      <div className="flex min-w-0 items-start gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {initials.toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-foreground">{name}</h3>
          <a
            href={`mailto:${volunteer.email}`}
            className="mt-1 flex min-h-8 min-w-0 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Mail aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{volunteer.email}</span>
          </a>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-10 shrink-0"
              aria-label={`Actions pour ${name}`}
            >
              <MoreHorizontal aria-hidden="true" className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/volunteer-management/${volunteer.id}`}>
                <Eye aria-hidden="true" />
                Voir la fiche
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/volunteer-management/${volunteer.id}#modifier`}
              >
                <Pencil aria-hidden="true" />
                Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => onDelete(volunteer)}
            >
              <Trash2 aria-hidden="true" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{roleLabel(volunteer.role)}</Badge>
        <Badge variant={volunteer.statut === "ACTIF" ? "outline" : "secondary"}>
          {statutLabel(volunteer.statut)}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-sm">
        <p className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-4" />
          Entrée le {formatDate(volunteer.dateEntree)}
        </p>
        <Link
          href={`/admin/volunteer-management/${volunteer.id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 font-medium text-primary hover:bg-accent hover:text-accent-foreground"
        >
          Voir la fiche
          <Eye aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}
