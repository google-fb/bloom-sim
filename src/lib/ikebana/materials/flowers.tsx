import type { ReactNode } from "react";
import { darken, lighten, mix } from "../color";
import { fx, seededRandom } from "../geometry";
import type { Material } from "../types";
import { RadialPetals, color } from "./shared";

const LEAF_GREEN = "#5f8a4e";

export const chrysanthemum: Material = {
  id: "chrysanthemum",
  name: "菊花",
  latin: "Chrysanthemum",
  category: "mass",
  colors: [
    color("yellow", "金黃", "#F0BE32", "yellow"),
    color("white", "素白", "#F6F1E4", "white"),
    color("pink", "櫻粉", "#E79BB6", "pink"),
    color("wine", "紫紅", "#A54A72", "purple"),
  ],
  defaultLengthCm: 32,
  minLengthCm: 10,
  maxLengthCm: 70,
  stemColor: "#5a7a45",
  stemWidth: 3.2,
  defaultCurve: 0,
  stemLeaves: "pair",
  leafColor: LEAF_GREEN,
  tip: "花道最常見的「塊」材料，花形飽滿，適合擔任控枝或焦點花。",
  renderHead: ({ color: c }) => (
    <g>
      <RadialPetals n={18} len={27} w={7} r0={5} fill={c.hex} />
      <RadialPetals n={13} len={20} w={6.5} r0={3} fill={lighten(c.hex, 0.12)} rot={10} />
      <RadialPetals n={8} len={12} w={6} fill={lighten(c.hex, 0.25)} rot={20} />
      <circle r={4.2} fill={darken(c.hex, 0.25)} />
    </g>
  ),
};

export const gerbera: Material = {
  id: "gerbera",
  name: "非洲菊",
  latin: "Gerbera",
  category: "mass",
  colors: [
    color("orange", "橙紅", "#EE7A3A", "orange"),
    color("hotpink", "桃紅", "#E2507E", "pink"),
    color("yellow", "檸黃", "#F3C53F", "yellow"),
    color("white", "白", "#F7F3EA", "white"),
  ],
  defaultLengthCm: 30,
  minLengthCm: 10,
  maxLengthCm: 60,
  stemColor: "#6e8f4f",
  stemWidth: 3,
  defaultCurve: 0.15,
  stemLeaves: "none",
  tip: "花莖柔軟略帶弧度，色彩鮮明，是很好的視覺焦點。",
  renderHead: ({ color: c }) => (
    <g>
      <RadialPetals n={22} len={26} w={4.6} r0={6} fill={c.hex} strokeWidth={0.5} />
      <RadialPetals n={22} len={21} w={4.2} r0={5} fill={lighten(c.hex, 0.14)} rot={8} strokeWidth={0.5} />
      <circle r={8} fill="#3b2a20" />
      <circle r={5} fill="#5a3f2b" />
      {Array.from({ length: 10 }, (_, i) => (
        <circle
          key={i}
          cx={0}
          cy={-6.5}
          r={0.9}
          fill={lighten(c.hex, 0.4)}
          transform={`rotate(${i * 36})`}
        />
      ))}
    </g>
  ),
};

