/**
 * Shared SVG paint servers for the abstract material graphics.
 * `id` must be unique per <svg>; pass the value from useId().
 */
export function SteelDefs({ id }: { id: string }) {
  return (
    <defs>
      {/* Cylindrical shading across a bar's thickness. */}
      <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#56626e" />
        <stop offset="0.28" stopColor="#2d3843" />
        <stop offset="0.62" stopColor="#151c22" />
        <stop offset="1" stopColor="#26303a" />
      </linearGradient>
      {/* Transverse ribs. User-space units so they rotate with the bar group. */}
      <pattern id={`${id}-ribs`} width="22" height="60" patternUnits="userSpaceOnUse">
        <path d="M2 60 L14 0" stroke="#ffffff" strokeOpacity="0.09" strokeWidth="3.5" />
      </pattern>
      <linearGradient id={`${id}-oxide`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#e0672f" stopOpacity="0" />
        <stop offset="0.45" stopColor="#e0672f" stopOpacity="0.95" />
        <stop offset="0.7" stopColor="#f08a5a" />
        <stop offset="1" stopColor="#e0672f" stopOpacity="0" />
      </linearGradient>
      <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0H0V40" fill="none" stroke="#a3aeb8" strokeOpacity="0.09" strokeWidth="1" />
      </pattern>
      <pattern id={`${id}-grid-major`} width="200" height="200" patternUnits="userSpaceOnUse">
        <path d="M200 0H0V200" fill="none" stroke="#a3aeb8" strokeOpacity="0.14" strokeWidth="1" />
      </pattern>
      <radialGradient id={`${id}-fade`} cx="0.62" cy="0.45" r="0.65">
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <mask id={`${id}-fade-mask`}>
        <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
      </mask>
    </defs>
  );
}

type BarProps = { id: string; x?: number; y: number; length: number; thickness: number; opacity?: number };

/** One ribbed bar: shaded body, transverse ribs and a longitudinal highlight. */
export function Bar({ id, x = -600, y, length, thickness, opacity = 1 }: BarProps) {
  const r = thickness / 2;
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={length} height={thickness} rx={r} fill={`url(#${id}-steel)`} />
      <rect x={x} y={y} width={length} height={thickness} rx={r} fill={`url(#${id}-ribs)`} />
      <rect
        x={x}
        y={y + thickness * 0.22}
        width={length}
        height={Math.max(1, thickness * 0.07)}
        fill="#ffffff"
        opacity="0.12"
      />
    </g>
  );
}
