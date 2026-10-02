import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";

export async function hasExcelAdminAccess() {
  const session = await getServerSession(authOptions);
  return (
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"
  );
}
