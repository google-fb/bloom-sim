import type { ReactNode } from "react";
import { darken, lighten } from "../color";
import type { ColorOption, HueFamily, RenderContext } from "../types";

export function color(id: string, name: string, hex: string, hue: HueFamily): ColorOption {
  return { id, name, hex, hue };
}

/** 尖端向上的花瓣，底部在原點 */
export function petalPath(len: number, w: number): string {
  const hw = w / 2;
  return `M0 0 C${hw} ${-len * 0.25}, ${hw} ${-len * 0.7}, 0 ${-len} C${-hw} ${-len * 0.7}, ${-hw} ${-len * 0.25}, 0 0 Z`;
}

/** 葉片（略有弧度），底部在原點、向上生長 */
export function leafPath(len: number, w: number): string {
  return `M0 0 Q${w} ${-len * 0.45} 0 ${-len} Q${-w * 0.7} ${-len * 0.55} 0 0 Z`;
}

export function RadialPetals({
  n,
  len,
  w,
  r0 = 0,
  fill,
  stroke,
  rot = 0,
  strokeWidth = 0.8,
}: {
  n: number;
  len: number;
  w: number;
  r0?: number;
  fill: string;
  stroke?: string;
  rot?: number;
  strokeWidth?: number;
}) {
  const d = petalPath(len, w);
  const items: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (360 / n) * i;
    items.push(
      <path
        key={i}
        d={d}
        fill={fill}
        stroke={stroke ?? darken(fill, 0.18)}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        transform={`rotate(${a}) translate(0 ${-r0})`}
      />,
    );
  }
  return <>{items}</>;
}

/** 五瓣小花（梅、桔梗等） */
export function SmallBlossom({
  r,
  fill,
  center,
  petals = 5,
}: {
  r: number;
  fill: string;
  center: string;
  petals?: number;
}) {
  const items: ReactNode[] = [];
  for (let i = 0; i < petals; i++) {
    items.push(
      <circle
        key={i}
        cx={0}
        cy={-r * 0.62}
        r={r * 0.5}
        fill={fill}
        stroke={darken(fill, 0.15)}
        strokeWidth={0.5}
        transform={`rotate(${(360 / petals) * i})`}
      />,
    );
  }
  return (
    <g>
      {items}
      <circle r={r * 0.28} fill={center} />
    </g>
  );
}

/** 位置沿花莖分布的小元件，回傳 t 值與左右交替的側邊 */
export function alongStem(
  from: number,
  to: number,
  count: number,
): { t: number; side: 1 | -1 }[] {
  const items: { t: number; side: 1 | -1 }[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? to : from + ((to - from) * i) / (count - 1);
    items.push({ t, side: i % 2 === 0 ? 1 : -1 });
  }
  return items;
}

export function placeAt(ctx: RenderContext, t: number): { x: number; y: number; rot: number } {
  const p = ctx.geometry.pointAt(t);
  return { x: p.x, y: p.y, rot: ctx.geometry.tangentAt(t) };
}

/** 一般花莖上的成對葉片 */
export function StemLeaves({
  ctx,
  fill,
  variant,
}: {
  ctx: RenderContext;
  fill: string;
  variant: "pair" | "long";
}) {
  const s = ctx.geometry.depthScale;
  const L = ctx.geometry.lengthPx;
  if (variant === "long") {
    // 鬱金香、水仙等從基部長出的長葉
    const len = Math.min(L * 0.55, 150) * s;
    const b = ctx.geometry.base;
    const rot = ctx.geometry.tangentAt(0.05);
    return (
      <g transform={`translate(${b.x} ${b.y}) rotate(${rot})`}>
        <path d={leafPath(len, 16 * s)} fill={fill} stroke={darken(fill, 0.2)} strokeWidth={0.8} transform="rotate(-16)" />
        <path
          d={leafPath(len * 0.85, 14 * s)}
          fill={lighten(fill, 0.1)}
          stroke={darken(fill, 0.2)}
          strokeWidth={0.8}
          transform="rotate(14)"
        />
      </g>
    );
  }
  if (L < 90) return null;
  const positions = L > 260 ? [0.36, 0.55, 0.72] : [0.42, 0.66];
  return (
    <g>
      {positions.map((t, i) => {
        const p = placeAt(ctx, t);
        const side = i % 2 === 0 ? -1 : 1;
        const len = Math.min(34, L * 0.16) * s;
        return (
          <path
            key={t}
            d={leafPath(len, 9 * s)}
            fill={fill}
            stroke={darken(fill, 0.2)}
            strokeWidth={0.8}
            transform={`translate(${p.x} ${p.y}) rotate(${p.rot + side * 48})`}
          />
        );
      })}
    </g>
  );
}

export function headTransform(ctx: RenderContext, extraScale = 1): string {
  const { tip, tipRotation, depthScale } = ctx.geometry;
  const sx = depthScale * extraScale * (ctx.flip ? -1 : 1);
  const sy = depthScale * extraScale;
  return `translate(${tip.x} ${tip.y}) rotate(${tipRotation}) scale(${sx} ${sy})`;
}
