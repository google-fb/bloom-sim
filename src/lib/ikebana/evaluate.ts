import { DEG, describeAngle, describeDepth, distance, round, stemGeometry } from "./geometry";
import { ROLE_INFO } from "./lessons";
import { CATEGORY_INFO, getMaterial } from "./materials";
import type {
  Category,
  Criterion,
  HueFamily,
  LessonStep,
  RuleId,
  RuleResult,
  Stem,
  StemEvaluation,
  StemTarget,
  Vase,
} from "./types";
import { unitCm } from "./vases";

export interface LengthRange {
  min: number;
  max: number;
  ideal: number;
  /** 說明基準，例如「真的 3/4」 */
  basis: string;
}

export function idealMainLengths(vase: Vase): { unit: number; shin: number; soe: number; hikae: number } {
  const unit = unitCm(vase);
  const shin = unit * 1.5;
  const soe = shin * 0.75;
  return { unit, shin, soe, hikae: soe * 0.75 };
}

export function resolveLengthRange(target: StemTarget, stems: Stem[], vase: Vase): LengthRange {
  const ideal = idealMainLengths(vase);
  const shinStem = stems.find((s) => s.role === "shin");
  const soeStem = stems.find((s) => s.role === "soe");
  const shinLen = shinStem?.lengthCm ?? ideal.shin;
  const soeLen = soeStem?.lengthCm ?? shinLen * 0.75;

  let base = ideal.unit;
  let basis = `基本寸法 ${round(ideal.unit)} cm`;
  if (target.length.ratioOf === "shin") {
    base = shinLen;
    basis = `真（${round(shinLen)} cm）`;
  } else if (target.length.ratioOf === "soe") {
    base = soeLen;
    basis = `副（${round(soeLen)} cm）`;
  }
  return {
    min: base * target.length.min,
    max: base * target.length.max,
    ideal: base * target.length.ideal,
    basis,
  };
}

export function idealStemValues(target: StemTarget, stems: Stem[], vase: Vase) {
  const range = resolveLengthRange(target, stems, vase);
  const offsets: Record<string, number> = { shin: 0, soe: -1.2, hikae: 1.6, jushi: 0.6 };
  return {
    lengthCm: round(range.ideal),
    angle: target.angle.ideal,
    depth: target.depth ?? 0,
    offsetCm: offsets[target.role] ?? 0,
  };
}

export function evaluateStemTarget(target: StemTarget, stems: Stem[], vase: Vase): StemEvaluation {
  const roleLabel = ROLE_INFO[target.role].label;
  const stem = stems.find((s) => s.role === target.role) ?? null;
  if (!stem) {
    return {
      stem: null,
      passed: false,
      criteria: [
        {
          id: "exists",
          label: `加入一枝「${roleLabel}」`,
          passed: false,
          detail: "從花材庫點選材料，新加入的花材會自動成為這個角色。",
        },
      ],
    };
  }

  const criteria: Criterion[] = [];
  const material = getMaterial(stem.materialId);

  if (target.categories && target.categories.length > 0) {
    const ok = target.categories.includes(material.category);
    const wanted = target.categories.map((c) => CATEGORY_INFO[c].label).join("或");
    criteria.push({
      id: "category",
      label: `材料類別：${wanted}`,
      passed: ok,
      detail: ok
        ? `${material.name}屬於${CATEGORY_INFO[material.category].label}，很適合。`
        : `${material.name}屬於${CATEGORY_INFO[material.category].label}。請刪除後改選${wanted}。`,
    });
  }

  const range = resolveLengthRange(target, stems, vase);
  const lenOk = stem.lengthCm >= range.min && stem.lengthCm <= range.max;
  criteria.push({
    id: "length",
    label: `長度 ${round(range.min)}–${round(range.max)} cm`,
    passed: lenOk,
    detail: lenOk
      ? `目前 ${round(stem.lengthCm)} cm，符合${range.basis}的 ${target.length.ideal} 倍。`
      : stem.lengthCm < range.min
        ? `目前 ${round(stem.lengthCm)} cm，再拉長一些（理想約 ${round(range.ideal)} cm）。`
        : `目前 ${round(stem.lengthCm)} cm，稍微縮短（理想約 ${round(range.ideal)} cm）。`,
  });

  const angleOk = stem.angle >= target.angle.min && stem.angle <= target.angle.max;
  criteria.push({
    id: "angle",
    label: `角度 ${describeAngle(target.angle.min)} ～ ${describeAngle(target.angle.max)}`,
    passed: angleOk,
    detail: angleOk
      ? `目前${describeAngle(stem.angle)}，理想為${describeAngle(target.angle.ideal)}。`
      : `目前${describeAngle(stem.angle)}，請${stem.angle < target.angle.min ? "往右" : "往左"}轉到${describeAngle(target.angle.ideal)}附近。`,
  });

  if (target.depth !== undefined) {
    const depthOk = stem.depth === target.depth;
    criteria.push({
      id: "depth",
      label: `前後位置：${describeDepth(target.depth)}`,
      passed: depthOk,
      detail: depthOk
        ? `已放在${describeDepth(stem.depth)}。`
        : `目前在${describeDepth(stem.depth)}。點選這枝花材，把前後位置改為「${describeDepth(target.depth)}」。`,
    });
  }

  return { stem, criteria, passed: criteria.every((c) => c.passed) };
}

