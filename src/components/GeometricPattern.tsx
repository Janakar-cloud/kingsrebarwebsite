/**
 * Abstract decorative treatment used in place of photography until approved
 * imagery is supplied. It is deliberately non-representational.
 */
export function GeometricPattern({ className }: { className?: string }) {
  const bars = Array.from({ length: 9 }, (_, index) => index);
  return (
    <svg
      className={className}
      viewBox="0 0 480 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="480" height="360" fill="#25313e" />
      <g stroke="#3a4757" strokeWidth="1">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="360" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="480" y2={i * 40} />
        ))}
      </g>
      <g transform="rotate(-24 240 180)">
        {bars.map((i) => (
          <rect
            key={i}
            x="-120"
            y={20 + i * 40}
            width="720"
            height="10"
            rx="5"
            fill={i % 3 === 1 ? "#a14a24" : "#5d6b7b"}
            opacity={i % 3 === 1 ? 0.9 : 0.55}
          />
        ))}
      </g>
    </svg>
  );
}
