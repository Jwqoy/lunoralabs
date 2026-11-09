import { CHARACTER } from "@/lib/brand";
import { PAINTING_STARTER } from "@/lib/painting";
import type { VoiceGender } from "@/types";

/** 试听用缩短版；完整开场白见 PAINTING_STARTER / greetingMessage */
export const WELCOME_LINE = `你好，我是${CHARACTER}。每个人的八字，都可以画成一幅属于自己的画。我们一起看看，你关心的事会怎样改变这幅画，以及新风景是否是你想要的生活。`;

export { PAINTING_STARTER };

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
