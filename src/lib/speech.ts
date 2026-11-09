import { CHARACTER } from "@/lib/brand";
import type { VoiceGender } from "@/types";

export const WELCOME_LINE = `你好，我是${CHARACTER}。先把八字盘核对正确，我们再慢慢聊事业和心事。`;

function pickVoice(gender: VoiceGender): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const zh = voices.filter((v) => /zh|chinese|中文|普通话|國語/i.test(`${v.lang} ${v.name}`));
  const pool = zh.length ? zh : voices;
  if (!pool.length) return null;

  const femaleHint = /female|woman|girl|ting|xiaoxiao|yaoyao|hui|mei|lisa|susan|kiki|女/i;
  const maleHint = /male|man|boy|yunyang|yunjian|kangkang|david|alex|男/i;

  const preferred =
    gender === "female"
      ? pool.find((v) => femaleHint.test(v.name)) ||
        pool.find((v) => /zh-CN|zh_CN|cmn/i.test(v.lang))
      : pool.find((v) => maleHint.test(v.name)) ||
        pool.find((v) => /zh-CN|zh_CN|cmn/i.test(v.lang));

  return preferred || pool[0];
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
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-CN";
  utter.rate = gender === "female" ? 0.96 : 0.92;
  utter.pitch = gender === "female" ? 1.08 : 0.88;
  const voice = pickVoice(gender);
  if (voice) utter.voice = voice;
  utter.onend = () => onEnd?.();
  utter.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utter);

  return {
    stop: () => window.speechSynthesis.cancel(),
  };
}

export function warmVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
