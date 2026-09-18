"use client";

import { Check, CircleDashed } from "lucide-react";
import { critique } from "@/lib/ikebana/evaluate";
import { useStudioStore } from "@/lib/ikebana/store";
import type { RuleResult, Vase } from "@/lib/ikebana/types";
import { cn } from "@/lib/utils";

export function RuleList({ results, compact = false }: { results: RuleResult[]; compact?: boolean }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {results.map((r) => (
        <li
          key={r.id}
          className={cn(
            "flex gap-2.5 rounded-lg border p-2.5 transition-colors",
            r.passed ? "border-success/30 bg-success/5" : "border-border bg-card/60",
          )}
        >
          <span
            className={cn(
              "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
              r.passed ? "bg-success text-white" : "bg-muted text-muted-foreground",
            )}
            aria-hidden
          >
            {r.passed ? <Check className="size-3" /> : <CircleDashed className="size-3" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-heading text-sm font-semibold">{r.title}</span>
              {!compact && (
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {r.score}/{r.weight}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-foreground/80">{r.message}</p>
            <p className={cn("text-[11px] leading-relaxed", r.passed ? "text-success" : "text-muted-foreground")}>
              {r.tip}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ScoreRing({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max === 0 ? 0 : value / max;
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 72 72" className="size-[72px]" aria-hidden>
        <circle cx={36} cy={36} r={r} fill="none" stroke="oklch(0.9 0.012 80)" strokeWidth={6} />
        <circle
          cx={36}
          cy={36}
          r={r}
          fill="none"
          stroke="oklch(0.5 0.145 35)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <text x={36} y={34} textAnchor="middle" fontSize={18} fontWeight={700} fill="currentColor" fontFamily="var(--font-heading)">
          {value}
        </text>
        <text x={36} y={48} textAnchor="middle" fontSize={9} fill="oklch(0.5 0.022 60)">
          / {max}
        </text>
      </svg>
      <div>
        <p className="font-heading text-xl font-semibold leading-tight">{label}</p>
        <p className="text-xs text-muted-foreground">依七項構成原則評分</p>
      </div>
    </div>
  );
}

export function CritiquePanel({ vase }: { vase: Vase }) {
  const stems = useStudioStore((s) => s.stems);
  const result = critique(stems, vase);
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold tracking-wide">即時評析</h3>
        <span className="text-[11px] text-muted-foreground">隨著調整即時更新</span>
      </header>
      <ScoreRing value={result.total} max={result.max} label={result.rating} />
      {stems.length === 0 ? (
        <p className="rounded-lg border border-dashed p-3 text-xs leading-relaxed text-muted-foreground">
          從左側花材庫加入第一枝花材，評析會立刻開始。建議先插一枝枝材決定高度與方向。
        </p>
      ) : (
        <RuleList results={result.results} />
      )}
    </section>
  );
}
