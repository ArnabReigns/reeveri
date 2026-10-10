import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DemoFrame } from "@/components/audits/DemoFrame";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Pencil } from "@/components/Pencil";
import { FadeUp, MagneticLink, RiseLines, SectionHead } from "@/components/ui";
import { mediaUrl } from "@/lib/api";
import { getAudit } from "@/lib/audits";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/audits/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const audit = await getAudit(slug);
  if (!audit) return {};
  const title = `${audit.brand} audit and rebuild — Reeveri`;
  return {
    title,
    description: audit.summary,
    alternates: { canonical: `/audits/${audit.slug}` },
    openGraph: { title, description: audit.summary, type: "article" },
  };
}

const wrap = "gutter mx-auto max-w-[110rem]";
const sectionPad = "pb-[clamp(3.6rem,6vw,5rem)] pt-[clamp(2.4rem,4vw,3.5rem)]";

export default async function AuditPage(props: PageProps<"/audits/[slug]">) {
  const { slug } = await props.params;
  const audit = await getAudit(slug);
  if (!audit) notFound();

  return (
    <>
      <Navbar />
      <main id="main">
        {/* Header */}
        <section id="top" aria-labelledby="audit-title" className={`${wrap} pb-[clamp(2.63rem,4.5vw,3.75rem)] pt-28 md:pt-36`}>
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="flex flex-col md:col-span-8">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <Link
                  href="/audits"
                  className="edge inline-flex items-center gap-2 text-dim transition-colors duration-300 hover:text-paper"
                >
                  <span aria-hidden="true">←</span> All audits
                </Link>
                <span className="edge text-rebate">Reeveri 400 · Audit {audit.n}</span>
              </div>

              <h1 id="audit-title" className="display mt-10 text-[clamp(2.2rem,4.6vw,3.75rem)]">
                <RiseLines
                  inView={false}
                  lines={[
                    audit.headline[0],
                    <span key="b" className="relative inline-block">
                      {audit.headline[1]}
                      <Pencil kind="underline" delay={0.9} strokeWidth={3} className="-bottom-[0.02em] left-0 h-[0.16em] w-full" />
                    </span>,
                  ]}
                />
              </h1>

              <p className="mt-8 max-w-xl text-[1.125rem] text-paper/90">{audit.lead}</p>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 md:mb-10">
                <MagneticLink href="#demo">Open the live rebuild</MagneticLink>
                <p className="edge max-w-[16rem] text-dim">
                  Independent concept. Not affiliated with or endorsed by {audit.brand}.
                </p>
              </div>

              <dl className="edge mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-5 text-rebate sm:grid-cols-4 md:mt-auto md:pt-6">
                <div>
                  <dt>Brand</dt>
                  <dd className="mt-1.5 text-paper">{audit.brand}</dd>
                </div>
                <div>
                  <dt>Sector</dt>
                  <dd className="mt-1.5 text-paper">{audit.category}</dd>
                </div>
                <div>
                  <dt>Reviewed</dt>
                  <dd className="mt-1.5 text-paper">{audit.date}</dd>
                </div>
                <div>
                  <dt>Rebuilt</dt>
                  <dd className="mt-1.5 text-paper">Home + product page</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col md:col-span-4">
              <div className="mb-2 flex items-center justify-between text-rebate">
                <span className="edge">→ Frame {audit.n}</span>
                <span className="edge">{audit.site}</span>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-[0.625rem]">
                {audit.cover.map((c) => (
                  <div key={c.src} className="relative aspect-[3/4] overflow-hidden bg-ink-2 md:aspect-auto md:min-h-[16rem]">
                    <Image src={mediaUrl(c.src)} unoptimized alt={c.alt} fill priority sizes="(min-width: 768px) 21vw, 48vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* By the numbers */}
        <section aria-labelledby="numbers-title" className={`${wrap} pb-[clamp(3.2rem,4.8vw,4.2rem)]`}>
          <h2 id="numbers-title" className="sr-only">
            The homepage, before and after
          </h2>
          <div className="edge hidden border-b border-line-strong pb-3 text-rebate md:grid md:grid-cols-12">
            <span className="md:col-span-5">What we measured</span>
            <span className="md:col-span-3">Today</span>
            <span className="md:col-span-4">Our concept</span>
          </div>
          <ul>
            {audit.stats.map((s, i) => (
              <li key={s.label} className="grid grid-cols-2 items-baseline gap-x-4 gap-y-1 border-b border-line py-5 md:grid-cols-12 md:py-6">
                <span className="col-span-2 text-dim md:col-span-5">{s.label}</span>
                <span className="relative md:col-span-3">
                  <span className="edge text-rebate md:sr-only">Today</span>
                  <span className="display relative block w-max text-[clamp(1.4rem,2.2vw,1.9rem)] text-dim">
                    {s.before}
                    {i === 0 && (
                      <Pencil kind="circle" inView delay={0.3} strokeWidth={2} className="-inset-x-4 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+2rem)]" />
                    )}
                  </span>
                </span>
                <span className="md:col-span-4">
                  <span className="edge text-rebate md:sr-only">Concept</span>
                  <span className="display block text-[clamp(1.4rem,2.2vw,1.9rem)]">{s.after}</span>
                  {s.note && <span className="edge mt-1 block text-rebate">{s.note}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="edge mt-4 text-rebate">One browser session, {audit.date}. Home page only.</p>
        </section>

        {/* Live demo */}
        <section id="demo" aria-labelledby="demo-title" className={`${wrap} ${sectionPad} border-t border-line`}>
          <SectionHead
            id="demo-title"
            title="Now click around it."
            aside={
              <p>
                The rebuilt home page and product page, running live. It uses the brand’s own products and photos.
                Checkout is the next build.
              </p>
            }
          />
          <FadeUp className="mt-14 md:mt-20">
            <DemoFrame src={audit.demo.src} label={audit.demo.label} />
          </FadeUp>
        </section>

        {/* Findings */}
        <section id="findings" aria-labelledby="findings-title" className={`${wrap} ${sectionPad} border-t border-line`}>
          <SectionHead
            id="findings-title"
            title="What we found"
            aside={<p>Five things we would fix first, in the order they cost the brand.</p>}
          />
          <ol className="mt-14 md:mt-20">
            {audit.findings.map((f) => (
              <li key={f.n} className="border-t border-line py-10 md:py-14">
                <FadeUp className="grid gap-8 lg:grid-cols-12 lg:gap-8">
                  <div className="lg:col-span-4">
                    <span className="edge text-rebate">→ {f.n}</span>
                    <h3 className="display mt-3 text-[clamp(1.4rem,2.2vw,1.9rem)]">{f.title}</h3>
                  </div>
                  <div className="grid gap-8 md:grid-cols-3 lg:col-span-8">
                    <div>
                      <p className="edge mb-3 text-rebate">What we found</p>
                      <p className="text-dim">{f.found}</p>
                    </div>
                    <div>
                      <p className="edge mb-3 text-rebate">Why it matters</p>
                      <p className="text-dim">{f.why}</p>
                    </div>
                    <div>
                      <p className="edge mb-3 text-rebate">What we did</p>
                      <p className="text-paper/90">{f.did}</p>
                    </div>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ol>
        </section>

        {/* Next */}
        <section aria-labelledby="next-title" className={`${wrap} ${sectionPad} border-t border-line`}>
          <SectionHead
            id="next-title"
            title="What comes next"
            aside={<p>This is a first pass. Here is how it becomes the real thing.</p>}
          />
          <ul className="mt-14 md:mt-20">
            {audit.next.map((item, i) => (
              <li key={item.title} className="grid gap-2 border-t border-line py-6 md:grid-cols-12 md:items-baseline md:gap-8">
                <span className="edge text-rebate md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display text-[clamp(1.42rem,2.16vw,2.03rem)] md:col-span-5">{item.title}</h3>
                <p className="text-dim md:col-span-6">{item.line}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Notes */}
        <section aria-labelledby="notes-title" className={`${wrap} pb-[clamp(3.2rem,4.8vw,4.2rem)]`}>
          <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-12">
            <h2 id="notes-title" className="display text-[clamp(1.42rem,2.16vw,2.03rem)] md:col-span-4">
              How to read this
            </h2>
            <ul className="space-y-4 text-dim md:col-span-8">
              {audit.notes.map((n) => (
                <li key={n} className="max-w-2xl">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="audit-cta" className="bg-ink-3">
          <div className={`${wrap} flex flex-col items-start justify-between gap-10 py-[clamp(3.2rem,4.8vw,4.2rem)] md:flex-row md:items-end`}>
            <h2 id="audit-cta" className="display max-w-[16ch] text-[clamp(2rem,3.8vw,3.1rem)]">
              Want yours looked at?
            </h2>
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-xs text-dim">Send us your site. We will tell you what we would change, and show you.</p>
              <div className="flex flex-wrap gap-3">
                <MagneticLink href={site.audit.href}>{site.audit.label}</MagneticLink>
                <MagneticLink href="/audits" variant="ghost" arrow={false}>
                  More audits
                </MagneticLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
