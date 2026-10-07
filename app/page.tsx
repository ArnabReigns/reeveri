import { About } from "@/components/About";
import { Approach } from "@/components/Approach";
import { AuditsTeaser } from "@/components/audits/AuditsTeaser";
import { ContentGallery } from "@/components/ContentGallery";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { Navbar } from "@/components/Navbar";
import { Services } from "@/components/Services";
import { Why } from "@/components/Why";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Intro />
        <Services />
        <Work />
        <AuditsTeaser />
        <Approach />
        <Why />
        <ContentGallery />
        <About />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
