"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { projects, type Project } from "@/lib/content";
import { FrameArt } from "./FrameArt";
import { CropMarks, Pencil } from "./Pencil";
import { EASE, SectionHead } from "./ui";

const layout = [
  { wrap: "md:col-span-12", aspect: "aspect-[4/3]", meta: "md:col-span-4 md:self-end md:pb-2" },
  { wrap: "md:col-span-5", aspect: "aspect-[4/5]", meta: "" },
  { wrap: "md:col-span-6 md:col-start-7 md:mt-[16vw]", aspect: "aspect-[4/5]", meta: "" },
  { wrap: "md:col-span-12", aspect: "aspect-[4/3] md:aspect-[21/9]", meta: "" },
];

function Media({ project }: { project: Project }) {
  if (project.media?.type === "image") {
    return (
      <Image
        src={project.media.src}
        alt={project.media.alt}
        fill
        sizes="(min-width: 768px) 66vw, 100vw"
        className="object-cover"
      />
    );
  }
  if (project.media?.type === "video") {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={project.media.src}
        poster={project.media.poster}
        autoPlay
        muted
        loop
        playsInline
        aria-label={project.media.alt}
      />
    );
  }
  return <FrameArt variant={project.art} />;
}

function ProjectFrame({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const innerY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);
  const l = layout[index % layout.length];
  const label = project.href ? "View project" : `Frame ${project.frame}`;

  const frame = (
    <div
      ref={ref}
      data-cursor="view"
      data-cursor-label={label}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="relative"
    >
      <motion.div
        className={`relative overflow-hidden bg-ink-2 ${l.aspect}`}
        initial={reduce ? false : { clipPath: "inset(12% 8% 12% 8%)", opacity: 0.2 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <motion.div
          className="absolute inset-[-7%] transition-transform duration-[1.2s] ease-out-expo"
          style={{ y: innerY, scale: hover && !reduce ? 1.04 : 1 }}
        >
          <Media project={project} />
        </motion.div>
        {project.placeholder && (
          <span className="edge absolute bottom-3 left-3 bg-ink/80 px-2 py-1 text-dim">
            Case study coming soon
          </span>
        )}
      </motion.div>
      <CropMarks show={hover} />
    </div>
  );

  return (
    <article className={`grid gap-6 md:grid-cols-12 ${l.wrap}`} aria-labelledby={`project-${project.n}`}>
      <div className={l.meta ? "md:col-span-8" : "md:col-span-12"}>
        <div className="mb-2 flex items-center justify-between text-rebate">
          <span className="edge relative">
            → {project.frame}
            {index === 0 && <Pencil kind="circle" inView delay={0.4} className="-inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]" strokeWidth={2} />}
          </span>
          <span className="edge">Reeveri 400 · {project.year}</span>
        </div>
        {project.href ? (
          <a href={project.href} aria-label={`${project.title} case study`} className="block">
            {frame}
          </a>
        ) : (
          frame
        )}
      </div>

      <div className={`${l.meta || "md:col-span-12"} grid grid-cols-[auto_1fr] gap-x-5 gap-y-2`}>
        <span className="display text-[clamp(1.5rem,2.4vw,2.25rem)] text-rebate">{project.n}</span>
        <div>
          <h3 id={`project-${project.n}`} className="display text-[clamp(1.75rem,3vw,2.75rem)] leading-none">
            {project.title}
          </h3>
          <p className="edge mt-3 text-dim">
            {project.category} · {project.year}
          </p>
          <p className="mt-4 max-w-md text-dim">{project.description}</p>
        </div>
      </div>
    </article>
  );
}

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="gutter mx-auto max-w-[110rem] pb-[clamp(6rem,12vw,11rem)] pt-[clamp(4rem,8vw,7rem)]">
      <SectionHead
        id="work-title"
        title="Selected work"
        aside={
          <p>
            A contact sheet of what we make. These frames are placeholders while real projects are added.
          </p>
        }
      />
      <div className="mt-16 grid gap-x-8 gap-y-20 md:mt-24 md:grid-cols-12 md:gap-y-28">
        {projects.map((p, i) => (
          <ProjectFrame key={p.n} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
