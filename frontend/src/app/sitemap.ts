import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-albert-sama.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["/", "/projets", "/competences", "/parcours", "/contact"].map((path) => ({ url: `${siteUrl}${path}`, lastModified: now, changeFrequency: path === "/" ? "weekly" : "monthly", priority: path === "/" ? 1 : 0.7 }));
}
