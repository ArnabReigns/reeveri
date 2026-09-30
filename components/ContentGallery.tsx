"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, MessageCircle, Play } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { contentItems, type ContentItem } from "@/lib/content";
import { FINE_POINTER, REDUCED_MOTION, useMediaQuery } from "@/lib/hooks";
import { FrameArt } from "./FrameArt";
import { SectionHead } from "./ui";

const shapeClass: Record<ContentItem["shape"], string> = {
  story: "w-[62vw] max-w-[17rem] aspect-[9/16]",
  portrait: "w-[70vw] max-w-[20rem] aspect-[4/5]",
  square: "w-[70vw] max-w-[19rem] aspect-square",
  wide: "w-[84vw] max-w-[34rem] aspect-[16/10]",
};

function ContentCard({ item, index }: { item: ContentItem; index: number }) {
  const isVideo = item.kind === "Reel" || item.kind === "Short-form";
  return (
    <li className={`shrink-0 snap-start ${index % 2 === 1 ? "lg:mt-24" : ""}`}>
      <div className="mb-2 flex justify-between gap-4 text-rebate">
        <span className="edge">{item.kind}</span>
        <span className="edge">→ {String(index + 21).padStart(2, "0")}</span>
      </div>
      <figure className={`relative overflow-hidden border border-line bg-ink-2 ${shapeClass[item.shape]}`}>
        <FrameArt variant={item.art} />
        {isVideo && (
          <>
            <div aria-hidden="true" className="absolute inset-x-3 top-3 flex gap-1">
              <span className="h-0.5 flex-1 rounded-full bg-paper" />
              <span className="h-0.5 flex-1 rounded-full bg-paper/30" />
              <span className="h-0.5 flex-1 rounded-full bg-paper/30" />
            </div>
            <span
              aria-hidden="true"
              className="absolute right-3 top-7 flex size-9 items-center justify-center rounded-full bg-ink/70"
            >
              <Play className="size-4 fill-paper text-paper" />
            </span>
          </>
        )}
        {item.kind === "Post" && (
          <div aria-hidden="true" className="absolute bottom-3 right-3 flex gap-3 text-paper mix-blend-difference">
            <Heart className="size-4" />
            <MessageCircle className="size-4" />
          </div>
        )}
        <figcaption className="sr-only">
          {item.kind} concept placeholder: {item.title}
        </figcaption>
      </figure>
      <p className="mt-3 max-w-[16rem] text-[0.95rem] leading-snug">{item.title}</p>
      <p className="edge mt-1 text-dim">Concept placeholder</p>
    </li>
  );
}

export function ContentGallery() {
  const fine = useMediaQuery(FINE_POINTER);
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduce = useMediaQuery(REDUCED_MOTION);
  const pinned = fine && wide && !reduce;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!pinned || !trackRef.current) return;
    const el = trackRef.current;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  const head = (
    <SectionHead
      id="content-title"
      title={
        <>
          Made for
          <br />
          the feed.
        </>
      }
      aside={
        <p>
          Reels, posts, campaign concepts, short-form video, and ads. Every frame here is a concept placeholder
          until real work is added.
        </p>
      }
    />
  );

  if (!pinned) {
    return (
      <section ref={sectionRef} aria-labelledby="content-title" className="py-[clamp(6rem,12vw,11rem)]">
        <div className="gutter mx-auto max-w-[110rem]">{head}</div>
        <ul
          className="gutter mt-14 flex snap-x snap-mandatory scroll-px-[clamp(1rem,4vw,3.5rem)] gap-4 overflow-x-auto pb-6 [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
          aria-label="Content examples, swipe to browse"
        >
          {contentItems.map((item, i) => (
            <ContentCard key={item.title} item={item} index={i} />
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="content-title"
      className="relative"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="gutter mx-auto w-full max-w-[110rem]">{head}</div>
        <motion.ul ref={trackRef} style={{ x }} className="gutter mt-12 flex w-max items-start gap-8" aria-label="Content examples">
          {contentItems.map((item, i) => (
            <ContentCard key={item.title} item={item} index={i} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
