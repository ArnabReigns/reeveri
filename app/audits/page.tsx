import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FadeUp, MagneticLink, RiseLines } from "@/components/ui";
import { mediaUrl } from "@/lib/api";
import { getAudits } from "@/lib/db";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Audits — Reeveri",
  description:
    "Independent teardowns of brand websites, with a working rebuild you can click through. See what we would change and why.",
  alternates: { canonical: "/audits" },
};

export const dynamic = "force-dynamic";

export default async function AuditsPage() {
  const audits = await getAudits();
  return (
    <>
      <Navbar />
      <main id="main">
        <section id="top" className="gutter mx-auto max-w-[110rem] pb-[clamp(3.2rem,4.8vw,4.2rem)] pt-32 md:pt-44">
          <h1 className="display text-[clamp(2.4rem,5.2vw,4rem)]">
            <RiseLines lines={["Audits."]} inView={false} />
          </h1>
          <p className="mt-5 max-w-2xl text-[1.125rem] text-dim">
              We pick a brand we admire, find what is holding its site back, then build the version we would
              have made. Every audit comes with a working front end you can open and use.
            </p>
        </section>

        <section aria-label="All audits" className="gutter mx-auto max-w-[110rem] pb-[clamp(4.8rem,7.2vw,6.6rem)]">
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-12">
            {audits.map((a) => (
              <FadeUp key={a.slug} className="md:col-span-6">
                <Link
                  href={`/audits/${a.slug}`}
                  data-cursor="view"
                  data-cursor-label="Open audit"
                  aria-label={`${a.brand} audit`}
                  className="group block"
                >
                  <div className="mb-2 flex items-center justify-between text-rebate">
                    <span className="edge">→ Audit {a.n}</span>
                    <span className="edge">Reeveri 400 · {a.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-[0.625rem]">
                    {a.cover.map((c) => (
                      <div key={c.src} className="relative aspect-[3/4] overflow-hidden bg-ink-2">
                        <Image
                          src={mediaUrl(c.src)}
                          alt={c.alt}
                          fill
                          sizes="(min-width: 768px) 30vw, 50vw"
                          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-5">
                    <span className="display text-[clamp(1.42rem,2.16vw,2.03rem)] text-rebate">{a.n}</span>
                    <div>
                      <h2 className="display text-[clamp(1.4rem,2.2vw,1.9rem)] leading-none">{a.headline.join(" ")}</h2>
                      <p className="edge mt-3 text-dim">{a.category}</p>
                      <p className="mt-4 max-w-md text-dim">{a.summary}</p>
                      <p className="mt-5 inline-flex items-center gap-2 font-semibold">
                        <span className="border-b border-marker pb-0.5">Read the audit, open the rebuild</span>
                        <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                          →
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}

            <FadeUp className="md:col-span-4 md:col-start-9">
              <div className="flex aspect-square flex-col justify-between border border-line-strong p-6 md:p-8">
                <p className="edge text-rebate">→ Audit {String(audits.length + 1).padStart(2, "0")} · Open frame</p>
                <div>
                  <p className="display text-[clamp(1.4rem,2.2vw,1.9rem)] leading-none">Your brand could be next.</p>
                  <p className="mt-4 max-w-xs text-dim">
                    Send us your site. We will tell you what we would change, and show you.
                  </p>
                  <MagneticLink href={site.audit.href} className="mt-8">
                    {site.audit.label}
                  </MagneticLink>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
