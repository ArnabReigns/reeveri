"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FilmStrip } from "./FilmStrip";
import { Pencil } from "./Pencil";
import { EASE, MagneticLink } from "./ui";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const headY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "16%"]);
  const stripY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-28%"]);

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
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 md:pt-32"
    >
      <motion.div style={{ y: headY }} className="gutter relative mx-auto w-full max-w-[110rem]">
        <h1 id="hero-title" className="display text-[clamp(3.1rem,10.4vw,9.25rem)] leading-[0.88]">
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
          className="mt-8 max-w-md lg:ml-auto lg:mt-12 lg:max-w-[25rem] 2xl:absolute 2xl:bottom-[0.6rem] 2xl:right-[clamp(1rem,4vw,3.5rem)] 2xl:ml-0 2xl:mt-0"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
        >
          <p className="text-[1.05rem] leading-[1.5] text-dim md:text-lg">
            Reeveri is a creative marketing agency. We turn attention into growth for ambitious brands, with
            strategy, content, and creative that people actually stop for.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <MagneticLink href="#start-project">Start a project</MagneticLink>
            <MagneticLink href="#work" variant="ghost" arrow={false}>
              See our work
            </MagneticLink>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: stripY }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.7 }}
        className="mt-28 pb-8 md:mt-32"
      >
        <FilmStrip />
      </motion.div>
    </section>
  );
}
