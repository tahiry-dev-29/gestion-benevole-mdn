import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXTAUTH_URL ?? "https://gestion-benevole-mdn.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const updatedAt = new Date();
  return ["/", "/activites", "/partages", "/temoignages"].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: updatedAt,
    changeFrequency: path === "/" ? "weekly" : "monthly",
  }));
}
