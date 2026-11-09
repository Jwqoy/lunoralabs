import { Solar } from "lunar-javascript";
import { CHARACTER } from "@/lib/brand";
import type { BaziChart, BirthInput, Pillar } from "@/types";

export const STEM_ELEMENT: Record<string, string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

export const BRANCH_ELEMENT: Record<string, string> = {
  寅: "木",
  卯: "木",
  巳: "火",
  午: "火",
  辰: "土",
  戌: "土",
  丑: "土",
  未: "土",
  申: "金",
  酉: "金",
  亥: "水",
  子: "水",
};

/** Muted journaling palette for 五行 */
export const ELEMENT_COLOR: Record<string, string> = {
  木: "#5F7F5A",
  火: "#B56A5A",
  土: "#A08A5C",
  金: "#6E7378",
  水: "#5A6E7A",
};

function splitGanZhi(gz: string, label: string): Pillar {
  if (!gz || gz.length < 2) {
    return { stem: "—", branch: "—", label };
  }
  return { stem: gz[0], branch: gz[1], label };
}

function summarize(dayMaster: string, element: string, gender: BirthInput["gender"]): string {
  const tone =
    gender === "女"
      ? "性情里有一份细察与坚持"
      : gender === "男"
        ? "行动里带着主见与节奏"
        : "性格底色清晰，待你慢慢核对";
  return `日主${dayMaster}（${element}）。${tone}。请逐柱核对干支是否与你惯用盘一致——确认后，${CHARACTER}才会把这盘当作专属记忆。`;
}

/**
 * 四柱排盘：节气月 + 五虎/五鼠遁，经 lunar-javascript（与常见在线排盘同源口径）。
 * 默认：公历、不启用真太阳时、日柱按库默认换日策略。
 */
export function computeChart(birth: BirthInput): BaziChart {
  const [y, m, d] = birth.date.split("-").map(Number);
  const [hh, mm] = (birth.time || "12:00").split(":").map(Number);

  const solar = Solar.fromYmdHms(y, m, d, hh || 0, mm || 0, 0);
  const eight = solar.getLunar().getEightChar();

  const year = splitGanZhi(eight.getYear(), "年柱");
  const month = splitGanZhi(eight.getMonth(), "月柱");
  const day = splitGanZhi(eight.getDay(), "日柱");
  const hour = splitGanZhi(eight.getTime(), "时柱");
  const dayMaster = day.stem;
  const element = STEM_ELEMENT[dayMaster] ?? "土";

  return {
    year,
    month,
    day,
    hour,
    dayMaster,
    element,
    summary: summarize(dayMaster, element, birth.gender),
    confirmed: false,
  };
}

export function formatPillar(p: Pillar) {
  return `${p.stem}${p.branch}`;
}

export function chartLines(chart: BaziChart) {
  return [
    `年柱 ${formatPillar(chart.year)}`,
    `月柱 ${formatPillar(chart.month)}`,
    `日柱 ${formatPillar(chart.day)}（日主${chart.dayMaster}）`,
    `时柱 ${formatPillar(chart.hour)}`,
  ];
}

export function stemColor(stem: string) {
  return ELEMENT_COLOR[STEM_ELEMENT[stem] ?? ""] ?? "#252B28";
}

export function branchColor(branch: string) {
  return ELEMENT_COLOR[BRANCH_ELEMENT[branch] ?? ""] ?? "#252B28";
}
