"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useId, type FormEvent, type ReactNode } from "react";
import { services } from "@/lib/content";
import { Pencil } from "./Pencil";

const timelines = ["As soon as possible", "In the next 1–3 months", "Just exploring"];

const fieldBase =
  "w-full bg-transparent py-3 text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium tracking-[-0.01em] text-ink outline-none placeholder:text-ink/60";

function Field({ id, label, optional, children }: { id: string; label: string; optional?: boolean; children: ReactNode }) {
  return (
    <div className="pb-6">
      <label htmlFor={id} className="edge flex justify-between text-ink/70">
        <span>{label}</span>
        {optional && <span>Optional</span>}
      </label>
      <div className="relative border-b border-ink/30 after:absolute after:-bottom-px after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-marker after:transition-transform after:duration-500 after:ease-out-expo focus-within:after:scale-x-100">
        {children}
      </div>
    </div>
  );
}

function Chip({ type, name, value, children }: { type: "checkbox" | "radio"; name: string; value: string; children: ReactNode }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} className="peer sr-only" />
      <span className="inline-flex h-11 items-center rounded-full border border-ink/35 px-5 text-[0.95rem] font-medium text-ink transition-colors duration-300 hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-marker">
        {children}
      </span>
    </label>
  );
}

export function ContactForm() {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  return (
    <form aria-label="Start a project" noValidate onSubmit={(e: FormEvent) => e.preventDefault()} className="grid gap-x-10 md:grid-cols-2">
      <Field id={id("name")} label="Your name">
        <input id={id("name")} name="name" autoComplete="name" placeholder="Who are we talking to?" className={fieldBase} />
      </Field>
      <Field id={id("email")} label="Email">
        <input id={id("email")} name="email" type="email" autoComplete="email" placeholder="you@brand.com" className={fieldBase} />
      </Field>
      <div className="md:col-span-2">
        <Field id={id("brand")} label="Brand or company" optional>
          <input id={id("brand")} name="brand" autoComplete="organization" placeholder="What are we making noise for?" className={fieldBase} />
        </Field>
      </div>

      <fieldset className="md:col-span-2">
        <legend className="edge text-ink/70">What do you need</legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {services.map((s) => (
            <Chip key={s.title} type="checkbox" name="services" value={s.title}>
              {s.title}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8 md:col-span-2">
        <legend className="edge text-ink/70">When</legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {timelines.map((t) => (
            <Chip key={t} type="radio" name="timeline" value={t}>
              {t}
            </Chip>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 md:col-span-2">
        <Field id={id("message")} label="The brief">
          <textarea
            id={id("message")}
            name="message"
            rows={3}
            placeholder="Tell us about the brand and what you want to change."
            className={`${fieldBase} resize-none`}
          />
        </Field>
      </div>

      <div className="mt-2 md:col-span-2">
        <div className="relative inline-block">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="group relative z-10 inline-flex h-16 items-center gap-3 rounded-full bg-marker px-8 text-lg font-semibold tracking-[-0.01em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper sm:h-20 sm:px-10 sm:text-xl"
          >
            Send the brief
            <ArrowRight aria-hidden="true" className="size-[1.1em] transition-transform duration-500 ease-out-expo group-hover:translate-x-1" strokeWidth={2.2} />
          </motion.button>
          <Pencil
            kind="circle"
            inView
            delay={0.4}
            duration={1}
            color="var(--color-ink)"
            strokeWidth={2}
            className="-left-[8%] -top-[30%] z-0 h-[160%] w-[116%]"
          />
        </div>
      </div>
    </form>
  );
}
