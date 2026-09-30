"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";
import { ContactWall } from "./ContactWall";
import { FilmStrip } from "./FilmStrip";
import { Pencil } from "./Pencil";
import { EASE, MagneticLink } from "./ui";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const headY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "6%"]);
  const wallY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);
  const stripY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);

  const rise = (i: number) => ({
    initial: reduce ? { y: "0%" } : { y: "108%" },
    animate: { y: "0%" },
    transition: { duration: 1, ease: EASE, delay: 0.25 + i * 0.1 },
  });

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="hero-fit relative flex flex-col justify-between overflow-hidden pt-[clamp(5.25rem,9dvh,7rem)]"
    >
      <motion.div style={{ y: wallY }} className="pointer-events-none absolute inset-0 z-0">
        <ContactWall hostRef={ref} />
      </motion.div>

      <motion.div style={{ y: headY }} className="gutter relative mx-auto w-full max-w-[110rem]">
        <h1
          id="hero-title"
          className="display leading-[0.88]"
          style={{ fontSize: "clamp(3.1rem, min(10.4vw, 11.5dvh), 9.25rem)" }}
        >
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
              delay={1.15}
              duration={0.95}
              strokeWidth={2.4}
            />
          </span>
        </h1>

        <motion.div
          data-hero-copy=""
          className="mt-[clamp(1rem,3.5dvh,2.5rem)]"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
        >
          <p className="flex items-center gap-4 text-[clamp(1rem,2.2dvh,1.25rem)] font-medium text-paper/85">
            <span aria-hidden="true" className="h-px w-10 shrink-0 bg-paper/40 md:w-14" />
            {site.tagline}
          </p>
          <div className="mt-[clamp(1rem,3dvh,2rem)] flex flex-wrap gap-3">
            <MagneticLink href="#start-project" className="h-[clamp(2.5rem,5.4dvh,3rem)]!">Start a project</MagneticLink>
            <MagneticLink href="#work" variant="ghost" arrow={false} className="h-[clamp(2.5rem,5.4dvh,3rem)]!">
              See our work
            </MagneticLink>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        data-hero-strip=""
        style={{ y: stripY }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.7 }}
        className="mt-[clamp(1.75rem,5dvh,3rem)] pb-[clamp(1rem,2.6dvh,1.5rem)]"
      >
        <FilmStrip />
      </motion.div>
    </section>
  );
}
