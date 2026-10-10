"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { Pencil } from "./Pencil";
import { ThemeToggle } from "./ThemeToggle";
import { EASE, MagneticLink } from "./ui";

// "/#services" -> "services"; page links such as "/audits" have no section id.
const MotionLink = motion.create(Link);

const sectionId = (href: string) => (href.includes("#") ? href.split("#")[1] : null);

export function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.4 });
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const firstLink = useRef<HTMLAnchorElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 40));

  // Links to a section of the page you are already on (e.g. "/#contact" from the home page) scroll to it directly.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", url.pathname + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Arriving from another page with a hash (e.g. /about -> /#contact): scroll once the page has rendered.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const t = window.setTimeout(() => document.getElementById(decodeURIComponent(hash))?.scrollIntoView({ block: "start" }), 120);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id;
          if (e.isIntersecting) setActive(id);
          else setActive((cur) => (cur === id ? null : cur));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    site.nav.forEach((item) => {
      const id = sectionId(item.href);
      const el = id ? document.getElementById(id) : null;
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  // On the home page the active link follows the section in view; on other pages it follows the route.
  const activeIndex = onHome
    ? site.nav.findIndex((n) => sectionId(n.href) === active)
    : site.nav.findIndex((n) => !n.href.includes("#") && pathname.startsWith(n.href));

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className={`gutter fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
          compact || open ? "border-b border-line bg-ink/92" : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-[110rem] items-center justify-between transition-[height] duration-500 ease-out-expo ${
            compact ? "h-16" : "h-20 md:h-24"
          }`}
        >
          <div className="relative z-10 flex items-center gap-5">
            <Link
              href="/"
              className="group display relative inline-flex min-h-11 shrink-0 items-center text-[1.35rem] tracking-[-0.02em] md:text-2xl"
              onClick={() => {
                setOpen(false);
                if (onHome) window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span className="whitespace-nowrap">
                {site.wordmark}
                {/* The red dot is the wordmark's full stop: it sits on the baseline, right after the last letter. */}
                <span
                  aria-hidden="true"
                  className="ml-[0.08em] inline-block size-[0.2em] rounded-full bg-marker transition-transform duration-500 ease-out-expo group-hover:scale-125"
                />
              </span>
              <span className="sr-only"> home</span>
            </Link>
            <span aria-hidden="true" className="hidden h-5 w-px bg-line-strong lg:block" />
            <span aria-hidden="true" className="edge hidden w-40 overflow-hidden text-rebate lg:block">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={active ?? "top"}
                  className="block"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {activeIndex >= 0
                    ? `→ ${String(activeIndex + 1).padStart(2, "0")} · ${site.nav[activeIndex].label}`
                    : "→ 00 · Contact sheet"}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <ul className="hidden items-center gap-1 md:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            {site.nav.map((item, i) => {
              const isActive = activeIndex === i;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`group relative flex items-start gap-1 rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors duration-300 hover:bg-ink-3 ${
                      isActive ? "text-paper" : "text-paper/70 hover:text-paper"
                    }`}
                  >
                    {item.label}
                    <span className="edge -mt-0.5 text-[0.55rem] text-rebate transition-colors group-hover:text-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {isActive && (
                      <Pencil
                        key={item.href}
                        kind="underline"
                        className="bottom-0.5 left-3 h-2 w-[calc(100%-1.75rem)]"
                        duration={0.45}
                        strokeWidth={2.4}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1 sm:gap-3">
            <ThemeToggle />
            <MagneticLink
              href={site.audit.href}
              className="max-md:h-10 max-md:px-4 max-md:text-sm"
            >
              <span className="sm:hidden">Free audit</span>
              <span className="max-sm:hidden">{site.audit.label}</span>
            </MagneticLink>
            <button
              ref={toggle}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="relative z-10 -mr-2 flex size-11 items-center justify-center rounded-full text-paper md:hidden"
            >
              {open ? <X className="size-6" strokeWidth={1.75} /> : <Menu className="size-6" strokeWidth={1.75} />}
            </button>
          </div>
        </nav>
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className={`absolute inset-x-0 -bottom-px h-px origin-left bg-paper/50 transition-opacity duration-500 ${
            compact && !open ? "opacity-100" : "opacity-0"
          }`}
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="gutter fixed inset-0 z-40 flex flex-col bg-ink pb-8 pt-24 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
          >
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-line">
                  <MotionLink
                    ref={i === 0 ? firstLink : undefined}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-baseline justify-between py-4 text-[clamp(2.75rem,14vw,4.5rem)]"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.18 + i * 0.06 }}
                  >
                    {item.label}
                    <span className="edge text-rebate">{String(i + 1).padStart(2, "0")}</span>
                  </MotionLink>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
              className="space-y-6"
            >
              <MagneticLink href={site.audit.href} size="lg" className="w-full" onClick={() => setOpen(false)}>
                {site.audit.label}
              </MagneticLink>
              <p className="edge text-rebate">{site.tagline}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
