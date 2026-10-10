import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Reeveri",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      {/* The marketing site hides the native cursor; the dashboard needs it. */}
      <style>{`html.has-cursor, html.has-cursor * { cursor: auto !important; } html.has-cursor button, html.has-cursor a { cursor: pointer !important; }`}</style>
      {children}
    </div>
  );
}
