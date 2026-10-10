import type { MetadataRoute } from "next";
import { getAudits } from "@/lib/db";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic"; // audits are added from the admin dashboard

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const audits = await getAudits();
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/work`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/audits`, changeFrequency: "weekly", priority: 0.8 },
    ...audits.map((a) => ({ url: `${site.url}/audits/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
