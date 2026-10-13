import type { Metadata } from "next";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { Footer } from "@/components/Footer";
import { getFeed } from "@/lib/db";
import { JsonLd, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Creatives: ad creatives, reels and posters",
  description:
    "Ad creatives, social posts, reels and carousels made by Reeveri, a digital marketing agency. Browse the feed.",
  openGraph: { title: "Creatives | Reeveri", url: "/creatives" },
  alternates: { canonical: "/creatives" },
};
export const dynamic = "force-dynamic";

export default async function CreativesPage() {
  const items = await getFeed();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Creatives", path: "/creatives" }])} />
      <main id="main">
        <section id="top" aria-label="Creative feed" className="gutter pb-[clamp(4.8rem,7.2vw,6.6rem)] pt-24 md:pt-32">
          <h1 className="sr-only">Creatives</h1>
          <FeedGrid items={items} />
        </section>
      </main>
      <Footer />
    </>
  );
}
