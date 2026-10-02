import { redirect } from "next/navigation";

export default function LegacyPresencePage() {
  redirect("/admin/presences");
}
