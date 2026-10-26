import { useId } from "react";

import type { FlagCode } from "@/content/types";
import { cn } from "@/lib/cn";
import styles from "./Flag.module.css";

/** Decorative country flag. Pair with a visible country name; do not use as the only label. */
export function Flag({ code, className }: { code: FlagCode; className?: string }) {
  return (
    <span className={cn(styles.flag, className)} aria-hidden="true">
      {code === "US" ? <UsFlag /> : <GbFlag />}
    </span>
  );
}

function UsFlag() {
  const cantonHeight = (7 * 10) / 13;
  const stars = Array.from({ length: 9 }, (_, row) => {
    const count = row % 2 === 0 ? 6 : 5;
    return Array.from({ length: count }, (__, col) => ({
      key: `${row}-${col}`,
      cx: count === 6 ? (7.6 * (col + 0.5)) / 6 : (7.6 * (col + 1)) / 6,
      cy: (cantonHeight * (row + 0.5)) / 9,
    }));
  }).flat();

  return (
    <svg viewBox="0 0 19 10" preserveAspectRatio="none">
      <rect width="19" height="10" fill="#b22234" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} y={((i * 2 + 1) * 10) / 13} width="19" height={10 / 13} fill="#fff" />
      ))}
      <rect width="7.6" height={cantonHeight} fill="#3c3b6e" />
      {stars.map((star) => (
        <circle key={star.key} cx={star.cx} cy={star.cy} r="0.14" fill="#fff" />
      ))}
    </svg>
  );
}

function GbFlag() {
  const clip = useId();

  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="none">
      <clipPath id={clip}>
        <rect width="60" height="30" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect width="60" height="30" fill="#012169" />
        <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0 L60 30 M60 0 L0 30" stroke="#c8102e" strokeWidth="4" />
        <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0 V30 M0 15 H60" stroke="#c8102e" strokeWidth="6" />
      </g>
    </svg>
  );
}
