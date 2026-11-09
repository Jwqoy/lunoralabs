export type VoiceGender = "male" | "female";

export type MoonTint = "silver" | "honey" | "jade";

export type FontMood = "serif" | "rounded" | "classic";

export type AppStep =
  | "landing"
  | "voice"
  | "birth"
  | "chart"
  | "chat";

export interface BirthInput {
  name: string;
  gender: "男" | "女" | "保密";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  city: string;
  /** 是否使用真太阳时近似（演示） */
  solarTimeHint: boolean;
}

export interface Pillar {
  stem: string;
  branch: string;
  label: string;
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
  createdAt: number;
}

export interface AppState {
  step: AppStep;
  voice: VoiceGender;
  tint: MoonTint;
  fontMood: FontMood;
  birth: BirthInput | null;
  chart: BaziChart | null;
  memory: MemoryHints;
  messages: ChatMessage[];
  proactiveDismissed: boolean;
}
