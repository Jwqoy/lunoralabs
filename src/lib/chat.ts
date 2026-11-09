import { buildAnalysis } from "@/lib/analysis";
import { CHARACTER } from "@/lib/brand";
import { chartLines, formatPillar } from "@/lib/bazi";
import { INTERPRETATION_BOUNDARIES, LAYER_NOTE } from "@/lib/knowledge";
import {
  PAINTING_BOUNDARY,
  PAINTING_CORE,
  PAINTING_LENS,
  PAINTING_STARTER,
  analysisFromPainting,
  chatFromPainting,
  readPainting,
} from "@/lib/painting";
import type { BaziChart, ChatMessage, MemoryHints, ReplyMode } from "@/types";

const DEMO = true;

function stamp(
  text: string,
  role: ChatMessage["role"],
  extra: Partial<ChatMessage> = {},
): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    createdAt: Date.now(),
    ...extra,
  };
}

export function greetingMessage(chart: BaziChart): ChatMessage {
  return stamp(
    [
      PAINTING_STARTER,
      "",
      PAINTING_CORE,
      PAINTING_LENS,
      "",
      `盘已确认：年${formatPillar(chart.year)} · 月${formatPillar(chart.month)} · 日${formatPillar(chart.day)} · 时${formatPillar(chart.hour)}。我是${CHARACTER}。`,
      "聊天模式给短预测；分析模式按「原局画面 → 入画元素 → 变化 → 愿望 → 行动」展开，并附排盘图工具。",
      PAINTING_BOUNDARY,
    ].join("\n"),
    "moon",
    { mode: "chat" },
  );
}

export const SHORTCUTS = [
  { id: "today", label: "今日宜忌", prompt: "根据我的八字，今天宜忌大概怎么看？" },
  { id: "career", label: "事业一问", prompt: "结合日主，最近事业上我该注意什么？" },
  { id: "heart", label: "心事一问", prompt: "我最近有点心绪不稳，从盘上看该怎么安顿自己？" },
  { id: "who", label: "我是谁", prompt: "用通俗的话讲讲我的日主性格底色。" },
] as const;

function rememberFromPrompt(prompt: string, memory: MemoryHints): MemoryHints {
  const next = { ...memory };
  if (/事业|工作|职业|升职|跳槽/.test(prompt) && !next.career) {
    next.career = "关注事业节奏与表达时机";
  }
  if (/心事|情绪|不安|焦虑|关系|感情/.test(prompt) && !next.cares) {
    next.cares = "在意情绪安顿与亲近关系";
  }
  if (/我是谁|性格|身份|日主/.test(prompt) && !next.identity) {
    next.identity = "在意自我定位与长期方向";
  }
  return next;
}

function analysisWriteup(prompt: string, chart: BaziChart, memory: MemoryHints): string {
  const pack = buildAnalysis(chart);
  const read = readPainting(prompt, chart);
  const lines = chartLines(chart).join("；");
  const top = [...pack.elements].sort((a, b) => b.score - a.score).slice(0, 2);
  const low = [...pack.elements].sort((a, b) => a.score - b.score)[0];
  const memBits = [
    memory.career && `事业：${memory.career}`,
    memory.cares && `在意：${memory.cares}`,
    memory.identity && `身份：${memory.identity}`,
  ]
    .filter(Boolean)
    .join("；");

  let body = analysisFromPainting(prompt, chart, read, {
    lines,
    top: top.map((t) => `${t.element}${t.pct}%`).join(" / "),
    low: `${low.element}${low.pct}%`,
    relationTitles: pack.relations.map((r) => r.title).join(" · "),
    memBits,
  });

  body += `\n\n${LAYER_NOTE}`;
  if (DEMO) {
    body += `\n边界：${INTERPRETATION_BOUNDARIES[0]}`;
  }
  return body;
}

export function answerQuestion(
  prompt: string,
  chart: BaziChart,
  memory: MemoryHints,
  mode: ReplyMode,
): { message: ChatMessage; memory: MemoryHints } {
  const read = readPainting(prompt, chart);
  const text =
    mode === "chat"
      ? `${chatFromPainting(read, chart)}${
          DEMO ? "\n\n【演示】聊天模式 · 变化与愿望分开" : ""
        }`
      : analysisWriteup(prompt, chart, memory);

  return {
    message: stamp(text, "moon", {
      demoLabel: true,
      mode,
      showTools: mode === "analysis",
    }),
    memory: rememberFromPrompt(prompt, memory),
  };
}

export function userMessage(text: string, mode: ReplyMode): ChatMessage {
  return stamp(text, "user", { mode });
}

export const PROACTIVE_BANNER = `今日天气偏「宜留白、少争锋」——像给画面一点呼吸。点开${CHARACTER}，可用你选的声音播报问候。`;
