"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { RiseLines } from "./ui";

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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 opacity-[0.1]">
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

        <div className="mt-14 md:mt-20">
          <ContactForm
            aside={
              <div className="flex flex-col">
                <p className="display mt-6 text-[clamp(1.125rem,1.6vw,1.375rem)] leading-[1.15] text-dim">Let&apos;s make some noise.</p>
                <p className="mt-8 text-dim">
                  Prefer email? Write to{" "}
                  <a href={site.contactHref} className="font-semibold text-paper underline">
                    {site.contactEmail}
                  </a>
                  {site.contactIsPlaceholder && <span className="edge ml-2 bg-paper/10 px-1.5 py-0.5 text-dim">Placeholder</span>}
                </p>
              </div>
            }
          />
        </div>

      </div>
    </section>
  );
}
