/** Clyde brand marks: the pixel crab mascot and the asterisk logo glyph. */

const CRAB = "#cd6444";
const CRAB_EYE = "#1a120e";

export function Mascot({
  size = 220,
  bob = true,
  className = "",
}: {
  size?: number;
  bob?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={(size * 140) / 160}
      viewBox="-15 -20 160 140"
      role="img"
      aria-label="Clyde, a blocky pixel crab"
      className={`${bob ? "bob" : ""} ${className}`}
      shapeRendering="crispEdges"
    >
      {/* top nubs */}
      <rect x="20" y="-20" width="20" height="20" fill={CRAB} />
      <rect x="90" y="-20" width="20" height="20" fill={CRAB} />
      {/* side arms */}
      <rect x="-15" y="35" width="15" height="25" fill={CRAB} />
      <rect x="130" y="35" width="15" height="25" fill={CRAB} />
      {/* body */}
      <rect x="0" y="0" width="130" height="90" fill={CRAB} />
      {/* legs */}
      <rect x="0" y="90" width="22" height="30" fill={CRAB} />
      <rect x="36" y="90" width="22" height="30" fill={CRAB} />
      <rect x="72" y="90" width="22" height="30" fill={CRAB} />
      <rect x="108" y="90" width="22" height="30" fill={CRAB} />
      {/* eyes */}
      <rect x="24" y="24" width="20" height="20" fill={CRAB_EYE} />
      <rect x="86" y="24" width="20" height="20" fill={CRAB_EYE} />
    </svg>
  );
}

export function Mark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {[0, 45, 90, 135].map((a) => (
        <rect
          key={a}
          x="11"
          y="1.5"
          width="2"
          height="21"
          rx="1"
          fill="var(--accent)"
          transform={`rotate(${a} 12 12)`}
        />
      ))}
    </svg>
  );
}
