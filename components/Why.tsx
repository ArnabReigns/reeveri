"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Pencil } from "./Pencil";
import { FadeUp, RiseLines } from "./ui";

export function Why() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.86, 1]);
  const invisible = useTransform(scrollYProgress, [0.5, 1], [1, reduce ? 1 : 0.22]);

  return (
    <section aria-labelledby="why-title" className="gutter mx-auto max-w-[110rem] pb-[clamp(3rem,6vw,5rem)] pt-[clamp(7rem,16vw,14rem)]">
      <h2 id="why-title" className="sr-only">
        Why Reeveri
      </h2>

      <motion.p
        style={{ scale }}
        className="display origin-left text-[clamp(3.25rem,11vw,10.5rem)] leading-[0.86]"
      >
        <RiseLines lines={["No noise.", "Just ideas", "worth noticing."]} />
      </motion.p>

      <div className="mt-28 grid gap-6 md:mt-40 md:grid-cols-12">
        <FadeUp className="md:col-span-7 md:col-start-6">
          <p className="display text-[clamp(2rem,4.4vw,4rem)] leading-[1]">
            We don&apos;t{" "}
            <span className="relative inline-block text-dim">
              chase
              <Pencil kind="strike" inView delay={0.35} className="left-[-4%] top-[46%] h-[0.2em] w-[108%]" strokeWidth={3} />
            </span>{" "}
            trends. We understand why they work.
          </p>
        </FadeUp>
      </div>

      <div ref={ref} className="mt-28 grid gap-x-8 gap-y-14 border-t border-line pt-14 md:mt-40 md:grid-cols-2">
        <FadeUp>
          <p className="display text-[clamp(2rem,4vw,3.75rem)] leading-[1]">
            Creative without strategy is{" "}
            <span className="relative inline-block">
              decoration.
              <Pencil kind="underline" inView delay={0.3} className="-bottom-[0.08em] left-0 h-[0.2em] w-full" strokeWidth={3} />
            </span>
          </p>
        </FadeUp>
        <div className="flex flex-col gap-12">
          <FadeUp delay={0.12}>
            <p className="display text-[clamp(2rem,4vw,3.75rem)] leading-[1]">
              Strategy without creativity is <motion.span style={{ opacity: invisible }}>invisible.</motion.span>
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="max-w-sm text-lg text-dim">
              So we never do one without the other. Every idea is built on a reason, and every strategy is made to be
              seen.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
