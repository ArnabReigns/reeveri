export type FrameArtVariant =
  | "letter"
  | "grid"
  | "halftone"
  | "bars"
  | "phone"
  | "stack"
  | "type"
  | "signal"
  | "launch"
  | "phones"
  | "browser"
  | "stairs"
  | "pov"
  | "carousel"
  | "countdown"
  | "split"
  | "viewfinder"
  | "focus"
  | "ornament"
  | "unseen";

type Props = {
  variant: FrameArtVariant;
  className?: string;
};

// Monochrome placeholder compositions standing in for real campaign stills.
export function FrameArt({ variant, className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-full w-full overflow-hidden [container-type:size] ${className}`}
    >
      {variant === "letter" && <Letter />}
      {variant === "grid" && <Grid />}
      {variant === "halftone" && <Halftone />}
      {variant === "bars" && <Bars />}
      {variant === "phone" && <Phone />}
      {variant === "stack" && <Stack />}
      {variant === "type" && <TypeFrame />}
      {variant === "signal" && <Signal />}
      {variant === "launch" && <Launch />}
      {variant === "phones" && <Phones />}
      {variant === "browser" && <Browser />}
      {variant === "stairs" && <Stairs />}
      {variant === "pov" && <Pov />}
      {variant === "carousel" && <Carousel />}
      {variant === "countdown" && <Countdown />}
      {variant === "split" && <Split />}
      {variant === "viewfinder" && <Viewfinder />}
      {variant === "focus" && <Focus />}
      {variant === "ornament" && <Ornament />}
      {variant === "unseen" && <Unseen />}
    </div>
  );
}

function Letter() {
  return (
    <div className="absolute inset-0 bg-ink-2">
      <span
        className="display absolute -bottom-[18cqh] -right-[6cqw] leading-none text-paper"
        style={{ fontSize: "118cqh" }}
      >
        R
      </span>
      <span className="edge absolute left-[6cqw] top-[7cqh] text-dim">Identity study</span>
      <span className="absolute left-[6cqw] top-[16cqh] h-px w-[22cqw] bg-line-strong" />
    </div>
  );
}

function Grid() {
  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[1.5cqw] bg-ink p-[3cqw]">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className={
            i === 4
              ? "flex items-end bg-paper p-[2cqw]"
              : i % 3 === 0
                ? "bg-ink-3"
                : "bg-ink-2"
          }
        >
          {i === 4 && (
            <span className="display text-ink" style={{ fontSize: "9cqh" }}>
              Hi.
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function Halftone() {
  return (
    <div className="absolute inset-0 bg-ink-2">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-paper) 1.1px, transparent 1.6px)",
          backgroundSize: "9px 9px",
          maskImage: "radial-gradient(circle at 62% 46%, black 0 30%, transparent 62%)",
          WebkitMaskImage:
            "radial-gradient(circle at 62% 46%, black 0 30%, transparent 62%)",
          opacity: 0.85,
        }}
      />
      <span
        className="display absolute bottom-[8cqh] left-[6cqw] text-paper"
        style={{ fontSize: "14cqh" }}
      >
        Look
        <br />
        closer.
      </span>
    </div>
  );
}

function Bars() {
  const widths = [92, 64, 78, 40, 86, 55, 70];
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-[2.4cqh] bg-ink-2 px-[7cqw]">
      {widths.map((w, i) => (
        <div key={i} className="flex items-center gap-[2cqw]">
          <span className="edge w-[5cqw] text-rebate">{String(i + 1).padStart(2, "0")}</span>
          <div
            className={i === 4 ? "bg-paper" : "bg-ink-3"}
            style={{ width: `${w}%`, height: "6.5cqh" }}
          />
        </div>
      ))}
    </div>
  );
}

function Phone() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <div className="relative h-[84cqh] w-[40cqh] rounded-[4cqh] border border-line-strong bg-ink-2 p-[2.4cqh]">
        <div className="flex gap-[1cqh]">
          {[1, 1, 0.35, 0.35].map((o, i) => (
            <span key={i} className="h-[0.6cqh] flex-1 rounded-full bg-paper" style={{ opacity: o }} />
          ))}
        </div>
        <span
          className="display absolute left-[2.4cqh] right-[2.4cqh] top-[22cqh] text-paper"
          style={{ fontSize: "5.4cqh" }}
        >
          Stop
          <br />
          scrolling.
        </span>
        <div className="absolute bottom-[3cqh] left-[2.4cqh] right-[2.4cqh] space-y-[1.2cqh]">
          <span className="block h-[1cqh] w-3/4 rounded-full bg-line-strong" />
          <span className="block h-[1cqh] w-1/2 rounded-full bg-line" />
        </div>
      </div>
    </div>
  );
}

function Stack() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center bg-paper px-[6cqw] text-ink">
      {["Brand", "Content", "Growth"].map((w, i) => (
        <span
          key={w}
          className="display block"
          style={{
            fontSize: "21cqh",
            color: i === 1 ? "transparent" : undefined,
            WebkitTextStroke: i === 1 ? "1.5px var(--color-ink)" : undefined,
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
}

function TypeFrame() {
  return (
    <div className="absolute inset-0 bg-ink-2 p-[7cqw]">
      <span className="edge block text-dim">Episode 01</span>
      <span
        className="display mt-[6cqh] block text-paper"
        style={{ fontSize: "12cqh", lineHeight: 0.95 }}
      >
        Nobody
        <br />
        reads the
        <br />
        caption.
      </span>
      <span className="absolute bottom-[7cqh] left-[7cqw] right-[7cqw] h-px bg-line-strong" />
    </div>
  );
}

function Signal() {
  return (
    <div className="absolute inset-0 flex items-center bg-paper px-[6cqw]">
      <span className="display text-ink" style={{ fontSize: "30cqh" }}>
        Say less.
      </span>
      <span className="edge absolute bottom-[8cqh] right-[5cqw] text-ink/60">48-sheet · Concept</span>
    </div>
  );
}

function Launch() {
  return (
    <div className="absolute inset-0 bg-paper text-ink">
      <div className="absolute inset-x-[6cqw] top-[8cqh] flex justify-between">
        <span className="edge">Launch day</span>
        <span className="edge">Brand · Campaign · Site</span>
      </div>
      <span className="absolute inset-x-[6cqw] top-[20cqh] h-px bg-ink/25" />
      <span className="display absolute bottom-[6cqh] left-[5cqw] leading-[0.8]" style={{ fontSize: "44cqh" }}>
        Day 01
      </span>
    </div>
  );
}

function Phones() {
  return (
    <div className="absolute inset-0 bg-ink-2">
      {["Hook.", "Story.", "Share."].map((w, i) => (
        <div
          key={w}
          className={`absolute top-[12cqh] h-[76cqh] w-[24cqw] rounded-[2.4cqw] border border-line-strong p-[1.6cqw] ${
            i === 1 ? "bg-paper text-ink" : "bg-ink text-paper"
          }`}
          style={{ left: `${14 + i * 26}cqw`, transform: `translateY(${i === 1 ? -4 : 4}cqh)` }}
        >
          <span className="display block" style={{ fontSize: "4.2cqw" }}>
            {w}
          </span>
          <span className="edge absolute bottom-[2cqw] left-[1.6cqw] opacity-60">0{i + 1}/03</span>
        </div>
      ))}
    </div>
  );
}

function Browser() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <div className="h-[80cqh] w-[86cqw] border border-line-strong bg-ink-2">
        <div className="flex items-center gap-[0.8cqw] border-b border-line px-[1.6cqw] py-[1.4cqh]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-[1cqw] rounded-full bg-line-strong" />
          ))}
          <span className="edge ml-[2cqw] text-rebate">yourbrand.com</span>
        </div>
        <div className="flex h-[calc(100%-6cqh)] items-end justify-between p-[3cqw]">
          <span className="display text-paper" style={{ fontSize: "15cqh" }}>
            Feel
            <br />
            it.
          </span>
          <span className="mb-[1cqh] h-[8cqh] w-[18cqw] rounded-full bg-paper" />
        </div>
      </div>
    </div>
  );
}

function Stairs() {
  const h = [22, 34, 30, 48, 58, 74];
  return (
    <div className="absolute inset-0 flex items-end gap-[1.6cqw] bg-ink-2 px-[6cqw] pb-[10cqh] pt-[16cqh]">
      <span className="edge absolute left-[6cqw] top-[7cqh] text-dim">Test · Learn · Scale</span>
      {h.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col justify-end gap-[1cqh]">
          <div className={i === h.length - 1 ? "bg-paper" : "bg-ink-3"} style={{ height: `${v}%` }} />
          <span className="edge text-rebate">V{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

function Pov() {
  return (
    <div className="absolute inset-0 bg-ink-3">
      <span
        className="display absolute inset-x-[8cqw] top-[34cqh] text-paper"
        style={{ fontSize: "11cqw", lineHeight: 1 }}
      >
        POV: day one of the rebrand.
      </span>
      <span className="absolute bottom-[8cqh] left-[8cqw] h-[1cqh] w-[40cqw] rounded-full bg-paper/40" />
    </div>
  );
}

function Carousel() {
  return (
    <div className="absolute inset-0 bg-paper p-[8cqw] text-ink">
      <span className="edge">1 / 5</span>
      <span className="display mt-[8cqh] block" style={{ fontSize: "13cqw", lineHeight: 0.95 }}>
        The brief nobody writes.
      </span>
      <div className="absolute bottom-[7cqh] left-1/2 flex -translate-x-1/2 gap-[1.6cqw]">
        {[1, 0, 0, 0, 0].map((a, i) => (
          <span key={i} className={`size-[1.8cqw] rounded-full ${a ? "bg-ink" : "bg-ink/25"}`} />
        ))}
      </div>
    </div>
  );
}

function Countdown() {
  return (
    <div className="absolute inset-0 bg-ink-2">
      <span
        className="display absolute -right-[4cqw] top-1/2 -translate-y-1/2 leading-none text-paper"
        style={{ fontSize: "82cqh" }}
      >
        03
      </span>
      <span className="edge absolute bottom-[8cqh] left-[7cqw] text-dim">Days to drop</span>
    </div>
  );
}

function Split() {
  return (
    <div className="absolute inset-0 grid grid-rows-3 bg-ink">
      {["Faster.", "Clearer.", "Yours."].map((w, i) => (
        <div
          key={w}
          className={`flex items-center justify-between px-[7cqw] ${
            i === 1 ? "bg-paper text-ink" : "border-b border-line text-paper"
          }`}
        >
          <span className="display" style={{ fontSize: "11cqw" }}>
            {w}
          </span>
          <span className="edge opacity-60">{["A", "B", "C"][i]}</span>
        </div>
      ))}
    </div>
  );
}

function Viewfinder() {
  const c = "absolute size-[10cqw] border-paper";
  return (
    <div className="absolute inset-0 bg-ink-3">
      <span className={`${c} left-[8cqw] top-[6cqh] border-l border-t`} />
      <span className={`${c} right-[8cqw] top-[6cqh] border-r border-t`} />
      <span className={`${c} bottom-[6cqh] left-[8cqw] border-b border-l`} />
      <span className={`${c} bottom-[6cqh] right-[8cqw] border-b border-r`} />
      <span className="absolute left-1/2 top-1/2 size-[14cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/60" />
      <span className="edge absolute left-[12cqw] top-[10cqh] flex items-center gap-[1.4cqw] text-paper">
        <span className="size-[1.6cqw] rounded-full bg-paper" />
        Rec
      </span>
      <span className="edge absolute bottom-[10cqh] right-[12cqw] text-paper/70">00:14:08</span>
    </div>
  );
}

function Focus() {
  return (
    <div className="absolute inset-0 bg-ink-2">
      {[94, 70, 48, 28].map((d, i) => (
        <span
          key={d}
          className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper"
          style={{ width: `${d}cqh`, opacity: 0.1 + i * 0.14 }}
        />
      ))}
      <span className="absolute left-[6cqw] right-[6cqw] top-1/2 h-px bg-paper/20" />
      <span className="absolute bottom-[8cqh] top-[8cqh] left-1/2 w-px bg-paper/20" />
      <span className="absolute left-1/2 top-1/2 size-[6cqh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper" />
      <span className="edge absolute left-[4cqw] top-[6cqh] text-dim">Focus</span>
      <span className="edge absolute bottom-[6cqh] right-[4cqw] text-dim">ƒ/1.4 · 1/250</span>
    </div>
  );
}

function Ornament() {
  return (
    <div className="absolute inset-0 bg-ink-2">
      <span className="absolute left-[30cqw] top-1/2 aspect-square -translate-y-1/2 rounded-full border border-paper/40" style={{ width: "78cqh" }} />
      <span className="absolute left-[38cqw] top-1/2 aspect-square -translate-y-1/2 rounded-full bg-paper/90" style={{ width: "46cqh" }} />
      <span className="absolute left-[52cqw] top-[22cqh] aspect-square rounded-full border border-paper/60" style={{ width: "30cqh" }} />
      {[0, 1, 2].map((i) => (
        <span key={i} className="absolute left-[6cqw] h-px w-[20cqw] bg-paper/30" style={{ top: `${58 + i * 7}cqh` }} />
      ))}
      <span className="edge absolute left-[4cqw] top-[8cqh] text-dim">Looks good</span>
      <span className="edge absolute bottom-[8cqh] right-[4cqw] text-dim">Says nothing</span>
    </div>
  );
}

function Unseen() {
  return (
    <div className="absolute inset-0 bg-ink">
      <span className="absolute left-[28cqw] right-[28cqw] top-[16cqh] bottom-[16cqh] border border-paper/10 bg-ink-2" />
      <span className="absolute left-[34cqw] top-[30cqh] h-[6cqh] w-[24cqw] bg-ink-3" />
      <span className="absolute left-[34cqw] top-[44cqh] h-[3cqh] w-[32cqw] bg-ink-3" />
      <span className="absolute left-[34cqw] top-[52cqh] h-[3cqh] w-[20cqw] bg-ink-3" />
      <span className="edge absolute left-[4cqw] top-[8cqh] text-dim">Posted</span>
      <span className="edge absolute bottom-[8cqh] right-[4cqw] text-dim">Unseen</span>
    </div>
  );
}
