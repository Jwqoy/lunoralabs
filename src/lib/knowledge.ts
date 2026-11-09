/**
 * Demo1 runtime notes distilled from Lunora 八字命理知识体系 v1.0
 * Full bank: docs/knowledge/lunora-bazi-knowledge-bank-v1.md (Project store)
 */

export const KNOWLEDGE_VERSION = "1.0";

/** A 可复算 / B 流派选项 / C 传统解释 — Demo 文案必须守边界 */
export const LAYER_NOTE =
  "排盘属可复算事实；喜忌与应期属传统解释，须标明前提，不作必然预言。";

export const INTERPRETATION_BOUNDARIES = [
  "不把神煞、用神或岁运组合写成必然事件",
  "六亲 / 感情 / 健康仅作传统象义，不替代现实关系或医疗判断",
  "数值五行评分是规则模型输出，不等于可测量能量或准确率",
] as const;
