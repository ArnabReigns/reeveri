// Structured data (schema.org JSON-LD) shared across pages. Search engines read these to understand who Reeveri
// is, where it is, and how pages relate. Keep every value true: no invented reviews, ratings or clients.
import { services } from "./content";
import { site } from "./site";

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

const sameAs = site.social.map((s) => s.href).filter((h) => h.startsWith("http"));

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "MarketingAgency",
  "@id": ORG_ID,
  name: site.name,
  alternateName: [site.wordmark, "Reeveri Marketing", "Reeveri Creative Marketing Agency"],
  url: site.url,
  logo: `${site.url}/logo.png`,
  image: `${site.url}/opengraph-image`,
  description: site.description,
  slogan: site.tagline,
  email: site.contactEmail,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: "Kolkata" },
    { "@type": "Country", name: "India" },
  ],
  knowsAbout: services.map((s) => s.title),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Marketing services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.description },
    })),
  },
  sameAs,
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": SITE_ID,
  name: site.name,
  alternateName: site.wordmark,
  url: site.url,
  inLanguage: "en-IN",
  publisher: { "@id": ORG_ID },
};

export const orgRef = { "@id": ORG_ID };

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

// Renders one or more JSON-LD blocks. "<" is escaped so content can never close the script tag.
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
