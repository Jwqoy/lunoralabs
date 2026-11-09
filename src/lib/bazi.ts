import { Solar } from "lunar-javascript";
import { CHARACTER } from "@/lib/brand";
import type {
  BaziChart,
  BirthInput,
  Pillar,
  ZiDayBoundary,
} from "@/types";

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

/** 时辰：23–01 子，01–03 丑 … 21–23 亥 */
const SHICHEN: { branch: string; label: string; startHour: number }[] = [
  { branch: "子", label: "子时", startHour: 23 },
  { branch: "丑", label: "丑时", startHour: 1 },
  { branch: "寅", label: "寅时", startHour: 3 },
  { branch: "卯", label: "卯时", startHour: 5 },
  { branch: "辰", label: "辰时", startHour: 7 },
  { branch: "巳", label: "巳时", startHour: 9 },
  { branch: "午", label: "午时", startHour: 11 },
  { branch: "未", label: "未时", startHour: 13 },
  { branch: "申", label: "申时", startHour: 15 },
  { branch: "酉", label: "酉时", startHour: 17 },
  { branch: "戌", label: "戌时", startHour: 19 },
  { branch: "亥", label: "亥时", startHour: 21 },
];

/**
 * lunar-javascript sect:
 * 1 = 晚子时（23:00–23:59）日柱算次日 —— 与问真八字默认口径一致
 * 2 = 晚子时日柱仍算当日
 */
export function sectFromBoundary(boundary: ZiDayBoundary = "late-zi"): number {
  return boundary === "midnight" ? 2 : 1;
}

export function shichenOf(hour: number, minute = 0): { branch: string; label: string } {
  const h = hour + minute / 60;
  if (h >= 23 || h < 1) return { branch: "子", label: "子时" };
  const slot = SHICHEN.find((s) => s.startHour !== 23 && h >= s.startHour && h < s.startHour + 2);
  return slot ? { branch: slot.branch, label: slot.label } : { branch: "子", label: "子时" };
}

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
 * 四柱排盘：节气月 + 五虎/五鼠遁（lunar-javascript）。
 * 默认对齐问真：公历、节气定月、晚子时换日；真太阳时尚未按经纬度校正。
 */
export function computeChart(birth: BirthInput): BaziChart {
  const [y, m, d] = birth.date.split("-").map(Number);
  const [hh, mm] = (birth.time || "12:00").split(":").map(Number);
  const hour = hh || 0;
  const minute = mm || 0;
  const boundary = birth.ziDayBoundary ?? "late-zi";
  const sect = sectFromBoundary(boundary);
  const shi = shichenOf(hour, minute);

  const solar = Solar.fromYmdHms(y, m, d, hour, minute, 0);
  const eight = solar.getLunar().getEightChar();
  eight.setSect(sect);

  const year = splitGanZhi(eight.getYear(), "年柱");
  const month = splitGanZhi(eight.getMonth(), "月柱");
  const day = splitGanZhi(eight.getDay(), "日柱");
  const hourPillar = splitGanZhi(eight.getTime(), "时柱");
  const dayMaster = day.stem;
  const element = STEM_ELEMENT[dayMaster] ?? "土";

  return {
    year,
    month,
    day,
    hour: hourPillar,
    dayMaster,
    element,
    summary: summarize(dayMaster, element, birth.gender),
    confirmed: false,
    meta: {
      calendar: "gregorian",
      ziDayBoundary: boundary,
      shichen: shi.label,
      note:
        boundary === "late-zi"
          ? "口径：节气定月 · 晚子时（23点）换日（对齐问真默认）"
          : "口径：节气定月 · 子时按午夜换日",
    },
  };
}

export function formatPillar(p: Pillar) {
  return `${p.stem}${p.branch}`;
}

export function isLateZiClock(time: string): boolean {
  const [hh] = (time || "").split(":").map(Number);
  return hh === 23;
}

/** When birth is 23:xx, show the other 子时口径 so user can match 问真/习惯盘. */
export function alternateBoundaryPreview(birth: BirthInput): {
  boundary: ZiDayBoundary;
  label: string;
  day: string;
  hour: string;
} | null {
  if (!isLateZiClock(birth.time)) return null;
  const current = birth.ziDayBoundary ?? "late-zi";
  const other: ZiDayBoundary = current === "late-zi" ? "midnight" : "late-zi";
  const alt = computeChart({ ...birth, ziDayBoundary: other });
  return {
    boundary: other,
    label: other === "late-zi" ? "晚子时换日" : "午夜换日",
    day: formatPillar(alt.day),
    hour: formatPillar(alt.hour),
  };
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
