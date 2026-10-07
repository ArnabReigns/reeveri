"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { steps } from "@/lib/content";
import { Pencil } from "./Pencil";
import { EASE } from "./ui";

export function Approach() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.7", "end 0.6"] });
  const progress = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);

  return (
    <section aria-labelledby="approach-title" className="border-y border-line bg-ink-2">
      <div className="gutter mx-auto grid max-w-[110rem] gap-10 py-[clamp(3.6rem,6vw,5.5rem)] lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="approach-title" className="display text-[clamp(2rem,3.6vw,3.1rem)] lg:sticky lg:top-32">
            Strategy first.
            <span className="block text-dim">Creativity second.</span>
            <span className="block">
              Growth{" "}
              <span className="relative inline-block">
                always.
                <Pencil kind="underline" inView delay={0.3} className="-bottom-[0.06em] left-0 h-[0.2em] w-full" strokeWidth={3} />
              </span>
            </span>
          </h2>
        </div>

        <ol ref={listRef} className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute bottom-0 left-[0.45rem] top-0 w-px bg-line md:left-[0.6rem]" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute bottom-0 left-[0.45rem] top-0 w-px origin-top bg-marker md:left-[0.6rem]"
          />
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              className="relative grid grid-cols-[1fr] gap-3 pb-10 pl-10 last:pb-0 md:pl-16"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.05 * i }}
            >
              <span
                aria-hidden="true"
                className="edge absolute left-0 top-[0.9rem] w-[0.9rem] bg-ink-2 py-1 text-center text-rebate md:left-[0.1rem] md:top-[1.2rem] md:w-[1rem]"
              >
                {s.n}
              </span>
              <h3 className="display text-[clamp(1.4rem,2vw,1.8rem)]">
                <span className="sr-only">Step {s.n}: </span>
                {s.title}
              </h3>
              <p className="max-w-md text-dim md:text-lg">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
