import { buildAnalysis } from "@/lib/analysis";
import { CHARACTER } from "@/lib/brand";
import { chartLines, formatPillar } from "@/lib/bazi";
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
    `盘已确认。年${formatPillar(chart.year)} · 月${formatPillar(chart.month)} · 日${formatPillar(chart.day)} · 时${formatPillar(chart.hour)}。我是${CHARACTER}——聊天模式给短预测，分析模式展开天干地支与五行图。`,
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

function chatPrediction(prompt: string, chart: BaziChart): string {
  if (/今日|宜忌|今天/.test(prompt)) {
    return `预测：今日宜「收束主线」，忌「情绪拍板」。日主${chart.dayMaster}${chart.element}，先做一件可验收的事，下午再对外沟通。`;
  }
  if (/事业|工作|职业/.test(prompt)) {
    return `预测：近程事业宜「深挖责任边界」，不宜急于曝光。日主${chart.dayMaster} × 月柱${formatPillar(chart.month)}——连续推进一个小目标 7 日。`;
  }
  if (/心事|情绪|安顿|心绪/.test(prompt)) {
    return `预测：情绪先降温再决策。${chart.element}日主适合短倾诉或纸面梳理；今晚留 15 分钟空白，不评判。`;
  }
  if (/我是谁|性格|日主/.test(prompt)) {
    return `预测底色：日主${chart.dayMaster}${chart.element}——做事看内核，不看场面。月柱是外壳，日主才是拍板的人。`;
  }
  return `预测：围绕日主${chart.dayMaster}${chart.element}，把问题压成「下一步一个动作」。需要盘理解析请切到分析模式。`;
}

function analysisWriteup(prompt: string, chart: BaziChart, memory: MemoryHints): string {
  const pack = buildAnalysis(chart);
  const lines = chartLines(chart).join("；");
  const top = [...pack.elements].sort((a, b) => b.score - a.score).slice(0, 2);
  const low = [...pack.elements].sort((a, b) => a.score - b.score)[0];

  let focus = "";
  if (/今日|宜忌|今天/.test(prompt)) {
    focus = `今日议题：用月令舞台（${formatPillar(chart.month)}）约束行动半径；时柱${formatPillar(chart.hour)}提示表达窗口——宜分段验证，忌一次押注。`;
  } else if (/事业|工作|职业/.test(prompt)) {
    focus = `事业议题：日主${pack.dayMaster}${pack.dayElement}求「做成」，月柱定可见度。优先补齐偏弱的${low.element}所代表的支持条件（人/流程/资金），再谈扩张。`;
  } else if (/心事|情绪|安顿|心绪/.test(prompt)) {
    focus = `心事议题：十神与日主关系显示你需要「有边界的倾诉」。先稳住日主，再处理外在冲克带来的波动。`;
  } else if (/我是谁|性格|日主/.test(prompt)) {
    focus = `性格议题：日柱是内核，月柱是角色，年柱是底盘，时柱是收尾风格。别人看到的多半是月柱，不是日主。`;
  } else {
    focus = `综合议题：先读排盘图与五行势能，再落到一个可执行动作。`;
  }

  const memBits = [
    memory.career && `事业：${memory.career}`,
    memory.cares && `在意：${memory.cares}`,
    memory.identity && `身份：${memory.identity}`,
  ]
    .filter(Boolean)
    .join("；");

  let body = [
    `【分析模式】围绕四柱 ${lines}`,
    "",
    focus,
    "",
    `五行读数（演示）：偏旺 ${top.map((t) => `${t.element}${t.pct}%`).join(" / ")}；需留意偏弱 ${low.element}${low.pct}%。`,
    `关系要点：${pack.relations.map((r) => r.title).join(" · ")}。下方附天干地支排盘图与五行图工具。`,
  ].join("\n");

  if (memBits) body += `\n\n记忆线索：${memBits}。`;
  if (DEMO) {
    body += `\n\n【演示解读】结构化分析 + 图工具为 Demo1 示意，非正式命理引擎终审。`;
  }
  return body;
}

export function answerQuestion(
  prompt: string,
  chart: BaziChart,
  memory: MemoryHints,
  mode: ReplyMode,
): { message: ChatMessage; memory: MemoryHints } {
  const text =
    mode === "chat"
      ? `${chatPrediction(prompt, chart)}${
          DEMO ? "\n\n【演示】聊天模式 · 短预测" : ""
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

export const PROACTIVE_BANNER = `今日有一点「宜收敛、少争锋」的信号。点开${CHARACTER}，我可用你选的声音把问候读给你听。`;
