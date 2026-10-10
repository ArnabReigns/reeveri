"use client";

import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { type FeedItem } from "@/lib/api";
import { api, ApiError, getToken, setToken } from "@/lib/adminApi";
import type { Audit } from "@/lib/audits";
import { AuditEditor, blankAudit } from "./AuditEditor";
import { FeedEditor, blankFeed } from "./FeedEditor";
import { Field, Thumb, btnGhost, btnPrimary, input } from "./ui";

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Tab = "feed" | "audits";
type FeedDraft = Omit<FeedItem, "id"> & { id?: string };

function Login({ onDone }: { onDone: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="edge text-rebate">Reeveri · Admin</p>
      <h1 className="display mt-2 text-[2rem]">Sign in</h1>
      <form
        className="mt-8 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr("");
          try {
            const { token } = await api<{ token: string }>("/api/login", { method: "POST", json: { username: u, password: p } });
            setToken(token);
            onDone();
          } catch (e) {
            setErr(e instanceof Error ? e.message : "Could not sign in");
          } finally {
            setBusy(false);
          }
        }}
      >
        <Field label="Username"><input className={input} autoComplete="username" value={u} onChange={(e) => setU(e.target.value)} autoFocus /></Field>
        <Field label="Password"><input className={input} type="password" autoComplete="current-password" value={p} onChange={(e) => setP(e.target.value)} /></Field>
        {err && <p role="alert" className="text-marker">{err}</p>}
        <button className={`${btnPrimary} w-full`} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

function FeedCard({ f, onEarlier, onLater, onToggle, onEdit, onDelete }: { f: FeedItem; onEarlier: () => void; onLater: () => void; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: f.id });
  const icon = "flex size-8 items-center justify-center text-dim hover:text-paper";
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`border border-line bg-ink ${isDragging ? "relative z-10 opacity-80 shadow-lg" : f.published === false ? "opacity-60" : ""}`}
    >
      <div {...attributes} {...listeners} className="aspect-[3/4] cursor-grab touch-none overflow-hidden bg-ink-2 active:cursor-grabbing" aria-label={`Drag to reorder: ${f.title}`}>
        {f.media[0] && <Thumb src={f.poster || f.media[0].src} kind={f.poster ? "image" : f.media[0].kind} className="pointer-events-none size-full" />}
      </div>
      <div className="p-3">
        <p className="edge text-rebate">{f.type}{f.type === "carousel" ? ` · ${f.media.length} slides` : ""}{f.published === false ? " · hidden" : ""}</p>
        <p className="mt-1 line-clamp-2 font-semibold">{f.title}</p>
        <div className="mt-3 flex items-center gap-1">
          <button className={icon} aria-label="Move earlier" onClick={onEarlier}>←</button>
          <button className={icon} aria-label="Move later" onClick={onLater}>→</button>
          <span className="flex-1" />
          <button className={icon} aria-label={f.published === false ? "Publish" : "Hide"} onClick={onToggle}>{f.published === false ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
          <button className={icon} aria-label="Edit" onClick={onEdit}><Pencil className="size-4" /></button>
          <button className={`${icon} hover:!text-marker`} aria-label="Delete" onClick={onDelete}><Trash2 className="size-4" /></button>
        </div>
      </div>
    </li>
  );
}

