import { BENEFITS } from "@/lib/content";
import { Picture } from "./Picture";

export function Benefits() {
  return (
    <section className="section-y relative" aria-labelledby="korzysci">
      <div className="aura top-0 h-[60%]" data-parallax="aura" aria-hidden="true">
        <Picture name="bg-aura-2" alt="" sizes="100vw" />
      </div>
      <div className="container-jm">
        <h2 id="korzysci" className="display h2 max-w-3xl" data-reveal="">
          Prawdziwa rekrutacja, <span className="accent">zanim zapłacisz.</span>
        </h2>
        <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <li key={b.title} data-reveal="" style={{ "--d": i * 90 } as React.CSSProperties}>
              <article className="card h-full" data-glow>
                <div className="card-media">
                  <Picture name={b.image} alt={b.alt} sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <div className="p-6 pt-2">
                  <p className="flex items-baseline gap-2">
                    <span className="counter" data-count={b.value}>{b.value}</span>
                    <span className="text-muted">{b.unit}</span>
                  </p>
                  <h3 className="h3 mt-5">{b.title}</h3>
                  <p className="mt-3 text-muted">{b.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
