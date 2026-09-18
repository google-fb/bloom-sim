"use client";

import { arcPath, polar } from "@/lib/ikebana/geometry";
import type { Point } from "@/lib/ikebana/types";

const TICKS = [-90, -75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75, 90];
const LABELED = new Set([-90, -75, -45, -15, 0, 15, 45, 75, 90]);

export function Protractor({ center, radius = 230 }: { center: Point; radius?: number }) {
  const inner = radius * 0.55;
  return (
    <g data-export-hide pointerEvents="none" fontFamily="var(--font-sans)">
      <path d={arcPath(center, radius, -90, 90)} stroke="oklch(0.55 0.02 60)" strokeWidth={1} fill="none" opacity={0.35} />
      <path d={arcPath(center, inner, -90, 90)} stroke="oklch(0.55 0.02 60)" strokeWidth={1} fill="none" opacity={0.25} strokeDasharray="3 5" />
      {TICKS.map((a) => {
        const major = LABELED.has(a);
        const p1 = polar(center, radius - (major ? 12 : 6), a);
        const p2 = polar(center, radius, a);
        const label = polar(center, radius + 16, a);
        return (
          <g key={a}>
            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="oklch(0.5 0.02 60)"
              strokeWidth={major ? 1.4 : 1}
              opacity={major ? 0.6 : 0.35}
            />
            {a % 45 === 0 || Math.abs(a) === 15 || Math.abs(a) === 75 ? (
              <line
                x1={center.x}
                y1={center.y}
                x2={p2.x}
                y2={p2.y}
                stroke="oklch(0.5 0.02 60)"
                strokeWidth={0.8}
                strokeDasharray="2 6"
                opacity={a === 0 ? 0.45 : 0.22}
              />
            ) : null}
            {major && (
              <text
                x={label.x}
                y={label.y}
                fontSize={11}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="oklch(0.5 0.02 60)"
                opacity={0.8}
              >
                {Math.abs(a)}°
              </text>
            )}
          </g>
        );
      })}
      <text
        x={center.x - radius - 22}
        y={center.y - 18}
        fontSize={11}
        textAnchor="middle"
        fill="oklch(0.5 0.02 60)"
        opacity={0.7}
      >
        左
      </text>
      <text
        x={center.x + radius + 22}
        y={center.y - 18}
        fontSize={11}
        textAnchor="middle"
        fill="oklch(0.5 0.02 60)"
        opacity={0.7}
      >
        右
      </text>
    </g>
  );
}
