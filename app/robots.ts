import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXTAUTH_URL ?? "https://gestion-benevole-mdn.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/login", "/forbidden"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
