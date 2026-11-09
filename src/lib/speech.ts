import { CHARACTER } from "@/lib/brand";
import { PAINTING_STARTER } from "@/lib/painting";
import type { VoiceGender } from "@/types";

/** 试听缩短版——更短更顺，避免系统 TTS 长句发飘 */
export const WELCOME_LINE = `你好，我是${CHARACTER}。八字是一幅属于你的画，我们一起看看变化，以及你想不想要那样的风景。`;

/** 更短的一句话试听，音色对比更清楚 */
export const AUDITION_LINE = `你好，我是${CHARACTER}。今晚想先陪你把盘画清楚。`;

export { PAINTING_STARTER };

type RankedVoice = {
  voice: SpeechSynthesisVoice;
  score: number;
};

function scoreVoice(v: SpeechSynthesisVoice, gender: VoiceGender): number {
  const blob = `${v.name} ${v.lang}`.toLowerCase();
  let score = 0;

  // language
  if (/zh-cn|zh_cn|cmn-hans|cmn_cn/.test(blob)) score += 40;
  else if (/zh-tw|zh_tw|zh-hk|yue|cmn/.test(blob)) score += 18;
  else if (/zh|chinese|中文|普通话|國語|国语/.test(blob)) score += 28;
  else score -= 20;

  // quality hints (Chrome / Edge / macOS)
  if (/google|microsoft|azure|neural|natural|enhanced|premium|online \(natural\)|online/.test(blob)) {
    score += 35;
  }
  if (/siri|eloquence|compact|espeak|festival/.test(blob)) score -= 25;
  if (!v.localService) score += 8; // cloud/neural often non-local in Chromium

  const femaleHint =
    /female|woman|girl|ting|xiaoxiao|xiaoyi|xiaoxuan|yaoyao|huihui|meijia|mei-jia|sinji|susan|samantha|karen|moira|女|晓晓|晓伊|晓萱|瑶瑶/.test(
      blob,
    );
  const maleHint =
    /male|man|boy|yunyang|yunjian|yunxi|kangkang|liang|david|daniel|alex|fred|男|云扬|云健|云希/.test(
      blob,
    );

  if (gender === "female") {
    if (femaleHint) score += 30;
    if (maleHint) score -= 35;
    // slight preference for brighter Chinese names often female on macOS
    if (/ting-ting|tingting|mei-jia|meijia|sin-ji|sinji/.test(blob)) score += 12;
  } else {
    if (maleHint) score += 30;
    if (femaleHint) score -= 35;
    if (/yunyang|yunjian|yunxi|kangkang/.test(blob)) score += 12;
  }

  if (v.default) score += 2;
  return score;
}

function listVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

export function pickVoice(gender: VoiceGender): SpeechSynthesisVoice | null {
  const voices = listVoices();
  if (!voices.length) return null;

  const ranked: RankedVoice[] = voices
    .map((voice) => ({ voice, score: scoreVoice(voice, gender) }))
    .sort((a, b) => b.score - a.score);

  // Require at least a weak Chinese match when any zh voice exists
  const zhAny = ranked.filter((r) => /zh|cmn|chinese|中文|普通话|國語|国语/i.test(`${r.voice.lang} ${r.voice.name}`));
  const pool = zhAny.length ? zhAny : ranked;
  return pool[0]?.voice ?? null;
}

export function describeVoice(gender: VoiceGender): string {
  const v = pickVoice(gender);
  if (!v) return "系统默认音色";
  return `${v.name} · ${v.lang}`;
}

function tune(gender: VoiceGender): { rate: number; pitch: number } {
  // Keep close to 1.0 — large pitch shifts make Chinese TTS metallic
  if (gender === "female") return { rate: 0.98, pitch: 1.04 };
  return { rate: 0.95, pitch: 0.92 };
}

/** Split on Chinese punctuation so cadence feels less robotic */
function chunkText(text: string): string[] {
  const parts = text
    .split(/(?<=[。！？；…!?])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [text];
}

export function speak(
  text: string,
  gender: VoiceGender,
  onEnd?: () => void,
): { stop: () => void } {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd?.();
    return { stop: () => undefined };
  }

  window.speechSynthesis.cancel();
  const voice = pickVoice(gender);
  const { rate, pitch } = tune(gender);
  const chunks = chunkText(text);
  let i = 0;
  let stopped = false;

  const next = () => {
    if (stopped) return;
    if (i >= chunks.length) {
      onEnd?.();
      return;
    }
    const utter = new SpeechSynthesisUtterance(chunks[i++]);
    utter.lang = voice?.lang?.startsWith("zh") ? voice.lang : "zh-CN";
    utter.rate = rate;
    utter.pitch = pitch;
    if (voice) utter.voice = voice;
    utter.onend = () => {
      // tiny breath between sentences
      if (stopped) return;
      window.setTimeout(next, 90);
    };
    utter.onerror = () => {
      if (!stopped) onEnd?.();
    };
    window.speechSynthesis.speak(utter);
  };

  next();

  return {
    stop: () => {
      stopped = true;
      window.speechSynthesis.cancel();
    },
  };
}

export function warmVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
