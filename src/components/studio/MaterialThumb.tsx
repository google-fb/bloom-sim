"use client";

import { memo } from "react";
import { buildGeometry, stemPath } from "@/lib/ikebana/geometry";
import { headTransform } from "@/lib/ikebana/materials/shared";
import type { Material, RenderContext } from "@/lib/ikebana/types";

interface MaterialThumbProps {
  material: Material;
  colorId?: string;
  size?: number;
  className?: string;
}

function MaterialThumbInner({ material, colorId, size = 72, className }: MaterialThumbProps) {
  const color = material.colors.find((c) => c.id === colorId) ?? material.colors[0];
  const hasHead = Boolean(material.renderHead);
  const defaultLength = material.renderAlong && !hasHead ? 86 : 58;
  const defaultTipY = material.renderAlong && !hasHead ? 12 : 40;
  const lengthPx = material.thumb?.lengthPx ?? defaultLength;
  const tipY = material.thumb?.tipY ?? defaultTipY;
  const geometry = buildGeometry({ x: 50, y: tipY + lengthPx }, lengthPx, 0, material.defaultCurve * 0.5);
  const ctx: RenderContext = {
    geometry,
    color,
    flip: false,
    seed: 7,
    uid: `thumb-${material.id}`,
  };
  const scale = material.thumb?.scale ?? 1;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      <g transform={`translate(50 100) scale(${scale}) translate(-50 -100)`}>
        <path
          d={stemPath(geometry)}
          stroke={material.stemColor}
          strokeWidth={material.stemWidth}
          strokeLinecap="round"
          fill="none"
        />
        {material.renderAlong?.(ctx)}
        {material.renderHead && <g transform={headTransform(ctx)}>{material.renderHead(ctx)}</g>}
      </g>
    </svg>
  );
}

export const MaterialThumb = memo(MaterialThumbInner);
