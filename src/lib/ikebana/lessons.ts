import type { Lesson, Role } from "./types";

export const ROLE_INFO: Record<Role, { label: string; reading: string; description: string }> = {
  shin: {
    label: "真",
    reading: "Shin",
    description: "最長的主枝，決定作品的高度與方向，像是一個人的脊椎。",
  },
  soe: {
    label: "副",
    reading: "Soe",
    description: "第二主枝，約為真的四分之三，與真呼應並向外開展。",
  },
  hikae: {
    label: "控",
    reading: "Hikae",
    description: "最短的主枝，低而向前，常以花朵擔任，是視線停留的焦點。",
  },
  jushi: {
    label: "從",
    reading: "Jushi",
    description: "從枝。輔助三主枝、補足空間，長度一律比所伴隨的主枝短。",
  },
};

export const LESSONS: Lesson[] = [
  {
    id: "upright-moribana",
    title: "基本立真型・盛花",
    subtitle: "認識三主枝：真、副、控",
    level: "初級",
    vaseId: "suiban-black",
    summary:
      "花道的第一課。學會用花器尺寸推算枝長，並以三支主枝搭出不等邊三角形的骨架。",
    goals: ["理解「基本寸法」如何由花器推算", "掌握真・副・控的長度比與角度", "加入從枝，完成一件完整的盛花"],
    steps: [
      {
        id: "intro",
        title: "從花器開始量",
        body: [
          "花道作品的尺寸不是憑感覺，而是由花器決定。「基本寸法」＝花器直徑＋花器高度。",
          "以這個黑釉水盤為例，直徑 30 cm、高 6 cm，基本寸法就是 36 cm。三主枝的長度都以它為基準：",
          "真 ＝ 基本寸法的 1.5 倍；副 ＝ 真的 3/4；控 ＝ 副的 3/4。下方表格列出了這個花器的數字，畫布上淡色的虛線就是三主枝的理想位置。",
          "畫布下方的量角器可以隨時開關，角度一律從垂直線量起：向左為負、向右為正。",
        ],
        check: { kind: "info" },
      },
      {
        id: "shin",
        title: "插入「真」",
        body: [
          "從左側花材庫挑一枝「枝材」，例如松枝或梅枝，它會自動被標記為「真」。",
          "拖曳花頭，把長度調到基本寸法的 1.5 倍左右（約 54 cm），並向左傾斜 10–15°。",
          "真是作品的脊椎：幾乎直立，卻帶著一點傾斜，才會有生命感。實際插作時它還會微微向前傾。",
        ],
        check: {
          kind: "stem",
          target: {
            role: "shin",
            length: { ratioOf: "unit", min: 1.35, max: 1.75, ideal: 1.5 },
            angle: { min: -22, max: -5, ideal: -12 },
            categories: ["line"],
            suggestedMaterialId: "pine",
          },
        },
      },
      {
        id: "soe",
        title: "插入「副」",
        body: [
          "再加入一枝枝材作為「副」。長度是真的 3/4（約 40 cm），向左傾斜 45°。",
          "副與真同側，但角度更開，像是真伸出去的一隻手臂，讓作品有寬度。",
          "小技巧：拖曳花莖本體可以只改變角度、不改變長度。",
        ],
        check: {
          kind: "stem",
          target: {
            role: "soe",
            length: { ratioOf: "shin", min: 0.62, max: 0.88, ideal: 0.75 },
            angle: { min: -58, max: -32, ideal: -45 },
            categories: ["line"],
            suggestedMaterialId: "maple",
            suggestedColorId: "green",
          },
        },
      },
      {
        id: "hikae",
        title: "插入「控」",
        body: [
          "這次選一枝「花材」，例如菊花或玫瑰，作為「控」。長度是副的 3/4（約 30 cm），向右傾斜 75°。",
          "控與真、副分別在花器兩側，形成不等邊三角形；它低而靠前，所以請把「前後位置」設為前方。",
          "控通常是作品最醒目的花，視線會先停在這裡，再沿著副、真往上走。",
        ],
        check: {
          kind: "stem",
          target: {
            role: "hikae",
            length: { ratioOf: "soe", min: 0.62, max: 0.9, ideal: 0.75 },
            angle: { min: 62, max: 88, ideal: 75 },
            depth: 1,
            categories: ["mass"],
            suggestedMaterialId: "chrysanthemum",
            suggestedColorId: "yellow",
          },
        },
      },
      {
        id: "jushi",
        title: "加入從枝",
        body: [
          "骨架完成後，加入 2 枝以上的「從枝」補足空間。從枝要比它所伴隨的主枝短，才不會搶戲。",
          "常見做法：在控的附近再插一朵較短的花，在真與副之間補一枝葉材遮住劍山。",
          "整體枝數保持奇數（例如 5 或 7 枝），這是東方美學裡不對稱的節奏感。",
        ],
        check: { kind: "rules", ruleIds: ["jushiSupport", "oddCount"] },
      },
      {
        id: "done",
        title: "完成！退一步看看",
        body: [
          "你完成了第一件盛花。試著關掉引導線，觀察三主枝的頂端是否連成一個不等邊三角形。",
          "花道講「一枝一花」：每一枝都應該有存在的理由。若覺得擁擠，減法往往比加法更有效。",
          "接下來可以匯出作品，或前往第二課學習傾斜型。",
        ],
        check: { kind: "info" },
      },
    ],
  },
  {
    id: "slanting-moribana",
    title: "基本傾真型・盛花",
    subtitle: "讓真倒下來，作品就有了風",
    level: "初級",
    vaseId: "suiban-round",
    summary:
      "同樣的三主枝，改變真的角度就是另一種型。傾真型強調橫向的流動感，副則挺立支撐。",
    goals: ["體會角度如何改變作品氣質", "練習真、副角色互換的比例邏輯", "在較小的花器上控制尺寸"],
    steps: [
      {
        id: "intro",
        title: "傾斜型的特色",
        body: [
          "在立真型裡，真近乎直立、副開展 45°。傾真型把兩者的角度對調：真倒向 45°，副只微傾 10–15°。",
          "長度比不變：真仍是基本寸法的 1.5 倍、副是真的 3/4、控是副的 3/4。",
          "這個白瓷圓盤直徑 24 cm、高 7 cm，基本寸法 31 cm，所以真約 46 cm。",
        ],
        check: { kind: "info" },
      },
      {
        id: "shin",
        title: "傾斜的「真」",
        body: [
          "選一枝有弧度的枝材，例如柳枝或梅枝，長度約基本寸法的 1.5 倍，向左傾 45°。",
          "傾斜的真會讓作品的重心向外移，畫面產生「風吹過」的方向感。",
          "可以把「彎曲」調高一些，讓線條更柔軟。",
        ],
        check: {
          kind: "stem",
          target: {
            role: "shin",
            length: { ratioOf: "unit", min: 1.35, max: 1.75, ideal: 1.5 },
            angle: { min: -58, max: -32, ideal: -45 },
            categories: ["line"],
            suggestedMaterialId: "plum",
          },
        },
      },
      {
        id: "soe",
        title: "挺立的「副」",
        body: [
          "副這次幾乎直立，向左傾 10–15°，長度是真的 3/4。",
          "當真倒下時，需要一枝挺立的副把視線再拉回來，作品才不會失去平衡。",
        ],
        check: {
          kind: "stem",
          target: {
            role: "soe",
            length: { ratioOf: "shin", min: 0.62, max: 0.88, ideal: 0.75 },
            angle: { min: -22, max: -5, ideal: -12 },
            categories: ["line"],
            suggestedMaterialId: "miscanthus",
          },
        },
      },
      {
        id: "hikae",
        title: "低處的「控」",
        body: [
          "控依然是花材、依然在右側 75°、依然放在前方。這是三主枝中最穩定的一位。",
          "長度是副的 3/4。因為花器較小，這裡的控只有 20 cm 左右，花頭選小一點的會更協調。",
        ],
        check: {
          kind: "stem",
          target: {
            role: "hikae",
            length: { ratioOf: "soe", min: 0.62, max: 0.9, ideal: 0.75 },
            angle: { min: 62, max: 88, ideal: 75 },
            depth: 1,
            categories: ["mass"],
            suggestedMaterialId: "balloon-flower",
          },
        },
      },
      {
        id: "jushi",
        title: "補上從枝",
        body: [
          "加入 2 枝以上從枝，並保持總數為奇數。",
          "傾斜型的真下方會空出一大片，可以用一枝低矮的葉材補在那裡，同時遮住劍山。",
        ],
        check: { kind: "rules", ruleIds: ["jushiSupport", "oddCount"] },
      },
      {
        id: "done",
        title: "完成傾真型",
        body: [
          "比較看看：同樣三枝，立真型像端坐的人，傾真型像走動的人。角度就是作品的姿態。",
          "把這個型左右鏡射就是「逆勝手」，適合放在需要向右延伸的空間。",
        ],
        check: { kind: "info" },
      },
    ],
  },
  {
    id: "composition",
    title: "色彩、留白與焦點",
    subtitle: "從規則走向自由花",
    level: "中級",
    vaseId: "compote-clay",
    summary:
      "不再限制角度，改以構成原則來檢視作品：線塊面、色彩節制、高低層次、留白與焦點。",
    goals: ["同時運用線、塊、面三種材料", "控制色系數量，讓作品安靜下來", "用高低差與留白創造呼吸感"],
    steps: [
      {
        id: "intro",
        title: "自由花的三個檢查點",
        body: [
          "自由花沒有固定的角度公式，但仍有可以檢查的原則。這一課會用右側的即時評析取代角度引導。",
          "「線」是枝材的方向、「塊」是花的份量、「面」是葉的面積。三者兼具，作品才有結構。",
          "色彩不超過三個色系（綠色葉材不計），畫面才不會嘈雜。",
        ],
        check: { kind: "info" },
      },
      {
        id: "elements",
        title: "線、塊、面各一",
        body: [
          "至少各加入一枝枝材、一枝花材與一枝葉材。先不用管角度，讓它們自然分布。",
          "灰陶高足碗的重心較高，枝材不必太長，反而更顯精緻。",
        ],
        check: { kind: "rules", ruleIds: ["threeElements"] },
      },
      {
        id: "color",
        title: "色彩節制",
        body: [
          "檢查你的花材顏色：把色系控制在三種以內。同色系深淺變化算同一種。",
          "點選任一枝花材，就能切換它的顏色。試試單一色系加白色的組合。",
        ],
        check: { kind: "rules", ruleIds: ["colorHarmony"] },
      },
      {
        id: "space",
        title: "高低層次與留白",
        body: [
          "最長與最短的花材至少要有 1.6 倍的差距，畫面才有前後遠近。",
          "相鄰花材之間保留至少 12° 的空隙，不要讓花頭彼此遮擋——留白也是構圖。",
        ],
        check: { kind: "rules", ruleIds: ["heightVariation", "negativeSpace"] },
      },
      {
        id: "focus",
        title: "焦點與不對稱平衡",
        body: [
          "把最醒目的花放在低處、靠近花器口並設為前方，成為視線的落點。",
          "整體重心稍微偏向一側，但不要全部倒向同一邊。左右都要有材料，只是份量不同。",
        ],
        check: { kind: "rules", ruleIds: ["focalPoint", "asymmetry"] },
      },
      {
        id: "done",
        title: "屬於你的作品",
        body: [
          "你已經掌握了從規則到原則的過程。接下來進入自由創作，右側的評析會一直陪著你。",
          "記得：花道不是把花放滿，而是決定哪些地方不放。",
        ],
        check: { kind: "info" },
      },
    ],
  },
];

export const LESSON_MAP: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export function getLesson(id: string | null | undefined): Lesson | null {
  if (!id) return null;
  return LESSON_MAP[id] ?? null;
}
