"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { MoonPet } from "@/components/MoonPet";
import { CHARACTER, CHARACTER_EN, COMPANY, PRODUCT } from "@/lib/brand";
import { computeChart, formatPillar } from "@/lib/bazi";
import {
  SHORTCUTS,
  PROACTIVE_BANNER,
  answerQuestion,
  greetingMessage,
  userMessage,
} from "@/lib/chat";
import { WELCOME_LINE, speak, warmVoices } from "@/lib/speech";
import { clearState, defaultState, loadState, saveState } from "@/lib/store";
import type {
  AppState,
  BirthInput,
  FontMood,
  MoonTint,
  VoiceGender,
} from "@/types";

const emptyBirth: BirthInput = {
  name: "",
  gender: "保密",
  date: "1995-08-18",
  time: "09:30",
  city: "上海",
  solarTimeHint: true,
};

export function DemoApp() {
  const [state, setState] = useState<AppState | null>(null);
  const [birthDraft, setBirthDraft] = useState<BirthInput>(emptyBirth);
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(true);
  const [, startTransition] = useTransition();
  const stopRef = useRef<(() => void) | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    if (loaded.birth) setBirthDraft(loaded.birth);
    warmVoices();
  }, []);

  useEffect(() => {
    if (!state) return;
    saveState(state);
  }, [state]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state?.messages.length, widgetOpen]);

  const tint = state?.tint ?? "silver";
  const fontMood = state?.fontMood ?? "serif";

  const patch = (partial: Partial<AppState>) => {
    setState((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  const play = (text: string, voice?: VoiceGender) => {
    if (!state) return;
    stopRef.current?.();
    setSpeaking(true);
    const handle = speak(text, voice ?? state.voice, () => setSpeaking(false));
    stopRef.current = handle.stop;
  };

  const stopSpeak = () => {
    stopRef.current?.();
    setSpeaking(false);
  };

  const resetAll = () => {
    stopSpeak();
    clearState();
    const fresh = defaultState();
    setState(fresh);
    setBirthDraft(emptyBirth);
    setSettingsOpen(false);
    setWidgetOpen(true);
  };

  const onConfirmChart = () => {
    if (!state?.chart || !state.birth) return;
    const confirmed = { ...state.chart, confirmed: true };
    const greet = greetingMessage(confirmed);
    patch({
      chart: confirmed,
      step: "chat",
      messages: [greet],
    });
    play(greet.text);
  };

  const sendPrompt = (prompt: string) => {
    if (!state?.chart?.confirmed) return;
    const trimmed = prompt.trim();
    if (!trimmed) return;
    startTransition(() => {
      const user = userMessage(trimmed);
      const { message, memory } = answerQuestion(trimmed, state.chart!, state.memory);
      patch({
        messages: [...state.messages, user, message],
        memory,
      });
      setInput("");
    });
  };

  const pillars = useMemo(() => {
    if (!state?.chart) return [];
    const c = state.chart;
    return [
      { label: "年", p: c.year },
      { label: "月", p: c.month },
      { label: "日", p: c.day },
      { label: "时", p: c.hour },
    ];
  }, [state?.chart]);

  if (!state) {
    return (
      <div className="sky flex min-h-dvh items-center justify-center text-sm text-[var(--mist)]">
        {CHARACTER}正在醒来…
      </div>
    );
  }

  return (
    <div
      className="sky"
      data-tint={tint}
      data-font={fontMood}
      lang="zh-CN"
    >
      {state.step === "landing" && (
        <section className="relative flex min-h-dvh flex-col justify-end px-6 pb-16 pt-10 sm:justify-center sm:pb-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-[-10%] top-[-5%] h-[70vh] w-[70vh] max-w-none">
              <MoonPet size={420} className="h-full w-full opacity-90" />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl rise">
            <p className="mb-3 text-sm tracking-[0.28em] text-[var(--mist)]">
              {COMPANY}
            </p>
            <h1 className="display-font text-5xl leading-tight tracking-wide text-[var(--moon)] sm:text-6xl">
              {PRODUCT}
            </h1>
            <p className="mt-3 display-font text-2xl text-[var(--accent)] rise rise-delay-1">
              {CHARACTER}
              <span className="ml-2 text-base tracking-wide text-[var(--mist)]">/ {CHARACTER_EN}</span>
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--mist)] rise rise-delay-1">
              浮在手边的八字聊天宠物。先锁定正确八字，再慢慢聊事业与心事。
            </p>
            <div className="mt-8 flex flex-wrap gap-3 rise rise-delay-2">
              <button
                type="button"
                className="btn-primary rounded-xl px-6 py-3 text-sm"
                onClick={() => patch({ step: "voice" })}
              >
                开始认识{CHARACTER}
              </button>
              <button
                type="button"
                className="btn-ghost rounded-xl px-5 py-3 text-sm"
                onClick={() => {
                  patch({ step: "birth" });
                }}
              >
                跳过声音，先排盘
              </button>
            </div>
          </div>
        </section>
      )}

      {state.step === "voice" && (
        <section className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-12">
          <div className="rise text-center">
            <MoonPet size={120} className="mx-auto" />
            <h2 className="display-font mt-4 text-3xl">先听一听{CHARACTER}的声音</h2>
            <p className="mt-2 text-sm text-[var(--mist)]">
              同一句欢迎语，可选男声或女声；角色都是{CHARACTER}（{CHARACTER_EN}）。可跳过，之后在设置里随时更换。
            </p>
          </div>
          <div className="panel mt-8 space-y-4 rounded-2xl p-5 rise rise-delay-1">
            <p className="text-sm leading-relaxed text-[var(--glow)]">
              「{WELCOME_LINE}」
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["female", "女声"],
                  ["male", "男声"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`rounded-xl px-3 py-3 text-sm ${
                    state.voice === value
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                  onClick={() => {
                    patch({ voice: value });
                    play(WELCOME_LINE, value);
                  }}
                >
                  试听{label}
                </button>
              ))}
            </div>
            {speaking ? (
              <button
                type="button"
                className="btn-ghost w-full rounded-xl py-2 text-xs"
                onClick={stopSpeak}
              >
                停止播放
              </button>
            ) : null}
          </div>
          <div className="mt-6 flex gap-3 rise rise-delay-2">
            <button
              type="button"
              className="btn-ghost flex-1 rounded-xl py-3 text-sm"
              onClick={() => patch({ step: "birth" })}
            >
              跳过
            </button>
            <button
              type="button"
              className="btn-primary flex-1 rounded-xl py-3 text-sm"
              onClick={() => patch({ step: "birth" })}
            >
              用这副声音继续
            </button>
          </div>
        </section>
      )}

      {state.step === "birth" && (
        <section className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-12">
          <h2 className="display-font rise text-3xl">输入正确生辰</h2>
          <p className="mt-2 text-sm text-[var(--mist)] rise rise-delay-1">
            八字准确度是 {PRODUCT} 的护城河。请尽量使用当地出生时间；不确定时辰可先填整点，之后可再改。
          </p>
          <form
            className="panel mt-6 space-y-4 rounded-2xl p-5 rise rise-delay-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!birthDraft.date || !birthDraft.time) return;
              const chart = computeChart(birthDraft);
              patch({ birth: birthDraft, chart, step: "chart" });
            }}
          >
            <label className="block text-xs text-[var(--mist)]">
              怎么称呼你
              <input
                className="input mt-1"
                value={birthDraft.name}
                onChange={(e) =>
                  setBirthDraft((b) => ({ ...b, name: e.target.value }))
                }
                placeholder="可选"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-[var(--mist)]">
                出生日期
                <input
                  required
                  type="date"
                  className="input mt-1"
                  value={birthDraft.date}
                  onChange={(e) =>
                    setBirthDraft((b) => ({ ...b, date: e.target.value }))
                  }
                />
              </label>
              <label className="block text-xs text-[var(--mist)]">
                出生时间
                <input
                  required
                  type="time"
                  className="input mt-1"
                  value={birthDraft.time}
                  onChange={(e) =>
                    setBirthDraft((b) => ({ ...b, time: e.target.value }))
                  }
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-[var(--mist)]">
                出生城市
                <input
                  className="input mt-1"
                  value={birthDraft.city}
                  onChange={(e) =>
                    setBirthDraft((b) => ({ ...b, city: e.target.value }))
                  }
                />
              </label>
              <label className="block text-xs text-[var(--mist)]">
                性别（排盘参考）
                <select
                  className="input mt-1"
                  value={birthDraft.gender}
                  onChange={(e) =>
                    setBirthDraft((b) => ({
                      ...b,
                      gender: e.target.value as BirthInput["gender"],
                    }))
                  }
                >
                  <option value="保密">保密</option>
                  <option value="女">女</option>
                  <option value="男">男</option>
                </select>
              </label>
            </div>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-[var(--mist)]">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={birthDraft.solarTimeHint}
                onChange={(e) =>
                  setBirthDraft((b) => ({
                    ...b,
                    solarTimeHint: e.target.checked,
                  }))
                }
              />
              演示将按近似历法排盘；正式版会提供更严格的真太阳时与节气校准。
            </label>
            <button type="submit" className="btn-primary w-full rounded-xl py-3 text-sm">
              排出四柱，核对准确性
            </button>
          </form>
        </section>
      )}

      {state.step === "chart" && state.chart && (
        <section className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-12">
          <h2 className="display-font rise text-3xl">请确认这盘正确</h2>
          <p className="mt-2 text-sm text-[var(--mist)] rise rise-delay-1">
            未确认前不会进入专属聊天。若干支与你惯用盘不一致，请返回修改生辰。
          </p>
          <div className="panel mt-6 rounded-2xl p-5 rise rise-delay-2">
            <div className="grid grid-cols-4 gap-2 text-center">
              {pillars.map(({ label, p }) => (
                <div
                  key={label}
                  className="rounded-xl border border-[var(--line)] bg-black/20 px-2 py-3"
                >
                  <div className="text-[10px] tracking-widest text-[var(--mist)]">
                    {label}柱
                  </div>
                  <div className="display-font mt-1 text-2xl tracking-wider">
                    {formatPillar(p)}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--glow)]">
              日主 <span className="text-[var(--accent)]">{state.chart.dayMaster}</span>
              （{state.chart.element}）。{state.chart.summary}
            </p>
            <p className="mt-3 text-xs text-[var(--mist)]">
              【演示排盘】历法为 Demo 近似实现，用于产品环路验证。
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="btn-ghost flex-1 rounded-xl py-3 text-sm"
              onClick={() => patch({ step: "birth", chart: null })}
            >
              返回修改
            </button>
            <button
              type="button"
              className="btn-primary flex-1 rounded-xl py-3 text-sm"
              onClick={onConfirmChart}
            >
              确认无误，绑定{CHARACTER}
            </button>
          </div>
        </section>
      )}

      {state.step === "chat" && state.chart?.confirmed && (
        <section className="relative mx-auto flex min-h-dvh max-w-2xl flex-col px-4 pb-28 pt-6 sm:px-6">
          {!state.proactiveDismissed && (
            <div className="panel mb-4 flex items-start gap-3 rounded-2xl p-4 rise">
              <MoonPet size={44} glowing={false} />
              <div className="flex-1">
                <p className="text-xs tracking-widest text-[var(--mist)]">日运问候</p>
                <p className="mt-1 text-sm leading-relaxed">{PROACTIVE_BANNER}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-primary rounded-lg px-3 py-1.5 text-xs"
                    onClick={() =>
                      play("今天宜收敛锋芒，把力气留给真正重要的一件事。我在这儿陪你。")
                    }
                  >
                    用当前声音播报
                  </button>
                  <button
                    type="button"
                    className="btn-ghost rounded-lg px-3 py-1.5 text-xs"
                    onClick={() => patch({ proactiveDismissed: true })}
                  >
                    知道了
                  </button>
                </div>
              </div>
            </div>
          )}

          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.22em] text-[var(--mist)]">{COMPANY}</p>
              <h2 className="display-font text-2xl">与{CHARACTER}对话</h2>
            </div>
            <button
              type="button"
              className="btn-ghost rounded-xl px-3 py-2 text-xs"
              onClick={() => setSettingsOpen(true)}
            >
              设置
            </button>
          </header>

          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {SHORTCUTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="btn-ghost shrink-0 rounded-full px-3 py-1.5 text-xs"
                onClick={() => sendPrompt(s.prompt)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="panel flex-1 space-y-3 overflow-y-auto scroll-thin rounded-2xl p-4">
            {state.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[color-mix(in_srgb,var(--accent)_28%,transparent)] text-[var(--moon)]"
                      : "bg-black/25 text-[var(--glow)]"
                  }`}
                >
                  {m.role === "moon" ? (
                    <div className="mb-1 flex items-center gap-2">
                      <MoonPet size={28} glowing={false} />
                      <span className="text-[10px] tracking-widest text-[var(--mist)]">
                        {CHARACTER}
                      </span>
                    </div>
                  ) : null}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.role === "moon" ? (
                    <button
                      type="button"
                      className="mt-2 text-xs text-[var(--accent)] underline-offset-2 hover:underline"
                      onClick={() => play(m.text.replace(/【演示解读】[\s\S]*$/, "").trim())}
                    >
                      {speaking ? "朗读中…" : "播放朗读"}
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendPrompt(input);
            }}
          >
            <input
              className="input flex-1"
              placeholder="问事业、心事，或今日宜忌…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-primary rounded-xl px-4 text-sm">
              发送
            </button>
          </form>

          {/* Floating widget feel */}
          <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2">
            {widgetOpen ? (
              <div className="panel w-56 rounded-2xl p-3 text-xs shadow-2xl">
                <p className="display-font text-sm">{CHARACTER}在线</p>
                <p className="mt-1 text-[var(--mist)]">
                  日主 {state.chart.dayMaster} · {state.voice === "female" ? "女声" : "男声"}
                </p>
                <button
                  type="button"
                  className="btn-ghost mt-2 w-full rounded-lg py-1.5"
                  onClick={() => setWidgetOpen(false)}
                >
                  收起挂件
                </button>
              </div>
            ) : null}
            <button
              type="button"
              aria-label={`打开${CHARACTER}挂件`}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              onClick={() => setWidgetOpen((v) => !v)}
            >
              <MoonPet size={64} />
            </button>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/55 p-4 sm:items-center">
          <div className="panel w-full max-w-md rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="display-font text-xl">设置</h3>
              <button
                type="button"
                className="btn-ghost rounded-lg px-2 py-1 text-xs"
                onClick={() => setSettingsOpen(false)}
              >
                关闭
              </button>
            </div>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="mb-2 text-xs text-[var(--mist)]">声音</p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["female", "女声"],
                      ["male", "男声"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`rounded-xl py-2 ${
                        state.voice === value ? "btn-primary" : "btn-ghost"
                      }`}
                      onClick={() => {
                        patch({ voice: value });
                        play(WELCOME_LINE, value);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-[var(--mist)]">月色外观</p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["silver", "银月"],
                      ["honey", "蜜月"],
                      ["jade", "青月"],
                    ] as [MoonTint, string][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`rounded-xl py-2 ${
                        state.tint === value ? "btn-primary" : "btn-ghost"
                      }`}
                      onClick={() => patch({ tint: value })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-[var(--mist)]">字体气质</p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["serif", "宋意"],
                      ["rounded", "手写"],
                      ["classic", "清晰"],
                    ] as [FontMood, string][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`rounded-xl py-2 ${
                        state.fontMood === value ? "btn-primary" : "btn-ghost"
                      }`}
                      onClick={() => patch({ fontMood: value })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {(state.memory.career || state.memory.cares || state.memory.identity) && (
                <div className="rounded-xl border border-[var(--line)] p-3 text-xs text-[var(--mist)]">
                  <p className="mb-1 text-[var(--glow)]">轻量记忆</p>
                  {state.memory.career ? <p>事业：{state.memory.career}</p> : null}
                  {state.memory.cares ? <p>在意：{state.memory.cares}</p> : null}
                  {state.memory.identity ? <p>身份：{state.memory.identity}</p> : null}
                </div>
              )}
              <button
                type="button"
                className="btn-ghost w-full rounded-xl py-2 text-xs text-[var(--danger)]"
                onClick={resetAll}
              >
                清除本地演示数据并重来
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
