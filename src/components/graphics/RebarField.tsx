import { useId } from "react";

import { Bar, SteelDefs } from "./SteelDefs";

/**
 * Layered abstract composition for the Home hero: an engineering grid at the
 * back, a diagonal field of ribbed bars in the middle and a few close bars
 * with an oxide highlight at the front. Each layer is a separate <svg> so it
 * can move independently for parallax. Purely decorative.
 */
type Layer = "far" | "mid" | "near";

const svgProps = {
  viewBox: "0 0 1600 1000",
  preserveAspectRatio: "xMidYMid slice",
  "aria-hidden": true,
  focusable: false,
} as const;

const midBars = [
  { y: 90, t: 18, o: 0.55 },
  { y: 190, t: 26, o: 0.8 },
  { y: 238, t: 14, o: 0.5 },
  { y: 360, t: 30, o: 0.9 },
  { y: 470, t: 20, o: 0.7 },
  { y: 600, t: 34, o: 1 },
  { y: 652, t: 16, o: 0.6 },
  { y: 780, t: 24, o: 0.75 },
  { y: 900, t: 18, o: 0.55 },
];

export function RebarLayer({ layer, className }: { layer: Layer; className?: string }) {
  const id = useId();

  if (layer === "far") {
    return (
      <svg className={className} {...svgProps}>
        <SteelDefs id={id} />
        <g mask={`url(#${id}-fade-mask)`}>
          <rect width="1600" height="1000" fill={`url(#${id}-grid)`} />
          <rect width="1600" height="1000" fill={`url(#${id}-grid-major)`} />
          <g fill="none" stroke="#a3aeb8" strokeOpacity="0.16">
            <circle cx="1180" cy="430" r="330" />
            <circle cx="1180" cy="430" r="250" strokeDasharray="2 10" />
            <circle cx="1180" cy="430" r="170" />
            <path d="M1180 60v80M1180 720v80M810 430h80M1470 430h80" />
          </g>
        </g>
      </svg>
    );
  }

  if (layer === "mid") {
    return (
      <svg className={className} {...svgProps}>
        <SteelDefs id={id} />
        <g transform="rotate(-22 800 500)">
          {midBars.map((bar) => (
            <Bar key={bar.y} id={id} y={bar.y} length={2800} thickness={bar.t} opacity={bar.o} />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg className={className} {...svgProps}>
      <SteelDefs id={id} />
      <g transform="rotate(-22 800 500)">
        <Bar id={id} y={980} length={2800} thickness={64} />
        <Bar id={id} y={1080} length={2800} thickness={48} opacity={0.9} />
        {/* Oxide highlight: a soft wide band under a sharp core, no blur filter. */}
        <rect x="200" y="525" width="1500" height="18" rx="9" fill={`url(#${id}-oxide)`} opacity="0.18" />
        <rect x="200" y="531" width="1500" height="6" rx="3" fill={`url(#${id}-oxide)`} />
      </g>
    </svg>
  );
}
