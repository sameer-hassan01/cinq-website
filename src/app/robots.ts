import type { MetadataRoute } from "next";

/** Only advertises the sitemap once a real domain is configured. A robots
    file pointing crawlers at localhost is worse than one that says nothing. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(site ? { sitemap: `${site}/sitemap.xml` } : {}),
  };
}
