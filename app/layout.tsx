import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Mono,
  Inter,
  Open_Sans,
  Source_Serif_4,
} from "next/font/google";
import Script from "next/script";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const openSans = Open_Sans({
  subsets: [
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "greek-ext",
    "hebrew",
    "latin",
    "latin-ext",
    "math",
    "symbols",
    "vietnamese",
  ],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
});

const sourceSerif4 = Source_Serif_4({
  subsets: [
    "latin",
    "latin-ext",
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "vietnamese",
  ],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-source-serif-4",
});

const iBMPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Gestion Benevole",
  description: "Gestion des bénévoles et des activités associatives",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gestion Bénévole",
  },
  icons: { icon: "/icons/icon-192x192.png", apple: "/icons/icon-192x192.png" },
};

export const viewport: Viewport = {
  themeColor: "#0284c7",
};

/**
 * Doit rester synchrone et sans dependance : ce script s'execute avant
 * l'hydratation pour poser la classe `dark` sur <html> sans flash.
 */
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("app-theme")||localStorage.getItem("admin-theme");document.documentElement.classList.toggle("dark",t!=="light")}catch(e){document.documentElement.classList.add("dark")}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(
        "h-full antialiased dark",
        openSans.variable,
        sourceSerif4.variable,
        iBMPlexMono.variable,
        "font-sans",
        inter.variable
      )}
      suppressHydrationWarning
    >
      <head>
        {/* Applique le thème avant le premier rendu pour eviter tout flash.
            Passe par `next/script` : un <script> inline ecrit directement dans
            <head> par un RSC n'est pas execute lors du rendu client. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
