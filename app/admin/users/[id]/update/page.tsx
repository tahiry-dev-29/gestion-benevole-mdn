import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getUserDetailsAction } from "@/features/user/user.action";

import { UserUpdateForm } from "./_components/user-update-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserUpdatePage({ params }: Props) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) notFound();

  const result = await getUserDetailsAction(userId);
  if (!result.success || !result.data) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/users/${userId}`}>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-100">
            Modifier {result.data.prenom} {result.data.nom}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Compte utilisateur</p>
        </div>
      </div>

      <UserUpdateForm userId={userId} initialData={result.data} />
    </div>
  );
}
