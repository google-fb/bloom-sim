import { darken, lighten } from "../color";
import type { Material } from "../types";
import { alongStem, color, leafPath, placeAt } from "./shared";

export const eucalyptus: Material = {
  id: "eucalyptus",
  name: "尤加利",
  latin: "Eucalyptus",
  category: "filler",
  colors: [color("sage", "灰綠", "#8FA88E", "green"), color("blue", "藍綠", "#7E9A9A", "green")],
  defaultLengthCm: 38,
  minLengthCm: 12,
  maxLengthCm: 70,
  stemColor: "#7d8a6c",
  stemWidth: 2.2,
  defaultCurve: 0.2,
  stemLeaves: "none",
  tip: "圓潤的灰綠色葉片，能柔化花朵間的空隙，也帶來層次感。",
  renderAlong: (ctx) => {
    const s = ctx.geometry.depthScale;
    const n = Math.max(3, Math.min(9, Math.round(ctx.geometry.lengthPx / 34)));
    const c = ctx.color.hex;
    return (
      <g>
        {alongStem(0.3, 1, n).map(({ t }, i) => {
          const p = placeAt(ctx, t);
          const r = (i === n - 1 ? 5.5 : 7) * s;
          return (
            <g key={t} transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`}>
              {[-1, 1].map((side) => (
                <ellipse
                  key={side}
                  cx={side * r * 1.05}
                  cy={-2}
                  rx={r}
                  ry={r * 0.9}
                  fill={side === 1 ? c : lighten(c, 0.1)}
                  stroke={darken(c, 0.25)}
                  strokeWidth={0.7}
                />
              ))}
            </g>
          );
        })}
      </g>
    );
  },
};

export const monstera: Material = {
  id: "monstera",
  name: "龜背芋",
  latin: "Monstera",
  category: "filler",
  colors: [color("green", "深綠", "#2E6B3E", "green"), color("light", "翠綠", "#4A8A4F", "green")],
  defaultLengthCm: 24,
  minLengthCm: 8,
  maxLengthCm: 50,
  stemColor: "#3d6b3c",
  stemWidth: 4,
  defaultCurve: 0.15,
  stemLeaves: "none",
  thumb: { lengthPx: 88, tipY: 10, scale: 1 },
  tip: "大片的「面」材料，能穩住作品下盤、遮蔽劍山，通常放得低而靠前。",
  renderHead: ({ color: c, uid }) => {
    const leaf =
      "M0 2 C-30 -4, -44 -30, -38 -54 C-32 -72, -12 -80, 0 -68 C12 -80, 32 -72, 38 -54 C44 -30, 30 -4, 0 2 Z";
    const maskId = `${uid}-monstera`;
    return (
      <g transform="translate(0 74)">
        <defs>
          <mask id={maskId}>
            <rect x={-60} y={-100} width={120} height={120} fill="#fff" />
            {[-1, 1].map((side) =>
              [0, 1, 2].map((i) => (
                <ellipse
                  key={`${side}-${i}`}
                  cx={side * (18 + i * 2)}
                  cy={-20 - i * 16}
                  rx={9 - i}
                  ry={4}
                  fill="#000"
                  transform={`rotate(${side * (-28 + i * 6)} ${side * (18 + i * 2)} ${-20 - i * 16})`}
                />
              )),
            )}
          </mask>
        </defs>
        <path d={leaf} fill={c.hex} stroke={darken(c.hex, 0.3)} strokeWidth={1} mask={`url(#${maskId})`} />
        <path d="M0 0 L0 -66" stroke={lighten(c.hex, 0.25)} strokeWidth={1.4} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M0 ${-14 - i * 16} L${-28 + i * 2} ${-36 - i * 12}`} stroke={lighten(c.hex, 0.2)} strokeWidth={0.8} />
            <path d={`M0 ${-14 - i * 16} L${28 - i * 2} ${-36 - i * 12}`} stroke={lighten(c.hex, 0.2)} strokeWidth={0.8} />
          </g>
        ))}
      </g>
    );
  },
};

export const aspidistra: Material = {
  id: "aspidistra",
  name: "蜘蛛抱蛋葉",
  latin: "Aspidistra",
  category: "filler",
  colors: [color("green", "葉綠", "#3F7A45", "green"), color("stripe", "斑葉", "#7FA469", "green")],
  defaultLengthCm: 34,
  minLengthCm: 10,
  maxLengthCm: 65,
  stemColor: "#3F7A45",
  stemWidth: 3,
  defaultCurve: 0.35,
  stemLeaves: "none",
  thumb: { lengthPx: 88, tipY: 12, scale: 1 },
  tip: "俗稱葉蘭。長葉可摺、可捲，是自由花中最常用來造型的葉材。",
  renderHead: ({ color: c, geometry }) => {
    const len = Math.min(120, Math.max(50, geometry.lengthPx * 0.42));
    return (
      <g transform={`translate(0 ${len * 0.9})`}>
        <path d={leafPath(len, 22)} fill={c.hex} stroke={darken(c.hex, 0.3)} strokeWidth={1} />
        <path d={`M0 0 Q${6} ${-len * 0.5} 0 ${-len}`} stroke={lighten(c.hex, 0.3)} strokeWidth={1.2} fill="none" />
        {c.id === "stripe" &&
          [-1, 1].map((side) => (
            <path
              key={side}
              d={`M${side * 3} ${-len * 0.1} Q${side * 9} ${-len * 0.5} ${side * 2} ${-len * 0.9}`}
              stroke="#e8ecc6"
              strokeWidth={1.6}
              fill="none"
              opacity={0.8}
            />
          ))}
      </g>
    );
  },
};
