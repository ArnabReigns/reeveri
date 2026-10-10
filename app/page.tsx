import { About } from "@/components/About";
import { Approach } from "@/components/Approach";
import { AuditsTeaser } from "@/components/audits/AuditsTeaser";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { Navbar } from "@/components/Navbar";
import { Services } from "@/components/Services";
import { Why } from "@/components/Why";
import type { Metadata } from "next";
import { faqs } from "@/lib/content";
import { JsonLd } from "@/lib/seo";
import { WorkGlimpse } from "@/components/WorkGlimpse";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export const dynamic = "force-dynamic"; // the audits teaser reads live data

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <Navbar />
      <main id="main">
        <Hero />
        <Intro />
        <Services />
        <AuditsTeaser />
        <WorkGlimpse />
        <Approach />
        <Why />
        <About />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
