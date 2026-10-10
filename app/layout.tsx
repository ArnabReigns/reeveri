import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import { MotionProvider } from "@/components/MotionProvider";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Pages set a short title ("About"); the template turns it into "About | Reeveri".
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Marketing",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Set GOOGLE_SITE_VERIFICATION to the code from Google Search Console (HTML tag method).
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0a",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${archivo.variable} antialiased`}
    >
      <head>
        {/* Apply a saved theme before first paint so there is no flash. Dark is the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("reeveri-theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t;if(t==="light"){var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute("content","#f1f0ea")}}}catch(e){}`,
          }}
        />
      </head>
      <body className="grain">
        <JsonLd data={[organizationLd, websiteLd]} />
        <a
          href="#main"
          className="sr-only z-[80] rounded-full bg-marker px-5 py-3 font-semibold text-on-marker focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <MotionProvider>
          {children}
          <Cursor />
        </MotionProvider>
      </body>
    </html>
  );
}
