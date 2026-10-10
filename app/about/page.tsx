import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Pencil } from "@/components/Pencil";
import { FadeUp, MagneticLink, RiseLines } from "@/components/ui";
import { services, steps } from "@/lib/content";
import { JsonLd, breadcrumbLd, orgRef } from "@/lib/seo";
import { site } from "@/lib/site";
import { getAbout } from "@/lib/db";

export const metadata: Metadata = {
  title: "About us: a creative marketing agency in Kolkata",
  description:
    "Reeveri is a creative marketing agency in Kolkata, India, that puts strategy, creative, content, technology and distribution in one team. Meet the team and see how we work.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About | Reeveri", type: "website", url: "/about" },
};

const wrap = "gutter mx-auto max-w-[110rem]";
const sectionPad = "py-[clamp(2.5rem,4vw,3.5rem)]";

// Compact section heading: title with a one-line note beneath it.
function Head({ id, title, note }: { id: string; title: string; note: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 id={id} className="display text-[clamp(1.5rem,2.4vw,2rem)]">
        {title}
      </h2>
      <p className="max-w-xl text-dim">{note}</p>
    </div>
  );
}


export const dynamic = "force-dynamic"; // content is edited from /admin

export default async function AboutPage() {
  const { hero, story, beliefs, team, cta } = await getAbout();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "About", path: "/about" }]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: `${site.url}/about`,
            about: orgRef,
            mainEntity: team.filter((m) => m.name).map((m) => ({
              "@type": "Person",
              name: m.name,
              ...(m.role ? { jobTitle: m.role } : {}),
              worksFor: orgRef,
            })),
          },
        ]}
      />
      <Navbar />
      <main id="main">
        {/* Hero */}
        <section id="top" aria-labelledby="about-title" className={`${wrap} pb-[clamp(2.5rem,4vw,3.5rem)] pt-28 md:pt-36`}>
          <p className="edge text-rebate">→ About Reeveri</p>
          <h1 id="about-title" className="display mt-4 max-w-[22ch] text-[clamp(2rem,4.6vw,3.6rem)]">
            <RiseLines
              inView={false}
              lines={[
                hero.headline[0],
                <span key="b" className="relative inline-block">
                  {hero.headline[1]}
                  <Pencil kind="underline" delay={0.9} strokeWidth={3} className="-bottom-[0.02em] left-0 h-[0.16em] w-full" />
                </span>,
              ]}
            />
          </h1>
          <p className="mt-6 max-w-xl text-[1.05rem] text-dim">{hero.intro}</p>
          <div className="mt-6">
            <MagneticLink href={site.audit.href}>{site.audit.label}</MagneticLink>
          </div>
        </section>

        {/* Story */}
        <section aria-labelledby="story-title" className={`${wrap} ${sectionPad} border-t border-line`}>
          <div className="grid gap-8 md:grid-cols-12">
            <h2 id="story-title" className="edge text-rebate md:col-span-3">
              Why we exist
            </h2>
            <FadeUp className="space-y-4 md:col-span-7">
              <p className="display text-[clamp(1.25rem,2.1vw,1.7rem)] leading-snug">{story.statement}</p>
              {story.paragraphs.map((p, i) => (
                <p key={i} className="max-w-xl text-dim">
                  {p}
                </p>
              ))}
            </FadeUp>
          </div>
        </section>

        {/* Beliefs */}
        <section aria-labelledby="beliefs-title" className={`${wrap} ${sectionPad} border-t border-line`}>
          <Head id="beliefs-title" title="What we believe" note="Four habits we hold ourselves to." />
          <ol className="mt-8">
            {beliefs.map((b, i) => (
              <li key={b.title} className="border-t border-line py-5 md:py-6">
                <FadeUp className="grid gap-3 md:grid-cols-12 md:items-baseline md:gap-8">
                  <span className="edge text-rebate md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display text-[1.15rem] md:col-span-5">{b.title}</h3>
                  <p className="max-w-xl text-dim md:col-span-6">{b.text}</p>
                </FadeUp>
              </li>
            ))}
          </ol>
        </section>

        {/* Team */}
        <section aria-labelledby="team-title" className={`${wrap} ${sectionPad} border-t border-line`}>
          <Head id="team-title" title="The team" note="The people you will talk to, from the first call to launch day." />
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-8">
            {team.map((m, i) => (
              <li key={m.name} style={{ width: "17.5rem", maxWidth: "100%" }}>
                <FadeUp delay={i * 0.08}>
                  <div className="relative flex aspect-square items-end overflow-hidden bg-ink-2 p-4">
                    {m.photo ? (
                      <Image src={m.photo} alt={m.name} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover object-[center_20%]" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="display select-none text-[clamp(4.5rem,8vw,7rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_var(--color-line-strong)]"
                      >
                        {m.name[0]}
                      </span>
                    )}
                  </div>
                  <h3 className="display mt-3 text-[1.1rem]">{m.name}</h3>
                  {m.role && <p className="edge mt-1 text-rebate">{m.role}</p>}
                  {m.bio && <p className="mt-2 max-w-sm text-[0.95rem] text-dim">{m.bio}</p>}
                </FadeUp>
              </li>
            ))}
          </ul>
        </section>

        {/* What we do */}
        <section aria-labelledby="do-title" className={`${wrap} ${sectionPad} border-t border-line`}>
          <Head id="do-title" title="What we do" note="Five disciplines, one team." />
          <ul className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2 bg-ink p-5">
                <span className="edge text-rebate">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display text-[1.05rem] leading-tight">{s.title}</h3>
                <p className="text-dim">{s.line}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* How we work */}
        <section aria-labelledby="how-title" className={`${wrap} ${sectionPad} border-t border-line`}>
          <Head id="how-title" title="How we work" note="The same five steps on every project, in this order." />
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s) => (
              <li key={s.n} className="border-t border-line-strong pt-4">
                <span className="edge text-marker">{s.n}</span>
                <h3 className="display mt-2 text-[1.1rem]">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] text-dim">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Contact */}
        <section aria-labelledby="about-cta" className="bg-ink-3">
          <div className={`${wrap} flex flex-col items-start justify-between gap-10 py-[clamp(2.5rem,4vw,3.5rem)] md:flex-row md:items-end`}>
            <h2 id="about-cta" className="display max-w-[18ch] text-[clamp(1.6rem,3vw,2.4rem)]">
              {cta.heading}
            </h2>
            <div className="flex flex-col items-start gap-5">
              <p className="max-w-xs text-dim">{cta.text}</p>
              <div className="flex flex-wrap gap-3">
                <MagneticLink href={site.audit.href}>{site.audit.label}</MagneticLink>
                <MagneticLink href={site.contactHref} variant="ghost" arrow={false}>
                  {site.contactEmail}
                </MagneticLink>
              </div>
              <a
                href={site.instagram.href}
                target="_blank"
                rel="noreferrer"
                className="edge text-dim underline decoration-line-strong underline-offset-4 transition-colors hover:text-paper"
              >
                Instagram · @{site.instagram.handle}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
