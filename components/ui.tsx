"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { FINE_POINTER, useMediaQuery } from "@/lib/hooks";

export const EASE = [0.16, 1, 0.3, 1] as const;

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "onPaper";
  size?: "md" | "lg";
  className?: string;
  arrow?: boolean;
  onClick?: () => void;
};

export function MagneticLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  arrow = true,
  onClick,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = useMediaQuery(FINE_POINTER);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.5 });
  const active = fine && !reduce;

  const onMove = (e: React.PointerEvent) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.36);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const styles = {
    primary: "bg-marker text-on-marker hover:bg-paper hover:text-ink",
    ghost: "text-paper ring-1 ring-inset ring-line-strong hover:ring-paper",
    onPaper: "bg-marker text-on-marker hover:bg-ink hover:text-paper",
  }[variant];
  const sizes = {
    md: "h-12 px-6 text-[0.95rem]",
    lg: "h-16 px-8 text-lg sm:h-20 sm:px-10 sm:text-xl",
  }[size];

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.97 }}
      className={`group inline-flex items-center justify-center gap-3 rounded-full font-semibold tracking-[-0.01em] transition-colors duration-300 ${styles} ${sizes} ${className}`}
    >
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="size-[1.1em] transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
          strokeWidth={2.2}
        />
      )}
    </motion.a>
  );
}

// Masked line rise. The unclipped wrapper observes the viewport; clipped children can't.
export function RiseLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  inView = true,
  stagger = 0.08,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  inView?: boolean;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const trigger = inView ? { whileInView: "shown" } : { animate: "shown" };
  return (
    <motion.span
      className={`block ${className}`}
      initial={reduce ? "shown" : "hidden"}
      {...trigger}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
    >
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.08em] ${lineClassName}`}>
          <motion.span
            className="block"
            variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function FadeUp({
  children,
  className = "",
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "p" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

export function SectionHead({
  id,
  title,
  aside,
  className = "",
}: {
  id?: string;
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-6 md:grid-cols-12 md:items-end ${className}`}>
      <h2 id={id} className="display text-[clamp(2rem,3.8vw,3.25rem)] md:col-span-8">
        {title}
      </h2>
      {aside && <div className="text-dim md:col-span-4 md:justify-self-end">{aside}</div>}
    </div>
  );
}
