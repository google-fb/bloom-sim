"use client";

import { PX_PER_CM, annularSectorPath, kenzanCenter, polar } from "@/lib/ikebana/geometry";
import { resolveLengthRange } from "@/lib/ikebana/evaluate";
import { ROLE_INFO } from "@/lib/ikebana/lessons";
import type { Stem, StemTarget, Vase } from "@/lib/ikebana/types";

const PREVIEW_TONES: Record<string, string> = {
  shin: "oklch(0.5 0.145 35)",
  soe: "oklch(0.5 0.08 145)",
  hikae: "oklch(0.55 0.1 300)",
  jushi: "oklch(0.55 0.02 60)",
};

/** 說明步驟時淡淡地預覽三主枝的理想位置，讓學習者先看到目標骨架 */
export function LessonPreviewOverlay({ targets, vase }: { targets: StemTarget[]; vase: Vase }) {
  const tips = targets.map((t) => {
    const center = kenzanCenter(vase, t.depth ?? 0);
    const range = resolveLengthRange(t, [], vase);
    return { target: t, center, tip: polar(center, range.ideal * PX_PER_CM, t.angle.ideal) };
  });
  return (
    <g data-export-hide pointerEvents="none">
      {tips.length >= 3 && (
        <path
          d={`M${tips[0].tip.x} ${tips[0].tip.y} L${tips[1].tip.x} ${tips[1].tip.y} L${tips[2].tip.x} ${tips[2].tip.y} Z`}
          fill="oklch(0.5 0.145 35)"
          opacity={0.05}
          stroke="oklch(0.5 0.145 35)"
          strokeWidth={1}
          strokeDasharray="3 5"
        />
      )}
      {tips.map(({ target, center, tip }) => {
        const tone = PREVIEW_TONES[target.role] ?? PREVIEW_TONES.jushi;
        const label = polar(center, Math.hypot(tip.x - center.x, tip.y - center.y) + 22, target.angle.ideal);
        return (
          <g key={target.role}>
            <line x1={center.x} y1={center.y} x2={tip.x} y2={tip.y} stroke={tone} strokeWidth={2.5} strokeDasharray="8 6" opacity={0.6} strokeLinecap="round" />
            <circle cx={tip.x} cy={tip.y} r={5} fill={tone} opacity={0.65} />
            <g transform={`translate(${label.x} ${label.y})`} opacity={0.85}>
              <circle r={12} fill="#fff" stroke={tone} strokeWidth={1.2} />
              <text textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill={tone} fontFamily="var(--font-heading)">
                {ROLE_INFO[target.role].label}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

interface GuideOverlayProps {
  target: StemTarget;
  stems: Stem[];
  vase: Vase;
  passed: boolean;
}

export function GuideOverlay({ target, stems, vase, passed }: GuideOverlayProps) {
  const center = kenzanCenter(vase, target.depth ?? 0);
  const range = resolveLengthRange(target, stems, vase);
  const r1 = range.min * PX_PER_CM;
  const r2 = range.max * PX_PER_CM;
  const rIdeal = range.ideal * PX_PER_CM;
  const tone = passed ? "oklch(0.55 0.12 150)" : "oklch(0.5 0.145 35)";
  const idealTip = polar(center, rIdeal, target.angle.ideal);
  const label = polar(center, r2 + 26, target.angle.ideal);
  const roleLabel = ROLE_INFO[target.role].label;

  return (
    <g data-export-hide pointerEvents="none">
      <path
        d={annularSectorPath(center, r1, r2, target.angle.min, target.angle.max)}
        fill={tone}
        opacity={0.13}
        stroke={tone}
        strokeWidth={1.2}
        strokeDasharray="6 5"
      />
      <line
        x1={center.x}
        y1={center.y}
        x2={idealTip.x}
        y2={idealTip.y}
        stroke={tone}
        strokeWidth={1.5}
        strokeDasharray="8 6"
        opacity={0.7}
      />
      <circle cx={idealTip.x} cy={idealTip.y} r={7} fill="none" stroke={tone} strokeWidth={1.5} opacity={0.9} />
      <circle cx={idealTip.x} cy={idealTip.y} r={2} fill={tone} />
      <g transform={`translate(${label.x} ${label.y})`}>
        <circle r={15} fill={tone} opacity={0.95} />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={15}
          fontWeight={700}
          fill="#fff"
          fontFamily="var(--font-heading)"
        >
          {roleLabel}
        </text>
      </g>
      <text
        x={label.x}
        y={label.y + 30}
        textAnchor="middle"
        fontSize={11}
        fill={tone}
        fontFamily="var(--font-sans)"
      >
        {passed ? "已到位" : `目標 ${Math.round(range.ideal)} cm・${Math.abs(target.angle.ideal)}°`}
      </text>
    </g>
  );
}
