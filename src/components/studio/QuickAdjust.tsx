"use client";

import { FlipHorizontal2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ROLE_INFO } from "@/lib/ikebana/lessons";
import { getMaterial } from "@/lib/ikebana/materials";
import { useStudioStore } from "@/lib/ikebana/store";
import type { Depth, Stem } from "@/lib/ikebana/types";
import { cn } from "@/lib/utils";
import { useSelectedStem } from "./StemInspector";

const DEPTHS: { value: Depth; label: string }[] = [
  { value: -1, label: "後方" },
  { value: 0, label: "中央" },
  { value: 1, label: "前方" },
];

/** 課程模式中浮在畫布上的精簡調整卡，補足右側課程面板沒有的屬性操作 */
export function QuickAdjust({ className }: { className?: string }) {
  const stem = useSelectedStem();
  const updateStem = useStudioStore((s) => s.updateStem);
  const removeStem = useStudioStore((s) => s.removeStem);
  const select = useStudioStore((s) => s.select);
  const snapshot = useStudioStore((s) => s.snapshot);

  if (!stem) return null;
  const material = getMaterial(stem.materialId);
  const update = (patch: Partial<Stem>) => updateStem(stem.id, patch);

  return (
    <div
      className={cn(
        "w-[264px] rounded-xl border bg-card/95 p-3 shadow-lg shadow-ink/10 backdrop-blur",
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-200",
        className,
      )}
      onPointerDownCapture={snapshot}
      role="group"
      aria-label="調整花材"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {stem.role && (
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary font-heading text-xs font-bold text-primary-foreground">
              {ROLE_INFO[stem.role].label}
            </span>
          )}
          <div>
            <p className="font-heading text-sm font-semibold leading-none">{material.name}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">調整花材</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          <Button variant="ghost" size="icon-sm" onClick={() => removeStem(stem.id)} aria-label="刪除這枝花材">
            <Trash2 className="text-destructive" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => select(null)} aria-label="關閉">
            <X />
          </Button>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {material.colors.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => update({ colorId: c.id })}
            className={cn(
              "size-5 rounded-full border border-black/10 transition-transform hover:scale-110",
              c.id === stem.colorId && "ring-2 ring-primary ring-offset-1 ring-offset-card",
            )}
            style={{ backgroundColor: c.hex }}
            aria-label={c.name}
            aria-pressed={c.id === stem.colorId}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <span className="text-[11px] font-medium text-foreground/80">前後位置</span>
        <div className="grid grid-cols-3 gap-1">
          {DEPTHS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => update({ depth: d.value })}
              className={cn(
                "rounded-md border py-1 text-xs transition-colors",
                stem.depth === d.value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted",
              )}
              aria-pressed={stem.depth === d.value}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-medium text-foreground/80">彎曲</span>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {stem.curve === 0 ? "直" : `${stem.curve > 0 ? "右" : "左"} ${Math.abs(Math.round(stem.curve * 100))}%`}
            </span>
          </div>
          <Slider
            value={[stem.curve]}
            min={-1}
            max={1}
            step={0.05}
            onValueChange={(v) => update({ curve: Array.isArray(v) ? v[0] : v })}
            aria-label="彎曲"
          />
        </div>
        <label className="flex flex-col items-center gap-1 text-[11px] font-medium text-foreground/80">
          <span className="inline-flex items-center gap-1">
            <FlipHorizontal2 className="size-3" /> 翻轉
          </span>
          <Switch size="sm" checked={stem.flip} onCheckedChange={(checked) => update({ flip: checked })} aria-label="翻轉花頭" />
        </label>
      </div>
    </div>
  );
}
