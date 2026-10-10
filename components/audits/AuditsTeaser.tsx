import Image from "next/image";
import { mediaUrl } from "@/lib/api";
import { getAudits } from "@/lib/db";
import { FadeUp, SectionHead } from "../ui";

// Homepage entry to the audits: one image, one stat, one link.
export async function AuditsTeaser() {
  const audit = (await getAudits())[0];
  if (!audit) return null;
  const images = audit.stats[0];

  return (
    <section
      id="audits"
      aria-labelledby="audits-title"
      className="gutter mx-auto max-w-[110rem] pb-[clamp(3.6rem,6vw,5.5rem)] pt-[clamp(1.5rem,3vw,2.5rem)]"
    >
      <SectionHead
        id="audits-title"
        title="Audits"
        aside={<p>We redraw brands before they ask. Open one, read what we found, then click through the site we built.</p>}
      />

      <FadeUp className="mt-8 md:mt-12">
        <a
          href={`/audits/${audit.slug}`}
          data-cursor="view"
          data-cursor-label="Open audit"
          aria-label={`${audit.brand} audit and live concept`}
          className="group grid items-center gap-6 border-y border-line py-6 md:grid-cols-12 md:gap-10 md:py-8"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-ink-2 md:col-span-4">
            <Image
              src={mediaUrl(audit.cover[0].src)}
              unoptimized
              alt={audit.cover[0].alt}
              fill
              sizes="(min-width: 768px) 30vw, 100vw"
              className="object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]"
            />
          </div>

          <div className="md:col-span-5">
            <h3 className="display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-none">{audit.headline.join(" ")}</h3>
            <p className="edge mt-3 text-dim">{audit.category}</p>
            <p className="mt-4 max-w-md text-dim">{audit.summary}</p>
          </div>

          <div className="flex flex-col gap-4 md:col-span-3 md:items-end md:text-right">
            {images && <p>
              <span className="edge text-dim">{images.label}</span>
              <span className="display mt-1 block text-[clamp(1.5rem,2.4vw,2rem)]">
                <span className="text-dim line-through decoration-marker decoration-2">{images.before}</span>
                <span aria-hidden="true" className="mx-2 text-rebate">
                  →
                </span>
                <span className="sr-only"> to </span>
                {images.after}
              </span>
            </p>}
            <span className="inline-flex items-center gap-2 font-semibold text-paper">
              <span className="border-b border-marker pb-0.5">Open the audit</span>
              <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </a>
      </FadeUp>
    </section>
  );
}
