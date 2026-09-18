"use client";

import { Plus } from "lucide-react";
import { memo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CATEGORY_INFO, CATEGORY_ORDER, MATERIALS } from "@/lib/ikebana/materials";
import { useStudioStore } from "@/lib/ikebana/store";
import type { Category, Material } from "@/lib/ikebana/types";
import { cn } from "@/lib/utils";
import { MaterialThumb } from "./MaterialThumb";

interface MaterialPaletteProps {
  /** 課程建議的花材類別（以逗號串接），會被強調顯示 */
  highlightKey?: string | null;
  suggestedMaterialId?: string | null;
}

function MaterialCard({
  material,
  highlighted,
  suggested,
  onAdd,
}: {
  material: Material;
  highlighted: boolean;
  suggested: boolean;
  onAdd: (colorId?: string) => void;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card/80 p-2 text-left transition-all",
        "hover:-translate-y-0.5 hover:shadow-md hover:shadow-ink/5",
        highlighted ? "border-primary/40 ring-1 ring-primary/20" : "border-border",
        suggested && "bg-accent/60",
      )}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={() => onAdd()}
              className="flex flex-col items-center gap-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`加入${material.name}`}
            />
          }
        >
          <div className="relative flex h-[76px] w-full items-center justify-center rounded-lg bg-gradient-to-b from-white/70 to-muted/60">
            <MaterialThumb material={material} size={74} />
            <span className="absolute right-1.5 top-1.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow transition-opacity group-hover:opacity-100">
              <Plus className="size-3" />
            </span>
          </div>
          <div className="flex w-full flex-col items-start px-0.5 pt-1.5">
            <span className="font-heading text-[15px] font-medium leading-none">{material.name}</span>
            <span className="mt-1 truncate text-[10px] tracking-wide text-muted-foreground">{material.latin}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-56 text-left leading-relaxed">
          {material.tip}
        </TooltipContent>
      </Tooltip>
      <div className="mt-1.5 flex items-center gap-1 px-0.5">
        {material.colors.map((c) => (
          <Tooltip key={c.id}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(c.id);
                  }}
                  className="size-4 rounded-full border border-black/10 shadow-sm ring-offset-1 transition-transform hover:scale-125 focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ backgroundColor: c.hex }}
                  aria-label={`加入${c.name}${material.name}`}
                />
              }
            />
            <TooltipContent side="bottom">{c.name}</TooltipContent>
          </Tooltip>
        ))}
        {suggested && (
          <span className="ml-auto rounded-full bg-moss px-1.5 py-0.5 text-[10px] font-medium text-moss-foreground">
            建議
          </span>
        )}
      </div>
    </div>
  );
}

function MaterialPaletteInner({ highlightKey, suggestedMaterialId }: MaterialPaletteProps) {
  const addStem = useStudioStore((s) => s.addStem);
  const highlightCategories = (highlightKey ? highlightKey.split(",") : []) as Category[];

  return (
    <div className="flex flex-col gap-5">
      {CATEGORY_ORDER.map((category) => {
        const info = CATEGORY_INFO[category];
        const items = MATERIALS.filter((m) => m.category === category);
        const highlighted = highlightCategories.includes(category);
        return (
          <section key={category} className="flex flex-col gap-2">
            <header className="flex flex-col gap-0.5 px-0.5">
              <h3 className="font-heading text-sm font-semibold tracking-wide">{info.label}</h3>
              <p className="text-[11px] leading-snug text-muted-foreground">{info.description}</p>
            </header>
            <div className="grid grid-cols-2 gap-2">
              {items.map((m) => (
                <MaterialCard
                  key={m.id}
                  material={m}
                  highlighted={highlighted}
                  suggested={m.id === suggestedMaterialId}
                  onAdd={(colorId) => addStem(m.id, colorId)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export const MaterialPalette = memo(MaterialPaletteInner);
