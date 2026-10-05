import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { PageHeader } from "@/features/admin/page-header";
import { listSeatsAction } from "@/features/places/places.action";
import { PlacesManager } from "@/features/places/presentation/places-manager";

// La grille des tables vient de PostgreSQL : pas de prérendu au build,
// sinon la construction échoue si la base n'est pas migrée ou joignable.
export const dynamic = "force-dynamic";

export default async function PlacesPage() {
  const result = await listSeatsAction();
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Tables & Places" },
        ]}
      />
      <PageHeader
        title="Tables et sièges"
        description="Gérez les places disponibles pour le pointage quotidien."
      />
      {result.success ? (
        <PlacesManager initialTables={result.data} />
      ) : (
        <p className="text-sm text-destructive">{result.error}</p>
      )}
    </div>
  );
}
