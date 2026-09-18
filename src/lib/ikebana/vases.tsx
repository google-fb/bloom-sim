import type { ReactNode } from "react";
import { PX_PER_CM } from "./geometry";
import type { Vase } from "./types";

function Water({ rx, ry, uid }: { rx: number; ry: number; uid: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-water`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#dbe6e3" />
          <stop offset="100%" stopColor="#a9bcb9" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={`url(#${uid}-water)`} opacity={0.92} />
      <ellipse cx={-rx * 0.35} cy={-ry * 0.25} rx={rx * 0.3} ry={ry * 0.22} fill="#ffffff" opacity={0.35} />
    </>
  );
}

function Kenzan({ cx, cy }: { cx: number; cy: number }) {
  const pins: ReactNode[] = [];
  for (let i = -3; i <= 3; i++) {
    for (let j = -1; j <= 1; j++) {
      pins.push(
        <circle key={`${i}-${j}`} cx={cx + i * 7} cy={cy + j * 3.2} r={0.9} fill="#8b8f8a" />,
      );
    }
  }
  return (
    <g opacity={0.9}>
      <ellipse cx={cx} cy={cy + 1} rx={30} ry={8} fill="#2c2f2e" />
      <ellipse cx={cx} cy={cy} rx={30} ry={7.5} fill="#4a4f4d" />
      {pins}
    </g>
  );
}

function Shadow({ rx, y }: { rx: number; y: number }) {
  return <ellipse cx={0} cy={y} rx={rx} ry={rx * 0.09} fill="#000" opacity={0.12} />;
}

export const VASES: Vase[] = [
  {
    id: "suiban-black",
    name: "黑釉水盤",
    kind: "suiban",
    widthCm: 30,
    heightCm: 6,
    mouthWidthCm: 24,
    depthOffsetPx: 7,
    baseOffsetPx: 2,
    description:
      "盛花最常用的淺盤。配合劍山固定花材，水面本身也是作品的一部分。",
    render: (uid) => {
      const rx = (30 * PX_PER_CM) / 2;
      const h = 6 * PX_PER_CM;
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1f1e1c" />
              <stop offset="35%" stopColor="#3a3835" />
              <stop offset="70%" stopColor="#262523" />
              <stop offset="100%" stopColor="#151413" />
            </linearGradient>
          </defs>
          <Shadow rx={rx * 1.05} y={h + 2} />
          <path
            d={`M${-rx} 0 L${-rx + 8} ${h} Q0 ${h + 12} ${rx - 8} ${h} L${rx} 0 Z`}
            fill={`url(#${uid}-body)`}
          />
          <ellipse cx={0} cy={0} rx={rx} ry={18} fill="#2b2a28" />
          <Water rx={rx - 8} ry={14} uid={uid} />
          <ellipse cx={0} cy={0} rx={rx} ry={18} fill="none" stroke="#4d4a45" strokeWidth={2} />
          <Kenzan cx={0} cy={2} />
        </g>
      );
    },
  },
  {
    id: "suiban-round",
    name: "白瓷圓盤",
    kind: "suiban",
    widthCm: 24,
    heightCm: 7,
    mouthWidthCm: 18,
    depthOffsetPx: 7,
    baseOffsetPx: 2,
    description: "口徑較小的圓形水盤，適合小型盛花與練習傾斜型。",
    render: (uid) => {
      const rx = (24 * PX_PER_CM) / 2;
      const h = 7 * PX_PER_CM;
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cfc9bd" />
              <stop offset="40%" stopColor="#f2ede4" />
              <stop offset="100%" stopColor="#bfb8ab" />
            </linearGradient>
          </defs>
          <Shadow rx={rx * 1.05} y={h + 2} />
          <path
            d={`M${-rx} 0 C${-rx} ${h * 0.6} ${-rx * 0.7} ${h} ${-rx * 0.45} ${h} L${rx * 0.45} ${h} C${rx * 0.7} ${h} ${rx} ${h * 0.6} ${rx} 0 Z`}
            fill={`url(#${uid}-body)`}
          />
          <ellipse cx={0} cy={0} rx={rx} ry={16} fill="#e9e4da" />
          <Water rx={rx - 7} ry={12} uid={uid} />
          <ellipse cx={0} cy={0} rx={rx} ry={16} fill="none" stroke="#b9b2a5" strokeWidth={2} />
          <Kenzan cx={0} cy={2} />
        </g>
      );
    },
  },
  {
    id: "compote-clay",
    name: "灰陶高足碗",
    kind: "compote",
    widthCm: 22,
    heightCm: 13,
    mouthWidthCm: 16,
    depthOffsetPx: 6,
    baseOffsetPx: 2,
    description: "帶有高足的陶碗，視覺重心較高，適合強調線條與留白的作品。",
    render: (uid) => {
      const rx = (22 * PX_PER_CM) / 2;
      const bowlH = 7 * PX_PER_CM;
      const h = 13 * PX_PER_CM;
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6f6a62" />
              <stop offset="45%" stopColor="#a39d92" />
              <stop offset="100%" stopColor="#5d5850" />
            </linearGradient>
          </defs>
          <Shadow rx={rx * 0.7} y={h + 2} />
          <path
            d={`M${-rx} 0 C${-rx} ${bowlH * 0.8} ${-rx * 0.5} ${bowlH} ${-14} ${bowlH} L${-16} ${h - 10} L${-rx * 0.55} ${h - 4} L${-rx * 0.55} ${h} L${rx * 0.55} ${h} L${rx * 0.55} ${h - 4} L${16} ${h - 10} L${14} ${bowlH} C${rx * 0.5} ${bowlH} ${rx} ${bowlH * 0.8} ${rx} 0 Z`}
            fill={`url(#${uid}-body)`}
          />
          <ellipse cx={0} cy={0} rx={rx} ry={15} fill="#8a857b" />
          <Water rx={rx - 7} ry={11} uid={uid} />
          <ellipse cx={0} cy={0} rx={rx} ry={15} fill="none" stroke="#575249" strokeWidth={2} />
          <Kenzan cx={0} cy={2} />
        </g>
      );
    },
  },
  {
    id: "vase-celadon",
    name: "青瓷花瓶",
    kind: "vase",
    widthCm: 12,
    heightCm: 26,
    mouthWidthCm: 7,
    depthOffsetPx: 3,
    baseOffsetPx: 0,
    description: "投入花使用的高瓶。不用劍山，靠瓶口與瓶壁支撐花材。",
    render: (uid) => {
      const h = 26 * PX_PER_CM;
      const mouthR = (12 * PX_PER_CM) / 2 * 0.6;
      const bellyR = (12 * PX_PER_CM) / 2;
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6f8f78" />
              <stop offset="40%" stopColor="#a9c4ad" />
              <stop offset="75%" stopColor="#8aa892" />
              <stop offset="100%" stopColor="#5d7c66" />
            </linearGradient>
          </defs>
          <Shadow rx={bellyR * 0.9} y={h + 2} />
          <path
            d={`M${-mouthR} 0 C${-mouthR} ${h * 0.18} ${-bellyR} ${h * 0.3} ${-bellyR} ${h * 0.55} C${-bellyR} ${h * 0.8} ${-bellyR * 0.75} ${h * 0.92} ${-bellyR * 0.6} ${h} L${bellyR * 0.6} ${h} C${bellyR * 0.75} ${h * 0.92} ${bellyR} ${h * 0.8} ${bellyR} ${h * 0.55} C${bellyR} ${h * 0.3} ${mouthR} ${h * 0.18} ${mouthR} 0 Z`}
            fill={`url(#${uid}-body)`}
          />
          <ellipse cx={0} cy={0} rx={mouthR} ry={8} fill="#3f5a48" />
          <ellipse cx={0} cy={0} rx={mouthR} ry={8} fill="none" stroke="#c7dccb" strokeWidth={2} />
        </g>
      );
    },
  },
  {
    id: "bamboo",
    name: "竹筒",
    kind: "vase",
    widthCm: 9,
    heightCm: 20,
    mouthWidthCm: 6,
    depthOffsetPx: 3,
    baseOffsetPx: 0,
    description: "質樸的竹製花器，適合一枝一花的簡素之美。",
    render: (uid) => {
      const h = 20 * PX_PER_CM;
      const r = (9 * PX_PER_CM) / 2;
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7d6a3a" />
              <stop offset="40%" stopColor="#c4ad6b" />
              <stop offset="100%" stopColor="#8a7440" />
            </linearGradient>
          </defs>
          <Shadow rx={r * 1.1} y={h + 2} />
          <rect x={-r} y={0} width={r * 2} height={h} fill={`url(#${uid}-body)`} />
          <ellipse cx={0} cy={h} rx={r} ry={7} fill="#8a7440" />
          <rect x={-r} y={h * 0.55} width={r * 2} height={6} fill="#6b5a30" opacity={0.6} />
          <ellipse cx={0} cy={0} rx={r} ry={7} fill="#4b3f22" />
          <ellipse cx={0} cy={0} rx={r} ry={7} fill="none" stroke="#dcc98d" strokeWidth={2.5} />
        </g>
      );
    },
  },
];

export const VASE_MAP: Record<string, Vase> = Object.fromEntries(VASES.map((v) => [v.id, v]));

export function getVase(id: string): Vase {
  return VASE_MAP[id] ?? VASES[0];
}

export function unitCm(vase: Vase): number {
  return vase.widthCm + vase.heightCm;
}
