import type { ReactNode } from "react";
import { darken, lighten } from "../color";
import { seededRandom } from "../geometry";
import type { Material, RenderContext } from "../types";
import { SmallBlossom, alongStem, color, leafPath, placeAt } from "./shared";

/** 依花莖長度決定沿莖元件數量 */
function countFor(ctx: RenderContext, spacingPx: number, min = 2, max = 8): number {
  return Math.max(min, Math.min(max, Math.round((ctx.geometry.lengthPx * 0.55) / spacingPx)));
}

function NeedleCluster({ n, len, stroke }: { n: number; len: number; stroke: string }) {
  const items: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = -70 + (140 / (n - 1)) * i;
    items.push(
      <line
        key={i}
        x1={0}
        y1={0}
        x2={0}
        y2={-len * (0.8 + 0.2 * Math.sin(i))}
        stroke={stroke}
        strokeWidth={1.1}
        strokeLinecap="round"
        transform={`rotate(${a})`}
      />,
    );
  }
  return <>{items}</>;
}

export const pine: Material = {
  id: "pine",
  name: "松枝",
  latin: "Pinus",
  category: "line",
  colors: [color("green", "松綠", "#2F6B3A", "green"), color("deep", "墨綠", "#244E30", "green")],
  defaultLengthCm: 50,
  minLengthCm: 15,
  maxLengthCm: 80,
  stemColor: "#5b4634",
  stemWidth: 5,
  defaultCurve: 0.1,
  stemLeaves: "none",
  tip: "常綠、線條剛直，象徵長壽。是擔任「真」的經典枝材。",
  renderAlong: (ctx) => {
    const s = ctx.geometry.depthScale;
    const n = countFor(ctx, 46, 3, 7);
    return (
      <g>
        {alongStem(0.42, 1, n).map(({ t, side }, i) => {
          const p = placeAt(ctx, t);
          const isTip = i === n - 1;
          const twig = isTip ? 0 : 12 * s;
          const rot = p.rot + (isTip ? 0 : side * 55);
          return (
            <g key={t} transform={`translate(${p.x} ${p.y}) rotate(${rot})`}>
              {!isTip && <line x1={0} y1={0} x2={0} y2={-twig} stroke="#5b4634" strokeWidth={2.4 * s} />}
              <g transform={`translate(0 ${-twig}) scale(${s})`}>
                <NeedleCluster n={15} len={22} stroke={ctx.color.hex} />
                <NeedleCluster n={11} len={16} stroke={lighten(ctx.color.hex, 0.18)} />
              </g>
            </g>
          );
        })}
      </g>
    );
  },
};

