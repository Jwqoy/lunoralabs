import type { BaziChart } from "@/types";
import { formatPillar } from "@/lib/bazi";

/** Lunora 画面式八字解读 — Bot 开场白 */
export const PAINTING_STARTER =
  "每个人的八字，都可以画成一幅属于自己的画。天干地支构成画中的底色与景物，大运流年如同不断变化的季节与天气，而你遇到的人、机会与选择，会成为进入画面的新元素。我们一起看看，你关心的这件事可能怎样改变这幅画，以及改变后的风景，是否是你想要的生活。";

/** 核心理念短述（UI / TTS 可用） */
export const PAINTING_CORE =
  "八字是一幅不断与外界发生互动的画。分析一件事，就是看它会给这幅画带来什么变化，以及这种变化是否符合画中人的愿望。";

export const PAINTING_LENS =
  "这里的「美」不只指平衡或安稳——有人要宁静，有人要生长，有人愿乘风浪换更广阔的空间。所以分析把两件事分开：画面可能怎样改变，以及你是否想要这样的改变。";

export const PAINTING_BOUNDARY =
  "画面是帮助理解传统命理关系的比喻，不是八字预测准确性的证明。";

export type PaintingShift = "expand" | "cost" | "theme";

export interface PaintingRead {
  shift: PaintingShift;
  /** 原局画面（简洁意象 + 依据） */
  canvasNow: string;
  /** 进入画面的元素 */
  incoming: string;
  /** 画面可能怎样变化 */
  change: string;
  /** 机会 / 帮助 */
  help: string;
  /** 张力 / 代价 */
  cost: string;
  /** 是否符合愿望：条件式，不替用户决定 */
  desireFrame: string;
  /** 可参与的行动 */
  agency: string;
  evidence: string;
}

function baseCanvas(chart: BaziChart): string {
  return `日主${chart.dayMaster}${chart.element}是读画的主要参照（不是整个人的唯一代表）；年${formatPillar(chart.year)}为远景底色，月${formatPillar(chart.month)}为当季中景，时${formatPillar(chart.hour)}为近处笔触。`;
}

export function readPainting(prompt: string, chart: BaziChart): PaintingRead {
  const canvasNow = baseCanvas(chart);
  const evidence = `依据：四柱 ${formatPillar(chart.year)}/${formatPillar(chart.month)}/${formatPillar(chart.day)}/${formatPillar(chart.hour)}；日主${chart.dayMaster}${chart.element}（演示口径）。`;

  if (/今日|宜忌|今天/.test(prompt)) {
    return {
      shift: "expand",
      canvasNow,
      incoming: "「今日节奏与表达」作为短期天气进入近景——属流日层面的笔触，不重画远景。",
      change: "若收束主线、分段表达，近景更清晰；若情绪化加笔，主色易被杂色盖住。",
      help: "主线更可读，已有优势有机会发挥。",
      cost: "多线并行或冲动拍板，会增加画面杂乱与返工代价。",
      desireFrame:
        "若你今天想要清晰推进，这种收束通常更贴愿望；若你更需要探索与碰撞，可保留一小块试验区，但别让它盖过主色。",
      agency: "选一件可验收的事做完；对外沟通放到信息更齐的时段。观察：情绪是否在替你做决定。",
      evidence,
    };
  }

  if (/事业|工作|职业|升职|跳槽/.test(prompt)) {
    return {
      shift: "theme",
      canvasNow,
      incoming:
        "事业选择常同时带来资源、责任、竞争与可见度——不要固定标成某一种五行；先拆成这些具体元素再入画。",
      change:
        "更像把安静的庭院打开成通往外界的路：中景（月令舞台）变亮、接触面变大；主题可能从「深耕」转向「曝光」。",
      help: "机会与舞台可能增加，擅长之事更容易被看见。",
      cost: "私人节奏与稳定感可能减少；若边界未清，责任会加重画面负荷。",
      desireFrame:
        "若你想拓展事业与接触面，这种改主题值得探索；若你目前最需要休养与确定性，代价就更值得重视——我不替你决定喜不喜欢新风景。",
      agency:
        "先对齐责任边界，再谈曝光。连续七日验证一个小目标；观察资源是否真的进画，还是只增加约束。",
      evidence,
    };
  }

  if (/心事|情绪|安顿|心绪|焦虑/.test(prompt)) {
    return {
      shift: "cost",
      canvasNow,
      incoming: "未消化的情绪像未干的颜料叠涂，先碰日主主色的清晰度，再影响中景是否可读。",
      change: "若不降温：近处笔触发糊，整幅画的可读性下降；先留白，则主色重新可辨。",
      help: "短倾诉或纸面梳理，能恢复主色清晰，让后续选择有依据。",
      cost: "硬扛或一次说透所有心事，可能加剧原本的湿冷与消耗。",
      desireFrame:
        "若你此刻要的是安稳可读的内心，降温是助益；若你愿意在风浪里换洞见，也可保留有边界的表达，但别让画面彻底糊掉。",
      agency: "今晚 15 分钟不评判空白，或跟信任的人短聊十分钟。观察：身体与睡眠是否先回稳。",
      evidence,
    };
  }

  if (/我是谁|性格|日主/.test(prompt)) {
    return {
      shift: "expand",
      canvasNow,
      incoming: "「认画」本身：分清主色（日主）、外壳（月柱）、远景（年柱），不把别人看到的角色当成整个人。",
      change: "解释力变强：你知道哪一笔是自己，哪一笔是舞台角色。",
      help: "决策更贴内核，减少被外壳牵着走。",
      cost: "若只盯日主一种五行，会丢掉整幅画的季节与关系。",
      desireFrame:
        "认清结构通常符合「想更懂自己」的愿望；至于要不要改画风，仍取决于你下一阶段想要宁静、生长还是风浪。",
      agency: "下次做决定时问：这是在护主色，还是只在装修外壳？把答案写下来对照一周。",
      evidence,
    };
  }

  return {
    shift: "theme",
    canvasNow,
    incoming: "你问的这件事，会作为新元素进入画面；具体含什么资源/责任/流动，需结合你补充的现实条件。",
    change: "可能更舒展、可能加代价、也可能改主题——脱离原局与目标，不能预设永远好或坏。",
    help: "若补到受阻处或放大已有优势，画面会更舒展。",
    cost: "若加剧原有矛盾或抽走你珍视的稳定，代价会上扬。",
    desireFrame: "目标未知时我只给条件式判断：你最在意收入、自由、成长还是稳定？不同目标会改写对同一变化的评价。",
    agency: "补充你的目标与现实约束；或切分析模式看排盘图与五行关系后再定。",
    evidence,
  };
}

