"use client";

import { ChevronLeft, ChevronRight, Clapperboard, Grid3x3, Image as ImageIcon, Layers, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { mediaUrl, type FeedItem } from "@/lib/api";

function Media({ item, index = 0, tile = false }: { item: FeedItem; index?: number; tile?: boolean }) {
  const m = item.media[index] ?? item.media[0];
  if (!m) return <div className="size-full bg-ink-2" />;
  if (m.kind === "video") {
    return (
      <video
        src={`${mediaUrl(m.src)}${item.poster || !tile ? "" : "#t=0.1"}`}
        poster={item.poster ? mediaUrl(item.poster) : undefined}
        muted={tile}
        loop
        playsInline
        preload="metadata"
        controls={!tile}
        autoPlay={!tile}
        className="size-full object-cover"
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={mediaUrl(m.src)} alt={item.title} loading="lazy" draggable={false} className="size-full object-cover" />;
}

function Tile({ item, onOpen }: { item: FeedItem; onOpen: () => void }) {
  const wrap = useRef<HTMLButtonElement>(null);
  const play = (on: boolean) => {
    const v = wrap.current?.querySelector("video");
    if (!v) return;
    if (on) {
      // Browsers only allow autoplay for muted video; set it on the element itself, not just the attribute.
      v.muted = true;
      void v.play().catch(() => {});
    }
    else {
      v.pause();
      v.currentTime = 0;
    }
  };
  return (
    <li className="aspect-[3/4]">
      <button
        ref={wrap}
        type="button"
        onClick={onOpen}
        onPointerEnter={(e) => e.pointerType !== "touch" && play(true)}
        onPointerLeave={() => play(false)}
        onFocus={() => play(true)}
        onBlur={() => play(false)}
        aria-label={`Open ${item.type}: ${item.title}`}
        className="group relative block size-full overflow-hidden bg-ink-2 text-left"
      >
        <div className="size-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]">
          <Media item={item} tile />
        </div>
        <span aria-hidden="true" className="absolute right-2 top-2 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          {item.type === "reel" ? <Play className="size-5 fill-white" /> : item.type === "carousel" ? <Layers className="size-5" /> : null}
        </span>
        <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:p-4">
          <span className="edge text-white/70">{item.client || item.type}</span>
          <span className="mt-1 line-clamp-2 text-[0.95rem] font-semibold leading-tight text-white">{item.title}</span>
        </span>
      </button>
    </li>
  );
}

function Viewer({ items, start, onClose }: { items: FeedItem[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const [slide, setSlide] = useState(0);
  const item = items[i];
  const count = item.media.length;

  const go = useCallback(
    (d: number) => {
      setI((v) => (v + d + items.length) % items.length);
      setSlide(0);
    },
    [items.length],
  );
  const slideBy = useCallback((d: number) => setSlide((s) => Math.min(Math.max(s + d, 0), count - 1)), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") {
        if (slide < count - 1) slideBy(1);
        else go(1);
      } else if (e.key === "ArrowLeft") {
        if (slide > 0) slideBy(-1);
        else go(-1);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [go, slideBy, onClose, count, slide]);

  const round = "flex items-center justify-center rounded-full";
  return (
    <div role="dialog" aria-modal="true" aria-label={item.title} className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 p-3 backdrop-blur-sm md:p-8" onClick={onClose}>
      {/* The site hides the native cursor; the viewer needs it. */}
      <style>{`html.has-cursor, html.has-cursor * { cursor: auto !important; } html.has-cursor button { cursor: pointer !important; }`}</style>
      <button type="button" onClick={onClose} aria-label="Close" className={`${round} absolute right-4 top-4 z-10 size-11 bg-ink text-paper ring-1 ring-line-strong`}>
        <X className="size-5" />
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous post" className={`${round} absolute left-2 top-1/2 z-10 hidden size-11 -translate-y-1/2 bg-ink text-paper ring-1 ring-line-strong md:flex`}>
        <ChevronLeft className="size-5" />
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next post" className={`${round} absolute right-2 top-1/2 z-10 hidden size-11 -translate-y-1/2 bg-ink text-paper ring-1 ring-line-strong md:flex`}>
        <ChevronRight className="size-5" />
      </button>

      <div onClick={(e) => e.stopPropagation()} className="grid max-h-full w-full max-w-5xl overflow-hidden border border-line-strong bg-ink md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="relative flex h-[62vh] items-center justify-center bg-ink-2 md:h-[86vh]">
          <div key={`${item.id}-${slide}`} className="size-full [&_img]:object-contain [&_video]:object-contain">
            <Media item={item} index={slide} />
          </div>
          {count > 1 && (
            <>
              {slide > 0 && (
                <button type="button" onClick={() => slideBy(-1)} aria-label="Previous slide" className={`${round} absolute left-2 top-1/2 size-9 -translate-y-1/2 bg-ink text-paper ring-1 ring-line-strong`}>
                  <ChevronLeft className="size-5" />
                </button>
              )}
              {slide < count - 1 && (
                <button type="button" onClick={() => slideBy(1)} aria-label="Next slide" className={`${round} absolute right-2 top-1/2 size-9 -translate-y-1/2 bg-ink text-paper ring-1 ring-line-strong`}>
                  <ChevronRight className="size-5" />
                </button>
              )}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink px-2.5 py-1.5 ring-1 ring-line-strong">
                {item.media.map((_, k) => (
                  <span key={k} className={`size-1.5 rounded-full ${k === slide ? "bg-paper" : "bg-paper/30"}`} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto p-5 md:p-7">
          <p className="edge text-rebate">
            {item.type}
            {item.client ? ` · ${item.client}` : ""}
          </p>
          <h2 className="display text-[clamp(1.3rem,2vw,1.7rem)] leading-tight">{item.title}</h2>
          {item.caption && <p className="whitespace-pre-line text-dim">{item.caption}</p>}
        </div>
      </div>
    </div>
  );
}

type Tab = "all" | "reel" | "post";
const tabs: { v: Tab; label: string; Icon: typeof Grid3x3 }[] = [
  { v: "all", label: "All", Icon: Grid3x3 },
  { v: "reel", label: "Reels", Icon: Clapperboard },
  { v: "post", label: "Posts", Icon: ImageIcon },
];
const matches = (i: FeedItem, t: Tab) => t === "all" || (t === "reel" ? i.type === "reel" : i.type !== "reel");

export function FeedGrid({ items }: { items: FeedItem[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const shown = items.filter((i) => matches(i, tab));
  const available = tabs.filter((t) => items.some((i) => matches(i, t.v)));

  if (items.length === 0) return <p className="edge py-16 text-center text-dim">New work is on its way.</p>;

  return (
    <>
      <div role="tablist" aria-label="Filter feed" className="flex justify-center gap-8 pb-4 md:gap-14">
        {available.map(({ v, label, Icon }) => (
          <button
            key={v}
            role="tab"
            aria-selected={tab === v}
            onClick={() => setTab(v)}
            className={`edge flex items-center gap-2 py-2 transition-colors ${tab === v ? "text-paper" : "text-rebate hover:text-paper"}`}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-0.5 md:grid-cols-3 md:gap-1 xl:grid-cols-4 2xl:grid-cols-5" aria-label="Creative feed">
        {shown.map((item, i) => (
          <Tile key={item.id} item={item} onOpen={() => setOpen(i)} />
        ))}
      </ul>
      {open !== null && <Viewer items={shown} start={open} onClose={close} />}
    </>
  );
}
