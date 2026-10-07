import { services } from "@/lib/content";
import { FadeUp, SectionHead } from "./ui";

// A plain, readable list: what we do, in one line each. No hover previews, no expanding rows.
export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="gutter mx-auto max-w-[110rem] pb-[clamp(3.6rem,6vw,5.5rem)] pt-[clamp(1.5rem,3vw,2.5rem)]"
    >
      <SectionHead
        id="services-title"
        title="What we do"
        aside={<p>Five disciplines, one team. Pick one, or let us join them up into something that compounds.</p>}
      />

      <FadeUp className="mt-8 md:mt-12">
        <ul className="border-b border-line">
          {services.map((s) => (
            <li key={s.n} className="grid gap-2 border-t border-line py-5 md:grid-cols-12 md:gap-8 md:py-6">
              <h3 className="display text-[clamp(1.4rem,2.2vw,1.9rem)] md:col-span-5">{s.title}</h3>
              <p className="max-w-xl text-dim md:col-span-6 md:col-start-7">{s.description}</p>
            </li>
          ))}
        </ul>
      </FadeUp>
    </section>
  );
}
