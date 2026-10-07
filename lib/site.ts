export const site = {
  name: "Reeveri",
  wordmark: "REEVERI",
  title: "Reeveri — Creative Marketing for Ambitious Brands",
  description:
    "Reeveri is a creative marketing agency helping ambitious brands turn attention into growth through social, content, performance marketing, websites, and growth strategy.",
  tagline: "Creative marketing for ambitious brands.",
  // TODO(owner): replace with the real domain before launch.
  url: "https://reeveri.example",
  // TODO(owner): replace with the real enquiry address, then set contactIsPlaceholder to false.
  contactEmail: "hello@example.com",
  contactHref: "mailto:hello@example.com?subject=Start%20a%20project%20with%20Reeveri",
  contactIsPlaceholder: true,
  // The primary action: opens the contact form with the free audit pre-selected.
  audit: { label: "Book a free audit", href: "/#book-audit" },
  nav: [
    { label: "Audits", href: "/audits" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  // TODO(owner): add real profile URLs. Links with href "#" render as placeholders.
  social: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
} as const;
