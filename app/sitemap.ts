import type { MetadataRoute } from "next";
import { getAudits } from "@/lib/db";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic"; // audits are added from the admin dashboard

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const audits = await getAudits();
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/audits`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...audits.map((a) => ({ url: `${site.url}/audits/${a.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
