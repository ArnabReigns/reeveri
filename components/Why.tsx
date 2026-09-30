"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FrameArt } from "./FrameArt";
import { Pencil } from "./Pencil";
import { FadeUp, RiseLines } from "./ui";

const KEEPER = 11;

function ProofRow() {
  return (
    <FadeUp className="mt-14 md:mt-20">
      <div aria-hidden="true">
        <div className="grid grid-cols-6 gap-x-2 gap-y-3 md:grid-cols-9 xl:grid-cols-18">
          {Array.from({ length: 18 }).map((_, i) => {
            const keeper = i === KEEPER;
            const a = 30 + ((i * 37) % 52);
            const b = 24 + ((i * 53) % 46);
            return (
              <div key={i} className={`relative ${keeper ? "z-10" : ""}`}>
                <div className={`aspect-[4/3] overflow-hidden border ${keeper ? "border-paper bg-paper" : "border-line bg-ink-2"}`}>
                  <span className={`absolute bottom-[22%] left-[12%] h-[7%] ${keeper ? "bg-ink" : "bg-ink-3"}`} style={{ width: `${a}%` }} />
                  <span className={`absolute bottom-[38%] left-[12%] h-[7%] ${keeper ? "bg-ink" : "bg-ink-3"}`} style={{ width: `${b}%` }} />
                  {keeper && <span className="absolute left-[12%] top-[14%] size-[22%] rounded-full bg-ink" />}
                </div>
                {keeper && (
                  <Pencil kind="circle" inView delay={0.5} className="-left-[26%] -top-[46%] h-[190%] w-[152%]" strokeWidth={2.4} />
                )}
              </div>
            );
          })}
        </div>
        <p className="edge mt-4 flex justify-between text-dim">
          <span>Eighteen frames shot</span>
          <span>One worth noticing</span>
        </p>
      </div>
    </FadeUp>
  );
}

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

      <ProofRow />

      <div className="mt-16 grid gap-6 border-t border-line pt-8 md:mt-24 md:grid-cols-12 md:gap-8 md:pt-10">
        <FadeUp className="order-1 md:order-2 md:col-span-9">
          <p className="display text-[clamp(2.25rem,5.2vw,4.75rem)] leading-[1]">
            We don&apos;t{" "}
            <span className="relative inline-block text-dim">
              chase
              <Pencil kind="strike" inView delay={0.2} className="left-[-4%] top-[46%] h-[0.2em] w-[108%]" strokeWidth={3} />
            </span>{" "}
            trends. We understand why they work.
          </p>
        </FadeUp>
        <p aria-hidden="true" className="edge order-2 flex items-center gap-3 text-dim md:order-1 md:col-span-3 md:pt-3">
          <span>→ 19</span>
          <span className="h-px w-8 bg-line-strong" />
          <span>The thesis</span>
        </p>
      </div>

      <div ref={ref} className="mt-28 grid gap-x-8 gap-y-14 border-t border-line pt-14 md:mt-40 md:grid-cols-2">
        <FadeUp>
          <div aria-hidden="true" className="mb-8 aspect-[21/9] border border-line">
            <FrameArt variant="ornament" />
          </div>
          <p className="display text-[clamp(2rem,4vw,3.75rem)] leading-[1]">
            Creative without strategy is{" "}
            <span className="relative inline-block">
              decoration.
              <Pencil kind="underline" inView delay={0.3} className="-bottom-[0.08em] left-0 h-[0.2em] w-full" strokeWidth={3} />
            </span>
          </p>
        </FadeUp>
        <div className="flex flex-col gap-10">
          <FadeUp delay={0.12}>
            <div aria-hidden="true" className="mb-8 aspect-[21/9] border border-line">
              <FrameArt variant="unseen" />
            </div>
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
