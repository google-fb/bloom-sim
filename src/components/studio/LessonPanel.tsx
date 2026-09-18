"use client";

import { ArrowLeft, ArrowRight, Check, ChevronLeft, Sparkles, Wand2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  critique,
  evaluateRules,
  evaluateStemTarget,
  idealMainLengths,
  isStepPassed,
  resolveLengthRange,
} from "@/lib/ikebana/evaluate";
import { describeAngle, describeDepth, round } from "@/lib/ikebana/geometry";
import { LESSONS, ROLE_INFO } from "@/lib/ikebana/lessons";
import { CATEGORY_INFO, getMaterial } from "@/lib/ikebana/materials";
import { useStudioStore } from "@/lib/ikebana/store";
import type { Lesson, Stem, StemTarget, Vase } from "@/lib/ikebana/types";
import { cn } from "@/lib/utils";
import { RuleList, ScoreRing } from "./CritiquePanel";

function DimensionTable({ vase }: { vase: Vase }) {
  const d = idealMainLengths(vase);
  const rows = [
    { label: "基本寸法", formula: `${vase.widthCm} + ${vase.heightCm}`, value: d.unit },
    { label: "真", formula: "基本寸法 × 1.5", value: d.shin },
    { label: "副", formula: "真 × 3/4", value: d.soe },
    { label: "控", formula: "副 × 3/4", value: d.hikae },
  ];
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-xs">
        <thead className="bg-muted/70 text-left text-[11px] text-muted-foreground">
          <tr>
            <th className="px-2.5 py-1.5 font-medium">項目</th>
            <th className="px-2.5 py-1.5 font-medium">算法</th>
            <th className="px-2.5 py-1.5 text-right font-medium">長度</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t">
              <td className="px-2.5 py-1.5 font-heading font-semibold">{r.label}</td>
              <td className="px-2.5 py-1.5 text-muted-foreground">{r.formula}</td>
              <td className="px-2.5 py-1.5 text-right tabular-nums">{round(r.value)} cm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TargetCard({ target, stems, vase }: { target: StemTarget; stems: Stem[]; vase: Vase }) {
  const range = resolveLengthRange(target, stems, vase);
  const material = getMaterial(target.suggestedMaterialId);
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-primary-foreground">
          {ROLE_INFO[target.role].label}
        </span>
        <div className="text-xs leading-relaxed">
          <p>
            長度約 <strong className="tabular-nums">{round(range.ideal)} cm</strong>
            <span className="text-muted-foreground">（{range.basis} × {target.length.ideal}）</span>
          </p>
          <p>
            角度 <strong>{describeAngle(target.angle.ideal)}</strong>
            {target.depth !== undefined && (
              <>
                ・前後 <strong>{describeDepth(target.depth)}</strong>
              </>
            )}
          </p>
          <p className="text-muted-foreground">
            建議材料：{material.name}
            {target.categories && `（${target.categories.map((c) => CATEGORY_INFO[c].label).join("／")}）`}
          </p>
        </div>
      </div>
    </div>
  );
}

