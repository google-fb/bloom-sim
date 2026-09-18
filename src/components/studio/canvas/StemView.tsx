"use client";

import { memo } from "react";
import { hashSeed, stemGeometry, stemPath } from "@/lib/ikebana/geometry";
import { getMaterial } from "@/lib/ikebana/materials";
import { StemLeaves, headTransform } from "@/lib/ikebana/materials/shared";
import type { RenderContext, Stem, Vase } from "@/lib/ikebana/types";

interface StemViewProps {
  stem: Stem;
  vase: Vase;
  selected?: boolean;
  interactive?: boolean;
  onPointerDown?: (e: React.PointerEvent, stem: Stem, part: "body" | "head") => void;
}

function StemViewInner({ stem, vase, selected, interactive = true, onPointerDown }: StemViewProps) {
  const material = getMaterial(stem.materialId);
  const color = material.colors.find((c) => c.id === stem.colorId) ?? material.colors[0];
  const geometry = stemGeometry(stem, vase);
  const ctx: RenderContext = {
    geometry,
    color,
    flip: stem.flip,
    seed: hashSeed(stem.id),
    uid: `st-${stem.id}`,
  };
  const d = stemPath(geometry);
  const width = material.stemWidth * geometry.depthScale;
  const opacity = stem.depth === -1 ? 0.88 : 1;

  return (
    <g data-stem-id={stem.id} opacity={opacity}>
      {selected && (
        <path
          d={d}
          stroke="oklch(0.5 0.145 35)"
          strokeWidth={width + 9}
          strokeLinecap="round"
          fill="none"
          opacity={0.22}
          data-export-hide
        />
      )}
      <path d={d} stroke={material.stemColor} strokeWidth={width} strokeLinecap="round" fill="none" />
      <path
        d={d}
        stroke="#ffffff"
        strokeWidth={Math.max(0.6, width * 0.3)}
        strokeLinecap="round"
        fill="none"
        opacity={0.18}
        transform="translate(-0.6 0)"
      />
      {material.stemLeaves !== "none" && (
        <StemLeaves ctx={ctx} fill={material.leafColor ?? "#5f8a4e"} variant={material.stemLeaves} />
      )}
      {material.renderAlong?.(ctx)}
      {material.renderHead && <g transform={headTransform(ctx)}>{material.renderHead(ctx)}</g>}
      {interactive && (
        <>
          <path
            d={d}
            stroke="transparent"
            strokeWidth={18}
            strokeLinecap="round"
            fill="none"
            style={{ cursor: "grab" }}
            onPointerDown={(e) => onPointerDown?.(e, stem, "body")}
            data-export-hide
          />
          <circle
            cx={geometry.tip.x}
            cy={geometry.tip.y}
            r={material.renderHead ? 30 * geometry.depthScale : 22}
            fill="transparent"
            style={{ cursor: "move" }}
            onPointerDown={(e) => onPointerDown?.(e, stem, "head")}
            data-export-hide
          />
        </>
      )}
    </g>
  );
}

export const StemView = memo(StemViewInner);
