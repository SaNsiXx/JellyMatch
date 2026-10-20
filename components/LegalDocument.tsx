import { Languages } from "lucide-react";
import { getLegalDoc, type LegalDoc } from "@/lib/legal";
import { content, type Content } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { LegalToc } from "./LegalToc";

export async function LegalDocument({ doc, locale }: { doc: LegalDoc; locale: Locale }) {
  const { html, toc } = await getLegalDoc(doc);
  const t: Content["pages"]["legal"] = content[locale].pages.legal;

  return (
    <main id="main" className="relative pt-32 pb-[clamp(5rem,10vw,9rem)] lg:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-violet/12 blur-[120px]" />
      </div>
      <div className="container-jm">
        <p data-reveal="" className="eyebrow">Jelly Match</p>
        <SplitHeading as="h1" text={t[doc].title} className="mt-5 max-w-4xl font-display text-[clamp(2.75rem,7vw,6rem)] font-semibold" />
        {t.languageNote && (
          <p data-reveal="" lang={locale} className="mt-8 inline-flex items-center gap-3 rounded-full border border-line bg-ink-2 px-4 py-2 text-sm text-muted">
            <Languages aria-hidden="true" className="size-4 text-lime" />
            {t.languageNote}
          </p>
        )}

        <div className="mt-14 grid gap-12 border-t border-line pt-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <LegalToc title={t.contents} items={toc} />
          {/* committed, pre-cleaned document (content/legal) */}
          <div lang="en" className="prose-jm prose-legal lg:col-span-8" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </main>
  );
}
