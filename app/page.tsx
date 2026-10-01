import { redirect } from "next/navigation";

export default function HomePage() {
  // Application fermée : la racine n'affiche rien, elle redirige vers le login.
  redirect("/login");
}
