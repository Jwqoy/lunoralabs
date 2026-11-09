import { formatPillar } from "@/lib/bazi";
import type { BaziChart, Pillar } from "@/types";

export type Element = "木" | "火" | "土" | "金" | "水";

export const ELEMENTS: Element[] = ["木", "火", "土", "金", "水"];

const STEM_EL: Record<string, Element> = {
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

const BRANCH_EL: Record<string, Element> = {
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

/** 地支藏干（演示用简化） */
const HIDDEN_STEMS: Record<string, string[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

const SHI_SHEN: Record<string, string> = {
  同: "比肩",
  异同: "劫财",
  生我同: "偏印",
  生我异: "正印",
  我生同: "食神",
  我生异: "伤官",
  克我同: "七杀",
  克我异: "正官",
  我克同: "偏财",
  我克异: "正财",
};

const GEN: Record<Element, Element> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};
const KE: Record<Element, Element> = {
  木: "土",
  火: "金",
  土: "水",
  金: "木",
  水: "火",
};
const YANG_STEMS = new Set(["甲", "丙", "戊", "庚", "壬"]);

export interface PillarView {
  label: string;
  stem: string;
  branch: string;
  stemEl: Element;
  branchEl: Element;
  hidden: string[];
  shiShen: string;
}

export interface ElementScore {
  element: Element;
  score: number;
  pct: number;
}

export interface RelationHint {
  id: string;
  title: string;
  detail: string;
}

export interface AnalysisPack {
  pillars: PillarView[];
  elements: ElementScore[];
  relations: RelationHint[];
  dayMaster: string;
  dayElement: Element;
}

function yinYang(stem: string): "yang" | "yin" {
  return YANG_STEMS.has(stem) ? "yang" : "yin";
}

function shiShenOf(dayStem: string, otherStem: string): string {
  const a = STEM_EL[dayStem];
  const b = STEM_EL[otherStem];
  if (!a || !b) return "—";
  const samePolarity = yinYang(dayStem) === yinYang(otherStem);
  if (a === b) return samePolarity ? SHI_SHEN.同 : SHI_SHEN.异同;
  if (GEN[b] === a) return samePolarity ? SHI_SHEN.生我同 : SHI_SHEN.生我异;
  if (GEN[a] === b) return samePolarity ? SHI_SHEN.我生同 : SHI_SHEN.我生异;
  if (KE[b] === a) return samePolarity ? SHI_SHEN.克我同 : SHI_SHEN.克我异;
  if (KE[a] === b) return samePolarity ? SHI_SHEN.我克同 : SHI_SHEN.我克异;
  return "—";
}

function pillarView(label: string, p: Pillar, dayStem: string): PillarView {
  return {
    label,
    stem: p.stem,
    branch: p.branch,
    stemEl: STEM_EL[p.stem] ?? "土",
    branchEl: BRANCH_EL[p.branch] ?? "土",
    hidden: HIDDEN_STEMS[p.branch] ?? [],
    shiShen: label === "日" ? "日主" : shiShenOf(dayStem, p.stem),
  };
}

export function buildAnalysis(chart: BaziChart): AnalysisPack {
  const dayStem = chart.day.stem;
  const pillars = [
    pillarView("年", chart.year, dayStem),
    pillarView("月", chart.month, dayStem),
    pillarView("日", chart.day, dayStem),
    pillarView("时", chart.hour, dayStem),
  ];

  const raw: Record<Element, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const pv of pillars) {
    raw[pv.stemEl] += 2.2;
    raw[pv.branchEl] += 1.4;
    for (const hs of pv.hidden) {
      const el = STEM_EL[hs];
      if (el) raw[el] += 0.55;
    }
  }
  const total = ELEMENTS.reduce((s, e) => s + raw[e], 0) || 1;
  const elements: ElementScore[] = ELEMENTS.map((element) => ({
    element,
    score: Math.round(raw[element] * 10) / 10,
    pct: Math.round((raw[element] / total) * 100),
  }));

  const dayEl = STEM_EL[dayStem] ?? "土";
  const strongest = [...elements].sort((a, b) => b.score - a.score)[0];
  const weakest = [...elements].sort((a, b) => a.score - b.score)[0];

  const relations: RelationHint[] = [
    {
      id: "day",
      title: "主色 · 日主",
      detail: `${dayStem}${dayEl}是画面主色。月柱${formatPillar(chart.month)}是中景舞台，不是整幅画本身。`,
    },
    {
      id: "wx",
      title: "颜料比重",
      detail: `偏旺 ${strongest.element}（${strongest.pct}%），偏弱 ${weakest.element}（${weakest.pct}%）。数量不等于旺衰终审（知识库 C 层）。`,
    },
    {
      id: "structure",
      title: "远近构图",
      detail: `年柱${formatPillar(chart.year)}远景根基；时柱${formatPillar(chart.hour)}近处笔触与收尾。大运像长滤镜，流年是当季新颜料。`,
    },
  ];

  // 简单刑冲合会提示（演示）
  const branches = pillars.map((p) => p.branch);
  if (branches.includes("子") && branches.includes("午")) {
    relations.push({
      id: "clash",
      title: "子午冲",
      detail: "盘中见子午冲：作息 / 情绪摆动可能更明显，决策宜拆成两段验证。",
    });
  }
  if (branches.includes("卯") && branches.includes("酉")) {
    relations.push({
      id: "clash2",
      title: "卯酉冲",
      detail: "卯酉冲：对外表达与边界感容易拉扯，沟通前先写清诉求。",
    });
  }

  return {
    pillars,
    elements,
    relations,
    dayMaster: dayStem,
    dayElement: dayEl,
  };
}
