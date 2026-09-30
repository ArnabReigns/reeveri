"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { services } from "@/lib/content";
import { FINE_POINTER, useMediaQuery } from "@/lib/hooks";
import { FrameArt } from "./FrameArt";
import { EASE, SectionHead } from "./ui";

export function Services() {
  const fine = useMediaQuery(FINE_POINTER);
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 220, damping: 26 });
  const y = useSpring(py, { stiffness: 220, damping: 26 });

  const onMove = (e: React.PointerEvent) => {
    if (!listRef.current) return;
    const r = listRef.current.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
  };

  return (
    <section id="services" aria-labelledby="services-title" className="gutter mx-auto max-w-[110rem] pb-[clamp(4rem,8vw,7rem)]">
      <SectionHead
        id="services-title"
        title="What we do"
        aside={<p>Six disciplines, one team. Pick one, or let us join them up into something that compounds.</p>}
      />

      <ul
        ref={listRef}
        className="relative mt-14 border-b border-line md:mt-20"
        onPointerMove={fine ? onMove : undefined}
        onPointerLeave={fine ? () => setActive(null) : undefined}
      >
        {fine && !reduce && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-20 hidden aspect-[3/2] w-[clamp(15rem,22vw,21rem)] lg:block"
            style={{ x, y, translateX: "-50%", translateY: "-55%" }}
            animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.85 : 1, rotate: active === null ? -4 : -2 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <AnimatePresence mode="popLayout">
              {active !== null && (
                <motion.div
                  key={active}
                  className="absolute inset-0 border border-line-strong bg-ink"
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ clipPath: "inset(0% 0 0 0)" }}
                  exit={{ clipPath: "inset(0 0 100% 0)" }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <FrameArt variant={services[active].art} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {services.map((s, i) => {
          const isActive = active === i;
          const panelId = `service-panel-${s.n}`;
          return (
            <li
              key={s.n}
              className={`relative border-t border-line transition-colors duration-500 ${isActive ? "bg-ink-2" : ""}`}
              onPointerEnter={fine ? () => setActive(i) : undefined}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => setActive(isActive ? null : i)}
                  onFocus={fine ? () => setActive(i) : undefined}
                  className={`grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 px-1 py-6 text-left transition-[padding] duration-500 ease-out-expo md:grid-cols-[4rem_1fr_minmax(0,24rem)] md:gap-x-6 md:px-4 ${
                    isActive && fine ? "md:py-14" : "md:py-9"
                  }`}
                >
                  <span className={`edge transition-colors duration-300 ${isActive ? "text-paper" : "text-dim"}`}>{s.n}</span>
                  <span
                    className={`display text-[clamp(1.8rem,4.6vw,4.25rem)] leading-[0.95] transition-transform duration-500 ease-out-expo ${
                      isActive ? "md:translate-x-4" : ""
                    }`}
                  >
                    {s.title}
                  </span>
                  <span className="relative hidden self-center text-dim md:block">
                    <span className={`block transition-all duration-500 ease-out-expo ${isActive && fine ? "-translate-y-2 opacity-0" : ""}`}>
                      {s.line}
                    </span>
                    {fine && (
                      <span
                        id={panelId}
                        className={`absolute inset-x-0 top-1/2 block -translate-y-1/2 text-[0.95rem] leading-snug text-paper transition-all duration-500 ease-out-expo ${
                          isActive ? "opacity-100" : "translate-y-0 opacity-0"
                        }`}
                      >
                        {s.description}
                      </span>
                    )}
                  </span>
                  <Plus
                    aria-hidden="true"
                    className={`size-5 self-center text-dim transition-transform duration-500 md:hidden ${isActive ? "rotate-45" : ""}`}
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isActive && !fine && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-label={s.title}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 px-1 pb-8 md:grid-cols-[4rem_1fr_minmax(0,22rem)] md:gap-x-6 md:px-4 md:pb-10">
                      <p className="max-w-xl text-dim md:col-start-2 md:translate-x-4 md:text-lg">
                        <span className="text-paper md:hidden">{s.line} </span>
                        {s.description}
                      </p>
                      <div className="relative aspect-[3/2] w-full max-w-sm border border-line lg:hidden">
                        <FrameArt variant={s.art} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
