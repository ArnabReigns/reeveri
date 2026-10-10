import { Pencil } from "./Pencil";
import { FadeUp, RiseLines } from "./ui";

export function Intro() {
  return (
    <section
      aria-labelledby="intro-title"
      className="gutter mx-auto max-w-[110rem] py-[clamp(3rem,6vw,5rem)]"
    >
      <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-12 md:items-end md:gap-8 md:pt-14">
        <h2 id="intro-title" className="display text-[clamp(2.1rem,4.4vw,3.6rem)] md:col-span-6">
          <RiseLines
            lines={[
              "Attention is the",
              <span key="c" className="relative inline-block">
                new currency.
                <Pencil kind="underline" inView delay={0.3} className="-bottom-[0.02em] left-0 h-[0.16em] w-full" strokeWidth={3} />
              </span>,
            ]}
          />
        </h2>
        <FadeUp className="space-y-4 md:col-span-5 md:col-start-8">
          <p className="text-lg text-paper md:text-xl">
            Everyone is shouting. Feeds refresh every second. The brands that win are not the loudest; they are the
            ones worth noticing.
          </p>
          <p className="max-w-md text-dim">
            Reeveri is a creative marketing agency in Kolkata. We help brands earn attention through strategy, creative,
            content and distribution, then turn that attention into growth you can see.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
