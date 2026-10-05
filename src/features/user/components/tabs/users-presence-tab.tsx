import Link from "next/link";
import { ArrowUpRight, CalendarCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UsersPresenceTab() {
  return (
    <Card className="glass-sm">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <CalendarCheck aria-hidden="true" className="size-5" />
          </span>
          <div className="grid gap-1">
            <CardTitle>Pointage des bénévoles</CardTitle>
            <CardDescription>
              Le pointage concerne les bénévoles dont le compte USER a été
              validé.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/admin/presences">
            Ouvrir les présences
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
