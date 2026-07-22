import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrgPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-slate-900 border-slate-800 text-white">
        <CardHeader>
          <CardTitle>Espace Multi-tenant : {orgId}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">
            Bienvenue dans l&apos;espace dédié à l&apos;organisation{" "}
            <strong className="text-sky-400">{orgId}</strong>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
