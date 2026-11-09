import { CHARACTER } from "@/lib/brand";
import type { BaziChart, BirthInput, Pillar } from "@/types";

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
] as const;

const STEM_ELEMENT: Record<string, string> = {
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

const HOUR_BRANCH: { start: number; branch: (typeof BRANCHES)[number] }[] = [
  { start: 23, branch: "子" },
  { start: 1, branch: "丑" },
  { start: 3, branch: "寅" },
  { start: 5, branch: "卯" },
  { start: 7, branch: "辰" },
  { start: 9, branch: "巳" },
  { start: 11, branch: "午" },
  { start: 13, branch: "未" },
  { start: 15, branch: "申" },
  { start: 17, branch: "酉" },
  { start: 19, branch: "戌" },
  { start: 21, branch: "亥" },
];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/** Gregorian → approximate Chinese sexagenary year index (Demo 用近似历法) */
function yearPillar(year: number, month: number, day: number): Pillar {
  // 立春前仍属上一年：演示以 2 月 4 日为界
  let y = year;
  if (month < 2 || (month === 2 && day < 4)) y -= 1;
  const stem = STEMS[mod(y - 4, 10)];
  const branch = BRANCHES[mod(y - 4, 12)];
  return { stem, branch, label: "年柱" };
}

function monthPillar(year: number, month: number, day: number): Pillar {
  // 简化节气月：以公历月近似，寅月起于立春附近
  let solarMonth = month;
  if (day < 6) solarMonth = month === 1 ? 12 : month - 1;
  const branch = BRANCHES[mod(solarMonth + 1, 12)]; // 寅=2 月附近
  const yearStemIdx = STEMS.indexOf(yearPillar(year, month, day).stem as (typeof STEMS)[number]);
  // 五虎遁：甲己之年丙作首
  const monthStemStart = [2, 4, 6, 8, 0][yearStemIdx % 5];
  const monthIdx = mod(solarMonth - 2, 12);
  const stem = STEMS[mod(monthStemStart + monthIdx, 10)];
  return { stem, branch, label: "月柱" };
}

/** Day pillar from JDN offset vs known anchor 甲子日 */
function dayPillar(year: number, month: number, day: number): Pillar {
  const jdn = gregorianToJdn(year, month, day);
  // Anchor: 2000-01-01 ≈ 戊午；用固定偏移演示
  const offset = jdn - 2451545; // 2000-01-01 JDN
  // 2000-01-01 = 戊午 → stem 4 (戊), branch 6 (午)
  const stem = STEMS[mod(4 + offset, 10)];
  const branch = BRANCHES[mod(6 + offset, 12)];
  return { stem, branch, label: "日柱" };
}

function hourPillar(dayStem: string, hour: number, minute: number): Pillar {
  const h = minute >= 0 ? hour : hour;
  let branch: (typeof BRANCHES)[number] = "子";
  if (h === 23 || h === 0) branch = "子";
  else {
    for (let i = HOUR_BRANCH.length - 1; i >= 0; i--) {
      if (h >= HOUR_BRANCH[i].start) {
        branch = HOUR_BRANCH[i].branch;
        break;
      }
    }
  }
  const dayStemIdx = STEMS.indexOf(dayStem as (typeof STEMS)[number]);
  // 五鼠遁：甲己还加甲
  const hourStemStart = [0, 2, 4, 6, 8][dayStemIdx % 5];
  const branchIdx = BRANCHES.indexOf(branch);
  const stem = STEMS[mod(hourStemStart + branchIdx, 10)];
  return { stem, branch, label: "时柱" };
}

function gregorianToJdn(year: number, month: number, day: number) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
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

export function computeChart(birth: BirthInput): BaziChart {
  const [y, m, d] = birth.date.split("-").map(Number);
  const [hh, mm] = birth.time.split(":").map(Number);
  const year = yearPillar(y, m, d);
  const month = monthPillar(y, m, d);
  const day = dayPillar(y, m, d);
  const hour = hourPillar(day.stem, hh, mm || 0);
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
