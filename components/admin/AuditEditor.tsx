"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import type { Audit } from "@/lib/audits";
import { ImageField, RemoveButton, UploadButton, Field, Thumb, btnGhost, btnPrimary, input } from "./ui";

export const blankAudit = (n: number): Audit => ({
  slug: "",
  n: String(n).padStart(2, "0"),
  brand: "",
  wordmark: "",
  category: "",
  date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  headline: ["", ""],
  summary: "",
  lead: "",
  site: "",
  cover: [],
  logo: "",
  demo: { src: "", label: "" },
  stats: [],
  findings: [],
  next: [],
  notes: [],
});

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

export function AuditEditor({
  initial,
  isNew,
  onSave,
  onCancel,
  onDelete,
  onError,
}: {
  initial: Audit;
  isNew: boolean;
  onSave: (a: Audit) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
  onError: (m: string) => void;
}) {
  const [a, setA] = useState<Audit>(initial);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Audit>(k: K, v: Audit[K]) => setA((p) => ({ ...p, [k]: v }));
  const text = (k: "brand" | "wordmark" | "category" | "date" | "site" | "n" | "slug", label: string, hint?: string) => (
    <Field label={label} hint={hint}>
      <input className={input} value={a[k]} onChange={(e) => set(k, e.target.value)} />
    </Field>
  );

  return (
    <form
      className="space-y-8"
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
        <h2 className="display text-[1.6rem]">{isNew ? "New audit" : `Edit: ${initial.brand}`}</h2>
        <div className="flex gap-2">
          {onDelete && (
            <button type="button" className={btnGhost} onClick={onDelete}>
              Delete
            </button>
          )}
          <button type="button" className={btnGhost} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? "Saving…" : "Save audit"}
          </button>
        </div>
      </div>

      <Section title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          {text("brand", "Brand")}
          {text("wordmark", "Wordmark", "e.g. JAIPUR KURTI")}
          {text("slug", "URL slug", isNew ? "Leave blank to use the brand name" : "Changing this changes the public URL")}
          {text("n", "Audit number", "e.g. 01")}
          {text("category", "Category")}
          {text("date", "Date reviewed")}
          {text("site", "Brand website", "e.g. jaipurkurti.com")}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Headline, line 1">
            <input className={input} value={a.headline[0]} onChange={(e) => set("headline", [e.target.value, a.headline[1]])} />
          </Field>
          <Field label="Headline, line 2 (underlined)">
            <input className={input} value={a.headline[1]} onChange={(e) => set("headline", [a.headline[0], e.target.value])} />
          </Field>
        </div>
        <Field label="Summary" hint="Shown on cards.">
          <textarea className={input} rows={3} value={a.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
        <Field label="Lead paragraph" hint="Shown at the top of the audit page.">
          <textarea className={input} rows={5} value={a.lead} onChange={(e) => set("lead", e.target.value)} />
        </Field>
      </Section>

      <Section title="Images and demo">
        <ImageField label="Logo" value={a.logo} onChange={(v) => set("logo", v)} onError={onError} />
        <div>
          <span className="edge mb-1.5 block text-rebate">Cover images</span>
          <div className="space-y-2">
            {a.cover.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-14 shrink-0 overflow-hidden bg-ink-2">{c.src && <Thumb src={c.src} className="size-full" />}</div>
                <input className={input} value={c.alt} placeholder="Alt text" onChange={(e) => set("cover", a.cover.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))} />
                <RemoveButton onClick={() => set("cover", a.cover.filter((_, k) => k !== i))} />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <UploadButton
              label="Upload cover images"
              accept="image/*"
              multiple
              onError={onError}
              onUploaded={(files) => set("cover", [...a.cover, ...files.map((f) => ({ src: f.src, alt: f.name.replace(/\.[^.]+$/, "") }))])}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Demo URL" hint="A page served by the site, e.g. /demos/jaipur-kurti/index.html, or a full URL.">
            <input className={input} value={a.demo.src} onChange={(e) => set("demo", { ...a.demo, src: e.target.value })} />
          </Field>
          <Field label="Demo label">
            <input className={input} value={a.demo.label} onChange={(e) => set("demo", { ...a.demo, label: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section
        title="Stats (before / after)"
        action={
          <button type="button" className={btnGhost} onClick={() => set("stats", [...a.stats, { label: "", before: "", after: "", note: "" }])}>
            <Plus className="size-4" /> Add stat
          </button>
        }
      >
        {a.stats.map((s, i) => (
          <div key={i} className="grid items-end gap-3 md:grid-cols-[2fr_1fr_1fr_1.5fr_auto]">
            {(["label", "before", "after", "note"] as const).map((k) => (
              <Field key={k} label={k}>
                <input
                  className={input}
                  value={s[k] ?? ""}
                  onChange={(e) => set("stats", a.stats.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))}
                />
              </Field>
            ))}
            <RemoveButton onClick={() => set("stats", a.stats.filter((_, j) => j !== i))} />
          </div>
        ))}
      </Section>

      <Section
        title="Findings"
        action={
          <button
            type="button"
            className={btnGhost}
            onClick={() => set("findings", [...a.findings, { n: String(a.findings.length + 1).padStart(2, "0"), title: "", found: "", why: "", did: "" }])}
          >
            <Plus className="size-4" /> Add finding
          </button>
        }
      >
        {a.findings.map((f, i) => {
          const upd = (k: keyof typeof f, v: string) => set("findings", a.findings.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
          return (
            <div key={i} className="space-y-3 border border-line p-4">
              <div className="flex items-center gap-3">
                <input className={`${input} !w-20`} value={f.n} onChange={(e) => upd("n", e.target.value)} aria-label="Number" />
                <input className={input} value={f.title} placeholder="Title" onChange={(e) => upd("title", e.target.value)} />
                <button type="button" className={btnGhost} onClick={() => set("findings", move(a.findings, i, -1))}>↑</button>
                <button type="button" className={btnGhost} onClick={() => set("findings", move(a.findings, i, 1))}>↓</button>
                <RemoveButton onClick={() => set("findings", a.findings.filter((_, j) => j !== i))} />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Field label="What we found"><textarea className={input} rows={5} value={f.found} onChange={(e) => upd("found", e.target.value)} /></Field>
                <Field label="Why it matters"><textarea className={input} rows={5} value={f.why} onChange={(e) => upd("why", e.target.value)} /></Field>
                <Field label="What we did"><textarea className={input} rows={5} value={f.did} onChange={(e) => upd("did", e.target.value)} /></Field>
              </div>
            </div>
          );
        })}
      </Section>

      <Section
        title="What comes next"
        action={
          <button type="button" className={btnGhost} onClick={() => set("next", [...a.next, { title: "", line: "" }])}>
            <Plus className="size-4" /> Add item
          </button>
        }
      >
        {a.next.map((n, i) => (
          <div key={i} className="flex items-center gap-3">
            <input className={input} value={n.title} placeholder="Title" onChange={(e) => set("next", a.next.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
            <input className={input} value={n.line} placeholder="One line" onChange={(e) => set("next", a.next.map((x, j) => (j === i ? { ...x, line: e.target.value } : x)))} />
            <RemoveButton onClick={() => set("next", a.next.filter((_, j) => j !== i))} />
          </div>
        ))}
      </Section>

      <Section
        title="How to read this (notes)"
        action={
          <button type="button" className={btnGhost} onClick={() => set("notes", [...a.notes, ""])}>
            <Plus className="size-4" /> Add note
          </button>
        }
      >
        {a.notes.map((n, i) => (
          <div key={i} className="flex items-start gap-3">
            <textarea className={input} rows={2} value={n} onChange={(e) => set("notes", a.notes.map((x, j) => (j === i ? e.target.value : x)))} />
            <RemoveButton onClick={() => set("notes", a.notes.filter((_, j) => j !== i))} />
          </div>
        ))}
      </Section>
    </form>
  );
}
