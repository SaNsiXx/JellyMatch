import { useContent } from "@/lib/content";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Picture } from "@/components/ui/Picture";

export function Principles() {
  const { principles, ui } = useContent();
  return (
    <section aria-labelledby="principles-title" className="section-y relative border-t border-line">
      <div className="container-jm grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SplitHeading id="principles-title" text={principles.title} className="h2" />
            <div data-reveal="" className="mt-10 hidden w-56 mix-blend-lighten lg:block xl:w-64">
              <Picture
                name="mascot-point"
                alt={ui.mascotPointAlt}
                sizes="16rem"
                imgClassName="h-auto w-full [mask-image:radial-gradient(closest-side,#000_70%,transparent)]"
              />
            </div>
          </div>
        </div>
        <ol className="border-t border-line lg:col-span-7">
          {principles.items.map((p, i) => (
            <li key={p.title} data-reveal="" className="group grid grid-cols-[auto_1fr] gap-6 border-b border-line py-10 sm:gap-10 sm:py-12">
              <span
                aria-hidden="true"
                className="font-display text-[clamp(3.5rem,7vw,6rem)] leading-[0.8] font-bold tracking-[-0.06em] text-transparent transition-[color,-webkit-text-stroke-color] duration-500 [-webkit-text-stroke:1.5px_rgb(245_245_247/0.3)] group-hover:text-lime group-hover:[-webkit-text-stroke-color:transparent]"
              >
                0{i + 1}
              </span>
              <div>
                <h3 className="h3 transition-transform duration-500 ease-[var(--ease-jelly)] group-hover:translate-x-2">{p.title}</h3>
                <p className="mt-3 max-w-xl text-muted">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
