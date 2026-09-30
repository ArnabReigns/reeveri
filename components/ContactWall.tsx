"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import { FINE_POINTER, REDUCED_MOTION, useMediaQuery } from "@/lib/hooks";
import { FrameArt, type FrameArtVariant } from "./FrameArt";
import { Pencil } from "./Pencil";

const ART: FrameArtVariant[] = [
  "letter", "grid", "halftone", "bars", "phone", "stack", "type", "signal", "launch", "phones",
  "browser", "stairs", "pov", "carousel", "countdown", "split", "viewfinder", "focus", "ornament", "unseen",
];

const REST = 0.14;
const GAP = 8;
const EXPOSE = [
  { opacity: 0, filter: "brightness(2.4)" },
  { opacity: 0.9, filter: "brightness(1.3)", offset: 0.2 },
  { opacity: REST, filter: "brightness(0.7)" },
];

type Keeper = { n: number; l: number; t: number; w: number; h: number };

export function ContactWall({ hostRef }: { hostRef: RefObject<HTMLElement | null> }) {
  const reduce = useMediaQuery(REDUCED_MOTION);
  const fine = useMediaQuery(FINE_POINTER);
  const wallRef = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const [count, setCount] = useState(48);
  const [ready, setReady] = useState(false);
  const [keeper, setKeeper] = useState<Keeper | null>(null);

  useEffect(() => {
    const wall = wallRef.current;
    const box = wall?.parentElement;
    if (!wall || !box) return;
    const measure = () => {
      const cols = getComputedStyle(wall).gridTemplateColumns.split(" ").length;
      const first = wall.children[0] as HTMLElement | undefined;
      if (!first) return;
      const rowH = first.getBoundingClientRect().height + GAP;
      const need = cols * (Math.ceil(box.getBoundingClientRect().height / rowH) + 1);
      setCount((c) => (need > 0 && need !== c ? Math.max(need, cols * 3) : c));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    tiles.current.length = count;
  }, [count]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!ready || reduce) return;
    const raf = requestAnimationFrame(() => {
      const list = tiles.current.filter((t): t is HTMLDivElement => !!t);
      const order = list.map((_, i) => i).sort(() => Math.random() - 0.5);
      order.forEach((idx, rank) => {
        list[idx].animate(EXPOSE, { duration: 1500, delay: 250 + rank * 36, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [ready, reduce]);

  useEffect(() => {
    const wall = wallRef.current;
    if (!ready || reduce || !wall) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(wall);
    const flash = window.setInterval(() => {
      if (!visible || document.hidden) return;
      const list = tiles.current.filter((t): t is HTMLDivElement => !!t);
      list[Math.floor(Math.random() * list.length)]?.animate(EXPOSE, { duration: 1600, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    }, 800);
    let n = 0;
    let clear = 0;
    const pick = window.setInterval(() => {
      if (!visible || document.hidden) return;
      const host = hostRef.current;
      const list = tiles.current.filter((t): t is HTMLDivElement => !!t);
      if (!host || !list.length) return;
      const avoid = [host.querySelector("h1"), host.querySelector("[data-hero-copy]"), host.querySelector("[data-hero-strip]")]
        .map((el) => el?.getBoundingClientRect())
        .filter((r): r is DOMRect => !!r);
      const hostRect = host.getBoundingClientRect();
      for (let k = 0; k < 16; k++) {
        const tile = list[Math.floor(Math.random() * list.length)];
        const r = tile.getBoundingClientRect();
        const clash = avoid.some((a) => r.left < a.right && r.right > a.left && r.top < a.bottom && r.bottom > a.top);
        const inside = r.top > hostRect.top + 40 && r.bottom < hostRect.bottom - 40 && r.left >= 0 && r.right <= innerWidth;
        if (clash || !inside) continue;
        n += 1;
        setKeeper({ n, l: tile.offsetLeft, t: tile.offsetTop, w: tile.offsetWidth, h: tile.offsetHeight });
        tile.setAttribute("data-keeper", "");
        window.clearTimeout(clear);
        clear = window.setTimeout(() => {
          tile.removeAttribute("data-keeper");
          setKeeper(null);
        }, 3000);
        break;
      }
    }, 4200);
    return () => {
      io.disconnect();
      window.clearInterval(flash);
      window.clearInterval(pick);
      window.clearTimeout(clear);
    };
  }, [ready, reduce, hostRef]);

  useEffect(() => {
    const host = hostRef.current;
    const wall = wallRef.current;
    if (!host || !wall || !fine || reduce) return;
    let hot = -1;
    const set = (i: number) => {
      if (i === hot) return;
      if (hot >= 0) tiles.current[hot]?.removeAttribute("data-hot");
      hot = i;
      if (i >= 0) tiles.current[i]?.setAttribute("data-hot", "");
    };
    const move = (e: PointerEvent) => {
      const first = tiles.current[0];
      if (!first) return;
      const r = wall.getBoundingClientRect();
      const tr = first.getBoundingClientRect();
      const cols = getComputedStyle(wall).gridTemplateColumns.split(" ").length;
      const col = Math.floor((e.clientX - r.left) / (tr.width + GAP));
      const row = Math.floor((e.clientY - r.top) / (tr.height + GAP));
      const i = row * cols + col;
      set(col >= 0 && col < cols && row >= 0 && i < tiles.current.length ? i : -1);
    };
    const leave = () => set(-1);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      set(-1);
    };
  }, [fine, reduce, hostRef]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-[6%] -top-[6%] z-0 overflow-hidden"
      style={{ visibility: ready ? "visible" : "hidden" }}
    >
      <div
        ref={wallRef}
        className="relative grid gap-2 px-2 [grid-template-columns:repeat(auto-fill,minmax(clamp(7.5rem,14vw,15rem),1fr))]"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              tiles.current[i] = el;
            }}
            className="wall-tile relative aspect-[3/2] bg-ink"
          >
            <FrameArt variant={ART[(i * 7 + (i >> 3)) % ART.length]} />
          </div>
        ))}
        {keeper && (
          <motion.div
            key={keeper.n}
            className="absolute z-10"
            style={{ left: keeper.l, top: keeper.t, width: keeper.w, height: keeper.h }}
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            transition={{ duration: 3, times: [0, 0.78, 1] }}
          >
            <Pencil kind="circle" className="-left-[8%] -top-[14%] h-[130%] w-[116%]" delay={0.1} duration={0.9} strokeWidth={2.4} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
