"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { mediaUrl } from "@/lib/api";
import { uploadFiles, type Uploaded } from "@/lib/adminApi";

export const input =
  "w-full rounded-none border border-line-strong bg-transparent px-3 py-2.5 text-paper outline-none transition-colors placeholder:text-rebate focus:border-marker";
export const btn =
  "inline-flex h-10 items-center justify-center gap-2 px-4 text-[0.9rem] font-semibold transition-colors disabled:opacity-50";
export const btnPrimary = `${btn} bg-marker text-on-marker hover:bg-paper hover:text-ink`;
export const btnGhost = `${btn} ring-1 ring-inset ring-line-strong text-paper hover:ring-paper`;

export function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="edge mb-1.5 block text-rebate">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[0.8rem] text-rebate">{hint}</span>}
    </label>
  );
}

export function Thumb({ src, kind = "image", className = "" }: { src: string; kind?: "image" | "video"; className?: string }) {
  if (kind === "video") return <video src={mediaUrl(src)} muted preload="metadata" className={`object-cover ${className}`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={mediaUrl(src)} alt="" draggable={false} className={`object-cover ${className}`} />;
}

// Upload button that returns the uploaded files to the caller.
export function UploadButton({
  label,
  accept = "image/*,video/*",
  multiple = false,
  onUploaded,
  onError,
}: {
  label: string;
  accept?: string;
  multiple?: boolean;
  onUploaded: (files: Uploaded[]) => void;
  onError: (msg: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <input
        ref={ref}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={async (e) => {
          const files = e.target.files;
          if (!files?.length) return;
          setBusy(true);
          try {
            onUploaded(await uploadFiles(files));
          } catch (err) {
            onError(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
            if (ref.current) ref.current.value = "";
          }
        }}
      />
      <button type="button" className={btnGhost} disabled={busy} onClick={() => ref.current?.click()}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        {busy ? "Uploading…" : label}
      </button>
    </>
  );
}

// A single image: preview, URL, and upload.
export function ImageField({
  label,
  value,
  onChange,
  onError,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onError: (msg: string) => void;
}) {
  return (
    <div>
      <span className="edge mb-1.5 block text-rebate">{label}</span>
      <div className="flex items-center gap-3">
        <div className="size-16 shrink-0 overflow-hidden bg-ink-2">{value && <Thumb src={value} className="size-full" />}</div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input className={input} value={value} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/…" />
          <div>
            <UploadButton label="Upload image" accept="image/*" onUploaded={(f) => onChange(f[0].src)} onError={onError} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function RemoveButton({ onClick, label = "Remove" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex size-8 shrink-0 items-center justify-center text-rebate hover:text-marker">
      <X className="size-4" />
    </button>
  );
}
