"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";
import { Pencil } from "./Pencil";
import { MagneticLink, RiseLines } from "./ui";

export function CTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rowA = useTransform(scrollYProgress, [0, 1], [reduce ? "0%" : "-12%", "0%"]);
  const rowB = useTransform(scrollYProgress, [0, 1], [reduce ? "-20%" : "-4%", "-20%"]);

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-paper text-ink"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 opacity-[0.07]">
        <motion.p style={{ x: rowA }} className="display whitespace-nowrap text-[18vw] leading-[0.8]">
          noise noise noise noise noise
        </motion.p>
        <motion.p style={{ x: rowB }} className="display whitespace-nowrap text-[18vw] leading-[0.8]">
          noise noise noise noise noise
        </motion.p>
      </div>

      <div className="gutter relative mx-auto max-w-[110rem] pb-[clamp(6rem,12vw,10rem)] pt-[clamp(7rem,14vw,12rem)]">
        <h2 id="cta-title" className="display text-[clamp(3rem,9.6vw,9rem)] leading-[0.88]">
          <RiseLines lines={["Got a brand", "worth talking", "about?"]} />
        </h2>

        <div className="mt-14 flex flex-col gap-10 md:mt-20 md:flex-row md:items-end md:justify-between">
          <p className="display text-[clamp(2rem,4.6vw,4.25rem)] text-ink/70">Let&apos;s make some noise.</p>
          <div className="flex flex-col items-start gap-6 md:items-end">
            <div className="relative">
              <MagneticLink href={site.contactHref} size="lg" variant="onPaper" className="relative z-10">
                Start a project
              </MagneticLink>
              <Pencil
                kind="circle"
                inView
                delay={0.5}
                duration={1}
                color="var(--color-ink)"
                strokeWidth={2}
                className="-left-[12%] -top-[34%] z-0 h-[168%] w-[124%]"
              />
            </div>
            <p className="text-ink/70 md:text-right">
              Or write to <a href={site.contactHref} className="font-semibold text-ink underline">{site.contactEmail}</a>
              {site.contactIsPlaceholder && <span className="edge ml-2 bg-ink/10 px-1.5 py-0.5 text-ink/70">Placeholder</span>}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
