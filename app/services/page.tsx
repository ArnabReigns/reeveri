import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { FadeUp, MagneticLink, RiseLines } from "@/components/ui";
import { faqs, services, steps } from "@/lib/content";
import { JsonLd, breadcrumbLd, orgRef } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services: social media, content, performance marketing and websites",
  description:
    "Reeveri is a creative marketing agency in Kolkata. We do social media, content and creative, performance marketing, websites and digital experiences, and growth strategy.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Services | Reeveri", type: "website", url: "/services" },
};

const wrap = "gutter mx-auto max-w-[110rem]";

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Services", path: "/services" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Reeveri services",
            itemListElement: services.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Service",
                name: s.title,
                description: `${s.description} Includes: ${s.includes.join("; ")}.`,
                url: `${site.url}/services#${s.slug}`,
                provider: orgRef,
                areaServed: "India",
              },
            })),
          },
        ]}
      />
      <main id="main">
        <section id="top" aria-labelledby="services-page-title" className={`${wrap} pb-[clamp(2rem,3vw,2.75rem)] pt-28 md:pt-36`}>
          <h1 id="services-page-title" className="display max-w-[22ch] text-[clamp(2rem,4.6vw,3.6rem)]">
            <RiseLines inView={false} lines={["Five disciplines,", "one team."]} />
          </h1>
          <p className="mt-6 max-w-xl text-[1.05rem] text-dim">
            Pick one, or let us join them up into something that compounds. Every project is scoped individually, after
            a first conversation.
          </p>
          <nav aria-label="Jump to a service" className="mt-8 flex flex-wrap gap-2">
            {services.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="rounded-full px-4 py-2 text-[0.9rem] text-paper/80 ring-1 ring-inset ring-line-strong transition-colors hover:text-paper hover:ring-paper"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </section>

        <section aria-label="Services in detail" className={`${wrap} border-t border-line`}>
          <ol>
            {services.map((s, i) => (
              <li key={s.slug} id={s.slug} className="scroll-mt-20 border-b border-line last:border-b-0">
                <FadeUp className="grid gap-4 py-6 md:grid-cols-12 md:gap-8 md:py-7">
                  <div className="md:col-span-4">
                    <p className="edge text-rebate">{String(i + 1).padStart(2, "0")}</p>
                    <h2 className="display mt-1 text-[clamp(1.25rem,2vw,1.6rem)]">{s.title}</h2>
                    <p className="mt-1 text-[0.95rem] text-dim">{s.line}</p>
                  </div>
                  <div className="md:col-span-8">
                    <p className="max-w-2xl text-paper/90">{s.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${s.title}: what is included`}>
                      {s.includes.map((item) => (
                        <li key={item} className="rounded-full px-3 py-1 text-[0.85rem] text-dim ring-1 ring-inset ring-line-strong">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 max-w-2xl text-[0.9rem] text-dim">
                      <span className="edge mr-2 text-marker">Good fit if</span>
                      {s.fit}
                    </p>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="process-title" className={`${wrap} border-t border-line py-[clamp(2rem,3.5vw,3rem)]`}>
          <h2 id="process-title" className="display text-[clamp(1.5rem,2.4vw,2rem)]">
            How every project runs
          </h2>
          <p className="mt-2 max-w-xl text-dim">The same five steps, whichever service you start with.</p>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((st, i) => (
              <li key={st.n} className="border-t border-line-strong pt-4">
                <p className="display text-[1.1rem]">
                  <span className="mr-2 text-marker">{i + 1}</span>
                  {st.title}
                </p>
                <p className="mt-2 text-[0.95rem] text-dim">{st.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="faq-title" className={`${wrap} border-t border-line py-[clamp(2rem,3.5vw,3rem)]`}>
          <h2 id="faq-title" className="display text-[clamp(1.5rem,2.4vw,2rem)]">
            Questions we get asked
          </h2>
          <dl className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-3">
            {faqs.slice(-3).map((f) => (
              <div key={f.q}>
                <dt className="display text-[1.1rem]">{f.q}</dt>
                <dd className="mt-2 max-w-md text-[0.95rem] text-dim">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="services-cta" className="bg-ink-3">
          <div className={`${wrap} flex flex-col items-start justify-between gap-8 py-[clamp(2.5rem,4vw,3.5rem)] md:flex-row md:items-end`}>
            <h2 id="services-cta" className="display max-w-[18ch] text-[clamp(1.6rem,3vw,2.4rem)]">
              Not sure where to start?
            </h2>
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-xs text-dim">Send us your site. We will tell you what we would change, and show you.</p>
              <div className="flex flex-wrap gap-3">
                <MagneticLink href={site.audit.href}>{site.audit.label}</MagneticLink>
                <MagneticLink href={site.contactHref} variant="ghost" arrow={false}>
                  {site.contactEmail}
                </MagneticLink>
              </div>
            </div>
          </div>
        </section>
        <p className="gutter mx-auto max-w-[110rem] pb-6 text-[0.8rem] text-rebate">Photography from Unsplash.</p>
      </main>
      <Footer />
    </>
  );
}
