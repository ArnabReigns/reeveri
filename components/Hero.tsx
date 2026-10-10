"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { FrameArt, type FrameArtVariant } from "./FrameArt";
import { HeroBackdrop } from "./HeroBackdrop";
import { Pencil } from "./Pencil";
import { EASE, MagneticLink } from "./ui";

// One small contact sheet: six frames, one keeper. Static and quiet; it carries the brand idea
// without filling the page.
const SHEET: { art: FrameArtVariant; frame: string }[] = [
  { art: "letter", frame: "01" },
  { art: "grid", frame: "02" },
  { art: "split", frame: "03" },
  { art: "browser", frame: "04" },
  { art: "focus", frame: "05" },
  { art: "halftone", frame: "06" },
];
const KEEPER = 4;

function Sheet() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="w-full max-w-[30rem] lg:justify-self-end">
      <div className="grid grid-cols-3 gap-[0.625rem]">
        {SHEET.map((f, i) => (
          <motion.div
            key={f.frame}
            className="relative"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 + i * 0.07 }}
          >
            <div className="aspect-[4/5] overflow-hidden border border-line bg-ink-2">
              <FrameArt variant={f.art} />
            </div>
            <span className="edge mt-1.5 block text-rebate">→ {f.frame}</span>
            {i === KEEPER && (
              <Pencil
                kind="circle"
                className="-left-[14%] -top-[10%] h-[104%] w-[128%]"
                delay={1.5}
                duration={0.9}
                strokeWidth={2.2}
              />
            )}
          </motion.div>
        ))}
      </div>
      <p className="edge mt-3 flex justify-between border-t border-line pt-2 text-rebate">
        <span>Reeveri 400 · Roll 01</span>
        <span>One worth keeping</span>
      </p>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (i: number) => ({
    initial: reduce ? { y: "0%" } : { y: "108%" },
    animate: { y: "0%" },
    transition: { duration: 1, ease: EASE, delay: 0.2 + i * 0.1 },
  });

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[min(44rem,86dvh)] flex-col justify-center pb-[clamp(3rem,6dvh,4.5rem)] pt-[clamp(6.5rem,12dvh,9rem)]"
    >
      <HeroBackdrop />
      <div className="gutter mx-auto grid w-full max-w-[110rem] items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h1 id="hero-title" className="display text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[0.92]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block" {...rise(0)}>
                We make brands
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block" {...rise(1)}>
                impossible to
              </motion.span>
            </span>
            <span className="relative inline-block">
              <span className="block overflow-hidden pb-[0.1em] pt-[0.04em]">
                <motion.span className="block" {...rise(2)}>
                  ignore.
                </motion.span>
              </span>
              <Pencil
                kind="circle"
                className="-left-[9%] -top-[10%] h-[126%] w-[116%]"
                delay={1.1}
                duration={0.95}
                strokeWidth={2.4}
              />
            </span>
          </h1>

          <motion.div
            className="mt-8 md:mt-10"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
          >
            <p className="max-w-lg text-lg text-dim md:text-xl">{site.heroLine}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <MagneticLink href="#book-audit">{site.audit.label}</MagneticLink>
              <MagneticLink href="#audits" variant="ghost" arrow={false}>
                See our audits
              </MagneticLink>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:flex lg:justify-end">
          <Sheet />
        </div>
      </div>
    </section>
  );
}
