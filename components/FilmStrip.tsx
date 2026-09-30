"use client";

import { useEffect, useState } from "react";
import { FrameArt, type FrameArtVariant } from "./FrameArt";
import { Pencil } from "./Pencil";
import { REDUCED_MOTION, useMediaQuery } from "@/lib/hooks";

type StripFrame = { id: string; art: FrameArtVariant; caption: string; keeper?: boolean };

const frames: StripFrame[] = [
  { id: "07", art: "signal", caption: "Out of home" },
  { id: "08", art: "letter", caption: "Identity", keeper: true },
  { id: "09", art: "type", caption: "Reel concept" },
  { id: "10", art: "grid", caption: "Social grid" },
  { id: "11", art: "halftone", caption: "Campaign still" },
  { id: "12", art: "phone", caption: "Launch site", keeper: true },
  { id: "13", art: "stack", caption: "Brand system" },
  { id: "14", art: "bars", caption: "Paid creative" },
];

const ADVANCE_MS = 2600;

export function FilmStrip() {
  const reduce = useMediaQuery(REDUCED_MOTION);
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const t = window.setInterval(() => {
      setAnimate(true);
      setStep((s) => s + 1);
    }, ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [reduce, paused]);

  const onEnd = () => {
    if (step >= frames.length) {
      setAnimate(false);
      setStep(0);
    }
  };

  const doubled = [...frames, ...frames];

  return (
    <div
      className="relative select-none [--fw:clamp(9.5rem,19vw,18rem)] [--gap:0.625rem]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="gutter mb-2 flex justify-between text-rebate">
        <span className="edge">Reeveri 400 · Contact sheet</span>
        <span className="edge hidden sm:inline">Frames 07 → 14 · Placeholder concepts</span>
      </div>
      <div className="relative overflow-hidden bg-ink-3 py-4">
        <div className="sprockets absolute inset-x-0 top-0.5 h-2" />
        <div className="sprockets absolute inset-x-0 bottom-0.5 h-2" />
        <ul
          className="flex gap-[var(--gap)] pl-[clamp(1rem,4vw,3.5rem)]"
          onTransitionEnd={onEnd}
          style={{
            transform: `translateX(calc(${-step} * (var(--fw) + var(--gap))))`,
            transition: animate ? "transform 900ms var(--ease-advance)" : "none",
          }}
        >
          {doubled.map((f, i) => (
            <li
              key={`${f.id}-${i}`}
              aria-hidden={i >= frames.length ? true : undefined}
              className="relative shrink-0"
              style={{ width: "var(--fw)" }}
            >
              <div className="relative aspect-[3/2] w-full bg-ink">
                <FrameArt variant={f.art} />
              </div>
              <div className="mt-1.5 flex justify-between text-rebate">
                <span className="edge">→ {f.id}</span>
                <span className="edge">{f.caption}</span>
              </div>
              {f.keeper && (
                <Pencil kind="circle" className="-left-[6%] -top-[4%] h-[108%] w-[112%]" delay={1.6} duration={1} strokeWidth={2.2} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
