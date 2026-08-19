import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Package className="size-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Gestion Bénévole
          </CardTitle>
          <CardDescription className="text-base">
            Gérez vos bénévoles et vos activités associatives en toute
            simplicité.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <Button className="w-full" nativeButton={false} render={<Link href="/admin" />}>
            Accéder à l'espace administration
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
