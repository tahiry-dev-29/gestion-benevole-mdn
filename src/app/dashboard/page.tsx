import React from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardContent } from "./dashboard-content";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <DashboardHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <DashboardContent />
      </main>
    </div>
  );
}