export const rose: Material = {
  id: "rose",
  name: "玫瑰",
  latin: "Rosa",
  category: "mass",
  colors: [
    color("red", "正紅", "#B9273B", "red"),
    color("pink", "淡粉", "#F0A7B8", "pink"),
    color("cream", "奶油", "#F2E2C1", "white"),
    color("apricot", "杏橘", "#E9925A", "orange"),
  ],
  defaultLengthCm: 34,
  minLengthCm: 10,
  maxLengthCm: 70,
  stemColor: "#4f6d3b",
  stemWidth: 3.4,
  defaultCurve: 0,
  stemLeaves: "pair",
  leafColor: "#3f6a3a",
  tip: "層層包覆的花形具有重量感，數量宜少，讓每一朵都能被看見。",
  renderHead: ({ color: c }) => {
    const outer: ReactNode[] = [];
    for (let i = 0; i < 6; i++) {
      outer.push(
        <ellipse
          key={i}
          cx={0}
          cy={-9}
          rx={8.5}
          ry={11.5}
          fill={i % 2 ? c.hex : lighten(c.hex, 0.06)}
          stroke={darken(c.hex, 0.25)}
          strokeWidth={0.8}
          transform={`rotate(${i * 60})`}
        />,
      );
    }
    const inner: ReactNode[] = [];
    for (let i = 0; i < 5; i++) {
      inner.push(
        <ellipse
          key={i}
          cx={0}
          cy={-5}
          rx={6}
          ry={8}
          fill={lighten(c.hex, 0.1)}
          stroke={darken(c.hex, 0.25)}
          strokeWidth={0.7}
          transform={`rotate(${36 + i * 72})`}
        />,
      );
    }
    return (
      <g>
        {outer}
        {inner}
        <circle r={5.5} fill={darken(c.hex, 0.12)} stroke={darken(c.hex, 0.3)} strokeWidth={0.7} />
        <path
          d="M0 -3 a3 3 0 1 1 -3 3 a4.5 4.5 0 1 0 4.5 -4.5"
          stroke={lighten(c.hex, 0.35)}
          strokeWidth={1.1}
          fill="none"
        />
      </g>
    );
  },
};

