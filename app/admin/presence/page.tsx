import { redirect } from "next/navigation";

export default function PresenceRedirectPage() {
  redirect("/admin/presences");
}
