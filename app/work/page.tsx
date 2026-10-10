import type { Metadata } from "next";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getFeed } from "@/lib/db";
import { JsonLd, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Work: ad creatives, reels and posters",
  description:
    "Ad creatives, social posts, reels and carousels made by Reeveri, a creative marketing agency in Kolkata. Browse the feed.",
  openGraph: { title: "Work | Reeveri", url: "/work" },
  alternates: { canonical: "/work" },
};
export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const items = await getFeed();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Work", path: "/work" }])} />
      <Navbar />
      <main id="main">
        <section id="top" aria-label="Creative feed" className="gutter pb-[clamp(4.8rem,7.2vw,6.6rem)] pt-24 md:pt-32">
          <h1 className="sr-only">Work</h1>
          <FeedGrid items={items} />
        </section>
      </main>
      <Footer />
    </>
  );
}
