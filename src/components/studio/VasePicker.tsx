"use client";

import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PX_PER_CM } from "@/lib/ikebana/geometry";
import { useStudioStore } from "@/lib/ikebana/store";
import type { Vase } from "@/lib/ikebana/types";
import { VASES, unitCm } from "@/lib/ikebana/vases";
import { cn } from "@/lib/utils";

export function VaseThumb({ vase, size = 64 }: { vase: Vase; size?: number }) {
  const h = vase.heightCm * PX_PER_CM;
  const w = vase.widthCm * PX_PER_CM;
  const pad = 24;
  const box = Math.max(w, h + 20) + pad * 2;
  return (
    <svg viewBox={`${-box / 2} ${h / 2 - box / 2} ${box} ${box}`} width={size} height={size} aria-hidden>
      {vase.render(`vpick-${vase.id}`)}
    </svg>
  );
}

export function VasePicker({ locked }: { locked: boolean }) {
  const vaseId = useStudioStore((s) => s.vaseId);
  const setVase = useStudioStore((s) => s.setVase);

  return (
    <section className="flex flex-col gap-2">
      <header className="flex items-center justify-between px-0.5">
        <h3 className="font-heading text-sm font-semibold tracking-wide">花器</h3>
        {locked && (
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="inline-flex cursor-help items-center gap-1 text-[11px] text-muted-foreground" tabIndex={0} />
              }
            >
              <Lock className="size-3" /> 課程指定
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-56 text-left leading-relaxed">
              課程會依指定花器計算尺寸，因此暫時無法更換。切換到「自由創作」即可自由選擇花器。
            </TooltipContent>
          </Tooltip>
        )}
      </header>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {VASES.map((v) => {
          const active = v.id === vaseId;
          return (
            <Tooltip key={v.id}>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    disabled={locked && !active}
                    onClick={() => setVase(v.id)}
                    className={cn(
                      "flex shrink-0 flex-col items-center gap-1 rounded-xl border bg-card/80 px-2 pb-1.5 pt-1 transition-all",
                      active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40",
                      locked && !active && "opacity-40",
                    )}
                    aria-pressed={active}
                  />
                }
              >
                <VaseThumb vase={v} size={58} />
                <span className="text-[11px] leading-none">{v.name}</span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-56 text-left leading-relaxed">
                <p className="font-medium">
                  {v.name}・{v.widthCm}×{v.heightCm} cm（基本寸法 {unitCm(v)} cm）
                </p>
                <p className="opacity-80">{v.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </section>
  );
}
