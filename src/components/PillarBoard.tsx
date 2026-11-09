"use client";

import { branchColor, formatPillar, stemColor } from "@/lib/bazi";
import type { BaziChart } from "@/types";

type Props = {
  chart: BaziChart;
  className?: string;
};

export function PillarBoard({ chart, className = "" }: Props) {
  const cols = [
    { key: "year", label: "年柱", p: chart.year },
    { key: "month", label: "月柱", p: chart.month },
    { key: "day", label: "日柱", p: chart.day, day: true },
    { key: "hour", label: "时柱", p: chart.hour },
  ] as const;

  return (
    <div className={`grid grid-cols-4 gap-2 ${className}`}>
      {cols.map(({ key, label, p, ...rest }) => {
        const isDay = "day" in rest && rest.day;
        return (
          <div
            key={key}
            className={`rounded-[var(--radius-sm)] px-2 py-3 text-center ${
              isDay ? "pillar-day" : "border border-[var(--line)] bg-white"
            }`}
          >
            <div className="mono-label !tracking-[0.12em]">{label}</div>
            <div
              className="display-font mt-2 text-2xl leading-none"
              style={{ color: stemColor(p.stem) }}
            >
              {p.stem}
            </div>
            <div
              className="display-font mt-2 text-2xl leading-none"
              style={{ color: branchColor(p.branch) }}
            >
              {p.branch}
            </div>
            <div className="mt-2 text-[10px] text-[var(--fg-dim)]">{formatPillar(p)}</div>
          </div>
        );
      })}
    </div>
  );
}
