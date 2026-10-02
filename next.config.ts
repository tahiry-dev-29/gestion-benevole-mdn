import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import withPWAInit from "@ducanh2912/next-pwa";

// PWA plugin intentionally skips the dev server; test registration with `build` + `start`.
// `disable` uses the Next build phase (not NODE_ENV): a stray NODE_ENV (env shell, `.env`)
// used to silently disable the service worker during `next build`.
function withPWAForPhase(phase: string) {
  return withPWAInit({
    dest: "public",
    disable: phase === PHASE_DEVELOPMENT_SERVER,
    fallbacks: { document: "/~offline" },
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern:
            /^https?.*\/(activites|partages|temoignages)(?:\/[^/?#]+)?\/?(?:\?.*)?$/,
          handler: "NetworkFirst",
          options: {
            cacheName: "public-pages",
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 },
            networkTimeoutSeconds: 3,
          },
        },
      ],
    },
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Images de profil stockées sur Vercel Blob en production
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
  turbopack: {
    // Enforce project root so Next/Turbopack do not infer a wrong workspace
    // root from stray lockfiles outside the repository (see build warning).
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none'",
          },
        ],
      },
    ];
  },
};

export default (phase: string): NextConfig =>
  withPWAForPhase(phase)(nextConfig);
