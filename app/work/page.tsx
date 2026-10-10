import type { Metadata } from "next";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FadeUp } from "@/components/ui";
import { getFeed } from "@/lib/api";

export const metadata: Metadata = {
  title: "Work — Reeveri",
  description: "Ad creatives, posters, reels and carousels from Reeveri.",
  alternates: { canonical: "/work" },
};
export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const items = await getFeed();
  return (
    <>
      <Navbar />
      <main id="main">
        <section id="top" aria-label="Creative feed" className="gutter pb-[clamp(4.8rem,7.2vw,6.6rem)] pt-24 md:pt-32">
          <h1 className="sr-only">Work</h1>
          <FadeUp>
            <FeedGrid items={items} />
          </FadeUp>
        </section>
      </main>
      <Footer />
    </>
  );
}
