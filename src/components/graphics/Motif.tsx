import { useId } from "react";

import { routes, type Route } from "@/content/routes";
import { Bar, SteelDefs } from "./SteelDefs";

export type MotifVariant = "bars" | "mesh" | "section" | "measure" | "signal";

/** The motif that represents each page wherever it appears. */
export const routeMotifs: Record<Route, MotifVariant> = {
  [routes.home]: "bars",
  [routes.about]: "bars",
  [routes.services]: "section",
  [routes.applications]: "mesh",
  [routes.careers]: "measure",
  [routes.contact]: "signal",
};

/**
 * Abstract, non-representational illustration for page heroes and empty
 * states. One variant per page keeps each page distinct while sharing the
 * same material language. Purely decorative.
 */
export function Motif({ variant, className }: { variant: MotifVariant; className?: string }) {
  const id = useId();
  return (
    <svg
      className={className}
      viewBox="0 0 600 440"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <SteelDefs id={id} />
      <rect width="600" height="440" fill={`url(#${id}-grid)`} />
      {variant === "bars" && <Bars id={id} />}
      {variant === "mesh" && <Mesh id={id} />}
      {variant === "section" && <CrossSections />}
      {variant === "measure" && <Measure id={id} />}
      {variant === "signal" && <Signal />}
    </svg>
  );
}

function Bars({ id }: { id: string }) {
  return (
    <g transform="rotate(-28 300 220)">
      {[40, 110, 150, 230, 300, 350, 420].map((y, i) => (
        <Bar key={y} id={id} x={-300} y={y} length={1200} thickness={i % 3 === 0 ? 30 : 18} opacity={0.6 + (i % 3) * 0.2} />
      ))}
      <rect x="40" y="268" width="520" height="5" rx="2.5" fill={`url(#${id}-oxide)`} />
    </g>
  );
}

function Mesh({ id }: { id: string }) {
  const lines = Array.from({ length: 9 }, (_, i) => i);
  return (
    <g transform="translate(300 230) skewX(-18) scale(1 0.62) rotate(-8) translate(-300 -230)">
      {lines.map((i) => (
        <Bar key={`h${i}`} id={id} x={-100} y={i * 62 - 20} length={800} thickness={10} opacity={0.85} />
      ))}
      <g transform="rotate(90 300 230)">
        {lines.map((i) => (
          <Bar key={`v${i}`} id={id} x={-100} y={i * 62 - 20} length={800} thickness={10} opacity={0.65} />
        ))}
      </g>
      {[
        [238, 166],
        [362, 290],
        [300, 228],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill="#e0672f" />
      ))}
    </g>
  );
}

function CrossSections() {
  const ends = [
    { cx: 250, cy: 200, r: 74 },
    { cx: 392, cy: 168, r: 54 },
    { cx: 372, cy: 300, r: 62 },
    { cx: 228, cy: 342, r: 40 },
    { cx: 486, cy: 252, r: 34 },
    { cx: 140, cy: 262, r: 30 },
  ];
  return (
    <g>
      {ends.map(({ cx, cy, r }, i) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={r} fill="#1d262e" stroke="#5d6a76" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={r + 7} fill="none" stroke="#a3aeb8" strokeOpacity="0.22" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={r * 0.62} fill="none" stroke="#a3aeb8" strokeOpacity="0.14" />
          {i === 0 && <circle cx={cx} cy={cy} r={r + 18} fill="none" stroke="#e0672f" strokeWidth="2" />}
        </g>
      ))}
    </g>
  );
}

function Measure({ id }: { id: string }) {
  const ticks = Array.from({ length: 41 }, (_, i) => i);
  return (
    <g transform="translate(0 30)">
      <g stroke="#a3aeb8" strokeOpacity="0.5">
        {ticks.map((i) => (
          <line key={i} x1={60 + i * 12} y1="96" x2={60 + i * 12} y2={i % 5 === 0 ? 70 : 84} />
        ))}
        <line x1="60" y1="96" x2="540" y2="96" />
      </g>
      <Bar id={id} x={60} y={188} length={480} thickness={44} />
      <g stroke="#e0672f" strokeWidth="2" fill="none">
        <path d="M60 268v40M540 268v40M60 288h480" />
        <path d="M72 280l-12 8 12 8M528 280l12 8-12 8" />
      </g>
      <g stroke="#a3aeb8" strokeOpacity="0.35" fill="none">
        <path d="M60 140v28M540 140v28" />
        <rect x="200" y="350" width="200" height="40" rx="20" />
      </g>
    </g>
  );
}

function Signal() {
  return (
    <g fill="none" strokeLinecap="round">
      {[60, 110, 160, 210, 260].map((r, i) => (
        <path
          key={r}
          d={`M${300 - r} ${300} A ${r} ${r} 0 0 1 ${300 + r} ${300}`}
          stroke={i === 1 ? "#e0672f" : "#a3aeb8"}
          strokeOpacity={i === 1 ? 1 : 0.35 - i * 0.04}
          strokeWidth={i === 1 ? 3 : 2}
        />
      ))}
      <circle cx="300" cy="300" r="10" fill="#e0672f" />
    </g>
  );
}
