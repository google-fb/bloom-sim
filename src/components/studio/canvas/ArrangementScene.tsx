"use client";

import { forwardRef } from "react";
import {
  CANVAS_H,
  CANVAS_W,
  CENTER_X,
  TABLE_Y,
  describeAngle,
  kenzanCenter,
  mouthY,
  polar,
  round,
  stemGeometry,
} from "@/lib/ikebana/geometry";
import { ROLE_INFO } from "@/lib/ikebana/lessons";
import { getMaterial } from "@/lib/ikebana/materials";
import type { Stem, StemTarget, Vase } from "@/lib/ikebana/types";
import { GuideOverlay, LessonPreviewOverlay } from "./GuideOverlay";
import { Protractor } from "./Protractor";
import { StemView } from "./StemView";

export interface ArrangementSceneProps {
  stems: Stem[];
  vase: Vase;
  selectedId?: string | null;
  interactive?: boolean;
  showProtractor?: boolean;
  showLabels?: boolean;
  guideTarget?: StemTarget | null;
  guidePassed?: boolean;
  /** 說明步驟時預覽的主枝目標 */
  previewTargets?: StemTarget[] | null;
  className?: string;
  onStemPointerDown?: (e: React.PointerEvent, stem: Stem, part: "body" | "head") => void;
  onTipHandleDown?: (e: React.PointerEvent, stem: Stem) => void;
  onBaseHandleDown?: (e: React.PointerEvent, stem: Stem) => void;
  onBackgroundPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
}

const ROLE_TONE: Record<string, string> = {
  shin: "oklch(0.5 0.145 35)",
  soe: "oklch(0.5 0.08 145)",
  hikae: "oklch(0.55 0.1 300)",
  jushi: "oklch(0.55 0.02 60)",
};

export const ArrangementScene = forwardRef<SVGSVGElement, ArrangementSceneProps>(
  function ArrangementScene(
    {
      stems,
      vase,
      selectedId,
      interactive = true,
      showProtractor,
      showLabels = true,
      guideTarget,
      guidePassed,
      previewTargets,
      className,
      onStemPointerDown,
      onTipHandleDown,
      onBaseHandleDown,
      onBackgroundPointerDown,
      onPointerMove,
      onPointerUp,
    },
    ref,
  ) {
    const my = mouthY(vase);
    const center = kenzanCenter(vase);
    // 後方的先畫，前方的後畫；同層依加入順序
    const ordered = [...stems].sort((a, b) => a.depth - b.depth);
    const selected = stems.find((s) => s.id === selectedId) ?? null;
    const selectedGeom = selected ? stemGeometry(selected, vase) : null;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        className={className}
        role="img"
        aria-label="插花作品畫布"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: "none", userSelect: "none" }}
      >
        <defs>
          <linearGradient id="scene-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9f6f0" />
            <stop offset="100%" stopColor="#efe9df" />
          </linearGradient>
          <linearGradient id="scene-table" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d9cfc0" />
            <stop offset="100%" stopColor="#c9bda9" />
          </linearGradient>
        </defs>
        <rect
          x={0}
          y={0}
          width={CANVAS_W}
          height={CANVAS_H}
          fill="url(#scene-wall)"
          onPointerDown={onBackgroundPointerDown}
        />
        <rect
          x={0}
          y={TABLE_Y}
          width={CANVAS_W}
          height={CANVAS_H - TABLE_Y}
          fill="url(#scene-table)"
          onPointerDown={onBackgroundPointerDown}
        />
        <line x1={0} y1={TABLE_Y} x2={CANVAS_W} y2={TABLE_Y} stroke="#b8ab95" strokeWidth={1.5} />

        {showProtractor && <Protractor center={center} />}

        <g transform={`translate(${CENTER_X} ${my})`}>{vase.render(`vase-${vase.id}`)}</g>

        {guideTarget && (
          <GuideOverlay target={guideTarget} stems={stems} vase={vase} passed={Boolean(guidePassed)} />
        )}
        {!guideTarget && previewTargets && previewTargets.length > 0 && (
          <LessonPreviewOverlay targets={previewTargets} vase={vase} />
        )}

        {ordered.map((stem) => (
          <StemView
            key={stem.id}
            stem={stem}
            vase={vase}
            selected={stem.id === selectedId}
            interactive={interactive}
            onPointerDown={onStemPointerDown}
          />
        ))}

        {showLabels && (
          <g data-export-hide pointerEvents="none" fontFamily="var(--font-heading)">
            {stems
              .filter((s) => s.role)
              .map((s) => {
                const g = stemGeometry(s, vase);
                const p = polar(g.tip, 34 * g.depthScale, g.tipRotation);
                const tone = ROLE_TONE[s.role!] ?? ROLE_TONE.jushi;
                return (
                  <g key={s.id} transform={`translate(${p.x} ${p.y})`}>
                    <circle r={12} fill="#fff" stroke={tone} strokeWidth={1.5} opacity={0.95} />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={13}
                      fontWeight={700}
                      fill={tone}
                    >
                      {ROLE_INFO[s.role!].label}
                    </text>
                  </g>
                );
              })}
          </g>
        )}

        {interactive && selected && selectedGeom && (
          <g data-export-hide>
            <g
              transform={`translate(${selectedGeom.base.x} ${selectedGeom.base.y})`}
              style={{ cursor: "ew-resize" }}
              onPointerDown={(e) => onBaseHandleDown?.(e, selected)}
            >
              <rect x={-16} y={-7} width={32} height={14} rx={7} fill="#fff" stroke="oklch(0.5 0.145 35)" strokeWidth={1.5} />
              <path d="M-9 0 L-4 -3.5 L-4 3.5 Z M9 0 L4 -3.5 L4 3.5 Z" fill="oklch(0.5 0.145 35)" />
            </g>
            <g
              transform={`translate(${selectedGeom.tip.x} ${selectedGeom.tip.y})`}
              style={{ cursor: "move" }}
              onPointerDown={(e) => onTipHandleDown?.(e, selected)}
            >
              <circle r={16} fill="oklch(0.5 0.145 35)" opacity={0.12} />
              <circle r={8} fill="#fff" stroke="oklch(0.5 0.145 35)" strokeWidth={2} />
              <circle r={2.5} fill="oklch(0.5 0.145 35)" />
            </g>
            <g transform="translate(20 22)" pointerEvents="none" fontFamily="var(--font-sans)">
              <rect x={0} y={-13} width={214} height={26} rx={13} fill="oklch(0.24 0.018 55)" opacity={0.88} />
              <text x={14} dominantBaseline="central" fontSize={12} fill="#fff" fontWeight={500}>
                {getMaterial(selected.materialId).name} ・ {round(selected.lengthCm)} cm ・ {describeAngle(selected.angle)}
              </text>
            </g>
          </g>
        )}
      </svg>
    );
  },
);