const COLOR_FAMILY_LABEL: Record<HueFamily, string> = {
  red: "紅",
  pink: "粉",
  orange: "橙",
  yellow: "黃",
  purple: "紫",
  blue: "藍",
  white: "白",
  green: "綠",
  neutral: "米",
};

function result(
  id: RuleId,
  title: string,
  weight: number,
  passed: boolean,
  message: string,
  tip: string,
  partial = 0,
): RuleResult {
  return { id, title, weight, passed, score: passed ? weight : Math.round(weight * partial), message, tip };
}

export function evaluateRule(id: RuleId, stems: Stem[], vase: Vase): RuleResult {
  const n = stems.length;
  switch (id) {
    case "oddCount": {
      const ok = n >= 3 && n % 2 === 1;
      return result(
        id,
        "奇數原則",
        10,
        ok,
        n === 0 ? "尚未加入花材。" : `目前共 ${n} 枝。`,
        ok ? "奇數帶來不對稱的節奏，很好。" : n < 3 ? "至少三枝才能形成結構。" : "增減一枝，讓總數成為奇數。",
      );
    }
    case "threeElements": {
      const present = new Set(stems.map((s) => getMaterial(s.materialId).category));
      const missing = (["line", "mass", "filler"] as Category[]).filter((c) => !present.has(c));
      const ok = missing.length === 0;
      return result(
        id,
        "線・塊・面",
        15,
        ok,
        ok ? "枝材、花材、葉材皆已具備。" : `尚缺：${missing.map((c) => CATEGORY_INFO[c].label).join("、")}。`,
        ok ? "三種材料讓作品同時擁有方向、份量與面積。" : "枝材給線條，花材給焦點，葉材遮劍山、補空間。",
        present.size / 3,
      );
    }
    case "heightVariation": {
      if (n < 2) return result(id, "高低層次", 15, false, "至少需要兩枝花材。", "長短差距讓畫面有遠近。");
      const lens = stems.map((s) => s.lengthCm);
      const ratio = Math.max(...lens) / Math.max(1, Math.min(...lens));
      const ok = ratio >= 1.6;
      return result(
        id,
        "高低層次",
        15,
        ok,
        `最長與最短的比例為 ${ratio.toFixed(1)} 倍。`,
        ok ? "高低分明，視線能在作品中上下移動。" : "把焦點花再放低一點，或把主枝拉高，拉開差距到 1.6 倍以上。",
        Math.min(1, (ratio - 1) / 0.6) * 0.6,
      );
    }
    case "asymmetry": {
      if (n < 2) return result(id, "不對稱平衡", 15, false, "至少需要兩枝花材。", "左右都要有材料，但份量不同。");
      const total = stems.reduce((acc, s) => acc + s.lengthCm, 0);
      const moment = stems.reduce((acc, s) => acc + s.lengthCm * Math.sin(s.angle * DEG), 0) / total;
      const left = stems.filter((s) => s.angle < -5).length;
      const right = stems.filter((s) => s.angle > 5).length;
      const ok = left >= 1 && right >= 1 && Math.abs(moment) > 0.04 && Math.abs(moment) < 0.6;
      let message = `重心偏${moment < 0 ? "左" : "右"} ${(Math.abs(moment) * 100).toFixed(0)}%。`;
      let tip = "左右皆有材料且重心略偏一側，是東方式的平衡。";
      if (left === 0 || right === 0) {
        message = `所有材料都在${left === 0 ? "右" : "左"}側。`;
        tip = "在另一側加入一枝較短的材料，作品才站得穩。";
      } else if (Math.abs(moment) <= 0.04) {
        message = "左右幾乎完全對稱。";
        tip = "把其中一枝主枝的角度再開一些，打破鏡射的對稱。";
      } else if (Math.abs(moment) >= 0.6) {
        message = "重心過度偏向一側。";
        tip = "縮短傾斜最多的那一枝，或在另一側補上材料。";
      }
      return result(id, "不對稱平衡", 15, ok, message, tip, left >= 1 && right >= 1 ? 0.5 : 0);
    }
    case "negativeSpace": {
      if (n < 2) return result(id, "留白", 15, n === 1, n === 0 ? "尚未加入花材。" : "只有一枝，自然留白。", "花頭之間保留空隙，讓作品呼吸。");
      const tips = stems.map((s) => stemGeometry(s, vase).tip);
      let minDist = Infinity;
      for (let i = 0; i < tips.length; i++) {
        for (let j = i + 1; j < tips.length; j++) {
          minDist = Math.min(minDist, distance(tips[i], tips[j]));
        }
      }
      const crowded = n > 9;
      const overlapping = minDist < 56;
      const ok = !crowded && !overlapping;
      return result(
        id,
        "留白",
        15,
        ok,
        crowded ? `共 ${n} 枝，材料過多。` : overlapping ? "有花頭彼此重疊。" : "花頭之間留有呼吸的空間。",
        crowded
          ? "花道講減法：拿掉幾枝，留下最有姿態的。"
          : overlapping
            ? "拖曳其中一枝，讓每個花頭都能完整被看見。"
            : "留白不是空，而是讓線條被看見。",
        overlapping ? 0.4 : 0,
      );
    }
    case "colorHarmony": {
      if (n === 0) return result(id, "色彩節制", 15, false, "尚未加入花材。", "色系控制在三種以內。");
      const families = new Set<HueFamily>();
      for (const s of stems) {
        const m = getMaterial(s.materialId);
        const c = m.colors.find((x) => x.id === s.colorId) ?? m.colors[0];
        if (c.hue !== "green" && c.hue !== "neutral") families.add(c.hue);
      }
      const ok = families.size <= 3;
      const list = [...families].map((f) => COLOR_FAMILY_LABEL[f]).join("、");
      return result(
        id,
        "色彩節制",
        15,
        ok,
        families.size === 0 ? "目前只有綠色與大地色。" : `使用了 ${families.size} 個色系：${list}。`,
        ok ? "色彩安靜，形態才會被看見。" : "點選花材切換顏色，把色系收斂到三種以內（綠色葉材不計）。",
        Math.max(0, 1 - (families.size - 3) * 0.3),
      );
    }
    case "focalPoint": {
      if (n === 0) return result(id, "焦點", 15, false, "尚未加入花材。", "在低處前方放一朵醒目的花。");
      const maxLen = Math.max(...stems.map((s) => s.lengthCm));
      const massStems = stems.filter((s) => getMaterial(s.materialId).category === "mass");
      const focal = massStems.find((s) => s.depth === 1 && s.lengthCm <= maxLen * 0.65);
      const lowMass = massStems.find((s) => s.lengthCm <= maxLen * 0.65);
      const ok = Boolean(focal);
      return result(
        id,
        "焦點",
        15,
        ok,
        ok
          ? `${getMaterial(focal!.materialId).name}位於低處前方，是視線的落點。`
          : massStems.length === 0
            ? "還沒有花材（塊）。"
            : lowMass
              ? "有較低的花，但沒有放在前方。"
              : "花材都插得太高。",
        ok
          ? "焦點在下，視線會沿著主枝往上流動。"
          : lowMass
            ? "點選那朵花，把前後位置改為「前方」。"
            : "把一朵花縮短到最長枝的 65% 以下，並放在前方。",
        lowMass ? 0.5 : 0,
      );
    }
    case "jushiSupport": {
      const mains = stems.filter((s) => s.role === "shin" || s.role === "soe" || s.role === "hikae");
      const jushi = stems.filter((s) => s.role === "jushi");
      const tooLong = jushi.filter((j) => {
        if (mains.length === 0) return false;
        const nearest = mains.reduce((best, m) =>
          Math.abs(m.angle - j.angle) < Math.abs(best.angle - j.angle) ? m : best,
        );
        return j.lengthCm >= nearest.lengthCm;
      });
      const ok = jushi.length >= 2 && tooLong.length === 0;
      return result(
        id,
        "從枝",
        15,
        ok,
        jushi.length < 2 ? `目前有 ${jushi.length} 枝從枝，需要至少 2 枝。` : tooLong.length > 0 ? `有 ${tooLong.length} 枝從枝比鄰近的主枝還長。` : `${jushi.length} 枝從枝皆短於所伴隨的主枝。`,
        jushi.length < 2 ? "在控的附近補一朵短花，在真副之間補一枝葉材。" : tooLong.length > 0 ? "縮短那幾枝從枝，讓主枝保持主導。" : "從枝安分地襯托主枝，結構清楚。",
        Math.min(1, jushi.length / 2) * 0.5,
      );
    }
  }
}

