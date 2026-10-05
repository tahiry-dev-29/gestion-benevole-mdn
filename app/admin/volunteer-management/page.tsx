import { Suspense } from "react";

import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { VolunteerManagementTabs } from "@/features/volunteers/presentation/volunteer-management-tabs";

function VolunteerManagementFallback() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

export default function VolunteerManagementPage() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Bénévoles" },
        ]}
      />
      <Suspense fallback={<VolunteerManagementFallback />}>
        <VolunteerManagementTabs />
      </Suspense>
    </div>
  );
}
