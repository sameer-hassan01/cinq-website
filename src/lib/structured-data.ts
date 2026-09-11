import { brand, contact, founders, seo } from "./content";

/**
 * Organization schema. Every field comes from `content.ts`. `url` and `logo`
 * are only emitted once a real domain is configured, because an absolute URL
 * that does not resolve can invalidate the whole block.
 */
export function organizationSchema() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    description: seo.description,
    email: contact.email,
    telephone: contact.phones.map((p) => `+${p.wa}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Islamabad",
      addressCountry: "PK",
    },
    founder: founders.people.map((m) => ({
      "@type": "Person",
      name: m.name,
      jobTitle: m.role,
      ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
    })),
    ...(site ? { url: site, logo: `${site}/opengraph-image` } : {}),
  };
}
