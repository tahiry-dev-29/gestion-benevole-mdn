import { redirect } from "next/navigation";

export default function LegacyVolunteersPage() {
  redirect("/admin/volunteer-management");
}