/** 聊天模式：短、快，仍分开「变化」与「愿望」 */
export function chatFromPainting(read: PaintingRead, chart: BaziChart): string {
  const tag =
    read.shift === "expand"
      ? "更舒展"
      : read.shift === "cost"
        ? "增代价"
        : "改主题";
  return [
    `画面变化（${tag}）：${read.change}`,
    `愿望侧：${read.desireFrame}`,
    `可做：${read.agency}`,
  ].join("\n");
}

/** 分析模式：推荐五段结构 */
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
  void prompt;
  void chart;

  const parts = [
    "【分析模式 · 画面式解读】",
    PAINTING_CORE,
    "",
    "1. 你的原局画面",
    read.canvasNow,
    `四柱 ${extras.lines}。${read.evidence}`,
    `五行势能（演示）：偏旺 ${extras.top}；偏弱 ${extras.low}。——数量统计不直接等于旺衰终审。`,
    "",
    "2. 这件事带来的元素",
    read.incoming,
    "来源需分开：命盘/岁运可计算结构 · 你提供的现实情况 · 我为解释提出的假设。",
    "",
    "3. 画面可能怎样变化",
    read.change,
    `可能的帮助：${read.help}`,
    `张力与代价：${read.cost}`,
    "合不自动等于好，冲不自动等于坏；稳定不必然适合每个人。大运如长季节，流年如当季天气。",
    `关系要点：${extras.relationTitles}。下方排盘图把「画」拆成可检视笔触。`,
    "",
    "4. 它是否符合你的愿望",
    read.desireFrame,
    "偏好决定值不值得追求，但不能用偏好掩盖现实风险。",
    "",
    "5. 你可以怎样参与改变",
    read.agency,
    "条件式：若这些条件成立，按所选传统规则可把这一阶段理解为上述变化；现实中请观察证据，并通过行动争取更贴目标的结果。",
  ];

  if (extras.memBits) {
    parts.push("", `记忆线索：${extras.memBits}。`);
  }

  parts.push("", PAINTING_BOUNDARY, "【演示解读】Demo1 示意，非正式命理终审。");
  return parts.join("\n");
}
