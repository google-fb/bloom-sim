"use client";

import { ArrangementScene } from "@/components/studio/canvas/ArrangementScene";
import type { Stem } from "@/lib/ikebana/types";
import { getVase } from "@/lib/ikebana/vases";

const SHOWCASE: Stem[] = [
  { id: "demo-shin", materialId: "pine", colorId: "green", role: "shin", lengthCm: 54, angle: -12, offsetCm: 0, depth: 0, curve: 0.1, flip: false },
  { id: "demo-soe", materialId: "maple", colorId: "red", role: "soe", lengthCm: 40.5, angle: -45, offsetCm: -1.2, depth: 0, curve: 0.2, flip: false },
  { id: "demo-hikae", materialId: "chrysanthemum", colorId: "yellow", role: "hikae", lengthCm: 30, angle: 75, offsetCm: 1.6, depth: 1, curve: 0.05, flip: false },
  { id: "demo-j1", materialId: "carnation", colorId: "pink", role: "jushi", lengthCm: 22, angle: 50, offsetCm: 1, depth: 1, curve: 0.1, flip: false },
  { id: "demo-j2", materialId: "monstera", colorId: "green", role: "jushi", lengthCm: 17, angle: -22, offsetCm: -0.5, depth: 1, curve: 0.15, flip: false },
];

export function HeroScene({ className }: { className?: string }) {
  return (
    <ArrangementScene
      stems={SHOWCASE}
      vase={getVase("suiban-black")}
      interactive={false}
      showLabels
      showProtractor={false}
      className={className}
    />
  );
}
