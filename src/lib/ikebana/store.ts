"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { idealStemValues } from "./evaluate";
import { MIN_LENGTH_CM, clamp, maxLengthCmFor, round } from "./geometry";
import { getLesson } from "./lessons";
import { getMaterial } from "./materials";
import type { Depth, Role, Stem } from "./types";
import { VASES, getVase } from "./vases";

export type Mode = "free" | "lesson";

const HISTORY_LIMIT = 60;

function newId(): string {
  return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export interface StudioState {
  vaseId: string;
  stems: Stem[];
  selectedId: string | null;
  mode: Mode;
  lessonId: string | null;
  stepIndex: number;
  completedLessons: string[];
  showProtractor: boolean;
  showLabels: boolean;
  showGuide: boolean;
  past: Stem[][];
  future: Stem[][];

  setVase: (id: string) => void;
  addStem: (materialId: string, colorId?: string, overrides?: Partial<Stem>) => string;
  updateStem: (id: string, patch: Partial<Stem>) => void;
  removeStem: (id: string) => void;
  duplicateStem: (id: string) => void;
  select: (id: string | null) => void;
  clearStems: () => void;
  /** 在互動開始前呼叫，把目前狀態推入歷史 */
  snapshot: () => void;
  undo: () => void;
  redo: () => void;

  setMode: (mode: Mode) => void;
  startLesson: (lessonId: string, options?: { keepStems?: boolean }) => void;
  exitLesson: () => void;
  goToStep: (index: number) => void;
  completeLesson: (lessonId: string) => void;
  demonstrateStep: () => void;

  toggleProtractor: () => void;
  toggleLabels: () => void;
  toggleGuide: () => void;
}

function sanitizeStem(stem: Stem, vaseId: string): Stem {
  const vase = getVase(vaseId);
  const material = getMaterial(stem.materialId);
  const half = vase.mouthWidthCm / 2 - 0.5;
  // 先確定角度與位置，長度上限才能依此算出（讓花頭留在畫布內）
  const angle = round(clamp(stem.angle, -95, 95), 1);
  const offsetCm = round(clamp(stem.offsetCm, -half, half), 1);
  const maxLen = Math.min(material.maxLengthCm, maxLengthCmFor({ angle, offsetCm, depth: stem.depth }, vase));
  const minLen = Math.min(Math.max(MIN_LENGTH_CM, material.minLengthCm), maxLen);
  return {
    ...stem,
    lengthCm: round(clamp(stem.lengthCm, minLen, maxLen), 1),
    angle,
    offsetCm,
    curve: round(clamp(stem.curve, -1, 1), 2),
  };
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      vaseId: VASES[0].id,
      stems: [],
      selectedId: null,
      mode: "free",
      lessonId: null,
      stepIndex: 0,
      completedLessons: [],
      showProtractor: true,
      showLabels: true,
      showGuide: true,
      past: [],
      future: [],

      setVase: (id) => {
        const { stems, snapshot } = get();
        snapshot();
        set({ vaseId: id, stems: stems.map((s) => sanitizeStem(s, id)) });
      },

      addStem: (materialId, colorId, overrides) => {
        const state = get();
        state.snapshot();
        const material = getMaterial(materialId);
        const color = material.colors.find((c) => c.id === colorId) ?? material.colors[0];

        let autoRole: Role | null = null;
        if (state.mode === "lesson") {
          const lesson = getLesson(state.lessonId);
          const has = (role: Role) => state.stems.some((s) => s.role === role);
          const check = lesson?.steps[state.stepIndex]?.check;
          if (check?.kind === "stem" && !has(check.target.role)) {
            autoRole = check.target.role;
          } else {
            // 說明步驟或從枝步驟時，先補齊尚未出現的主枝，其餘皆為從枝
            const missing = lesson?.steps
              .map((s) => (s.check.kind === "stem" ? s.check.target.role : null))
              .find((role): role is Role => role !== null && !has(role));
            autoRole = missing ?? "jushi";
          }
        }

        // 錯開新花材的初始角度，避免疊在一起
        const spread = [0, -14, 14, -28, 28, -42, 42, -56, 56];
        const angle = spread[state.stems.length % spread.length];

        const id = newId();
        const stem = sanitizeStem(
          {
            id,
            materialId,
            colorId: color.id,
            lengthCm: material.defaultLengthCm,
            angle,
            offsetCm: 0,
            depth: 0,
            curve: material.defaultCurve,
            flip: false,
            ...overrides,
            role: overrides?.role ?? autoRole,
          },
          state.vaseId,
        );
        set({ stems: [...state.stems, stem], selectedId: id });
        return id;
      },

      updateStem: (id, patch) => {
        const { stems, vaseId } = get();
        set({
          stems: stems.map((s) => (s.id === id ? sanitizeStem({ ...s, ...patch }, vaseId) : s)),
        });
      },

      removeStem: (id) => {
        const state = get();
        state.snapshot();
        set({
          stems: state.stems.filter((s) => s.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        });
      },

      duplicateStem: (id) => {
        const state = get();
        const src = state.stems.find((s) => s.id === id);
        if (!src) return;
        state.snapshot();
        const copy = sanitizeStem(
          {
            ...src,
            id: newId(),
            role: state.mode === "lesson" ? "jushi" : null,
            angle: src.angle + (src.angle >= 0 ? 12 : -12),
            lengthCm: src.lengthCm * 0.8,
          },
          state.vaseId,
        );
        set({ stems: [...state.stems, copy], selectedId: copy.id });
      },

      select: (id) => set({ selectedId: id }),

      clearStems: () => {
        const state = get();
        if (state.stems.length === 0) return;
        state.snapshot();
        set({ stems: [], selectedId: null });
      },

      snapshot: () => {
        const { stems, past } = get();
        const next = [...past, stems.map((s) => ({ ...s }))];
        if (next.length > HISTORY_LIMIT) next.shift();
        set({ past: next, future: [] });
      },

      undo: () => {
        const { past, future, stems, selectedId } = get();
        if (past.length === 0) return;
        const prev = past[past.length - 1];
        set({
          stems: prev,
          past: past.slice(0, -1),
          future: [stems, ...future],
          selectedId: prev.some((s) => s.id === selectedId) ? selectedId : null,
        });
      },

      redo: () => {
        const { past, future, stems, selectedId } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          stems: next,
          past: [...past, stems],
          future: future.slice(1),
          selectedId: next.some((s) => s.id === selectedId) ? selectedId : null,
        });
      },

      setMode: (mode) => {
        const state = get();
        if (mode === "free") {
          // 保留 lessonId 與 stepIndex，切回課程時可以接續
          set({ mode });
          return;
        }
        const lesson = getLesson(state.lessonId);
        if (!lesson) return;
        set({
          mode,
          vaseId: lesson.vaseId,
          stems: state.stems.map((s) => sanitizeStem(s, lesson.vaseId)),
        });
      },

      startLesson: (lessonId, options) => {
        const lesson = getLesson(lessonId);
        if (!lesson) return;
        const state = get();
        if (!options?.keepStems) state.snapshot();
        set({
          mode: "lesson",
          lessonId,
          stepIndex: 0,
          vaseId: lesson.vaseId,
          stems: options?.keepStems ? state.stems.map((s) => sanitizeStem(s, lesson.vaseId)) : [],
          selectedId: null,
          showGuide: true,
        });
      },

      exitLesson: () => set({ mode: "free", lessonId: null, stepIndex: 0 }),

      goToStep: (index) => {
        const lesson = getLesson(get().lessonId);
        if (!lesson) return;
        set({ stepIndex: clamp(index, 0, lesson.steps.length - 1) });
      },

      completeLesson: (lessonId) => {
        const { completedLessons } = get();
        if (completedLessons.includes(lessonId)) return;
        set({ completedLessons: [...completedLessons, lessonId] });
      },

      demonstrateStep: () => {
        const state = get();
        const lesson = getLesson(state.lessonId);
        const step = lesson?.steps[state.stepIndex];
        if (!step || step.check.kind !== "stem") return;
        const target = step.check.target;
        const vase = getVase(state.vaseId);
        const existing = state.stems.find((s) => s.role === target.role);
        const ideal = idealStemValues(target, state.stems, vase);

        if (existing) {
          state.snapshot();
          const material = getMaterial(existing.materialId);
          const categoryOk = !target.categories || target.categories.includes(material.category);
          const patch: Partial<Stem> = { ...ideal };
          if (!categoryOk) {
            const m = getMaterial(target.suggestedMaterialId);
            patch.materialId = m.id;
            patch.colorId = (m.colors.find((c) => c.id === target.suggestedColorId) ?? m.colors[0]).id;
            patch.curve = m.defaultCurve;
          }
          state.updateStem(existing.id, patch);
          set({ selectedId: existing.id });
        } else {
          state.addStem(target.suggestedMaterialId, target.suggestedColorId, {
            role: target.role,
            ...ideal,
          });
        }
      },

      toggleProtractor: () => set((s) => ({ showProtractor: !s.showProtractor })),
      toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
      toggleGuide: () => set((s) => ({ showGuide: !s.showGuide })),
    }),
    {
      name: "ikebana-studio-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        vaseId: state.vaseId,
        stems: state.stems,
        mode: state.mode,
        lessonId: state.lessonId,
        stepIndex: state.stepIndex,
        completedLessons: state.completedLessons,
        showProtractor: state.showProtractor,
        showLabels: state.showLabels,
        showGuide: state.showGuide,
      }),
    },
  ),
);

export function depthLabel(depth: Depth): string {
  return depth === -1 ? "後" : depth === 1 ? "前" : "中";
}
