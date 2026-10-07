import { Fragment } from "react";
import { Pencil } from "./Pencil";
import { FadeUp, RiseLines } from "./ui";

// The thesis, said once. No proof row, no art panels, no second and third statements.
export function Why() {
  return (
    <section
      aria-labelledby="why-title"
      className="gutter mx-auto max-w-[110rem] py-[clamp(3.6rem,7vw,6rem)]"
    >
      <h2 id="why-title" className="display max-w-[20ch] text-[clamp(2.1rem,4.6vw,3.8rem)] leading-[1]">
        <RiseLines
          lines={[
            <Fragment key="a">
              Creative without strategy is{" "}
              <span key="d" className="relative inline-block">
                decoration.
                <Pencil kind="underline" inView delay={0.3} className="-bottom-[0.02em] left-0 h-[0.16em] w-full" strokeWidth={3} />
              </span>
            </Fragment>,
            "Strategy without creativity is invisible.",
          ]}
        />
      </h2>

      <FadeUp className="mt-8 grid gap-4 md:mt-12 md:grid-cols-12 md:gap-8">
        <p className="text-lg text-paper md:col-span-5 md:col-start-8 md:text-xl">
          We don&apos;t chase trends. We understand why they work.
        </p>
        <p className="max-w-md text-dim md:col-span-5 md:col-start-8">
          So we never do one without the other. Every idea is built on a reason, and every strategy is made to be
          seen.
        </p>
      </FadeUp>
    </section>
  );
}
