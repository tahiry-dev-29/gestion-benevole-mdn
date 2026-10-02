import Link from "next/link";
import type { Role } from "@prisma/client";

import { adminGestionItems, adminNavGroups } from "../admin.data";

export function MobileAdminNavigation({
  role,
  onNavigate,
}: {
  role?: Role;
  onNavigate: () => void;
}) {
  const canSee = (roles?: readonly Role[]) =>
    !roles || (role !== undefined && roles.includes(role));

  return (
    <nav aria-label="Navigation principale" className="space-y-5 p-4">
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase text-muted-foreground">
          Gestion
        </h2>
        {adminGestionItems
          .filter((item) => canSee(item.roles))
          .map((item) => (
            <div key={item.url} className="space-y-1">
              <p className="px-2 text-sm font-medium">{item.title}</p>
              {(item.items ?? [{ title: item.title, url: item.url }])
                .filter((child) => canSee(child.roles))
                .map((child) => (
                  <Link
                    key={child.url}
                    href={child.url}
                    onClick={onNavigate}
                    className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {child.title}
                  </Link>
                ))}
            </div>
          ))}
      </section>
      {adminNavGroups.map((group) => {
        const items = group.items.filter((item) => canSee(item.roles));
        if (items.length === 0) return null;
        return (
          <section key={group.label} className="space-y-1">
            <h2 className="px-2 text-xs font-semibold uppercase text-muted-foreground">
              {group.label}
            </h2>
            {items.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                onClick={onNavigate}
                className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                {item.title}
              </Link>
            ))}
          </section>
        );
      })}
    </nav>
  );
}
