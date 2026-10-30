import { AI_STEPS } from "@/lib/content";
import { Picture } from "./Picture";

/**
 * Stacked steps by default (no JS, reduced motion). MotionRoot sets data-pinned and drives
 * a scrubbed timeline over the same elements.
 */
export function AiSelection() {
  return (
    <section className="ai-section" data-ai aria-labelledby="selekcja">
      <div className="ai-stage container-jm section-y">
        <div>
          <p className="eyebrow">Jak działa selekcja AI</p>
          <h2 id="selekcja" className="display mt-3 text-[clamp(1.75rem,3.6vw,3rem)]">
            Od stosu CV do <span className="accent">krótkiej listy.</span>
          </h2>
        </div>
        <div className="ai-rail" aria-hidden="true"><span data-ai-rail /></div>
        <ol className="ai-steps mt-10 list-none">
          {AI_STEPS.map((s, i) => (
            <li key={s.title} className="ai-step" data-ai-step>
              <div className="ai-copy" data-ai-copy>
                <p className="eyebrow text-lime" aria-hidden="true">0{i + 1}</p>
                <h3 className="display mt-3 text-[clamp(1.5rem,3vw,2.5rem)]">{s.title}</h3>
                <p className="lead mt-3">{s.text}</p>
              </div>
              <div className="ai-visual mt-6" data-ai-visual>
                {i === 1 && <span className="ai-scan-line" data-ai-scan aria-hidden="true" />}
                <Picture name={s.image} alt={s.alt} sizes="(min-width: 900px) 58vw, 100vw" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
