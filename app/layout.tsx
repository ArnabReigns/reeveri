import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import { MotionProvider } from "@/components/MotionProvider";
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
  title: site.title,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f1f0ea",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${archivo.variable} antialiased`}
    >
      <head>
        {/* Apply a saved theme before first paint so there is no flash. Light is the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("reeveri-theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t;if(t==="dark"){var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute("content","#0b0b0a")}}}catch(e){}`,
          }}
        />
      </head>
      <body className="grain">
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
