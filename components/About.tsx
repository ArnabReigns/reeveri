import { Pencil } from "./Pencil";
import { FadeUp, RiseLines } from "./ui";

const ingredients = ["Strategy", "Creativity", "Technology", "Content", "Distribution"];

// TODO(owner): replace with real team members (name, role, portrait).
const team = Array.from({ length: 4 }, (_, i) => ({ id: `team-${i + 1}`, frame: String(40 + i) }));

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="gutter mx-auto max-w-[110rem] py-[clamp(6rem,12vw,11rem)]">
      <h2 id="about-title" className="display text-[clamp(2.75rem,7vw,6.5rem)]">
        <RiseLines lines={["Reeveri is built for", "brands that want", "to matter."]} />
      </h2>

      <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
        <FadeUp className="space-y-6 text-lg md:col-span-5 md:text-xl">
          <p>
            Good marketing used to be one thing done well. Now it takes five things done together, and most brands
            end up juggling them separately.
          </p>
          <p className="text-dim">
            We put them in the same room, so the idea, the making, and the getting-it-seen never lose track of each
            other. We would rather be useful than loud, curious than certain, and honest about what&apos;s working.
          </p>
        </FadeUp>

        <FadeUp delay={0.1} className="md:col-span-6 md:col-start-7">
          <div className="relative border-y border-line bg-ink-2 px-9 md:px-12">
            <span aria-hidden="true" className="sprockets-v absolute inset-y-0 left-2.5 w-3 md:left-4" />
            <span aria-hidden="true" className="sprockets-v absolute inset-y-0 right-2.5 w-3 md:right-4" />
          <ul>
            {ingredients.map((word, i) => (
              <li key={word} className="flex items-baseline justify-between border-b border-line py-4 last:border-b-0 md:py-5">
                <span className="relative display text-[clamp(1.75rem,3.2vw,3rem)]">
                  {word}
                  <Pencil kind="tick" inView delay={0.15 + i * 0.12} duration={0.4} className="-right-[1.4em] top-[0.05em] size-[0.8em]" strokeWidth={3} />
                </span>
                <span className="edge text-dim">→ {31 + i}</span>
              </li>
            ))}
          </ul>
          </div>
          <p className="edge mt-3 text-dim">Five frames, one roll.</p>
        </FadeUp>
      </div>

      <div className="mt-24 md:mt-32">
        <div className="flex flex-col gap-2 border-b border-line pb-4 md:flex-row md:items-baseline md:justify-between md:gap-6">
          <h3 className="display text-2xl md:text-3xl">The people</h3>
          <p className="edge text-dim">Placeholder · add team portraits, names, and roles</p>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {team.map((m) => (
            <li key={m.id}>
              <div className="relative aspect-[4/5] border border-dashed border-line-strong bg-ink-2">
                <span className="edge absolute left-3 top-3 text-rebate">→ {m.frame}</span>
                <span className="absolute inset-x-3 bottom-3 text-sm text-dim">Portrait</span>
              </div>
              <p className="mt-3 text-[0.95rem]">Name</p>
              <p className="edge mt-1 text-dim">Role</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
