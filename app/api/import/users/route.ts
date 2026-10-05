import { hasExcelAdminAccess } from "@/features/excel/excel.access";
import { importUsers } from "@/features/excel/excel.import";
import { importFromMultipartRequest } from "@/features/excel/excel.import.shared";

export async function POST(request: Request) {
  if (!(await hasExcelAdminAccess()))
    return Response.json({ error: "Accès interdit." }, { status: 403 });
  return importFromMultipartRequest(request, importUsers);
}
