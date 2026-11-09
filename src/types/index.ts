export type VoiceGender = "male" | "female";

export type MoonTint = "silver" | "honey" | "jade";

export type FontMood = "serif" | "rounded" | "classic";

export type ReplyMode = "chat" | "analysis";

export type AppStep =
  | "landing"
  | "voice"
  | "birth"
  | "chart"
  | "chat";

/** 晚子时日柱边界：late-zi=23点换日（问真默认）；midnight=午夜换日 */
export type ZiDayBoundary = "late-zi" | "midnight";

export interface BirthInput {
  name: string;
  gender: "男" | "女" | "保密";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  city: string;
  /** 真太阳时：Demo1 仅提示，尚未按经纬度校正 */
  solarTimeHint: boolean;
  /** 子时换日口径，默认 late-zi（对齐问真） */
  ziDayBoundary?: ZiDayBoundary;
}

export interface Pillar {
  stem: string;
  branch: string;
  label: string;
}

export interface ChartMeta {
  calendar: "gregorian";
  ziDayBoundary: ZiDayBoundary;
  shichen: string;
  note: string;
}

export interface BaziChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  dayMaster: string;
  element: string;
  summary: string;
  confirmed: boolean;
  meta?: ChartMeta;
}

export interface MemoryHints {
  career: string;
  cares: string;
  identity: string;
}

export interface ChatMessage {
  id: string;
  role: "moon" | "user" | "system";
  text: string;
  demoLabel?: boolean;
  mode?: ReplyMode;
  /** Attach analysis tools only in analysis-mode replies */
  showTools?: boolean;
  createdAt: number;
}

export interface AppState {
  step: AppStep;
  voice: VoiceGender;
  tint: MoonTint;
  fontMood: FontMood;
  replyMode: ReplyMode;
  birth: BirthInput | null;
  chart: BaziChart | null;
  memory: MemoryHints;
  messages: ChatMessage[];
  proactiveDismissed: boolean;
}