function CriteriaList({ target, stems, vase }: { target: StemTarget; stems: Stem[]; vase: Vase }) {
  const evaluation = evaluateStemTarget(target, stems, vase);
  return (
    <ul className="flex flex-col gap-1.5">
      {evaluation.criteria.map((c) => (
        <li
          key={c.id}
          className={cn(
            "flex gap-2.5 rounded-lg border p-2.5",
            c.passed ? "border-success/30 bg-success/5" : "border-border bg-card/60",
          )}
        >
          <span
            className={cn(
              "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
              c.passed ? "bg-success text-white" : "bg-warning/20 text-warning",
            )}
          >
            {c.passed ? <Check className="size-3" /> : <X className="size-3" />}
          </span>
          <div>
            <p className="text-sm font-medium">{c.label}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{c.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function LessonPanel({ lesson, vase }: { lesson: Lesson; vase: Vase }) {
  const stems = useStudioStore((s) => s.stems);
  const stepIndex = useStudioStore((s) => s.stepIndex);
  const goToStep = useStudioStore((s) => s.goToStep);
  const demonstrateStep = useStudioStore((s) => s.demonstrateStep);
  const completeLesson = useStudioStore((s) => s.completeLesson);
  const completedLessons = useStudioStore((s) => s.completedLessons);
  const startLesson = useStudioStore((s) => s.startLesson);
  const exitLesson = useStudioStore((s) => s.exitLesson);
  const [doneOpen, setDoneOpen] = useState(false);

  const step = lesson.steps[stepIndex];
  const passed = isStepPassed(step, stems, vase);
  const isLast = stepIndex === lesson.steps.length - 1;
  const progress = Math.round(((stepIndex + (passed ? 1 : 0)) / lesson.steps.length) * 100);
  const lessonIndex = LESSONS.findIndex((l) => l.id === lesson.id);
  const nextLesson = LESSONS[lessonIndex + 1] ?? null;
  const summary = isLast || doneOpen ? critique(stems, vase) : null;

  const finish = () => {
    completeLesson(lesson.id);
    setDoneOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Link
          href="/#lessons"
          className="inline-flex w-fit items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3" /> 課程列表
        </Link>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-heading text-lg font-semibold leading-tight">{lesson.title}</h2>
            <p className="text-xs text-muted-foreground">{lesson.subtitle}</p>
          </div>
          <Badge variant="outline" className="shrink-0">
            {lesson.level}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {stepIndex + 1} / {lesson.steps.length}
          </span>
        </div>
      </div>

      <ol className="flex items-center gap-1" aria-label="課程步驟">
        {lesson.steps.map((s, i) => {
          const reached = i <= stepIndex;
          return (
            <li key={s.id} className="flex-1">
              <button
                type="button"
                onClick={() => reached && goToStep(i)}
                disabled={!reached}
                className={cn(
                  "h-1.5 w-full rounded-full transition-colors",
                  i < stepIndex ? "bg-success" : i === stepIndex ? "bg-primary" : "bg-muted",
                  reached && "hover:opacity-80",
                )}
                aria-label={`第 ${i + 1} 步：${s.title}`}
                aria-current={i === stepIndex ? "step" : undefined}
              />
            </li>
          );
        })}
      </ol>

      <article className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground font-heading text-xs font-bold text-background">
            {stepIndex + 1}
          </span>
          <h3 className="font-heading text-base font-semibold">{step.title}</h3>
        </div>
        <div className="flex flex-col gap-2 text-[13px] leading-relaxed text-foreground/85">
          {step.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {step.check.kind === "info" && stepIndex === 0 && <DimensionTable vase={vase} />}

        {step.check.kind === "stem" && (
          <>
            <TargetCard target={step.check.target} stems={stems} vase={vase} />
            <CriteriaList target={step.check.target} stems={stems} vase={vase} />
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={demonstrateStep}>
                <Wand2 data-icon="inline-start" /> 看示範擺放
              </Button>
              <span className="text-[11px] leading-snug text-muted-foreground">
                點選畫布上的花材，可調整顏色、前後位置與彎曲。
              </span>
            </div>
          </>
        )}

        {step.check.kind === "rules" && (
          <RuleList results={evaluateRules(step.check.ruleIds, stems, vase)} compact />
        )}

        {isLast && summary && (
          <div className="rounded-lg border bg-card/70 p-3">
            <ScoreRing value={summary.total} max={summary.max} label={summary.rating} />
          </div>
        )}
      </article>

      <div className="flex items-center justify-between gap-2 border-t pt-3">
        <Button variant="ghost" size="sm" disabled={stepIndex === 0} onClick={() => goToStep(stepIndex - 1)}>
          <ArrowLeft data-icon="inline-start" /> 上一步
        </Button>
        {isLast ? (
          <Button size="sm" onClick={finish}>
            <Sparkles data-icon="inline-start" /> 完成課程
          </Button>
        ) : (
          <Button size="sm" disabled={!passed} onClick={() => goToStep(stepIndex + 1)}>
            {passed ? "下一步" : "完成此步後繼續"} <ArrowRight data-icon="inline-end" />
          </Button>
        )}
      </div>

      <Dialog open={doneOpen} onOpenChange={setDoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">課程完成：{lesson.title}</DialogTitle>
            <DialogDescription>
              {completedLessons.length >= LESSONS.length
                ? "你已完成所有課程。接下來的每一件作品，都由你自己決定。"
                : "把這件作品匯出留念，或繼續下一課。"}
            </DialogDescription>
          </DialogHeader>
          {summary && (
            <div className="rounded-lg border bg-muted/40 p-3">
              <ScoreRing value={summary.total} max={summary.max} label={summary.rating} />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDoneOpen(false);
                exitLesson();
              }}
            >
              進入自由創作
            </Button>
            {nextLesson && (
              <Button
                onClick={() => {
                  setDoneOpen(false);
                  startLesson(nextLesson.id);
                }}
              >
                下一課：{nextLesson.title} <ArrowRight data-icon="inline-end" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