export const lily: Material = {
  id: "lily",
  name: "百合",
  latin: "Lilium",
  category: "mass",
  colors: [
    color("white", "純白", "#F8F5EC", "white"),
    color("pink", "粉紅", "#EFB8C8", "pink"),
    color("orange", "橙黃", "#E98F3E", "orange"),
  ],
  defaultLengthCm: 40,
  minLengthCm: 14,
  maxLengthCm: 75,
  stemColor: "#4c7a3f",
  stemWidth: 3.8,
  defaultCurve: 0,
  stemLeaves: "pair",
  leafColor: "#4c7a3f",
  tip: "花形大而張揚，一枝即成主角。留意花朵朝向，通常微微面向觀者。",
  renderHead: ({ color: c }) => {
    const spots = c.id === "pink";
    return (
      <g>
        <RadialPetals n={6} len={36} w={13} r0={2} fill={c.hex} stroke={darken(c.hex, 0.2)} rot={0} />
        <RadialPetals n={6} len={30} w={11} r0={1} fill={lighten(c.hex, 0.08)} stroke={darken(c.hex, 0.18)} rot={30} strokeWidth={0.6} />
        {spots &&
          Array.from({ length: 18 }, (_, i) => (
            <circle
              key={i}
              cx={0}
              cy={-8 - (i % 3) * 5}
              r={0.9}
              fill={darken(c.hex, 0.45)}
              transform={`rotate(${(i * 60) / 3 + (i % 3) * 4})`}
            />
          ))}
        <path d="M0 -6 Q0 -22 -3 -26" stroke={darken(c.hex, 0.35)} strokeWidth={1} fill="none" opacity={0.6} />
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 60 + 30})`}>
            <line x1={0} y1={0} x2={0} y2={-14} stroke="#c9d7b5" strokeWidth={1} />
            <ellipse cx={0} cy={-15} rx={1.7} ry={3} fill="#c9772e" />
          </g>
        ))}
        <circle r={2} fill="#9fb76c" />
      </g>
    );
  },
};

export const carnation: Material = {
  id: "carnation",
  name: "康乃馨",
  latin: "Dianthus",
  category: "mass",
  colors: [
    color("pink", "粉紅", "#F2A1B6", "pink"),
    color("red", "深紅", "#C43A4B", "red"),
    color("white", "白", "#F6F1E8", "white"),
    color("yellow", "淡黃", "#F2D26B", "yellow"),
  ],
  defaultLengthCm: 30,
  minLengthCm: 10,
  maxLengthCm: 60,
  stemColor: "#7e9c78",
  stemWidth: 2.8,
  defaultCurve: 0.1,
  stemLeaves: "pair",
  leafColor: "#8aa889",
  tip: "花瓣如波浪皺褶，耐久易插，適合作為從枝補足塊面。",
  renderHead: ({ color: c, seed }) => {
    const rnd = seededRandom(seed);
    const dots: ReactNode[] = [];
    const layers = [
      { n: 14, r: 12, size: 6.2, shade: 0 },
      { n: 10, r: 7, size: 5.6, shade: 0.08 },
      { n: 6, r: 3, size: 5, shade: 0.16 },
    ];
    layers.forEach((layer, li) => {
      for (let i = 0; i < layer.n; i++) {
        const a = (i / layer.n) * Math.PI * 2 + rnd() * 0.3;
        const r = layer.r + (rnd() - 0.5) * 2;
        dots.push(
          <circle
            key={`${li}-${i}`}
            cx={fx(Math.cos(a) * r)}
            cy={fx(Math.sin(a) * r)}
            r={layer.size}
            fill={i % 2 ? lighten(c.hex, layer.shade) : lighten(c.hex, layer.shade + 0.06)}
            stroke={darken(c.hex, 0.22)}
            strokeWidth={0.6}
          />,
        );
      }
    });
    return (
      <g>
        <path d="M-6 4 Q0 14 6 4 L4 -2 L-4 -2 Z" fill="#7e9c78" />
        {dots}
        <circle r={3.4} fill={lighten(c.hex, 0.25)} />
      </g>
    );
  },
};

export const tulip: Material = {
  id: "tulip",
  name: "鬱金香",
  latin: "Tulipa",
  category: "mass",
  colors: [
    color("red", "紅", "#D8323C", "red"),
    color("yellow", "黃", "#F0C43C", "yellow"),
    color("purple", "紫", "#7A4B9E", "purple"),
    color("pink", "粉", "#EC9DB2", "pink"),
  ],
  defaultLengthCm: 30,
  minLengthCm: 10,
  maxLengthCm: 55,
  stemColor: "#7ea25a",
  stemWidth: 3.4,
  defaultCurve: 0.25,
  stemLeaves: "long",
  leafColor: "#86a65f",
  tip: "莖會隨光線彎曲生長，善用弧度可以創造柔和的動勢。",
  renderHead: ({ color: c }) => (
    <g>
      <path
        d="M-11 0 C-15 -12, -13 -24, -6 -31 C-3 -20, -1 -10, 0 2 Z"
        fill={darken(c.hex, 0.12)}
        stroke={darken(c.hex, 0.3)}
        strokeWidth={0.8}
      />
      <path
        d="M11 0 C15 -12, 13 -24, 6 -31 C3 -20, 1 -10, 0 2 Z"
        fill={darken(c.hex, 0.06)}
        stroke={darken(c.hex, 0.3)}
        strokeWidth={0.8}
      />
      <path
        d="M-8 1 C-11 -14, -7 -26, 0 -34 C7 -26, 11 -14, 8 1 Z"
        fill={c.hex}
        stroke={darken(c.hex, 0.3)}
        strokeWidth={0.8}
      />
      <path d="M0 -30 Q-2 -16 -1 0" stroke={lighten(c.hex, 0.3)} strokeWidth={1} fill="none" opacity={0.7} />
    </g>
  ),
};

export const balloonFlower: Material = {
  id: "balloon-flower",
  name: "桔梗",
  latin: "Platycodon",
  category: "mass",
  colors: [
    color("violet", "紫藍", "#6F63B8", "purple"),
    color("blue", "青藍", "#5B7DBE", "blue"),
    color("white", "白", "#F3F1EC", "white"),
  ],
  defaultLengthCm: 28,
  minLengthCm: 10,
  maxLengthCm: 55,
  stemColor: "#5d7d50",
  stemWidth: 2.4,
  defaultCurve: 0.1,
  stemLeaves: "pair",
  leafColor: "#5d7d50",
  tip: "秋之七草之一，五角星形的小花清雅，適合作為點綴的從枝。",
  renderHead: ({ color: c }) => (
    <g>
      <RadialPetals n={5} len={19} w={14} r0={0} fill={c.hex} stroke={darken(c.hex, 0.25)} />
      {Array.from({ length: 5 }, (_, i) => (
        <line
          key={i}
          x1={0}
          y1={-3}
          x2={0}
          y2={-14}
          stroke={lighten(c.hex, 0.55)}
          strokeWidth={0.9}
          transform={`rotate(${i * 72})`}
          opacity={0.9}
        />
      ))}
      <circle r={2.6} fill={mix(c.hex, "#ffffff", 0.7)} />
      <g transform="translate(-16 10)">
        <ellipse rx={4} ry={5.5} fill={darken(c.hex, 0.05)} stroke={darken(c.hex, 0.3)} strokeWidth={0.6} />
        <line x1={0} y1={5} x2={4} y2={12} stroke="#5d7d50" strokeWidth={1.4} />
      </g>
    </g>
  ),
};

export const anthurium: Material = {
  id: "anthurium",
  name: "火鶴花",
  latin: "Anthurium",
  category: "mass",
  colors: [
    color("red", "亮紅", "#C8283C", "red"),
    color("pink", "粉紅", "#F0A0B0", "pink"),
    color("white", "白綠", "#EEF0E3", "white"),
    color("green", "翠綠", "#9CBF7A", "green"),
  ],
  defaultLengthCm: 36,
  minLengthCm: 12,
  maxLengthCm: 70,
  stemColor: "#4f7f4f",
  stemWidth: 3,
  defaultCurve: 0.2,
  stemLeaves: "none",
  tip: "心形苞片線條俐落、質感如蠟，很適合現代風格的自由花。",
  renderHead: ({ color: c }) => (
    <g>
      <path
        d="M0 4 C-18 -4, -24 -22, -14 -32 C-7 -38, -1 -32, 0 -26 C1 -32, 7 -38, 14 -32 C24 -22, 18 -4, 0 4 Z"
        fill={c.hex}
        stroke={darken(c.hex, 0.3)}
        strokeWidth={0.9}
      />
      <path d="M-4 -6 C-10 -14, -12 -22, -8 -28" stroke={lighten(c.hex, 0.35)} strokeWidth={1.2} fill="none" opacity={0.7} />
      <path d="M0 -24 C4 -16, 4 -8, 3 2" stroke="#f0d36a" strokeWidth={4.5} strokeLinecap="round" fill="none" />
      <path d="M0 -24 C4 -16, 4 -8, 3 2" stroke="#d9b24a" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.6} />
    </g>
  ),
};

export const babysBreath: Material = {
  id: "babys-breath",
  name: "滿天星",
  latin: "Gypsophila",
  category: "filler",
  colors: [color("white", "白", "#F8F6F0", "white"), color("pink", "淡粉", "#F4D3DC", "pink")],
  defaultLengthCm: 30,
  minLengthCm: 10,
  maxLengthCm: 60,
  stemColor: "#98a67f",
  stemWidth: 1.6,
  defaultCurve: 0.1,
  stemLeaves: "none",
  tip: "細碎的小白花能填補空隙，卻要留意別填得太滿，留白才是花道的呼吸。",
  renderHead: ({ color: c, seed }) => {
    const rnd = seededRandom(seed);
    const twigs: ReactNode[] = [];
    for (let i = 0; i < 7; i++) {
      const a = -70 + i * 23 + (rnd() - 0.5) * 10;
      const len = 18 + rnd() * 20;
      const rad = (a - 90) * (Math.PI / 180);
      const ex = fx(Math.cos(rad) * len);
      const ey = fx(Math.sin(rad) * len);
      twigs.push(
        <g key={i}>
          <line x1={0} y1={0} x2={ex} y2={ey} stroke="#98a67f" strokeWidth={0.8} />
          {Array.from({ length: 4 }, (_, j) => {
            const f = 0.55 + j * 0.15;
            const ox = (rnd() - 0.5) * 8;
            const oy = (rnd() - 0.5) * 8;
            return (
              <circle
                key={j}
                cx={fx(ex * f + ox)}
                cy={fx(ey * f + oy)}
                r={fx(2.2 + rnd())}
                fill={c.hex}
                stroke={darken(c.hex, 0.15)}
                strokeWidth={0.5}
              />
            );
          })}
        </g>,
      );
    }
    return <g>{twigs}</g>;
  },
};
