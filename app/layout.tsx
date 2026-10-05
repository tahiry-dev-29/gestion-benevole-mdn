import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono,Open_Sans, Source_Serif_4 } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";

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
        iBMPlexMono.variable
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('app-theme') || localStorage.getItem('admin-theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
