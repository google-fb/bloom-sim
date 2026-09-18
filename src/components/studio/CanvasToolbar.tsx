"use client";

import { Compass, Redo2, Tags, Target, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useStudioStore } from "@/lib/ikebana/store";

/** 手機版用的精簡工具列（桌面版的功能位於頁首） */
export function CanvasToolbar() {
  const mode = useStudioStore((s) => s.mode);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const canUndo = useStudioStore((s) => s.past.length > 0);
  const canRedo = useStudioStore((s) => s.future.length > 0);
  const showProtractor = useStudioStore((s) => s.showProtractor);
  const showLabels = useStudioStore((s) => s.showLabels);
  const showGuide = useStudioStore((s) => s.showGuide);
  const toggleProtractor = useStudioStore((s) => s.toggleProtractor);
  const toggleLabels = useStudioStore((s) => s.toggleLabels);
  const toggleGuide = useStudioStore((s) => s.toggleGuide);

  return (
    <div className="flex items-center gap-1 rounded-xl border bg-card/70 p-1">
      <Button variant="ghost" size="icon-sm" onClick={undo} disabled={!canUndo} aria-label="復原">
        <Undo2 />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={redo} disabled={!canRedo} aria-label="重做">
        <Redo2 />
      </Button>
      <span className="mx-1 h-5 w-px bg-border" />
      <Toggle pressed={showProtractor} onPressedChange={toggleProtractor} size="sm" aria-label="量角器">
        <Compass /> 量角器
      </Toggle>
      <Toggle pressed={showLabels} onPressedChange={toggleLabels} size="sm" aria-label="角色標籤">
        <Tags /> 標籤
      </Toggle>
      {mode === "lesson" && (
        <Toggle pressed={showGuide} onPressedChange={toggleGuide} size="sm" aria-label="目標引導">
          <Target /> 引導
        </Toggle>
      )}
    </div>
  );
}
