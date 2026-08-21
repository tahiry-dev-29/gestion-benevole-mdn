import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Gestion Bénévole",
  description: "Mon espace bénévole",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}