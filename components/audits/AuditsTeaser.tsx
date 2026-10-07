import Image from "next/image";
import { audits } from "@/lib/audits";
import { FadeUp, SectionHead } from "../ui";

// Homepage entry to the audits. Server component; the shared motion helpers are client components.
export function AuditsTeaser() {
  const audit = audits[0];
  const images = audit.stats[0];

  return (
    <section
      id="audits"
      aria-labelledby="audits-title"
      className="gutter mx-auto max-w-[110rem] pb-[clamp(6rem,12vw,11rem)]"
    >
      <SectionHead
        id="audits-title"
        title="Audits"
        aside={
          <p>
            We redraw brands before they ask. Open one, read what we found, then click through the site we built.
          </p>
        }
      />

      <FadeUp className="mt-16 md:mt-24">
        <a
          href={`/audits/${audit.slug}`}
          data-cursor="view"
          data-cursor-label="Open audit"
          aria-label={`${audit.brand} audit and live concept`}
          className="group grid gap-8 md:grid-cols-12 md:gap-8"
        >
          <div className="md:col-span-7">
            <div className="mb-2 flex items-center justify-between text-rebate">
              <span className="edge">→ Audit {audit.n}</span>
              <span className="edge">Reeveri 400 · {audit.date}</span>
            </div>
            <div className="grid grid-cols-2 gap-[0.625rem]">
              {audit.cover.map((c) => (
                <div key={c.src} className="relative aspect-[4/5] overflow-hidden bg-ink-2">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 50vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end gap-6 md:col-span-5">
            <div>
              <h3 className="display text-[clamp(1.75rem,3vw,2.75rem)] leading-none">{audit.headline.join(" ")}</h3>
              <p className="edge mt-3 text-dim">{audit.category}</p>
              <p className="mt-4 max-w-md text-dim">{audit.summary}</p>
            </div>
            <p className="border-t border-line pt-5">
              <span className="edge text-rebate">{images.label}</span>
              <span className="display mt-1 block text-[clamp(2rem,4vw,3.25rem)]">
                <span className="text-dim line-through decoration-marker decoration-2">{images.before}</span>
                <span aria-hidden="true" className="mx-3 text-rebate">
                  →
                </span>
                <span className="sr-only"> to </span>
                {images.after}
              </span>
            </p>
            <span className="inline-flex items-center gap-2 font-semibold text-paper">
              <span className="border-b border-marker pb-0.5">Open the audit and the live rebuild</span>
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
