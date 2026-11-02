/**
 * SVG filters for outlined display type: the text is filled, grown by the stroke width and the fill cut away, so
 * the line runs once around the whole shape — unlike -webkit-text-stroke, which also traces the overlapping contours
 * inside a glyph (variable fonts) and where tight tracking makes letters overlap.
 * Use with `[filter:url(#jm-outline-1)]` on text in an opaque colour; set the line's alpha with `opacity`.
 */
export function OutlineFilters() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      {[
        ["jm-outline-1", 1],
        ["jm-outline-15", 1.5],
      ].map(([id, r]) => (
        <filter key={id} id={String(id)} colorInterpolationFilters="sRGB">
          <feMorphology in="SourceGraphic" operator="dilate" radius={r} result="grown" />
          <feComposite in="grown" in2="SourceAlpha" operator="out" />
        </filter>
      ))}
    </svg>
  );
}
