import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { ActivitesTable } from "@/features/activites/presentation/activites-table";

export default function ActivitesPage() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Activités" },
        ]}
      />
      <ActivitesTable />
    </div>
  );
}
