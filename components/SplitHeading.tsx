import { Fragment } from "react";

/** Letter-by-letter mask reveal; the accent phrase rises as one piece so its gradient stays continuous. */
export function SplitHeading({ before, accent, className = "" }: { before: string; accent: string; className?: string }) {
  let i = 0;
  return (
    <h1 className={`display h1 ${className}`}>
      <span className="sr-only">{before} {accent}</span>
      <span aria-hidden="true">
        {before.split(" ").map((word, w) => (
          <Fragment key={w}>
            <span className="word">
              {[...word].map((c, k) => <span key={k} className="char" style={{ "--i": i++ } as React.CSSProperties}>{c}</span>)}
            </span>{" "}
          </Fragment>
        ))}
        <span className="word"><span className="char accent" style={{ "--i": i } as React.CSSProperties}>{accent}</span></span>
      </span>
    </h1>
  );
}
