"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/lib/content";
import { EASE } from "./ui";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-title" className="border-t border-line">
      <div className="gutter mx-auto grid max-w-[110rem] gap-12 py-[clamp(6rem,12vw,11rem)] lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="faq-title" className="display text-[clamp(2.75rem,5.6vw,5.5rem)] lg:sticky lg:top-32">
            Fair
            <br />
            questions.
          </h2>
        </div>

        <dl className="border-t border-line lg:col-span-7 lg:col-start-6">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <div key={f.q} className="border-b border-line">
                <dt>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-panel`}
                    id={`${id}-button`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
                  >
                    <span
                      className={`text-[clamp(1.2rem,2vw,1.6rem)] font-semibold tracking-[-0.02em] transition-colors duration-300 ${
                        isOpen ? "text-paper" : "text-paper/80 group-hover:text-paper"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-out-expo ${
                        isOpen ? "rotate-45 border-paper bg-paper text-ink" : "border-line-strong text-paper group-hover:border-paper"
                      }`}
                    >
                      <Plus className="size-4" strokeWidth={2} />
                    </span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      id={`${id}-panel`}
                      role="region"
                      aria-labelledby={`${id}-button`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 pr-14 text-dim md:text-lg">{f.a}</p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
