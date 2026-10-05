import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { PartagesTable } from "@/features/partages/presentation/partages-table";

export default function PartagesPage() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Partages" },
        ]}
      />
      <PartagesTable />
    </div>
  );
}
