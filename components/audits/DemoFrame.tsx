"use client";

import { ArrowUpRight, Monitor, RotateCcw, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = { src: string; label: string };

export function DemoFrame({ src, label }: Props) {
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [nonce, setNonce] = useState(0);
  const phone = device === "phone";
  // The demo is a whole store (about 1MB). Only start loading it once it is actually on screen.
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = (value: "desktop" | "phone", text: string, icon: React.ReactNode) => (
    <button
      type="button"
      aria-pressed={device === value}
      onClick={() => setDevice(value)}
      className={`edge inline-flex h-10 items-center gap-2 rounded-full px-4 ring-1 ring-inset transition-colors duration-300 ${
        device === value ? "bg-paper text-ink ring-paper" : "text-paper ring-line-strong hover:ring-paper"
      }`}
    >
      {icon}
      {text}
    </button>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="edge text-rebate">Live, interactive · {label}</p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden items-center gap-2 md:flex" role="group" aria-label="Preview size">
            {toggle("desktop", "Desktop", <Monitor aria-hidden="true" className="size-4" strokeWidth={1.8} />)}
            {toggle("phone", "Phone", <Smartphone aria-hidden="true" className="size-4" strokeWidth={1.8} />)}
          </div>
          <button
            type="button"
            onClick={() => setNonce((n) => n + 1)}
            className="edge inline-flex h-10 items-center gap-2 rounded-full px-4 text-paper ring-1 ring-inset ring-line-strong transition-colors duration-300 hover:ring-paper"
          >
            <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.8} />
            Reset
          </button>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="edge inline-flex h-10 items-center gap-2 rounded-full px-4 text-paper ring-1 ring-inset ring-line-strong transition-colors duration-300 hover:ring-paper"
          >
            Full screen
            <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.8} />
          </a>
        </div>
      </div>

      <div className="border border-line-strong bg-ink-2 p-2 sm:p-3">
        <div
          className={`mx-auto transition-[max-width] duration-700 ease-out-expo ${phone ? "max-w-[24.5rem]" : "max-w-full"}`}
        >
          <div ref={box} className={near ? undefined : `bg-ink-2 ${phone ? "h-[min(46rem,82dvh)]" : "h-[min(52rem,80dvh)]"}`}>
          {near && <iframe
            key={nonce}
            data-cursor-hide=""
            src={src}
            title={`${label}. Interactive preview: browse products, filter, and add to bag.`}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            className={`block w-full bg-[#fbf6ee] ${phone ? "h-[min(46rem,82dvh)]" : "h-[min(52rem,80dvh)]"}`}
          />}
          </div>
        </div>
      </div>
      <p className="edge mt-3 text-rebate">
        Scroll inside the frame. Add something to the bag, filter the grid, open a product, check a pincode.
      </p>
    </div>
  );
}
