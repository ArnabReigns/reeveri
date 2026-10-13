export const site = {
  name: "Reeveri",
  wordmark: "REEVERI",
  title: "Reeveri — Digital Marketing Agency",
  description:
    "Reeveri is a digital marketing agency. Social media marketing, performance marketing, content, websites and growth strategy for ambitious brands.",
  keywords: [
    "Reeveri",
    "digital marketing agency",
    "digital marketing company",
    "digital marketing services",
    "digital agency",
    "social media marketing agency",
    "performance marketing agency",
    "paid ads agency",
    "content marketing agency",
    "website design agency",
    "growth marketing agency",
    "online marketing agency",
  ],
  tagline: "Digital marketing for ambitious brands.",
  // The line under the home page headline. The plain tagline above stays for the footer and search listings.
  heroLine: "Digital marketing that works as hard as you do, from the first click to the last sale.",
  url: "https://reeveri.com",
  contactEmail: "hello@reeveri.com",
  contactHref: "mailto:hello@reeveri.com?subject=Start%20a%20project%20with%20Reeveri",
  contactIsPlaceholder: false,
  address: { street: "Sector V", city: "Kolkata", region: "West Bengal", country: "India" },
  instagram: { handle: "the_reeveri", href: "https://instagram.com/the_reeveri" },
  // The primary action: opens the contact form with the free audit pre-selected.
  audit: { label: "Book a free audit", href: "/#book-audit" },
  nav: [
    { label: "Audits", href: "/audits" },
    { label: "Creatives", href: "/creatives" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/#contact" },
  ],
  // TODO(owner): add real profile URLs. Links with href "#" render as placeholders.
  social: [
    { label: "Instagram", href: "https://instagram.com/the_reeveri" },
    { label: "LinkedIn", href: "#" },
  ],
} as const;
