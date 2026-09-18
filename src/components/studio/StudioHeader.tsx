"use client";

import { Compass, Download, Eraser, Flower2, Redo2, Tags, Target, Undo2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { downloadSvgAsPng } from "@/lib/ikebana/export";
import { LESSONS } from "@/lib/ikebana/lessons";
import { useStudioStore, type Mode } from "@/lib/ikebana/store";

interface StudioHeaderProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  onPickLesson: () => void;
}

function IconToggle({
  pressed,
  onPressedChange,
  label,
  children,
}: {
  pressed: boolean;
  onPressedChange: (v: boolean) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Toggle
            pressed={pressed}
            onPressedChange={onPressedChange}
            aria-label={label}
            size="sm"
            variant="outline"
            className="text-muted-foreground aria-pressed:border-primary/40 aria-pressed:bg-primary/10 aria-pressed:text-primary"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function StudioHeader({ svgRef, onPickLesson }: StudioHeaderProps) {
  const mode = useStudioStore((s) => s.mode);
  const lessonId = useStudioStore((s) => s.lessonId);
  const setMode = useStudioStore((s) => s.setMode);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const canUndo = useStudioStore((s) => s.past.length > 0);
  const canRedo = useStudioStore((s) => s.future.length > 0);
  const clearStems = useStudioStore((s) => s.clearStems);
  const stemCount = useStudioStore((s) => s.stems.length);
  const showProtractor = useStudioStore((s) => s.showProtractor);
  const showLabels = useStudioStore((s) => s.showLabels);
  const showGuide = useStudioStore((s) => s.showGuide);
  const toggleProtractor = useStudioStore((s) => s.toggleProtractor);
  const toggleLabels = useStudioStore((s) => s.toggleLabels);
  const toggleGuide = useStudioStore((s) => s.toggleGuide);
  const [clearOpen, setClearOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleMode = (value: Mode) => {
    if (value === mode) return;
    if (value === "lesson" && !lessonId) {
      onPickLesson();
      return;
    }
    setMode(value);
  };

  const handleExport = async () => {
    if (!svgRef.current) return;
    setExporting(true);
    try {
      const stamp = new Date().toISOString().slice(0, 10);
      await downloadSvgAsPng(svgRef.current, `ikebana-${stamp}.png`);
    } catch (err) {
      console.error(err);
      window.alert("匯出失敗，請再試一次。");
    } finally {
      setExporting(false);
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card/70 px-3 backdrop-blur sm:px-4">
      <Link href="/" className="flex items-center gap-2 text-foreground">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Flower2 className="size-4" />
        </span>
        <span className="hidden font-heading text-lg font-semibold tracking-wide sm:inline">花道練習室</span>
      </Link>

      <Tabs value={mode} onValueChange={(v) => handleMode(v as Mode)} className="mx-auto">
        <TabsList>
          <TabsTrigger value="lesson" className="px-3">
            學習課程
          </TabsTrigger>
          <TabsTrigger value="free" className="px-3">
            自由創作
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-1">
        <div className="hidden items-center gap-1 md:flex">
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon-sm" onClick={undo} disabled={!canUndo} aria-label="復原" />}>
              <Undo2 />
            </TooltipTrigger>
            <TooltipContent>復原（Ctrl/⌘+Z）</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon-sm" onClick={redo} disabled={!canRedo} aria-label="重做" />}>
              <Redo2 />
            </TooltipTrigger>
            <TooltipContent>重做（Ctrl/⌘+Shift+Z）</TooltipContent>
          </Tooltip>
          <span className="mx-1 h-5 w-px bg-border" />
          <IconToggle pressed={showProtractor} onPressedChange={toggleProtractor} label="量角器">
            <Compass />
          </IconToggle>
          <IconToggle pressed={showLabels} onPressedChange={toggleLabels} label="角色標籤">
            <Tags />
          </IconToggle>
          {mode === "lesson" && (
            <IconToggle pressed={showGuide} onPressedChange={toggleGuide} label="目標引導">
              <Target />
            </IconToggle>
          )}
          <span className="mx-1 h-5 w-px bg-border" />
        </div>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon-sm" onClick={() => setClearOpen(true)} disabled={stemCount === 0} aria-label="清空畫布" />
            }
          >
            <Eraser />
          </TooltipTrigger>
          <TooltipContent>清空畫布</TooltipContent>
        </Tooltip>
        <Button size="sm" onClick={handleExport} disabled={exporting || stemCount === 0}>
          <Download data-icon="inline-start" /> <span className="hidden sm:inline">匯出 PNG</span>
          <span className="sm:hidden">匯出</span>
        </Button>
      </div>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>清空畫布？</DialogTitle>
            <DialogDescription>會移除目前的 {stemCount} 枝花材。你隨時可以用復原找回。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>取消</DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                clearStems();
                setClearOpen(false);
              }}
            >
              清空
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export function LessonPickerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const startLesson = useStudioStore((s) => s.startLesson);
  const completed = useStudioStore((s) => s.completedLessons);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">選擇課程</DialogTitle>
          <DialogDescription>開始課程會清空畫布並切換到指定花器。</DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-2">
          {LESSONS.map((l, i) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => {
                  startLesson(l.id);
                  onOpenChange(false);
                }}
                className="flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground font-heading text-xs font-bold text-background">
                  {i + 1}
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-heading text-base font-semibold">{l.title}</span>
                    <span className="text-[11px] text-muted-foreground">{l.level}</span>
                    {completed.includes(l.id) && <span className="text-[11px] text-success">已完成</span>}
                  </span>
                  <span className="block text-xs text-muted-foreground">{l.subtitle}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
