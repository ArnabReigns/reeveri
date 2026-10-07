import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { RiseLines } from "./ui";

// Quiet close: same ground as the page, one heading, the brief form. No inverted block, no moving backdrop.
export function CTA() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="border-t border-line">
      <div className="gutter mx-auto max-w-[110rem] py-[clamp(3.6rem,7vw,6rem)]">
        <h2 id="cta-title" className="display max-w-[16ch] text-[clamp(2.2rem,4.8vw,4rem)] leading-[0.95]">
          <RiseLines lines={["Got a brand", "worth talking about?"]} />
        </h2>

        <div className="mt-8 md:mt-12">
          <ContactForm
            aside={
              <div className="flex flex-col">
                <p className="mt-6 text-lg text-dim">Let&apos;s make some noise.</p>
                <p className="mt-6 text-dim">
                  Prefer email? Write to{" "}
                  <a href={site.contactHref} className="font-semibold text-paper underline">
                    {site.contactEmail}
                  </a>
                  {site.contactIsPlaceholder && (
                    <span className="edge ml-2 bg-ink-3 px-1.5 py-0.5 text-dim">Placeholder</span>
                  )}
                </p>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
