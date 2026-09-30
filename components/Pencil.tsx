"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

type Kind = "circle" | "underline" | "strike" | "tick";

const paths: Record<Kind, { d: string; viewBox: string }> = {
  circle: {
    viewBox: "0 0 300 120",
    d: "M 196 14 C 120 4, 34 22, 16 58 C 2 92, 88 114, 168 110 C 246 106, 296 84, 288 52 C 280 20, 214 6, 132 12 C 96 15, 70 22, 52 30",
  },
  underline: {
    viewBox: "0 0 300 20",
    d: "M 3 13 C 70 6, 150 9, 297 5",
  },
  strike: {
    viewBox: "0 0 300 20",
    d: "M 2 12 C 80 8, 190 11, 298 7",
  },
  tick: {
    viewBox: "0 0 40 40",
    d: "M 6 22 C 10 25, 14 30, 16 34 C 22 22, 28 13, 36 5",
  },
};

type Props = {
  kind: Kind;
  className?: string;
  delay?: number;
  duration?: number;
  /** Draw when scrolled into view instead of on mount. */
  inView?: boolean;
  strokeWidth?: number;
  color?: string;
};

export function Pencil({
  kind,
  className = "",
  delay = 0,
  duration = 0.8,
  inView = false,
  strokeWidth = 2.6,
  color = "var(--color-marker)",
}: Props) {
  const reduce = useReducedMotion();
  const filterId = `wax-${useId().replace(/:/g, "")}`;
  const { d, viewBox } = paths[kind];

  // Two passes: the main wax stroke, then a thinner, lighter pass that lags slightly for uneven pressure.
  const passes = [
    { width: strokeWidth, opacity: 1, lag: 0, shift: "translate(0 0)" },
    { width: strokeWidth * 0.45, opacity: 0.55, lag: 0.06, shift: "translate(0.8 -0.6)" },
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute overflow-visible ${className}`}
    >
      <defs>
        <filter id={filterId} x="-10%" y="-40%" width="120%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="4" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        {passes.map((p, i) => {
          const drawn = { pathLength: 1, opacity: p.opacity };
          const trigger = inView ? { whileInView: drawn } : { animate: drawn };
          return (
            <motion.path
              key={i}
              d={d}
              transform={p.shift}
              fill="none"
              stroke={color}
              strokeWidth={p.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? drawn : { pathLength: 0, opacity: 0 }}
              {...trigger}
              viewport={{ once: true, amount: 0.8 }}
              transition={{
                pathLength: { delay: delay + p.lag, duration, ease: [0.65, 0, 0.35, 1] },
                opacity: { delay: delay + p.lag, duration: 0.01 },
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}

/** Hand-drawn crop brackets at the four corners of a frame. */
export function CropMarks({ show }: { show: boolean }) {
  const corner = "absolute h-6 w-6 border-marker transition-all duration-500 ease-out-expo";
  const o = show ? "opacity-100" : "opacity-0";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className={`${corner} ${o} border-l-2 border-t-2 ${show ? "-left-2 -top-2" : "left-2 top-2"}`} />
      <span className={`${corner} ${o} border-r-2 border-t-2 ${show ? "-right-2 -top-2" : "right-2 top-2"}`} />
      <span className={`${corner} ${o} border-b-2 border-l-2 ${show ? "-bottom-2 -left-2" : "bottom-2 left-2"}`} />
      <span className={`${corner} ${o} border-b-2 border-r-2 ${show ? "-bottom-2 -right-2" : "bottom-2 right-2"}`} />
    </div>
  );
}
