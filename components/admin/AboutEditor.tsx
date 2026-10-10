"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import type { AboutContent } from "@/lib/about";
import { Field, ImageField, RemoveButton, btnGhost, btnPrimary, input } from "./ui";

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <legend className="display float-left text-[1.2rem]">{title}</legend>
        {action}
      </div>
      <div className="clear-both space-y-4">{children}</div>
    </fieldset>
  );
}

const move = <T,>(arr: T[], i: number, d: number) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const c = [...arr];
  [c[i], c[j]] = [c[j], c[i]];
  return c;
};

export function AboutEditor({
  initial,
  onSave,
  onError,
}: {
  initial: AboutContent;
  onSave: (a: AboutContent) => Promise<void>;
  onError: (m: string) => void;
}) {
  const [a, setA] = useState<AboutContent>(initial);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof AboutContent>(k: K, v: AboutContent[K]) => setA((p) => ({ ...p, [k]: v }));

  return (
    <form
      className="mx-auto max-w-3xl space-y-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          await onSave(a);
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="display text-[1.6rem]">About page</h2>
        <div className="flex gap-2">
          <a className={btnGhost} href="/about" target="_blank" rel="noreferrer">
            View page
          </a>
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <Section title="Top of the page">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Headline, line 1">
            <input className={input} value={a.hero.headline[0]} onChange={(e) => set("hero", { ...a.hero, headline: [e.target.value, a.hero.headline[1]] })} />
          </Field>
          <Field label="Headline, line 2 (underlined)">
            <input className={input} value={a.hero.headline[1]} onChange={(e) => set("hero", { ...a.hero, headline: [a.hero.headline[0], e.target.value] })} />
          </Field>
        </div>
        <Field label="Intro paragraph">
          <textarea className={input} rows={3} value={a.hero.intro} onChange={(e) => set("hero", { ...a.hero, intro: e.target.value })} />
        </Field>
      </Section>

      <Section
        title="Why we exist"
        action={
          <button type="button" className={btnGhost} onClick={() => set("story", { ...a.story, paragraphs: [...a.story.paragraphs, ""] })}>
            <Plus className="size-4" /> Add paragraph
          </button>
        }
      >
        <Field label="Big statement">
          <textarea className={input} rows={2} value={a.story.statement} onChange={(e) => set("story", { ...a.story, statement: e.target.value })} />
        </Field>
        {a.story.paragraphs.map((p, i) => (
          <div key={i} className="flex items-start gap-3">
            <textarea
              className={input}
              rows={3}
              value={p}
              aria-label={`Paragraph ${i + 1}`}
              onChange={(e) => set("story", { ...a.story, paragraphs: a.story.paragraphs.map((x, j) => (j === i ? e.target.value : x)) })}
            />
            <RemoveButton onClick={() => set("story", { ...a.story, paragraphs: a.story.paragraphs.filter((_, j) => j !== i) })} />
          </div>
        ))}
      </Section>

      <Section
        title="What we believe"
        action={
          <button type="button" className={btnGhost} onClick={() => set("beliefs", [...a.beliefs, { title: "", text: "" }])}>
            <Plus className="size-4" /> Add
          </button>
        }
      >
        {a.beliefs.map((b, i) => (
          <div key={i} className="space-y-2 border border-line p-3">
            <div className="flex items-center gap-2">
              <input
                className={input}
                value={b.title}
                placeholder="Title"
                onChange={(e) => set("beliefs", a.beliefs.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
              />
              <button type="button" className={btnGhost} aria-label="Move up" onClick={() => set("beliefs", move(a.beliefs, i, -1))}>↑</button>
              <button type="button" className={btnGhost} aria-label="Move down" onClick={() => set("beliefs", move(a.beliefs, i, 1))}>↓</button>
              <RemoveButton onClick={() => set("beliefs", a.beliefs.filter((_, j) => j !== i))} />
            </div>
            <textarea
              className={input}
              rows={2}
              value={b.text}
              placeholder="One or two sentences"
              onChange={(e) => set("beliefs", a.beliefs.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
            />
          </div>
        ))}
      </Section>

      <Section
        title="The team"
        action={
          <button type="button" className={btnGhost} onClick={() => set("team", [...a.team, { name: "", role: "", bio: "", photo: "" }])}>
            <Plus className="size-4" /> Add person
          </button>
        }
      >
        {a.team.map((m, i) => {
          const upd = (k: keyof typeof m, v: string) => set("team", a.team.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
          return (
            <div key={i} className="space-y-3 border border-line p-3">
              <div className="flex items-center gap-2">
                <input className={input} value={m.name} placeholder="Name" onChange={(e) => upd("name", e.target.value)} />
                <input className={input} value={m.role} placeholder="Role (optional)" onChange={(e) => upd("role", e.target.value)} />
                <button type="button" className={btnGhost} aria-label="Move up" onClick={() => set("team", move(a.team, i, -1))}>↑</button>
                <button type="button" className={btnGhost} aria-label="Move down" onClick={() => set("team", move(a.team, i, 1))}>↓</button>
                <RemoveButton onClick={() => set("team", a.team.filter((_, j) => j !== i))} />
              </div>
              <textarea className={input} rows={2} value={m.bio} placeholder="One-line bio (optional)" onChange={(e) => upd("bio", e.target.value)} />
              <ImageField label="Photo (optional)" value={m.photo} onChange={(v) => upd("photo", v)} onError={onError} />
            </div>
          );
        })}
      </Section>

      <Section title="Closing block">
        <Field label="Heading">
          <input className={input} value={a.cta.heading} onChange={(e) => set("cta", { ...a.cta, heading: e.target.value })} />
        </Field>
        <Field label="Text">
          <textarea className={input} rows={2} value={a.cta.text} onChange={(e) => set("cta", { ...a.cta, text: e.target.value })} />
        </Field>
      </Section>

      <p className="text-[0.9rem] text-rebate">
        The &quot;What we do&quot; and &quot;How we work&quot; sections show the site&apos;s services and process, shared with the home page.
      </p>
    </form>
  );
}
