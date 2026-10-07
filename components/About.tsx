import { FadeUp, RiseLines } from "./ui";

const ingredients = ["Strategy", "Creativity", "Technology", "Content", "Distribution"];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="gutter mx-auto max-w-[110rem] py-[clamp(3.6rem,6vw,5.5rem)]"
    >
      <h2 id="about-title" className="display max-w-[22ch] text-[clamp(2.1rem,4.4vw,3.6rem)]">
        <RiseLines lines={["Reeveri is built for", "brands that want to matter."]} />
      </h2>

      <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-12 md:gap-8">
        <FadeUp className="space-y-5 text-lg md:col-span-6">
          <p>
            Good marketing used to be one thing done well. Now it takes five things done together, and most brands end
            up juggling them separately.
          </p>
          <p className="text-dim">
            We put them in the same room, so the idea, the making, and the getting-it-seen never lose track of each
            other. We would rather be useful than loud, curious than certain, and honest about what&apos;s working.
          </p>
        </FadeUp>

        <FadeUp delay={0.1} className="md:col-span-5 md:col-start-8">
          <ul className="border-b border-line">
            {ingredients.map((word) => (
              <li key={word} className="border-t border-line py-3">
                <span className="display text-[clamp(1.25rem,1.8vw,1.55rem)]">{word}</span>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}
