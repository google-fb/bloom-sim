"use client";

import { Copy, FlipHorizontal2, MousePointerClick, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MIN_LENGTH_CM, describeAngle, maxLengthCmFor, round } from "@/lib/ikebana/geometry";
import { ROLE_INFO } from "@/lib/ikebana/lessons";
import { CATEGORY_INFO, getMaterial } from "@/lib/ikebana/materials";
import { useStudioStore } from "@/lib/ikebana/store";
import type { Depth, Role, Stem, Vase } from "@/lib/ikebana/types";
import { cn } from "@/lib/utils";

const ROLES: (Role | null)[] = [null, "shin", "soe", "hikae", "jushi"];
const DEPTHS: { value: Depth; label: string }[] = [
  { value: -1, label: "後方" },
  { value: 0, label: "中央" },
  { value: 1, label: "前方" },
];

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-foreground/80">{label}</span>
        <span className="text-xs tabular-nums text-muted-foreground">{value}</span>
      </div>
      {children}
    </div>
  );
}

export function useSelectedStem(): Stem | null {
  return useStudioStore((s) => s.stems.find((st) => st.id === s.selectedId) ?? null);
}

export function StemInspector({ vase }: { vase: Vase }) {
  const stem = useSelectedStem();
  const updateStem = useStudioStore((s) => s.updateStem);
  const removeStem = useStudioStore((s) => s.removeStem);
  const duplicateStem = useStudioStore((s) => s.duplicateStem);
  const snapshot = useStudioStore((s) => s.snapshot);
  const count = useStudioStore((s) => s.stems.length);

  if (!stem) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center">
        <MousePointerClick className="size-6 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">點選畫布上的花材來調整</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            拖曳花頭可以同時改變長度與角度；拖曳花莖只改變角度；拖曳基部可左右移動。
            按住 Shift 可以吸附到整數。
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground">目前共 {count} 枝花材</p>
      </div>
    );
  }

  const material = getMaterial(stem.materialId);
  const color = material.colors.find((c) => c.id === stem.colorId) ?? material.colors[0];
  const maxLen = Math.min(material.maxLengthCm, maxLengthCmFor(stem, vase));
  const minLen = Math.min(Math.max(MIN_LENGTH_CM, material.minLengthCm), maxLen);
  const half = round(vase.mouthWidthCm / 2 - 0.5, 1);
  const update = (patch: Partial<Stem>) => updateStem(stem.id, patch);

  return (
    <div className="flex flex-col gap-4" onPointerDownCapture={snapshot}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-heading text-lg font-semibold leading-none">{material.name}</h3>
            <span className="text-[11px] text-muted-foreground">{material.latin}</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {CATEGORY_INFO[material.category].label}・{color.name}
          </p>
        </div>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon-sm" onClick={() => duplicateStem(stem.id)} aria-label="複製" />}
            >
              <Copy />
            </TooltipTrigger>
            <TooltipContent>複製（D）</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon-sm" onClick={() => removeStem(stem.id)} aria-label="刪除" />}
            >
              <Trash2 className="text-destructive" />
            </TooltipTrigger>
            <TooltipContent>刪除（Delete）</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-foreground/80">顏色</span>
        <div className="flex flex-wrap gap-2">
          {material.colors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => update({ colorId: c.id })}
              className={cn(
                "flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-xs transition-colors",
                c.id === stem.colorId ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
              )}
              aria-pressed={c.id === stem.colorId}
            >
              <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-foreground/80">角色</span>
        <div className="grid grid-cols-5 gap-1">
          {ROLES.map((r) => (
            <button
              key={r ?? "none"}
              type="button"
              onClick={() => update({ role: r })}
              className={cn(
                "rounded-lg border py-1.5 text-center text-sm transition-colors",
                stem.role === r ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted",
              )}
              aria-pressed={stem.role === r}
            >
              <span className={r ? "font-heading font-semibold" : "text-xs"}>{r ? ROLE_INFO[r].label : "無"}</span>
            </button>
          ))}
        </div>
        {stem.role && <p className="text-[11px] leading-relaxed text-muted-foreground">{ROLE_INFO[stem.role].description}</p>}
      </div>

      <Field label="長度" value={`${round(stem.lengthCm)} cm`}>
        <Slider
          value={[stem.lengthCm]}
          min={minLen}
          max={maxLen}
          step={0.5}
          onValueChange={(v) => update({ lengthCm: Array.isArray(v) ? v[0] : v })}
          aria-label="長度"
        />
      </Field>

      <Field label="角度" value={describeAngle(stem.angle)}>
        <Slider
          value={[stem.angle]}
          min={-95}
          max={95}
          step={1}
          onValueChange={(v) => update({ angle: Array.isArray(v) ? v[0] : v })}
          aria-label="角度"
        />
      </Field>

      <Field label="左右位置" value={`${stem.offsetCm > 0 ? "右" : stem.offsetCm < 0 ? "左" : ""} ${Math.abs(round(stem.offsetCm, 1))} cm`}>
        <Slider
          value={[stem.offsetCm]}
          min={-half}
          max={half}
          step={0.5}
          onValueChange={(v) => update({ offsetCm: Array.isArray(v) ? v[0] : v })}
          aria-label="左右位置"
        />
      </Field>

      <Field label="彎曲" value={stem.curve === 0 ? "直" : `${stem.curve > 0 ? "右彎" : "左彎"} ${Math.abs(Math.round(stem.curve * 100))}%`}>
        <Slider
          value={[stem.curve]}
          min={-1}
          max={1}
          step={0.05}
          onValueChange={(v) => update({ curve: Array.isArray(v) ? v[0] : v })}
          aria-label="彎曲"
        />
      </Field>

      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-foreground/80">前後位置</span>
          <div className="grid grid-cols-3 gap-1">
            {DEPTHS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => update({ depth: d.value })}
                className={cn(
                  "rounded-lg border py-1.5 text-xs transition-colors",
                  stem.depth === d.value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted",
                )}
                aria-pressed={stem.depth === d.value}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <label className="flex flex-col items-center gap-1.5 text-xs font-medium text-foreground/80">
          <span className="inline-flex items-center gap-1">
            <FlipHorizontal2 className="size-3.5" /> 翻轉
          </span>
          <Switch checked={stem.flip} onCheckedChange={(checked) => update({ flip: checked })} aria-label="翻轉花頭" />
        </label>
      </div>

      <p className="rounded-lg bg-muted/70 p-2.5 text-[11px] leading-relaxed text-muted-foreground">{material.tip}</p>
    </div>
  );
}
