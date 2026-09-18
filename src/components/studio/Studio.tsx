"use client";

import { Flower2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useSquareFit } from "@/hooks/use-square-fit";
import { useStoreHydration } from "@/hooks/use-store-hydration";
import { getLesson } from "@/lib/ikebana/lessons";
import { useStudioStore } from "@/lib/ikebana/store";
import type { Lesson, StemTarget } from "@/lib/ikebana/types";
import { getVase } from "@/lib/ikebana/vases";
import { ArrangementCanvas } from "./ArrangementCanvas";
import { CanvasToolbar } from "./CanvasToolbar";
import { CritiquePanel } from "./CritiquePanel";
import { LessonPanel } from "./LessonPanel";
import { MaterialPalette } from "./MaterialPalette";
import { QuickAdjust } from "./QuickAdjust";
import { StemInspector } from "./StemInspector";
import { LessonPickerDialog, StudioHeader } from "./StudioHeader";
import { VasePicker } from "./VasePicker";

interface StudioProps {
  initialLesson?: string | null;
  initialMode?: string | null;
  restart?: boolean;
}

function stemTargets(lesson: Lesson | null): StemTarget[] {
  if (!lesson) return [];
  return lesson.steps.flatMap((s) => (s.check.kind === "stem" ? [s.check.target] : []));
}

function CanvasStage({
  guideTarget,
  previewTargets,
  svgRef,
  overlay,
}: {
  guideTarget: StemTarget | null;
  previewTargets: StemTarget[] | null;
  svgRef: React.RefObject<SVGSVGElement | null>;
  overlay?: React.ReactNode;
}) {
  const vaseId = useStudioStore((s) => s.vaseId);
  const vase = getVase(vaseId);
  const { ref, side } = useSquareFit<HTMLDivElement>();
  return (
    <div ref={ref} className="flex h-full min-h-0 w-full items-center justify-center">
      <div
        className="canvas-frame relative overflow-hidden rounded-2xl bg-[#f9f6f0]"
        style={{ width: side || undefined, height: side || undefined, visibility: side ? "visible" : "hidden" }}
      >
        <ArrangementCanvas
          vase={vase}
          guideTarget={guideTarget}
          previewTargets={previewTargets}
          svgRef={svgRef}
          className="block h-full w-full"
        />
        {overlay && <div className="absolute bottom-3 left-3">{overlay}</div>}
      </div>
    </div>
  );
}

/** 只在課程需要某個角色、且畫布上還沒有該角色時，才提示建議花材 */
function useSuggestedMaterial(target: StemTarget | null): string | null {
  const assigned = useStudioStore((s) => (target ? s.stems.some((st) => st.role === target.role) : true));
  return target && !assigned ? target.suggestedMaterialId : null;
}

/** 讀取 URL 參數決定要開啟哪一課或哪個模式，只在還原完成後執行一次 */
function useInitialRoute({ initialLesson, initialMode, restart }: StudioProps, hydrated: boolean) {
  const router = useRouter();
  const applied = useRef(false);
  useEffect(() => {
    if (!hydrated || applied.current) return;
    applied.current = true;
    const state = useStudioStore.getState();
    if (initialLesson && getLesson(initialLesson)) {
      const resume = !restart && state.lessonId === initialLesson;
      if (resume) state.setMode("lesson");
      else state.startLesson(initialLesson);
    } else if (initialMode === "free") {
      state.setMode("free");
    }
    if (initialLesson || initialMode) router.replace("/studio");
  }, [hydrated, initialLesson, initialMode, restart, router]);
}

type MobileTab = "materials" | "inspect" | "guide";

