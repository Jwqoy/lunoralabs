"use client";

import { buildAnalysis, type Element } from "@/lib/analysis";
import { ELEMENT_COLOR } from "@/lib/bazi";
import type { BaziChart } from "@/types";

const EL_COLOR = ELEMENT_COLOR as Record<Element, string>;

type Props = {
  chart: BaziChart;
};

export function BaziTools({ chart }: Props) {
  const pack = buildAnalysis(chart);
  const maxPct = Math.max(...pack.elements.map((e) => e.pct), 1);

  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg)] p-3">
        <div className="flex items-center justify-between">
          <p className="mono-label">天干地支 · 排盘图 · 画的笔触</p>
          <p className="text-[10px] text-[var(--fg-dim)]">
            日主 {pack.dayMaster}
            {pack.dayElement}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {pack.pillars.map((p) => (
            <div
              key={p.label}
              className="rounded-[var(--radius-sm)] border border-[var(--line)] px-1.5 py-2 text-center"
            >
              <div className="mono-label !tracking-[0.1em]">{p.label}</div>
              <div
                className="display-font mt-1 text-xl leading-none"
                style={{ color: EL_COLOR[p.stemEl] }}
              >
                {p.stem}
              </div>
              <div
                className="display-font mt-1 text-xl leading-none text-[var(--fg)]"
                style={{ color: EL_COLOR[p.branchEl] }}
              >
                {p.branch}
              </div>
              <div className="mt-2 text-[10px] text-[var(--fg-dim)]">{p.shiShen}</div>
              <div className="mt-1 text-[9px] leading-4 text-[var(--fg-dim)]">
                藏 {p.hidden.join("")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg)] p-3">
        <p className="mono-label">五行势能 · 颜料比重</p>
        <div className="mt-3 space-y-2">
          {pack.elements.map((e) => (
            <div key={e.element} className="flex items-center gap-2">
              <span className="w-6 text-xs text-[var(--fg-muted)]">{e.element}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--bg-soft)]">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${(e.pct / maxPct) * 100}%`,
                    background: EL_COLOR[e.element],
                  }}
                />
              </div>
              <span className="w-10 text-right font-[family-name:var(--font-space-grotesk)] text-[11px] text-[var(--fg-dim)]">
                {e.pct}%
              </span>
            </div>
          ))}
        </div>
        {/* Simple generation cycle strip */}
        <div className="mt-4 flex items-center justify-between gap-1 border-t border-[var(--line)] pt-3 text-[10px] text-[var(--fg-dim)]">
          {(["木", "火", "土", "金", "水"] as Element[]).map((el, i, arr) => (
            <span key={el} className="flex items-center gap-1">
              <span style={{ color: EL_COLOR[el] }}>{el}</span>
              {i < arr.length - 1 ? <span className="text-[var(--fg-dim)]">→</span> : null}
            </span>
          ))}
          <span className="text-[var(--fg-dim)]">相生</span>
        </div>
      </div>

      <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg)] p-3">
        <p className="mono-label">关系工具 · 构图张力</p>
        <ul className="mt-2 space-y-2">
          {pack.relations.map((r) => (
            <li key={r.id} className="text-xs leading-5 text-[var(--fg-muted)]">
              <span className="text-[var(--fg)]">{r.title}</span>
              <span className="text-[var(--fg-dim)]"> · </span>
              {r.detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
