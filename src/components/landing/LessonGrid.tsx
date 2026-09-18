"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useStoreHydration } from "@/hooks/use-store-hydration";
import { LESSONS } from "@/lib/ikebana/lessons";
import { useStudioStore } from "@/lib/ikebana/store";
import { getVase } from "@/lib/ikebana/vases";
import { VaseThumb } from "@/components/studio/VasePicker";
import { cn } from "@/lib/utils";

export function LessonGrid() {
  const hydrated = useStoreHydration();
  const completed = useStudioStore((s) => s.completedLessons);
  const currentLesson = useStudioStore((s) => (s.mode === "lesson" ? s.lessonId : null));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {LESSONS.map((lesson, i) => {
        const done = hydrated && completed.includes(lesson.id);
        const inProgress = hydrated && !done && currentLesson === lesson.id;
        const vase = getVase(lesson.vaseId);
        return (
          <Link
            key={lesson.id}
            href={`/studio?lesson=${lesson.id}${done ? "&restart=1" : ""}`}
            className={cn(
              "group relative flex flex-col gap-4 rounded-2xl border bg-card/80 p-5 transition-all",
              "hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10",
              done ? "border-success/40" : "border-border hover:border-primary/40",
            )}
          >
            <div className="flex items-start justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-foreground font-heading text-sm font-bold text-background">
                {i + 1}
              </span>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline">{lesson.level}</Badge>
                {done && (
                  <Badge className="bg-success text-white">
                    <CheckCircle2 /> 已完成
                  </Badge>
                )}
                {inProgress && <Badge variant="secondary">進行中</Badge>}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-xl bg-muted/60 p-1">
                <VaseThumb vase={vase} size={56} />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold leading-tight">{lesson.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{lesson.subtitle}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{lesson.summary}</p>
            <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
              {lesson.goals.map((g) => (
                <li key={g} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                  {g}
                </li>
              ))}
            </ul>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
              {done ? "再練一次" : inProgress ? "繼續課程" : "開始課程"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
