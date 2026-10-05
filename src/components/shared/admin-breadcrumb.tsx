import { Fragment } from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface AdminBreadcrumbItem {
  label: string;
  href?: string;
}

export function AdminBreadcrumb({ items }: { items: AdminBreadcrumbItem[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1 || !item.href;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isCurrent || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
