import type { ReactNode } from "react";

/** 花材類別：線（枝材）、塊（花材）、面/填充（葉材） */
export type Category = "line" | "mass" | "filler";

/** 三主枝與從枝（草月流用語） */
export type Role = "shin" | "soe" | "hikae" | "jushi";

/** 前後深度：-1 後方、0 中央、1 前方 */
export type Depth = -1 | 0 | 1;

export type HueFamily =
  | "red"
  | "pink"
  | "orange"
  | "yellow"
  | "purple"
  | "blue"
  | "white"
  | "green"
  | "neutral";

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  hue: HueFamily;
}

export interface Point {
  x: number;
  y: number;
}

export interface Stem {
  id: string;
  materialId: string;
  colorId: string;
  role: Role | null;
  /** 從花器口量起的可見長度（公分） */
  lengthCm: number;
  /** 與垂直線的夾角（度）。負值向觀者左側傾斜，正值向右側 */
  angle: number;
  /** 基部相對劍山中心的水平位移（公分） */
  offsetCm: number;
  depth: Depth;
  /** 花莖彎曲程度 -1 ~ 1，正值向右彎 */
  curve: number;
  /** 花頭左右翻轉 */
  flip: boolean;
}

/** 花莖幾何（畫布座標，像素） */
export interface StemGeometry {
  base: Point;
  ctrl: Point;
  tip: Point;
  lengthPx: number;
  /** 花頭朝向（度，0 為向上，正值順時針） */
  tipRotation: number;
  /** 依前後深度所做的縮放 */
  depthScale: number;
  pointAt: (t: number) => Point;
  tangentAt: (t: number) => number;
}

export interface RenderContext {
  geometry: StemGeometry;
  color: ColorOption;
  flip: boolean;
  seed: number;
  /** 用於 SVG defs 的唯一 id 前綴 */
  uid: string;
}

export interface Material {
  id: string;
  name: string;
  latin: string;
  category: Category;
  colors: ColorOption[];
  defaultLengthCm: number;
  minLengthCm: number;
  maxLengthCm: number;
  stemColor: string;
  stemWidth: number;
  defaultCurve: number;
  /** 沿莖生葉的樣式 */
  stemLeaves: "none" | "pair" | "long";
  leafColor?: string;
  /** 花道用途小提示 */
  tip: string;
  /** 畫在花莖頂端（以頂端為原點，向上為 -y） */
  renderHead?: (ctx: RenderContext) => ReactNode;
  /** 沿著花莖繪製（畫布座標） */
  renderAlong?: (ctx: RenderContext) => ReactNode;
  /** 花材庫縮圖的版面微調 */
  thumb?: { lengthPx?: number; tipY?: number; scale?: number };
}

export interface Vase {
  id: string;
  name: string;
  kind: "suiban" | "vase" | "compote";
  widthCm: number;
  heightCm: number;
  /** 可插花的口徑，用來限制基部左右位移 */
  mouthWidthCm: number;
  /** 前後深度造成的基部 y 位移（像素） */
  depthOffsetPx: number;
  /** 基部相對於花器口中心的 y 位移（像素），水盤內的劍山略低於口緣 */
  baseOffsetPx: number;
  description: string;
  /** 以花器口中心為原點繪製 */
  render: (uid: string) => ReactNode;
}

export interface StemTarget {
  role: Role;
  length: {
    ratioOf: "unit" | "shin" | "soe";
    min: number;
    max: number;
    ideal: number;
  };
  angle: { min: number; max: number; ideal: number };
  depth?: Depth;
  categories?: Category[];
  suggestedMaterialId: string;
  suggestedColorId?: string;
}

export type RuleId =
  | "oddCount"
  | "threeElements"
  | "heightVariation"
  | "asymmetry"
  | "negativeSpace"
  | "colorHarmony"
  | "focalPoint"
  | "jushiSupport";

export type StepCheck =
  | { kind: "stem"; target: StemTarget }
  | { kind: "rules"; ruleIds: RuleId[] }
  | { kind: "info" };

export interface LessonStep {
  id: string;
  title: string;
  body: string[];
  check: StepCheck;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  level: "初級" | "中級";
  vaseId: string;
  summary: string;
  goals: string[];
  steps: LessonStep[];
}

export interface Criterion {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface StemEvaluation {
  stem: Stem | null;
  criteria: Criterion[];
  passed: boolean;
}

export interface RuleResult {
  id: RuleId;
  title: string;
  passed: boolean;
  weight: number;
  score: number;
  message: string;
  tip: string;
}