export function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("feed");
  const [audits, setAudits] = useState<Audit[]>([]);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [auditEdit, setAuditEdit] = useState<{ audit: Audit; isNew: boolean } | null>(null);
  const [feedEdit, setFeedEdit] = useState<{ item: FeedDraft; isNew: boolean } | null>(null);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  const flash = useCallback((text: string, bad = false) => {
    setMsg({ text, bad });
    setTimeout(() => setMsg(null), 4000);
  }, []);
  const fail = useCallback((e: unknown) => {
    if (e instanceof ApiError && e.status === 401) {
      setToken("");
      setAuthed(false);
    }
    flash(e instanceof Error ? e.message : String(e), true);
  }, [flash]);

  const load = useCallback(async () => {
    try {
      const [a, f] = await Promise.all([api<Audit[]>("/api/audits"), api<FeedItem[]>("/api/feed?all=1")]);
      setAudits(a);
      setFeed(f);
    } catch (e) {
      fail(e);
    }
  }, [fail]);

  useEffect(() => {
    (getToken() ? api("/api/me") : Promise.reject(new Error("no token")))
      .then(() => {
        setAuthed(true);
        void load();
      })
      .catch(() => setAuthed(false));
  }, [load]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (authed === null) return null;
  if (!authed) {
    return (
      <Login
        onDone={() => {
          setAuthed(true);
          void load();
        }}
      />
    );
  }

  const saveAudit = async (a: Audit) => {
    try {
      if (auditEdit?.isNew) await api("/api/audits", { method: "POST", json: a });
      else await api(`/api/audits/${auditEdit!.audit.slug}`, { method: "PUT", json: a });
      flash("Audit saved");
      setAuditEdit(null);
      await load();
    } catch (e) {
      fail(e);
    }
  };
  const saveFeed = async (f: FeedDraft) => {
    try {
      if (feedEdit?.isNew) await api("/api/feed", { method: "POST", json: f });
      else await api(`/api/feed/${f.id}`, { method: "PUT", json: f });
      flash("Saved");
      setFeedEdit(null);
      await load();
    } catch (e) {
      fail(e);
    }
  };
  const reorder = async (i: number, j: number) => {
    if (i === j || j < 0 || j >= feed.length) return;
    const next = arrayMove(feed, i, j);
    setFeed(next);
    try {
      await api("/api/feed/reorder", { method: "PUT", json: { ids: next.map((f) => f.id) } });
    } catch (e) {
      fail(e);
      void load();
    }
  };
  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    void reorder(
      feed.findIndex((x) => x.id === e.active.id),
      feed.findIndex((x) => x.id === e.over!.id),
    );
  };
  const togglePublished = async (f: FeedItem) => {
    try {
      await api(`/api/feed/${f.id}`, { method: "PUT", json: { published: f.published === false } });
      await load();
    } catch (e) {
      fail(e);
    }
  };
  const del = async (path: string, what: string) => {
    if (!confirm(`Delete ${what}? This can't be undone.`)) return false;
    try {
      await api(path, { method: "DELETE" });
      flash("Deleted");
      await load();
      return true;
    } catch (e) {
      fail(e);
      return false;
    }
  };

  const editing = auditEdit || feedEdit;

  return (
    <div className="mx-auto max-w-[80rem] px-5 pb-24 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5">
        <div className="flex items-center gap-6">
          <span className="display text-[1.2rem]">REEVERI <span className="edge ml-2 text-rebate">Admin</span></span>
          {!editing && (
            <nav className="flex gap-1" aria-label="Sections">
              {(["feed", "audits"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} aria-current={tab === t} className={`h-9 px-3 text-[0.9rem] font-semibold ${tab === t ? "bg-marker text-on-marker" : "text-dim hover:text-paper"}`}>
                  {t === "feed" ? "Creative feed" : "Audits"}
                </button>
              ))}
            </nav>
          )}
        </div>
        <div className="flex gap-2">
          <a className={btnGhost} href="/work" target="_blank" rel="noreferrer">View Work</a>
          <a className={btnGhost} href="/audits" target="_blank" rel="noreferrer">View Audits</a>
          <button className={btnGhost} onClick={() => { setToken(""); setAuthed(false); }}>Sign out</button>
        </div>
      </header>

      {msg && (
        <p role="status" className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-5 py-3 font-semibold ${msg.bad ? "bg-marker text-on-marker" : "bg-paper text-ink"}`}>
          {msg.text}
        </p>
      )}

      <div className="pt-8">
        {auditEdit ? (
          <AuditEditor
            key={auditEdit.audit.slug || "new"}
            initial={auditEdit.audit}
            isNew={auditEdit.isNew}
            onSave={saveAudit}
            onCancel={() => setAuditEdit(null)}
            onError={(m) => flash(m, true)}
            onDelete={auditEdit.isNew ? undefined : async () => { if (await del(`/api/audits/${auditEdit.audit.slug}`, auditEdit.audit.brand)) setAuditEdit(null); }}
          />
        ) : feedEdit ? (
          <FeedEditor key={feedEdit.item.id || "new"} initial={feedEdit.item} isNew={feedEdit.isNew} onSave={saveFeed} onCancel={() => setFeedEdit(null)} onError={(m) => flash(m, true)} />
        ) : tab === "feed" ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-dim">{feed.length} creatives. Drag tiles to rearrange: this is the order on the Work page.</p>
              <button className={btnPrimary} onClick={() => setFeedEdit({ item: blankFeed(), isNew: true })}><Plus className="size-4" /> Add creative</button>
            </div>
            {feed.length === 0 && <p className="border border-line p-8 text-dim">Nothing yet. Add your first poster, reel or carousel.</p>}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={feed.map((f) => f.id)} strategy={rectSortingStrategy}>
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {feed.map((f, i) => (
                    <FeedCard
                      key={f.id}
                      f={f}
                      onEarlier={() => reorder(i, i - 1)}
                      onLater={() => reorder(i, i + 1)}
                      onToggle={() => togglePublished(f)}
                      onEdit={() => setFeedEdit({ item: f, isNew: false })}
                      onDelete={() => del(`/api/feed/${f.id}`, f.title)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-dim">{audits.length} audits.</p>
              <button className={btnPrimary} onClick={() => setAuditEdit({ audit: blankAudit(audits.length + 1), isNew: true })}><Plus className="size-4" /> New audit</button>
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {audits.map((a) => (
                <li key={a.slug} className="flex items-center gap-4 py-4">
                  <div className="size-14 shrink-0 overflow-hidden bg-ink-2">{a.cover[0] && <Thumb src={a.cover[0].src} className="size-full" />}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{a.n}. {a.brand}</p>
                    <p className="edge text-rebate">/audits/{a.slug} · {a.category}</p>
                  </div>
                  <a className={btnGhost} href={`/audits/${a.slug}`} target="_blank" rel="noreferrer">View</a>
                  <button className={btnPrimary} onClick={() => setAuditEdit({ audit: a, isNew: false })}>Edit</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