export function evaluateRules(ids: RuleId[], stems: Stem[], vase: Vase): RuleResult[] {
  return ids.map((id) => evaluateRule(id, stems, vase));
}

export const CRITIQUE_RULES: RuleId[] = [
  "threeElements",
  "colorHarmony",
  "heightVariation",
  "negativeSpace",
  "asymmetry",
  "focalPoint",
  "oddCount",
];

export interface Critique {
  total: number;
  max: number;
  rating: string;
  results: RuleResult[];
}

export function critique(stems: Stem[], vase: Vase): Critique {
  const results = evaluateRules(CRITIQUE_RULES, stems, vase);
  const total = results.reduce((a, r) => a + r.score, 0);
  const max = results.reduce((a, r) => a + r.weight, 0);
  let rating = "繼續練習";
  if (stems.length === 0) rating = "尚未開始";
  else if (total >= 90) rating = "氣韻生動";
  else if (total >= 75) rating = "相當出色";
  else if (total >= 55) rating = "漸入佳境";
  return { total, max, rating, results };
}

export function isStepPassed(step: LessonStep, stems: Stem[], vase: Vase): boolean {
  switch (step.check.kind) {
    case "info":
      return true;
    case "stem":
      return evaluateStemTarget(step.check.target, stems, vase).passed;
    case "rules":
      return evaluateRules(step.check.ruleIds, stems, vase).every((r) => r.passed);
  }
}
