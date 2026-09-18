import type { Category, Material } from "../types";
import { maple, miscanthus, pine, plum, willow } from "./branches";
import {
  anthurium,
  babysBreath,
  balloonFlower,
  carnation,
  chrysanthemum,
  gerbera,
  lily,
  rose,
  tulip,
} from "./flowers";
import { aspidistra, eucalyptus, monstera } from "./foliage";

export const MATERIALS: Material[] = [
  pine,
  plum,
  maple,
  willow,
  miscanthus,
  chrysanthemum,
  rose,
  lily,
  gerbera,
  carnation,
  tulip,
  balloonFlower,
  anthurium,
  eucalyptus,
  monstera,
  aspidistra,
  babysBreath,
];

export const MATERIAL_MAP: Record<string, Material> = Object.fromEntries(
  MATERIALS.map((m) => [m.id, m]),
);

export function getMaterial(id: string): Material {
  return MATERIAL_MAP[id] ?? MATERIALS[0];
}

export const CATEGORY_INFO: Record<
  Category,
  { label: string; short: string; description: string }
> = {
  line: {
    label: "枝材・線",
    short: "線",
    description: "決定作品骨架與方向的枝條，多用於真、副。",
  },
  mass: {
    label: "花材・塊",
    short: "塊",
    description: "有份量的花朵，形成視覺焦點，多用於控。",
  },
  filler: {
    label: "葉材・面",
    short: "面",
    description: "葉片與細碎花材，補足空間、遮蔽劍山。",
  },
};

export const CATEGORY_ORDER: Category[] = ["line", "mass", "filler"];
