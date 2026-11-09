import type { BaziChart } from "@/types";
import { formatPillar } from "@/lib/bazi";

/** Core product metaphor — 八字 = 属于你的一幅画 */
export const PAINTING_STARTER =
  "每个人的八字都会画出一副属于你的画。理解为什么八字准，就是理解：世界上的各种变数，会像不同的元素进入你的画面，改变你的画面。";

export const PAINTING_LENS =
  "把天干地支当成画面里的颜色与构图：问的事情若让这幅画更完整、更美，便是助益；若显得突兀、无用或可能毁掉画面，便是损耗；若会改画，我会客观描出新画面——喜不喜欢，由你定。";

export type PaintingVerdict = "beautify" | "harm" | "transform";

export interface PaintingRead {
  verdict: PaintingVerdict;
  label: string;
  canvasNow: string;
  factor: string;
  after: string;
  advice: string;
}

function baseCanvas(chart: BaziChart): string {
  return `日主${chart.dayMaster}${chart.element}作主色，年${formatPillar(chart.year)}为远景，月${formatPillar(chart.month)}为中景舞台，时${formatPillar(chart.hour)}为近处笔触。`;
}

/** Demo heuristic: map question themes to how a factor enters the painting */
export function readPainting(prompt: string, chart: BaziChart): PaintingRead {
  const canvasNow = baseCanvas(chart);

  if (/今日|宜忌|今天/.test(prompt)) {
    return {
      verdict: "beautify",
      label: "助益画面",
      canvasNow,
      factor: "「收束主线、分段表达」像稳住构图的留白与主线条",
      after: "画面更干净：主色突出，杂笔减少，远近层次清楚",
      advice: "宜一件可验收的事；忌情绪化加笔。下午再对外沟通。",
    };
  }
  if (/事业|工作|职业|升职|跳槽/.test(prompt)) {
    return {
      verdict: "transform",
      label: "改动画风",
      canvasNow,
      factor: "事业推进 / 曝光选择会改中景（月柱舞台）的密度与光源",
      after: "新画面：责任边界更硬、可见度上升；若急于曝光，主色易被杂光盖住",
      advice: "先深挖边界、连做七日小目标；再决定要不要更亮的灯光。喜不喜欢这版「更醒目」的画，由你定。",
    };
  }
  if (/心事|情绪|安顿|心绪|焦虑/.test(prompt)) {
    return {
      verdict: "harm",
      label: "慎入杂笔",
      canvasNow,
      factor: "未消化的情绪像未干的颜料叠涂，容易糊掉日主主色",
      after: "若不降温：近处笔触发糊，整体可读性下降",
      advice: "先留白 15 分钟或短倾诉——这是修复画面，不是逃避。",
    };
  }
  if (/我是谁|性格|日主/.test(prompt)) {
    return {
      verdict: "beautify",
      label: "看清主色",
      canvasNow,
      factor: "认识日主 = 辨认这幅画真正的主色，而不是别人看到的月柱外壳",
      after: "画面解释力变强：你知道哪一笔是自己，哪一笔是角色",
      advice: "决策时先问：这是在护主色，还是只在装修外壳？",
    };
  }
  return {
    verdict: "transform",
    label: "观察入画",
    canvasNow,
    factor: "你问的这件事，会作为新元素进入画面",
    after: "可能更美、可能改风格、也可能干扰主色——需对照日主与月令再定",
    advice: "把问题压成一个动作，看它是补笔、改风，还是污点。切分析模式可展开排盘图。",
  };
}

export function chatFromPainting(read: PaintingRead, chart: BaziChart): string {
  const tag =
    read.verdict === "beautify"
      ? "好事 · 让画更美"
      : read.verdict === "harm"
        ? "损耗 · 易毁画面"
        : "改画 · 新画面如下";
  return `画面判断：${tag}\n${read.factor}。→ ${read.after}\n预测：${read.advice}（日主${chart.dayMaster}${chart.element}）`;
}

export function analysisFromPainting(
  prompt: string,
  chart: BaziChart,
  read: PaintingRead,
  extras: {
    lines: string;
    top: string;
    low: string;
    relationTitles: string;
    memBits: string;
  },
): string {
  const dayunHint =
    "大运像长时间的光向与滤镜：不改你的主色配方，但会改整幅画被看见的方式；流年则是这一季新落入的颜料。";

  let topic = "";
  if (/今日|宜忌|今天/.test(prompt)) {
    topic = "今日因子偏「短期笔触」：影响近处，不重画远景。";
  } else if (/事业|工作|职业/.test(prompt)) {
    topic = "事业因子多落在月令中景与财官相关笔法：改的是舞台，不只是心情。";
  } else if (/心事|情绪|安顿|心绪/.test(prompt)) {
    topic = "心事因子先碰日主主色的清晰度：主色糊了，再好的中景也看不清。";
  } else if (/我是谁|性格|日主/.test(prompt)) {
    topic = "性格议题是认画：先分清主色 / 外壳 / 远景，再谈要不要改。";
  } else {
    topic = "综合议题：先定这个因子对画面是补笔、改风，还是风险。";
  }

  const parts = [
    `【分析模式 · 以画观盘】`,
    PAINTING_STARTER,
    "",
    `你的底画：${read.canvasNow}`,
    `四柱：${extras.lines}`,
    "",
    `入画因子：${read.factor}`,
    `画面走向（${read.label}）：${read.after}`,
    topic,
    dayunHint,
    "",
    `五行势能（演示）：偏旺 ${extras.top}；偏弱 ${extras.low}。`,
    `结合点：${extras.relationTitles}。下方排盘图与五行图，是把「画」拆成可检视的笔触。`,
    `给你的预测：${read.advice}`,
    `若画面被改写——喜不喜欢这幅新画，由你决定这件事对你好不好。`,
  ];

  if (extras.memBits) {
    parts.push("", `记忆线索：${extras.memBits}。`);
  }
  parts.push("", "【演示解读】画面隐喻 + 图工具为 Demo1 示意，非正式命理终审。");
  return parts.join("\n");
}