export function Studio(props: StudioProps) {
  const hydrated = useStoreHydration();
  const isDesktop = useIsDesktop();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  useInitialRoute(props, hydrated);

  const mode = useStudioStore((s) => s.mode);
  const lessonId = useStudioStore((s) => s.lessonId);
  const stepIndex = useStudioStore((s) => s.stepIndex);
  const vaseId = useStudioStore((s) => s.vaseId);
  const hasSelection = useStudioStore((s) => s.selectedId !== null);

  // 手機版分頁：進入課程時自動切到「課程」，讓步驟說明不會被藏在其他分頁
  const [mobileTab, setMobileTab] = useState<MobileTab>(mode === "lesson" ? "guide" : "materials");
  const [seenMode, setSeenMode] = useState(mode);
  if (seenMode !== mode) {
    setSeenMode(mode);
    if (mode === "lesson") setMobileTab("guide");
  }

  const vase = getVase(vaseId);
  const lesson = mode === "lesson" ? getLesson(lessonId) : null;
  const step = lesson?.steps[stepIndex] ?? null;
  const guideTarget = step?.check.kind === "stem" ? step.check.target : null;
  const previewTargets = useMemo(
    () => (step?.check.kind === "info" ? stemTargets(lesson) : null),
    [lesson, step],
  );
  const suggestedMaterialId = useSuggestedMaterial(guideTarget);

  if (!hydrated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
        <Flower2 className="size-8 animate-pulse text-primary" />
        <p className="text-sm">正在準備花器與花材…</p>
      </div>
    );
  }

  const palette = (
    <div className="flex flex-col gap-5">
      <VasePicker locked={mode === "lesson"} />
      <MaterialPalette
        highlightKey={guideTarget?.categories?.join(",") ?? null}
        suggestedMaterialId={suggestedMaterialId}
      />
    </div>
  );

  const rightPanel = lesson ? (
    <LessonPanel lesson={lesson} vase={vase} />
  ) : (
    <div className="flex flex-col gap-6">
      <StemInspector vase={vase} />
      <CritiquePanel vase={vase} />
    </div>
  );

  return (
    <div className="flex h-dvh flex-col">
      <StudioHeader svgRef={svgRef} onPickLesson={() => setPickerOpen(true)} />

      {isDesktop ? (
        <div className="grid min-h-0 flex-1 grid-cols-[296px_minmax(0,1fr)_368px]">
          <aside className="min-h-0 overflow-y-auto border-r bg-sidebar/60 p-3">{palette}</aside>
          <main className="min-h-0 p-4">
            <CanvasStage
              guideTarget={guideTarget}
              previewTargets={previewTargets}
              svgRef={svgRef}
              overlay={lesson && hasSelection ? <QuickAdjust /> : null}
            />
          </main>
          <aside className="min-h-0 overflow-y-auto border-l bg-sidebar/60 p-4">{rightPanel}</aside>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <main className="h-[min(56vh,100vw)] shrink-0 p-3">
            <CanvasStage guideTarget={guideTarget} previewTargets={previewTargets} svgRef={svgRef} />
          </main>
          <Tabs
            value={mobileTab}
            onValueChange={(v) => setMobileTab(v as MobileTab)}
            className="min-h-0 flex-1 gap-0 border-t bg-sidebar/60"
          >
            <TabsList className="mx-3 mt-2 w-[calc(100%-1.5rem)]">
              <TabsTrigger value="materials">花材</TabsTrigger>
              <TabsTrigger value="inspect">調整</TabsTrigger>
              <TabsTrigger value="guide">{lesson ? "課程" : "評析"}</TabsTrigger>
            </TabsList>
            <TabsContent value="materials" className="min-h-0 overflow-y-auto p-3">
              {palette}
            </TabsContent>
            <TabsContent value="inspect" className="min-h-0 overflow-y-auto p-3">
              <div className="flex flex-col gap-4">
                <CanvasToolbar />
                <StemInspector vase={vase} />
              </div>
            </TabsContent>
            <TabsContent value="guide" className="min-h-0 overflow-y-auto p-3">
              {lesson ? <LessonPanel lesson={lesson} vase={vase} /> : <CritiquePanel vase={vase} />}
            </TabsContent>
          </Tabs>
        </div>
      )}

      <LessonPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} />
    </div>
  );
}
