"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { FINE_POINTER, REDUCED_MOTION, useMediaQuery } from "@/lib/hooks";

type Mode = "default" | "link" | "view";

// Desktop-only loupe cursor. Elements opt in with data-cursor="view" and data-cursor-label.
export function Cursor() {
  const fine = useMediaQuery(FINE_POINTER);
  const reduce = useMediaQuery(REDUCED_MOTION);
  const enabled = fine && !reduce;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.6 });

  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      if (!el) {
        setMode("default");
        return;
      }
      if (el.dataset.cursor === "view") {
        setMode("view");
        setLabel(el.dataset.cursorLabel ?? "View");
      } else {
        setMode("link");
      }
    };
    const leave = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = mode === "view" ? 108 : mode === "link" ? 46 : 14;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.86 : 1,
          backgroundColor:
            mode === "view" ? "rgba(239,238,232,1)" : mode === "link" ? "rgba(239,238,232,0)" : "rgba(239,238,232,1)",
          borderColor: mode === "link" ? "rgba(239,238,232,0.8)" : "rgba(239,238,232,0)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        style={{ borderWidth: 1, borderStyle: "solid", mixBlendMode: mode === "view" ? "normal" : "difference" }}
      >
        <motion.span
          className="edge whitespace-nowrap text-ink"
          animate={{ opacity: mode === "view" ? 1 : 0, scale: mode === "view" ? 1 : 0.6 }}
          transition={{ duration: 0.25 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
