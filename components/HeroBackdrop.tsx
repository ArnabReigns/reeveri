// A very faint contact-sheet grid with registration marks behind the hero. Decorative only.
const FADE = "linear-gradient(to bottom, black 45%, transparent 100%)";

export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      <svg className="absolute inset-0 size-full text-paper" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" width="96" height="96" patternUnits="userSpaceOnUse">
            <path d="M96 0H0V96" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <pattern id="hero-marks" width="288" height="288" patternUnits="userSpaceOnUse">
            <path d="M-7 0H7M0 -7V7" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" opacity="0.1" />
        <rect width="100%" height="100%" fill="url(#hero-marks)" opacity="0.35" />
      </svg>
    </div>
  );
}
