import { LINKS } from "@/lib/content";
import { Cta } from "./Cta";
import { Picture } from "./Picture";

export function FinalCta() {
  return (
    <section className="relative overflow-clip py-20 text-center md:py-28" aria-labelledby="start">
      <div className="container-jm flex flex-col items-center">
        <div className="float w-[min(68vw,380px)]" data-reveal="">
          <Picture name="mascot-celebrate" alt="Maskotka Jelly Match, orzeł z galaretki, świętuje z uniesionymi skrzydłami" sizes="380px" className="mascot h-auto w-full" />
        </div>
        <h2 id="start" className="display mt-2 text-[clamp(2.6rem,8vw,7rem)]" data-reveal="">
          Zacznij rekrutować <span className="accent">za darmo.</span>
        </h2>
        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:flex-row" data-reveal="" style={{ "--d": 120 } as React.CSSProperties}>
          <Cta href={LINKS.signUp} arrow>Utwórz konto</Cta>
          <Cta href={LINKS.demo} variant="ghost">Wypróbuj demo na żywo</Cta>
        </div>
      </div>
    </section>
  );
}
