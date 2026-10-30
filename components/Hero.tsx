import { HERO, LINKS } from "@/lib/content";
import { Cta } from "./Cta";
import { HeroJellies } from "./HeroJellies";
import { SplitHeading } from "./SplitHeading";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroJellies />

      <div className="container-jm" data-parallax="hero-copy">
        <div className="max-w-[33rem] max-[899px]:max-w-[40rem] min-[1600px]:max-w-[46rem]">
          <p className="badge hero-in mb-6" style={{ "--d": 0 } as React.CSSProperties}>
            <span className="badge-dot" aria-hidden="true" />
            {HERO.badge}
          </p>
          <div id="hero-title"><SplitHeading before={HERO.before} accent={HERO.accent} /></div>
          <p className="lead hero-in mt-6" style={{ "--d": 120 } as React.CSSProperties}>{HERO.lead}</p>
          <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--d": 240 } as React.CSSProperties}>
            <Cta href={LINKS.signUp} arrow>{HERO.primary}</Cta>
            <Cta href={LINKS.demo} variant="ghost">{HERO.secondary}</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
