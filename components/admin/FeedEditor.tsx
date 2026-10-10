"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { FeedItem } from "@/lib/api";
import { makePoster } from "@/lib/adminApi";
import { Field, ImageField, RemoveButton, Thumb, UploadButton, btnGhost, btnPrimary, input } from "./ui";

export const blankFeed = (): Omit<FeedItem, "id"> => ({
  type: "poster",
  title: "",
  caption: "",
  client: "",
  size: "sm",
  media: [],
  poster: "",
  published: true,
});

export function FeedEditor({
  initial,
  isNew,
  onSave,
  onCancel,
  onError,
}: {
  initial: Omit<FeedItem, "id"> & { id?: string };
  isNew: boolean;
  onSave: (f: Omit<FeedItem, "id"> & { id?: string }) => Promise<void>;
  onCancel: () => void;
  onError: (m: string) => void;
}) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof FeedItem>(k: K, v: FeedItem[K]) => setF((p) => ({ ...p, [k]: v }));
  const single = f.type !== "carousel";

  const swap = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= f.media.length) return;
    const m = [...f.media];
    [m[i], m[j]] = [m[j], m[i]];
    set("media", m);
  };

  return (
    <form
      className="mx-auto max-w-3xl space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        if (f.media.length === 0) return onError("Upload at least one image or video");
        setSaving(true);
        try {
          await onSave(f);
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="display text-[1.6rem]">{isNew ? "New creative" : "Edit creative"}</h2>
        <div className="flex gap-2">
          <button type="button" className={btnGhost} onClick={onCancel}>Cancel</button>
          <button type="submit" className={btnPrimary} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Type">
          <select
            className={input}
            value={f.type}
            onChange={(e) => {
              const type = e.target.value as FeedItem["type"];
              setF((p) => ({ ...p, type, media: type === "carousel" ? p.media : p.media.slice(0, 1) }));
            }}
          >
            <option value="poster">Poster</option>
            <option value="reel">Reel (video)</option>
            <option value="carousel">Carousel</option>
          </select>
        </Field>
                <Field label="Client / brand">
          <input className={input} value={f.client} onChange={(e) => set("client", e.target.value)} />
        </Field>
      </div>
      <Field label="Title">
        <input className={input} required value={f.title} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field label="Caption">
        <textarea className={input} rows={4} value={f.caption} onChange={(e) => set("caption", e.target.value)} />
      </Field>

      <div>
        <span className="edge mb-2 block text-rebate">
          {f.type === "carousel" ? "Slides (images or videos, in order)" : f.type === "reel" ? "Reel video" : "Poster image"}
        </span>
        <ul className="mb-3 flex flex-wrap gap-3">
          {f.media.map((m, i) => (
            <li key={m.src + i} className="relative w-28">
              <div className="aspect-[4/5] overflow-hidden bg-ink-2"><Thumb src={m.src} kind={m.kind} className="size-full" /></div>
              <div className="mt-1 flex items-center justify-between">
                {!single ? (
                  <>
                    <button type="button" aria-label="Move earlier" onClick={() => swap(i, -1)} className="p-1 text-rebate hover:text-paper"><ArrowLeft className="size-4" /></button>
                    <button type="button" aria-label="Move later" onClick={() => swap(i, 1)} className="p-1 text-rebate hover:text-paper"><ArrowRight className="size-4" /></button>
                  </>
                ) : <span />}
                <RemoveButton onClick={() => set("media", f.media.filter((_, k) => k !== i))} />
              </div>
            </li>
          ))}
        </ul>
        <UploadButton
          label={single ? (f.media.length ? "Replace file" : "Upload file") : "Add slides"}
          accept={f.type === "poster" ? "image/*" : f.type === "reel" ? "video/*" : "image/*,video/*"}
          multiple={!single}
          onError={onError}
          onUploaded={async (files, originals) => {
            set("media", single ? files.slice(0, 1).map(({ src, kind }) => ({ src, kind })) : [...f.media, ...files.map(({ src, kind }) => ({ src, kind }))]);
            // A reel gets a cover image automatically, so the grid shows a picture instead of loading the video.
            if (f.type === "reel" && files[0]?.kind === "video") {
              const poster = await makePoster(originals[0]);
              if (poster) set("poster", poster.src);
            }
          }}
        />
      </div>

      {f.type === "reel" && (
        <ImageField label="Cover image (made automatically from the video, or upload your own)" value={f.poster ?? ""} onChange={(v) => set("poster", v)} onError={onError} />
      )}

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={f.published !== false} onChange={(e) => set("published", e.target.checked)} />
        <span>Published (visible on the Work page)</span>
      </label>
    </form>
  );
}
