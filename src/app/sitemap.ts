import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) return [];
  return [{ url: `${site}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
