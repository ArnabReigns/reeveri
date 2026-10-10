"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "reeveri-theme";
const THEME_COLOR: Record<Theme, string> = { light: "#f1f0ea", dark: "#0b0b0a" };

// The <html data-theme> attribute is the single source of truth (set before paint by the inline script in layout).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "dark" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = () => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage can be blocked; the choice just won't persist */
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[next]);
    window.setTimeout(() => root.classList.remove("theme-switching"), 450);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`relative flex size-11 shrink-0 items-center justify-center rounded-full text-paper ring-1 ring-inset ring-line-strong transition-colors duration-300 hover:ring-paper max-md:size-10 ${className}`}
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.8} />
      ) : (
        <Moon aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.8} />
      )}
    </button>
  );
}
