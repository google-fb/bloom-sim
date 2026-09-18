const INK = "oklch(0.3 0.02 55)";
const VERMILION = "oklch(0.5 0.145 35)";
const MOSS = "oklch(0.5 0.08 145)";
const FAINT = "oklch(0.75 0.015 80)";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 90" className="h-auto w-full" aria-hidden>
      <path d="M20 78 Q60 84 100 78" stroke={FAINT} strokeWidth={1.5} fill="none" />
      {children}
    </svg>
  );
}

export function ThreeStemsDiagram() {
  return (
    <Frame>
      <line x1={60} y1={78} x2={52} y2={16} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <line x1={60} y1={78} x2={24} y2={40} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <line x1={60} y1={78} x2={96} y2={66} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M52 16 L24 40 L96 66 Z" stroke={VERMILION} strokeWidth={1} strokeDasharray="3 3" fill="none" />
      <circle cx={52} cy={16} r={5} fill={VERMILION} />
      <circle cx={24} cy={40} r={5} fill={MOSS} />
      <circle cx={96} cy={66} r={5} fill="oklch(0.55 0.1 300)" />
      <text x={52} y={9} fontSize={7} textAnchor="middle" fill={VERMILION} fontWeight={700}>真</text>
      <text x={14} y={42} fontSize={7} textAnchor="middle" fill={MOSS} fontWeight={700}>副</text>
      <text x={106} y={69} fontSize={7} textAnchor="middle" fill="oklch(0.55 0.1 300)" fontWeight={700}>控</text>
    </Frame>
  );
}

export function MeasureDiagram() {
  return (
    <Frame>
      <path d="M30 60 L34 76 L86 76 L90 60 Z" fill={INK} opacity={0.85} />
      <ellipse cx={60} cy={60} rx={30} ry={6} fill="oklch(0.8 0.02 200)" />
      <line x1={30} y1={50} x2={90} y2={50} stroke={VERMILION} strokeWidth={1.2} />
      <line x1={30} y1={47} x2={30} y2={53} stroke={VERMILION} strokeWidth={1.2} />
      <line x1={90} y1={47} x2={90} y2={53} stroke={VERMILION} strokeWidth={1.2} />
      <text x={60} y={45} fontSize={7} textAnchor="middle" fill={VERMILION}>直徑</text>
      <line x1={100} y1={60} x2={100} y2={76} stroke={VERMILION} strokeWidth={1.2} />
      <line x1={97} y1={60} x2={103} y2={60} stroke={VERMILION} strokeWidth={1.2} />
      <line x1={97} y1={76} x2={103} y2={76} stroke={VERMILION} strokeWidth={1.2} />
      <text x={110} y={70} fontSize={7} textAnchor="middle" fill={VERMILION}>高</text>
      <line x1={60} y1={60} x2={60} y2={8} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <text x={68} y={22} fontSize={7} fill={INK}>×1.5</text>
    </Frame>
  );
}

export function AngleDiagram() {
  return (
    <Frame>
      <path d="M12 78 A48 48 0 0 1 108 78" stroke={FAINT} strokeWidth={1} fill="none" />
      <line x1={60} y1={78} x2={60} y2={30} stroke={FAINT} strokeWidth={1} strokeDasharray="2 3" />
      {[-15, -45, -75, 75].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x = 60 + 46 * Math.sin(rad);
        const y = 78 - 46 * Math.cos(rad);
        return (
          <g key={a}>
            <line x1={60} y1={78} x2={x} y2={y} stroke={a === 75 ? "oklch(0.55 0.1 300)" : a === -45 ? MOSS : VERMILION} strokeWidth={1.8} strokeLinecap="round" />
            <text x={x + (a < 0 ? -8 : 8)} y={y - 2} fontSize={6.5} textAnchor="middle" fill={INK}>
              {Math.abs(a)}°
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

export function SpaceDiagram() {
  return (
    <Frame>
      <line x1={60} y1={78} x2={40} y2={14} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <line x1={60} y1={78} x2={92} y2={60} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <circle cx={92} cy={58} r={7} fill={VERMILION} />
      <circle cx={40} cy={14} r={4} fill={MOSS} />
      <path d="M48 24 Q76 30 84 50" stroke={FAINT} strokeWidth={1} strokeDasharray="2 3" fill="none" />
      <text x={72} y={30} fontSize={7} fill="oklch(0.55 0.02 60)">留白</text>
    </Frame>
  );
}

export function OddDiagram() {
  return (
    <Frame>
      {[
        [30, 30],
        [60, 22],
        [90, 36],
      ].map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={78} x2={x} y2={y} stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
          <circle cx={x} cy={y} r={6} fill={i === 1 ? VERMILION : MOSS} />
        </g>
      ))}
      <text x={60} y={60} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700} fontFamily="var(--font-heading)">
        3・5・7
      </text>
    </Frame>
  );
}

export function ElementsDiagram() {
  return (
    <Frame>
      <path d="M22 76 Q30 40 44 12" stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <text x={30} y={82} fontSize={7} textAnchor="middle" fill={INK}>線</text>
      <circle cx={62} cy={44} r={13} fill={VERMILION} />
      <text x={62} y={82} fontSize={7} textAnchor="middle" fill={INK}>塊</text>
      <path d="M96 70 Q80 50 92 24 Q106 48 96 70 Z" fill={MOSS} />
      <text x={94} y={82} fontSize={7} textAnchor="middle" fill={INK}>面</text>
    </Frame>
  );
}
