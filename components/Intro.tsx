"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Pencil } from "./Pencil";
import { FadeUp } from "./ui";

const statement = ["Attention", "is", "the", "new", "currency."];

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(progress, [start, start + 1 / total], [0.14, 1]);
  const isKey = word === "currency.";
  return (
    <motion.span style={{ opacity }} className="relative mr-[0.22em] inline-block">
      {word}
      {isKey && <Pencil kind="underline" inView delay={0.2} className="-bottom-[0.1em] left-0 h-[0.2em] w-[96%]" strokeWidth={3} />}
    </motion.span>
  );
}

export function Intro() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.35"] });

  return (
    <section aria-labelledby="intro-title" className="gutter mx-auto max-w-[110rem] py-[clamp(7rem,16vw,14rem)]">
      <h2 ref={ref} id="intro-title" className="display max-w-[14ch] text-[clamp(3rem,9vw,8.25rem)]">
        {statement.map((w, i) =>
          reduce ? (
            <span key={w} className="relative mr-[0.22em] inline-block">
              {w}
            </span>
          ) : (
            <Word key={w} word={w} i={i} total={statement.length} progress={scrollYProgress} />
          ),
        )}
      </h2>

      <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
        <FadeUp className="md:col-span-5 md:col-start-6 lg:col-span-4 lg:col-start-7">
          <p className="text-xl leading-[1.45] text-paper md:text-2xl">
            Everyone is shouting. Feeds refresh every second. The brands that win are not the loudest; they are
            the ones worth noticing.
          </p>
        </FadeUp>
        <FadeUp delay={0.1} className="md:col-span-4 md:col-start-6 lg:col-span-3 lg:col-start-11">
          <p className="text-dim">
            Reeveri helps brands earn attention through strategy, creative, content, and distribution, then turns
            that attention into growth you can see.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