export const plum: Material = {
  id: "plum",
  name: "梅枝",
  latin: "Prunus mume",
  category: "line",
  colors: [
    color("pink", "淡粉", "#F2B6C6", "pink"),
    color("white", "白梅", "#FAF3F0", "white"),
    color("red", "紅梅", "#D9536E", "red"),
  ],
  defaultLengthCm: 52,
  minLengthCm: 15,
  maxLengthCm: 80,
  stemColor: "#4a3327",
  stemWidth: 4.2,
  defaultCurve: 0.2,
  stemLeaves: "none",
  tip: "枯枝上綻放小花，剛與柔並存。枝形轉折處是欣賞重點，不必多。",
  renderAlong: (ctx) => {
    const s = ctx.geometry.depthScale;
    const rnd = seededRandom(ctx.seed);
    const n = countFor(ctx, 30, 4, 10);
    const c = ctx.color.hex;
    return (
      <g>
        {alongStem(0.35, 0.98, n).map(({ t, side }, i) => {
          const p = placeAt(ctx, t);
          const twig = (10 + rnd() * 10) * s;
          const rot = p.rot + side * (40 + rnd() * 25);
          const bud = i % 3 === 2;
          return (
            <g key={t} transform={`translate(${p.x} ${p.y}) rotate(${rot})`}>
              <line x1={0} y1={0} x2={0} y2={-twig} stroke="#4a3327" strokeWidth={1.8 * s} strokeLinecap="round" />
              <g transform={`translate(0 ${-twig}) scale(${s})`}>
                {bud ? (
                  <circle r={2.8} fill={darken(c, 0.15)} stroke={darken(c, 0.35)} strokeWidth={0.5} />
                ) : (
                  <SmallBlossom r={7.5} fill={c} center="#e2b64a" />
                )}
              </g>
              {!bud && (
                <g transform={`translate(${side * 4} ${-twig * 0.5}) scale(${s * 0.75})`}>
                  <SmallBlossom r={6} fill={lighten(c, 0.08)} center="#e2b64a" />
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  },
};

const MAPLE_LEAF =
  "M0 0 L-3 -7 L-13 -9 L-8 -14 L-12 -25 L-4 -19 L0 -30 L4 -19 L12 -25 L8 -14 L13 -9 L3 -7 Z";

export const maple: Material = {
  id: "maple",
  name: "楓枝",
  latin: "Acer",
  category: "line",
  colors: [
    color("red", "楓紅", "#C8402F", "red"),
    color("orange", "橙黃", "#E07B2A", "orange"),
    color("green", "青楓", "#6B9A47", "green"),
  ],
  defaultLengthCm: 48,
  minLengthCm: 15,
  maxLengthCm: 80,
  stemColor: "#6b4a3a",
  stemWidth: 3.6,
  defaultCurve: 0.15,
  stemLeaves: "none",
  tip: "葉片舒展、季節感強。適合擔任副枝，讓作品有向外延伸的姿態。",
  renderAlong: (ctx) => {
    const s = ctx.geometry.depthScale;
    const n = countFor(ctx, 40, 3, 7);
    const c = ctx.color.hex;
    return (
      <g>
        {alongStem(0.4, 1, n).map(({ t, side }, i) => {
          const p = placeAt(ctx, t);
          const isTip = i === n - 1;
          const twig = isTip ? 4 : 10;
          const rot = p.rot + (isTip ? 0 : side * 50);
          const size = (isTip ? 0.85 : 1) * s;
          return (
            <g key={t} transform={`translate(${p.x} ${p.y}) rotate(${rot})`}>
              <line x1={0} y1={0} x2={0} y2={-twig * s} stroke="#6b4a3a" strokeWidth={1.6 * s} />
              <path
                d={MAPLE_LEAF}
                transform={`translate(0 ${-twig * s}) scale(${size})`}
                fill={i % 2 ? c : lighten(c, 0.1)}
                stroke={darken(c, 0.3)}
                strokeWidth={0.8}
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </g>
    );
  },
};

export const willow: Material = {
  id: "willow",
  name: "柳枝",
  latin: "Salix",
  category: "line",
  colors: [color("green", "柳綠", "#8FAA4E", "green"), color("yellow", "嫩黃", "#B9BE5C", "green")],
  defaultLengthCm: 55,
  minLengthCm: 20,
  maxLengthCm: 85,
  stemColor: "#6f7a3a",
  stemWidth: 2.4,
  defaultCurve: 0.7,
  stemLeaves: "none",
  tip: "柔軟垂墜的線條。把「彎曲」調大，就能做出隨風擺盪的動感。",
  renderAlong: (ctx) => {
    const s = ctx.geometry.depthScale;
    const n = countFor(ctx, 22, 5, 14);
    const c = ctx.color.hex;
    return (
      <g>
        {alongStem(0.3, 1, n).map(({ t, side }, i) => {
          const p = placeAt(ctx, t);
          return (
            <path
              key={t}
              d={leafPath(20 * s, 4.5 * s)}
              fill={i % 2 ? c : lighten(c, 0.12)}
              stroke={darken(c, 0.25)}
              strokeWidth={0.6}
              transform={`translate(${p.x} ${p.y}) rotate(${p.rot + side * 42})`}
            />
          );
        })}
      </g>
    );
  },
};

export const miscanthus: Material = {
  id: "miscanthus",
  name: "芒草",
  latin: "Miscanthus",
  category: "line",
  colors: [color("tan", "秋芒", "#D8C59A", "neutral"), color("silver", "銀白", "#E7E1D2", "white")],
  defaultLengthCm: 60,
  minLengthCm: 20,
  maxLengthCm: 90,
  stemColor: "#b8a97a",
  stemWidth: 2,
  defaultCurve: 0.3,
  stemLeaves: "none",
  thumb: { lengthPx: 70, tipY: 60, scale: 0.85 },
  tip: "纖細高聳的線條能拉高作品，秋天的氛圍全靠它。",
  renderAlong: (ctx) => {
    const s = ctx.geometry.depthScale;
    const g = ctx.geometry;
    const b = g.base;
    const bladeLen = g.lengthPx * 0.6;
    const baseRot = g.tangentAt(0.05);
    return (
      <g transform={`translate(${b.x} ${b.y}) rotate(${baseRot})`}>
        {[-1, 1].map((side) => (
          <path
            key={side}
            d={`M0 0 Q${side * bladeLen * 0.25} ${-bladeLen * 0.55} ${side * bladeLen * 0.55} ${-bladeLen}`}
            stroke="#8a9a4a"
            strokeWidth={2.6 * s}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </g>
    );
  },
  renderHead: ({ color: c, seed }) => {
    const rnd = seededRandom(seed);
    const strands: ReactNode[] = [];
    for (let i = 0; i < 9; i++) {
      const a = -34 + i * 8.5 + (rnd() - 0.5) * 4;
      const len = 34 + rnd() * 22;
      strands.push(
        <g key={i} transform={`rotate(${a})`}>
          <path d={`M0 0 Q${4} ${-len * 0.5} ${8} ${-len}`} stroke={c.hex} strokeWidth={1.4} fill="none" strokeLinecap="round" />
          {Array.from({ length: 5 }, (_, j) => (
            <circle key={j} cx={2 + j * 1.5} cy={-len * (0.3 + j * 0.15)} r={1.1} fill={lighten(c.hex, 0.3)} />
          ))}
        </g>,
      );
    }
    return <g>{strands}</g>;
  },
};
