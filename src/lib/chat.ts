import { CHARACTER } from "@/lib/brand";
import { chartLines, formatPillar } from "@/lib/bazi";
import type { BaziChart, ChatMessage, MemoryHints } from "@/types";

const DEMO = true;

function stamp(text: string, role: ChatMessage["role"], demoLabel = false): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    demoLabel,
    createdAt: Date.now(),
  };
}

export function greetingMessage(chart: BaziChart): ChatMessage {
  return stamp(
    `盘已确认。年${formatPillar(chart.year)} · 月${formatPillar(chart.month)} · 日${formatPillar(chart.day)} · 时${formatPillar(chart.hour)}。我是你的${CHARACTER}，事业和心事都可以问我。`,
    "moon",
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

export function answerQuestion(
  prompt: string,
  chart: BaziChart,
  memory: MemoryHints,
): { message: ChatMessage; memory: MemoryHints } {
  const lines = chartLines(chart).join("；");
  const memBits = [
    memory.career && `事业线索：${memory.career}`,
    memory.cares && `在意：${memory.cares}`,
    memory.identity && `身份：${memory.identity}`,
  ]
    .filter(Boolean)
    .join("。");

  let body = "";
  if (/今日|宜忌|今天/.test(prompt)) {
    body = `以日主${chart.dayMaster}（${chart.element}）看今日：宜稳住主线、少开多线；忌情绪化拍板。时柱${formatPillar(chart.hour)}提示作息与表达节奏——上午想清楚，下午再推进。`;
  } else if (/事业|工作|职业/.test(prompt)) {
    body = `日主${chart.dayMaster}偏重「把一件事做成」的质感。月柱${formatPillar(chart.month)}像你当前的舞台：先对齐责任边界，再谈曝光。近一步：选一个可验证的小目标，连续做满七日。`;
  } else if (/心事|情绪|安顿|心绪/.test(prompt)) {
    body = `心事不必一次说透。从盘上看，${chart.element}日主需要「有容器的倾诉」——写下来、或跟信任的人短聊十分钟，比硬扛更贴你。今晚给自己一个不评判的空白时段。`;
  } else if (/我是谁|性格|日主/.test(prompt)) {
    body = `你是${chart.dayMaster}${chart.element}日主：核心动力来自${chart.element}的气质。四柱 ${lines}。别人看到的你，往往是月柱外在；真正做决定的，是日主这份底色。`;
  } else {
    body = `围绕你的本命盘（${lines}）来看：先把问题拆成「事实 / 感受 / 下一步」三层。我可以陪你慢慢收束到一个可执行的小动作。`;
  }

  if (memBits) {
    body += `\n\n（记得你曾提到：${memBits}。）`;
  }

  if (DEMO) {
    body += `\n\n【演示解读】此为 Demo1 结构化话术，非完整命理引擎结论。正式版将以更深八字理论为准。`;
  }

  return {
    message: stamp(body, "moon", true),
    memory: rememberFromPrompt(prompt, memory),
  };
}

export function userMessage(text: string): ChatMessage {
  return stamp(text, "user");
}

export const PROACTIVE_BANNER = `今日有一点「宜收敛、少争锋」的信号。点开${CHARACTER}，我可用你选的声音把问候读给你听。`;
