import { redirect } from "next/navigation";

export default function VolunteerRolesPage() {
  redirect("/admin/volunteer-management?tab=roles");
}
