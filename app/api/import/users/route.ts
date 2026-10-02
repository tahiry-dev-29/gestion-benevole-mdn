import { hasExcelAdminAccess } from "@/features/excel/excel.access";
import { importUsers } from "@/features/excel/excel.import";

export async function POST(request: Request) {
  if (!(await hasExcelAdminAccess()))
    return Response.json({ error: "Accès interdit." }, { status: 403 });
  const formData = await request.formData();
  const result = await importUsers(formData.get("file"));
  return Response.json(result, {
    status: result.success || result.imported > 0 ? 200 : 400,
  });
}
