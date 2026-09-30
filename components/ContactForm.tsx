"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useId, type FormEvent, type ReactNode } from "react";
import { services } from "@/lib/content";
import { Pencil } from "./Pencil";
import { EASE } from "./ui";

const timelines = ["As soon as possible", "In the next 1–3 months", "Just exploring"];

const fieldBase =
  "w-full bg-transparent py-3 text-[clamp(1.4rem,2.6vw,2.25rem)] font-medium tracking-[-0.02em] text-paper outline-none placeholder:text-paper/55";

function Field({ id, label, optional, children }: { id: string; label: string; optional?: boolean; children: ReactNode }) {
  return (
    <div className="pb-7">
      <label htmlFor={id} className="edge flex justify-between text-dim">
        <span>{label}</span>
        {optional && <span>Optional</span>}
      </label>
      <div className="relative border-b border-paper/30 after:absolute after:-bottom-px after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-marker after:transition-transform after:duration-500 after:ease-out-expo focus-within:after:scale-x-100">
        {children}
      </div>
    </div>
  );
}

function Chip({ type, name, value, children }: { type: "checkbox" | "radio"; name: string; value: string; children: ReactNode }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} className="peer sr-only" />
      <span className="inline-flex h-12 items-center rounded-full border border-paper/35 px-5 text-base font-medium text-paper transition-colors duration-300 hover:border-paper peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-marker">
        {children}
      </span>
    </label>
  );
}

export function ContactForm({ aside }: { aside?: ReactNode }) {
  const uid = useId();
  const reduce = useReducedMotion();
  const id = (k: string) => `${uid}-${k}`;

  return (
    <motion.div
      initial={reduce ? false : { clipPath: "inset(14% 0 0 0)", opacity: 0, y: 40 }}
      whileInView={{ clipPath: "inset(0% 0 0 0)", opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1, ease: EASE }}
      className="relative bg-ink text-paper"
    >
      <div aria-hidden="true" className="relative bg-ink-3 py-3">
        <div className="sprockets absolute inset-x-0 top-0.5 h-2" />
        <p className="edge flex justify-between px-6 pt-2.5 text-dim md:px-12">
          <span>Reeveri 400 · Brief sheet</span>
          <span>→ 44</span>
        </p>
      </div>

      <div className="px-6 pb-10 pt-10 md:px-12 md:pb-14 md:pt-14 lg:grid lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <p className="display relative inline-block text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] lg:text-[clamp(2.5rem,3.9vw,4rem)]">
            Start a<br className="hidden lg:block" /> project.
            <Pencil kind="underline" inView delay={0.5} className="-bottom-[0.08em] left-0 h-[0.2em] w-full" strokeWidth={3} />
          </p>
          {aside}
        </div>

        <form
          aria-label="Start a project"
          noValidate
          onSubmit={(e: FormEvent) => e.preventDefault()}
          className="mt-10 grid gap-x-12 md:mt-14 md:grid-cols-2 lg:col-span-8 lg:mt-0"
        >
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
            <legend className="edge text-dim">What do you need</legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {services.map((s) => (
                <Chip key={s.title} type="checkbox" name="services" value={s.title}>
                  {s.title}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-9 md:col-span-2">
            <legend className="edge text-dim">When</legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {timelines.map((t) => (
                <Chip key={t} type="radio" name="timeline" value={t}>
                  {t}
                </Chip>
              ))}
            </div>
          </fieldset>

          <div className="mt-9 md:col-span-2">
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

          <div className="mt-4 md:col-span-2">
            <div className="relative inline-block">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="group relative z-10 inline-flex h-16 items-center gap-3 rounded-full bg-marker px-9 text-lg font-semibold tracking-[-0.01em] text-ink transition-colors duration-300 hover:bg-paper sm:h-20 sm:px-12 sm:text-xl"
              >
                Send the brief
                <ArrowRight aria-hidden="true" className="size-[1.1em] transition-transform duration-500 ease-out-expo group-hover:translate-x-1" strokeWidth={2.2} />
              </motion.button>
              <Pencil
                kind="circle"
                inView
                delay={0.6}
                duration={1}
                color="var(--color-paper)"
                strokeWidth={2}
                className="-left-[8%] -top-[30%] z-0 h-[160%] w-[116%]"
              />
            </div>
          </div>
        </form>
      </div>

      <div aria-hidden="true" className="relative h-5 bg-ink-3">
        <div className="sprockets absolute inset-x-0 bottom-1.5 h-2" />
      </div>
    </motion.div>
  );
}
