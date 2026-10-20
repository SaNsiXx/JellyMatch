import { benefits } from "@/lib/content";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Picture } from "@/components/ui/Picture";

export function Benefits() {
  return (
    <section id="korzysci" aria-labelledby="benefits-title" className="section-y relative">
      <div className="container-jm">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p data-reveal="" className="eyebrow">{benefits.eyebrow}</p>
            <SplitHeading id="benefits-title" text={benefits.title} className="h2 mt-5" />
          </div>
          <div data-reveal="" className="lg:col-span-4 lg:justify-self-end">
            <span className="inline-flex items-center gap-3 rounded-full border border-lime/30 bg-lime/[0.06] py-2 pr-5 pl-3 font-display text-[0.95rem] font-medium text-fg">
              <span className="relative flex size-2.5" aria-hidden="true">
                <span className="absolute inline-flex size-full rounded-full bg-lime opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2.5 rounded-full bg-lime" />
              </span>
              Pierwsza selekcja AI za darmo
            </span>
          </div>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20">
          {benefits.items.map((b) => (
            <li key={b.title} data-reveal="">
              <article className="card group flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Picture
                    name={b.image}
                    alt={b.alt}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    imgClassName="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-jelly)] group-hover:scale-[1.06]"
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,var(--color-ink-2),transparent)]" />
                </div>
                <div className="relative -mt-14 flex flex-1 flex-col p-7 sm:p-8">
                  <p className="font-display text-[clamp(3.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.05em] text-lime">
                    <span className="tabular" data-count={b.stat.value} data-suffix={b.stat.suffix}>
                      {b.stat.value}
                      {b.stat.suffix}
                    </span>
                    <span className="ml-3 align-middle font-mono text-xs tracking-[0.2em] text-muted uppercase">{b.stat.label}</span>
                  </p>
                  <h3 className="h3 mt-6">{b.title}</h3>
                  <p className="mt-3 text-muted">{b.body}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
