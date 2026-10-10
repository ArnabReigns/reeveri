import { Layers, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mediaUrl, type FeedItem } from "@/lib/api";
import { getFeed } from "@/lib/db";
import { FadeUp, MagneticLink, SectionHead } from "./ui";

function Tile({ item, tall }: { item: FeedItem; tall: boolean }) {
  const m = item.media[0];
  if (!m) return null;
  const still = m.kind === "image" ? m.src : item.poster;
  return (
    <li className={`mr-3 shrink-0 md:mr-4 ${tall ? "w-[42vw] sm:w-[26vw] lg:w-[17vw]" : "w-[34vw] sm:w-[21vw] lg:w-[13.5vw]"}`}>
      <Link
        href="/work"
        tabIndex={-1}
        aria-hidden="true"
        className="group relative block aspect-[3/4] overflow-hidden bg-ink-2"
      >
        {still ? (
          <Image
            src={mediaUrl(still)}
            alt=""
            fill
            sizes="(min-width: 1024px) 17vw, (min-width: 640px) 26vw, 42vw"
            className="transform-gpu object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
          />
        ) : (
          <video src={`${mediaUrl(m.src)}#t=0.1`} muted playsInline preload="metadata" className="size-full object-cover" />
        )}
        <span className="absolute right-2 top-2 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          {item.type === "reel" ? <Play className="size-4 fill-white" /> : item.type === "carousel" ? <Layers className="size-4" /> : null}
        </span>
      </Link>
    </li>
  );
}

function Row({ items, reverse, duration }: { items: FeedItem[]; reverse?: boolean; duration: number }) {
  // The list is rendered twice so the loop can run from 0 to -50% without a jump.
  const loop = [...items, ...items];
  return (
    <ul
      className={`marquee-track flex items-start ${reverse ? "reverse" : ""}`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      {loop.map((item, i) => (
        <Tile key={`${item.id}-${i}`} item={item} tall={(i % items.length) % 2 === 0} />
      ))}
    </ul>
  );
}

// Home page glimpse of the Work feed: a drifting two-row strip that links through to /work.
export async function WorkGlimpse() {
  const feed = (await getFeed()).filter((f) => f.media.length > 0);
  if (feed.length === 0) return null;

  // Enough tiles per row to overflow the screen, even with a small feed.
  const fill = (list: FeedItem[]) => {
    const out = [...list];
    while (out.length < 8) out.push(...list);
    return out;
  };
  const a = fill(feed);
  const b = fill([...feed.slice(Math.ceil(feed.length / 2)), ...feed.slice(0, Math.ceil(feed.length / 2))]);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="pb-[clamp(3.6rem,6vw,5.5rem)] pt-[clamp(1.5rem,3vw,2.5rem)]"
    >
      <div className="gutter mx-auto max-w-[110rem]">
        <SectionHead
          id="work-title"
          title={
            <>
              Made for
              <br />
              the feed.
            </>
          }
          aside={<p>Posters, reels and carousels from the campaigns we make. Hover to pause, tap to open the full feed.</p>}
        />
      </div>

      <FadeUp className="marquee mt-10 space-y-3 overflow-hidden md:mt-14 md:space-y-4" >
        <Row items={a} duration={80} />
        <div className="-ml-[8vw]">
          <Row items={b} reverse duration={95} />
        </div>
      </FadeUp>

      <div className="gutter mx-auto mt-10 max-w-[110rem]">
        <MagneticLink href="/work" variant="ghost">
          See all work
        </MagneticLink>
      </div>
    </section>
  );
}
