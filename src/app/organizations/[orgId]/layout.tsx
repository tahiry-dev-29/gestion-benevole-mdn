import React from "react";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/60 px-6 py-4">
        <h1 className="text-lg font-bold text-sky-400">Organisation ID: {orgId}</h1>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
