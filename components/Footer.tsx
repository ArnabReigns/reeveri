import { ArrowUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { site } from "@/lib/site";

function FooterLink({ href, label }: { href: string; label: string }) {
  const placeholder = href === "#";
  return (
    <li>
      <a
        href={href}
        aria-disabled={placeholder || undefined}
        title={placeholder ? "Link coming soon" : undefined}
        className="group inline-flex items-center gap-2 py-1 text-lg text-paper/80 transition-colors duration-300 hover:text-paper"
      >
        <span className="relative">
          {label}
          <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-paper transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 -translate-x-1 translate-y-1 opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
        />
      </a>
      {placeholder && <span className="edge ml-1 text-dim">Soon</span>}
    </li>
  );
}

export function Footer() {
  return (
    <footer className="relative">
      <div aria-hidden="true" className="relative overflow-hidden bg-ink-3 py-3">
        <div className="sprockets absolute inset-x-0 top-0.5 h-2" />
        <div className="sprockets absolute inset-x-0 bottom-0.5 h-2" />
        <p className="edge flex gap-10 whitespace-nowrap text-rebate">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>
              Reeveri 400 · End of roll · → {37 + i}
            </span>
          ))}
        </p>
      </div>

      <div className="gutter mx-auto max-w-[110rem] pb-10 pt-16 md:pt-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="display text-[clamp(3rem,7vw,6rem)] leading-[0.85]">
              {site.wordmark}
              <span aria-hidden="true" className="ml-1 inline-block size-[0.14em] rounded-full bg-marker align-top" />
            </p>
            <p className="mt-5 max-w-xs text-lg text-dim">{site.tagline}</p>
            <Link
              href="/#start-project"
              className="group mt-8 inline-flex items-center gap-2 font-semibold text-paper"
            >
              <span className="border-b border-marker pb-0.5">Start a project</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7 md:gap-8">
            <div>
              <p className="edge mb-4 text-rebate">Index</p>
              <ul>
                {site.nav.map((l) => (
                  <FooterLink key={l.label} {...l} />
                ))}
              </ul>
            </div>
            <div>
              <p className="edge mb-4 text-rebate">Elsewhere</p>
              <ul>
                {site.social.map((l) => (
                  <FooterLink key={l.label} {...l} />
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="edge mb-4 text-rebate">Say hello</p>
              <a
                href={site.contactHref}
                className="break-all text-lg text-paper/80 underline decoration-line-strong underline-offset-4 transition-colors hover:text-paper hover:decoration-paper"
              >
                {site.contactEmail}
              </a>
              {site.contactIsPlaceholder && <p className="edge mt-2 text-dim">Placeholder address</p>}
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-6 sm:flex-row sm:items-center md:mt-24">
          <p className="edge text-rebate">© 2026 Reeveri. All rights reserved.</p>
          <a
            href="#top"
            className="group edge inline-flex items-center gap-3 text-dim transition-colors hover:text-paper"
          >
            Back to top
            <span className="flex size-9 items-center justify-center rounded-full border border-line-strong transition-colors duration-300 group-hover:border-paper">
              <ArrowUp
                aria-hidden="true"
                className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
