import { PRINCIPLES } from "@/lib/content";
import { Picture } from "./Picture";

export function Principles() {
  return (
    <section className="section-y border-t border-white/10" aria-labelledby="zasady">
      <div className="container-jm grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5" data-reveal="">
          <h2 id="zasady" className="display h2">Trzy zasady <span className="accent">naszego cennika.</span></h2>
          <div className="mx-auto mt-6 max-w-sm lg:mx-0">
            <Picture name="mascot-point" alt="Maskotka Jelly Match, orzeł z galaretki, wskazuje skrzydłem w prawo" sizes="(min-width: 1024px) 30vw, 80vw" className="mascot h-auto w-full" />
          </div>
        </div>
        <ol className="list-none lg:col-span-7">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="border-t border-white/10 py-8 first:border-t-0 lg:first:border-t" data-reveal="" style={{ "--d": i * 90 } as React.CSSProperties}>
              <div className="flex gap-5">
                <span className="eyebrow pt-1.5 text-lime" aria-hidden="true">0{i + 1}</span>
                <div>
                  <h3 className="h3">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
