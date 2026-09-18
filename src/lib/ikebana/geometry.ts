import type { Depth, Point, Stem, StemGeometry, Vase } from "./types";

export const PX_PER_CM = 8;
export const CANVAS_W = 800;
export const CANVAS_H = 800;
export const CENTER_X = 400;
/** 桌面（花器底部）所在的 y 座標 */
export const TABLE_Y = 736;

export const MIN_LENGTH_CM = 6;
export const MAX_ANGLE = 95;

export const DEG = Math.PI / 180;

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function round(v: number, digits = 0): number {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
}

/** 固定到小數兩位，避免伺服器與瀏覽器三角函數的最末位差異造成 hydration 不一致 */
export function fx(v: number): number {
  return Math.round(v * 100) / 100;
}

export function mouthY(vase: Vase): number {
  return TABLE_Y - vase.heightCm * PX_PER_CM;
}

export function kenzanCenter(vase: Vase, depth: Depth = 0): Point {
  return {
    x: CENTER_X,
    y: mouthY(vase) + vase.baseOffsetPx + depth * vase.depthOffsetPx,
  };
}

export function basePoint(stem: Stem, vase: Vase): Point {
  const c = kenzanCenter(vase, stem.depth);
  return { x: c.x + stem.offsetCm * PX_PER_CM, y: c.y };
}

export function depthScale(depth: Depth): number {
  return 1 + depth * 0.06;
}

const EDGE_MARGIN_X = 36;
const EDGE_MARGIN_TOP = 44;

/** 依角度與基部位置計算花材可達的最長長度，讓花頭留在畫布內、不穿過桌面 */
export function maxLengthCmFor(
  stem: Pick<Stem, "angle" | "offsetCm" | "depth">,
  vase: Vase,
): number {
  const c = kenzanCenter(vase, stem.depth);
  const base = { x: c.x + stem.offsetCm * PX_PER_CM, y: c.y };
  const dir = directionFromAngle(stem.angle);
  let maxPx = Infinity;
  if (dir.y < -1e-6) maxPx = Math.min(maxPx, (base.y - EDGE_MARGIN_TOP) / -dir.y);
  if (dir.y > 1e-6) maxPx = Math.min(maxPx, (TABLE_Y - 8 - base.y) / dir.y);
  if (dir.x > 1e-6) maxPx = Math.min(maxPx, (CANVAS_W - EDGE_MARGIN_X - base.x) / dir.x);
  if (dir.x < -1e-6) maxPx = Math.min(maxPx, (base.x - EDGE_MARGIN_X) / -dir.x);
  return Math.max(MIN_LENGTH_CM, Math.floor(maxPx / PX_PER_CM));
}

export function directionFromAngle(angle: number): Point {
  return { x: Math.sin(angle * DEG), y: -Math.cos(angle * DEG) };
}

/** 依基部與花頭位置反推角度（0 為向上，正值向右） */
export function angleFromPoints(base: Point, tip: Point): number {
  return Math.atan2(tip.x - base.x, base.y - tip.y) / DEG;
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function quadPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: fx(mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x),
    y: fx(mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y),
  };
}

function quadTangent(p0: Point, p1: Point, p2: Point, t: number): number {
  const mt = 1 - t;
  const dx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  return fx(Math.atan2(dx, -dy) / DEG);
}

export function buildGeometry(
  base: Point,
  lengthPx: number,
  angle: number,
  curve: number,
  depth: Depth = 0,
): StemGeometry {
  const dir = directionFromAngle(angle);
  const tip = { x: fx(base.x + dir.x * lengthPx), y: fx(base.y + dir.y * lengthPx) };
  const perp = { x: -dir.y, y: dir.x };
  const bend = curve * lengthPx * 0.28;
  const ctrl = {
    x: fx((base.x + tip.x) / 2 + perp.x * bend),
    y: fx((base.y + tip.y) / 2 + perp.y * bend),
  };
  return {
    base,
    ctrl,
    tip,
    lengthPx,
    tipRotation: quadTangent(base, ctrl, tip, 1),
    depthScale: depthScale(depth),
    pointAt: (t) => quadPoint(base, ctrl, tip, t),
    tangentAt: (t) => quadTangent(base, ctrl, tip, t),
  };
}

export function stemGeometry(stem: Stem, vase: Vase): StemGeometry {
  return buildGeometry(basePoint(stem, vase), stem.lengthCm * PX_PER_CM, stem.angle, stem.curve, stem.depth);
}

export function stemPath(g: StemGeometry): string {
  return `M${g.base.x.toFixed(1)} ${g.base.y.toFixed(1)} Q${g.ctrl.x.toFixed(1)} ${g.ctrl.y.toFixed(1)} ${g.tip.x.toFixed(1)} ${g.tip.y.toFixed(1)}`;
}

export function polar(center: Point, r: number, angle: number): Point {
  return {
    x: fx(center.x + r * Math.sin(angle * DEG)),
    y: fx(center.y - r * Math.cos(angle * DEG)),
  };
}

/** 環形扇區路徑（角度以垂直為 0，向右為正） */
export function annularSectorPath(
  center: Point,
  r1: number,
  r2: number,
  a1: number,
  a2: number,
): string {
  const [lo, hi] = a1 < a2 ? [a1, a2] : [a2, a1];
  const large = hi - lo > 180 ? 1 : 0;
  const p1 = polar(center, r1, lo);
  const p2 = polar(center, r2, lo);
  const p3 = polar(center, r2, hi);
  const p4 = polar(center, r1, hi);
  return [
    `M${p1.x} ${p1.y}`,
    `L${p2.x} ${p2.y}`,
    `A${r2} ${r2} 0 ${large} 1 ${p3.x} ${p3.y}`,
    `L${p4.x} ${p4.y}`,
    `A${r1} ${r1} 0 ${large} 0 ${p1.x} ${p1.y}`,
    "Z",
  ].join(" ");
}

export function arcPath(center: Point, r: number, a1: number, a2: number): string {
  const [lo, hi] = a1 < a2 ? [a1, a2] : [a2, a1];
  const large = hi - lo > 180 ? 1 : 0;
  const p1 = polar(center, r, lo);
  const p2 = polar(center, r, hi);
  return `M${p1.x} ${p1.y} A${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
}

export function describeAngle(angle: number): string {
  const a = Math.round(angle);
  if (Math.abs(a) < 3) return `直立 ${Math.abs(a)}°`;
  return a < 0 ? `向左 ${Math.abs(a)}°` : `向右 ${a}°`;
}

export function describeDepth(depth: Depth): string {
  return depth === -1 ? "後方" : depth === 1 ? "前方" : "中央";
}

export function hashSeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 偽隨機數，讓同一枝花材每次繪製一致 */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
