import type { AppState } from "@/types";

const KEY = "lunora-demo1-state-v5";

export const defaultState = (): AppState => ({
  step: "landing",
  voice: "female",
  tint: "honey",
  fontMood: "classic",
  replyMode: "chat",
  birth: null,
  chart: null,
  memory: { career: "", cares: "", identity: "" },
  messages: [],
  proactiveDismissed: false,
});

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) } as AppState;
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
