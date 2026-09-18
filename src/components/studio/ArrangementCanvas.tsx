"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  CENTER_X,
  PX_PER_CM,
  angleFromPoints,
  basePoint,
  distance,
} from "@/lib/ikebana/geometry";
import { evaluateStemTarget } from "@/lib/ikebana/evaluate";
import { useStudioStore } from "@/lib/ikebana/store";
import type { Point, Stem, StemTarget, Vase } from "@/lib/ikebana/types";
import { ArrangementScene } from "./canvas/ArrangementScene";

type Drag =
  | { kind: "tip"; id: string }
  | { kind: "rotate"; id: string; startAngle: number; startPointerAngle: number }
  | { kind: "base"; id: string };

interface ArrangementCanvasProps {
  vase: Vase;
  /** 目前課程步驟的目標；說明步驟則為 null */
  guideTarget: StemTarget | null;
  /** 說明步驟時預覽的主枝目標 */
  previewTargets: StemTarget[] | null;
  svgRef: React.RefObject<SVGSVGElement | null>;
  className?: string;
}

export function ArrangementCanvas({ vase, guideTarget, previewTargets, svgRef, className }: ArrangementCanvasProps) {
  const stems = useStudioStore((s) => s.stems);
  const selectedId = useStudioStore((s) => s.selectedId);
  const showProtractor = useStudioStore((s) => s.showProtractor);
  const showLabels = useStudioStore((s) => s.showLabels);
  const showGuide = useStudioStore((s) => s.showGuide);
  const select = useStudioStore((s) => s.select);
  const updateStem = useStudioStore((s) => s.updateStem);
  const snapshot = useStudioStore((s) => s.snapshot);
  const guidePassed = guideTarget ? evaluateStemTarget(guideTarget, stems, vase).passed : false;

  const dragRef = useRef<Drag | null>(null);
  const lastKeyEditRef = useRef(0);

  const toSvgPoint = useCallback(
    (e: React.PointerEvent | PointerEvent): Point | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      return { x: p.x, y: p.y };
    },
    [svgRef],
  );

  const beginDrag = useCallback(
    (e: React.PointerEvent, drag: Drag) => {
      e.stopPropagation();
      e.preventDefault();
      select(drag.id);
      snapshot();
      dragRef.current = drag;
      svgRef.current?.setPointerCapture(e.pointerId);
    },
    [select, snapshot, svgRef],
  );

  // 保持 handler 身分穩定，拖曳時未變動的花材才能靠 memo 略過重繪
  const handleStemPointerDown = useCallback(
    (e: React.PointerEvent, stem: Stem, part: "body" | "head") => {
      if (part === "head") {
        beginDrag(e, { kind: "tip", id: stem.id });
        return;
      }
      const p = toSvgPoint(e);
      if (!p) return;
      beginDrag(e, {
        kind: "rotate",
        id: stem.id,
        startAngle: stem.angle,
        startPointerAngle: angleFromPoints(basePoint(stem, vase), p),
      });
    },
    [beginDrag, toSvgPoint, vase],
  );

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const p = toSvgPoint(e);
    if (!p) return;
    const stem = useStudioStore.getState().stems.find((s) => s.id === drag.id);
    if (!stem) return;
    const base = basePoint(stem, vase);
    const snap = e.shiftKey;

    if (drag.kind === "tip") {
      let lengthCm = distance(base, p) / PX_PER_CM;
      let angle = angleFromPoints(base, p);
      if (snap) {
        lengthCm = Math.round(lengthCm);
        angle = Math.round(angle / 5) * 5;
      }
      updateStem(stem.id, { lengthCm, angle });
    } else if (drag.kind === "rotate") {
      let angle = drag.startAngle + (angleFromPoints(base, p) - drag.startPointerAngle);
      if (snap) angle = Math.round(angle / 5) * 5;
      updateStem(stem.id, { angle });
    } else {
      let offsetCm = (p.x - CENTER_X) / PX_PER_CM;
      if (snap) offsetCm = Math.round(offsetCm);
      updateStem(stem.id, { offsetCm });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // 指標可能已被釋放
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const state = useStudioStore.getState();
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) state.redo();
        else state.undo();
        return;
      }
      if (meta && e.key.toLowerCase() === "y") {
        e.preventDefault();
        state.redo();
        return;
      }
      if (e.key === "Escape") {
        state.select(null);
        return;
      }
      const stem = state.stems.find((s) => s.id === state.selectedId);
      if (!stem) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        state.removeStem(stem.id);
        return;
      }
      if (e.key.toLowerCase() === "d" && !meta) {
        e.preventDefault();
        state.duplicateStem(stem.id);
        return;
      }
      const step = e.shiftKey ? 5 : 1;
      const patch: Partial<Stem> = {};
      if (e.key === "ArrowLeft") patch.angle = stem.angle - step;
      else if (e.key === "ArrowRight") patch.angle = stem.angle + step;
      else if (e.key === "ArrowUp") patch.lengthCm = stem.lengthCm + step;
      else if (e.key === "ArrowDown") patch.lengthCm = stem.lengthCm - step;
      else return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastKeyEditRef.current > 800) state.snapshot();
      lastKeyEditRef.current = now;
      state.updateStem(stem.id, patch);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ArrangementScene
      ref={svgRef}
      className={className}
      stems={stems}
      vase={vase}
      selectedId={selectedId}
      interactive
      showProtractor={showProtractor}
      showLabels={showLabels}
      guideTarget={showGuide ? guideTarget : null}
      guidePassed={guidePassed}
      previewTargets={showGuide ? previewTargets : null}
      onStemPointerDown={handleStemPointerDown}
      onTipHandleDown={(e, stem) => beginDrag(e, { kind: "tip", id: stem.id })}
      onBaseHandleDown={(e, stem) => beginDrag(e, { kind: "base", id: stem.id })}
      onBackgroundPointerDown={() => select(null)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  );
}
