"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { BaziTools } from "@/components/BaziTools";
import { MoonPet } from "@/components/MoonPet";
import { PillarBoard } from "@/components/PillarBoard";
import { CHARACTER, CHARACTER_EN, COMPANY, PRODUCT } from "@/lib/brand";
import {
  alternateBoundaryPreview,
  computeChart,
  formatPillar,
  isLateZiClock,
  shichenOf,
} from "@/lib/bazi";
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
  ReplyMode,
  VoiceGender,
} from "@/types";

const emptyBirth: BirthInput = {
  name: "",
  gender: "保密",
  date: "1995-08-18",
  time: "09:30",
  city: "上海",
  solarTimeHint: true,
  ziDayBoundary: "late-zi",
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

  const tint = state?.tint ?? "honey";
  const fontMood = state?.fontMood ?? "classic";

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
    const mode = state.replyMode;
    startTransition(() => {
      const user = userMessage(trimmed, mode);
      const { message, memory } = answerQuestion(
        trimmed,
        state.chart!,
        state.memory,
        mode,
      );
      patch({
        messages: [...state.messages, user, message],
        memory,
      });
      setInput("");
    });
  };


  if (!state) {
    return (
      <div className="app-shell flex min-h-dvh items-center justify-center text-sm text-[var(--fg-muted)]">
        {CHARACTER} 启动中…
      </div>
    );
  }

  return (
    <div className="app-shell" data-tint={tint} data-font={fontMood} lang="zh-CN">
      {state.step === "landing" && (
        <section className="relative flex min-h-dvh flex-col px-6 pb-10 pt-8 sm:px-10">
          <div className="flex items-center justify-between">
            <p className="mono-label">{COMPANY}</p>
            <span className="chip chip-active">Demo1</span>
          </div>

          <div className="relative mt-10 flex flex-1 flex-col justify-between gap-10 lg:mt-0 lg:flex-row lg:items-center">
            <div className="relative z-10 max-w-xl rise">
              <h1 className="display-font text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95] text-[var(--fg)]">
                {PRODUCT}
              </h1>
              <p className="mt-5 text-lg text-[var(--fg-muted)] rise rise-delay-1">
                <span className="display-font text-2xl text-[var(--fg)]">{CHARACTER}</span>
                <span className="mx-2 text-[var(--fg-dim)]">/</span>
                <span className="display-font text-xl tracking-tight text-[var(--fg-muted)]">
                  {CHARACTER_EN}
                </span>
              </p>
              <p className="mt-5 max-w-md text-[0.95rem] leading-7 text-[var(--fg-muted)] rise rise-delay-1">
                八字是一幅不断与外界互动的画。先确认盘，再看事情带来什么变化——以及这是否是你想要的生活。
              </p>
              <div className="mt-9 flex flex-wrap gap-3 rise rise-delay-2">
                <button
                  type="button"
                  className="btn-primary rounded-[var(--radius)] px-6 py-3.5 text-sm"
                  onClick={() => patch({ step: "voice" })}
                >
                  开始 · 认识{CHARACTER}
                </button>
                <button
                  type="button"
                  className="btn-ghost rounded-[var(--radius)] px-5 py-3.5 text-sm"
                  onClick={() => patch({ step: "birth" })}
                >
                  跳过声音，先排盘
                </button>
              </div>
            </div>

            <div className="pointer-events-none relative mx-auto flex w-full max-w-md flex-1 items-center justify-center lg:max-w-none lg:justify-end">
              <div className="absolute inset-8 rounded-full border border-[var(--line)]" />
              <div className="absolute inset-16 rounded-full border border-[var(--line)] opacity-60" />
              <MoonPet size={280} className="relative" />
            </div>
          </div>
        </section>
      )}

      {state.step === "voice" && (
        <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-12">
          <p className="mono-label rise">Voice</p>
          <h2 className="display-font mt-3 text-3xl leading-tight rise">
            试听 {CHARACTER}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--fg-muted)] rise rise-delay-1">
            同一句欢迎语，男声 / 女声可选。角色始终是 {CHARACTER}（{CHARACTER_EN}）。可跳过。
          </p>
          <div className="mt-8 flex justify-center rise rise-delay-1">
            <MoonPet size={96} />
          </div>
          <div className="panel mt-8 space-y-4 rounded-[var(--radius)] p-5 rise rise-delay-2">
            <p className="text-sm leading-7 text-[var(--fg)]">「{WELCOME_LINE}」</p>
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
                  className={`rounded-[var(--radius-sm)] px-3 py-3 text-sm ${
                    state.voice === value ? "btn-primary" : "btn-ghost"
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
                className="btn-ghost w-full rounded-[var(--radius-sm)] py-2 text-xs"
                onClick={stopSpeak}
              >
                停止
              </button>
            ) : null}
          </div>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              className="btn-ghost flex-1 rounded-[var(--radius)] py-3 text-sm"
              onClick={() => patch({ step: "birth" })}
            >
              跳过
            </button>
            <button
              type="button"
              className="btn-primary flex-1 rounded-[var(--radius)] py-3 text-sm"
              onClick={() => patch({ step: "birth" })}
            >
              继续
            </button>
          </div>
        </section>
      )}

      {state.step === "birth" && (
        <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-12">
          <p className="mono-label rise">传统排盘录入</p>
          <h2 className="display-font mt-3 text-3xl rise">输入出生信息</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--fg-muted)] rise rise-delay-1">
            公历 + 钟表时间。月柱按二十四节气；默认晚子时（23点）换日，对齐问真八字。
          </p>
          <form
            className="panel mt-8 space-y-4 rounded-[var(--radius)] p-5 rise rise-delay-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!birthDraft.date || !birthDraft.time) return;
              const chart = computeChart(birthDraft);
              patch({ birth: birthDraft, chart, step: "chart" });
            }}
          >
            <label className="block text-xs text-[var(--fg-dim)]">
              称呼（可选）
              <input
                className="input mt-1.5"
                value={birthDraft.name}
                onChange={(e) => setBirthDraft((b) => ({ ...b, name: e.target.value }))}
                placeholder="—"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-[var(--fg-dim)]">
                公历日期
                <input
                  required
                  type="date"
                  className="input mt-1.5"
                  value={birthDraft.date}
                  onChange={(e) => setBirthDraft((b) => ({ ...b, date: e.target.value }))}
                />
              </label>
              <label className="block text-xs text-[var(--fg-dim)]">
                出生时间
                <input
                  required
                  type="time"
                  className="input mt-1.5"
                  value={birthDraft.time}
                  onChange={(e) => setBirthDraft((b) => ({ ...b, time: e.target.value }))}
                />
                {(() => {
                  const [hh, mm] = (birthDraft.time || "12:00").split(":").map(Number);
                  const shi = shichenOf(hh || 0, mm || 0);
                  return (
                    <span className="mt-1 block text-[11px] text-[var(--accent)]">
                      {shi.label}（{shi.branch}）
                    </span>
                  );
                })()}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-[var(--fg-dim)]">
                城市
                <input
                  className="input mt-1.5"
                  value={birthDraft.city}
                  onChange={(e) => setBirthDraft((b) => ({ ...b, city: e.target.value }))}
                />
              </label>
              <label className="block text-xs text-[var(--fg-dim)]">
                性别
                <select
                  className="input mt-1.5"
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
            <label className="block text-xs text-[var(--fg-dim)]">
              子时换日口径
              <select
                className="input mt-1.5"
                value={birthDraft.ziDayBoundary ?? "late-zi"}
                onChange={(e) =>
                  setBirthDraft((b) => ({
                    ...b,
                    ziDayBoundary: e.target.value as BirthInput["ziDayBoundary"],
                  }))
                }
              >
                <option value="late-zi">晚子时换日（23点 · 问真默认）</option>
                <option value="midnight">午夜换日（00点）</option>
              </select>
            </label>
            {isLateZiClock(birthDraft.time) ? (
              <p className="rounded-[var(--radius-sm)] bg-[var(--pale-sage)] px-3 py-2 text-[11px] leading-5 text-[var(--fg-muted)]">
                出生在 23 点档（晚子时）：日柱会因换日口径不同。默认对齐问真「23
                点换日」；若你惯用午夜换日，请在上方改口径。
              </p>
            ) : null}
            <label className="flex items-start gap-2 text-xs leading-5 text-[var(--fg-dim)]">
              <input
                type="checkbox"
                className="mt-0.5 accent-[var(--accent)]"
                checked={birthDraft.solarTimeHint}
                onChange={(e) =>
                  setBirthDraft((b) => ({ ...b, solarTimeHint: e.target.checked }))
                }
              />
              节气月已按精确历法计算。真太阳时（经纬度校正）正式版再启用；现在按当地钟表时间排盘。
            </label>
            <button type="submit" className="btn-primary w-full rounded-[var(--radius)] py-3.5 text-sm">
              排出四柱并核对
            </button>
          </form>
        </section>
      )}

      {state.step === "chart" && state.chart && (
        <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-12">
          <p className="mono-label rise">确认八字</p>
          <h2 className="display-font mt-3 text-3xl rise">请确认这盘正确</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--fg-muted)] rise rise-delay-1">
            未确认不进入聊天。请与问真等惯用盘逐柱核对；不对请返回改生辰或换日口径。
          </p>
          <div className="panel mt-8 rounded-[var(--radius)] p-5 rise rise-delay-2">
            <PillarBoard chart={state.chart} />
            <div className="mt-5 border-t border-[var(--line)] pt-4">
              <p className="text-sm leading-7 text-[var(--fg-muted)]">
                日主{" "}
                <span className="display-font text-[var(--fg)]">
                  {state.chart.dayMaster}
                </span>{" "}
                · {state.chart.element}
                {state.chart.meta?.shichen ? (
                  <>
                    {" "}
                    · {state.chart.meta.shichen}
                  </>
                ) : null}
              </p>
              {state.chart.meta?.note ? (
                <p className="mt-2 text-[11px] leading-5 text-[var(--fg-dim)]">
                  {state.chart.meta.note}
                </p>
              ) : null}
              {state.birth && isLateZiClock(state.birth.time)
                ? (() => {
                    const alt = alternateBoundaryPreview(state.birth);
                    if (!alt) return null;
                    return (
                      <p className="mt-3 rounded-[var(--radius-sm)] bg-[var(--bg-soft)] px-3 py-2 text-[11px] leading-5 text-[var(--fg-muted)]">
                        对照 · {alt.label}：日柱 {alt.day} · 时柱 {alt.hour}
                        （当前已选日柱 {formatPillar(state.chart.day)} · 时柱{" "}
                        {formatPillar(state.chart.hour)}）
                      </p>
                    );
                  })()
                : null}
              <p className="mt-2 text-sm leading-6 text-[var(--fg-muted)]">
                {state.chart.summary}
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              className="btn-ghost flex-1 rounded-[var(--radius)] py-3 text-sm"
              onClick={() => patch({ step: "birth", chart: null })}
            >
              返回
            </button>
            <button
              type="button"
              className="btn-primary flex-1 rounded-[var(--radius)] py-3 text-sm"
              onClick={onConfirmChart}
            >
              确认 · 绑定{CHARACTER}
            </button>
          </div>
        </section>
      )}

      {state.step === "chat" && state.chart?.confirmed && (
        <section className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pb-28 pt-6 sm:px-6">
          {!state.proactiveDismissed && (
            <div className="panel mb-4 flex items-start gap-3 rounded-[var(--radius)] p-4 rise">
              <MoonPet size={40} glowing={false} />
              <div className="flex-1">
                <p className="mono-label">Daily signal</p>
                <p className="mt-2 text-sm leading-6 text-[var(--fg-muted)]">{PROACTIVE_BANNER}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-primary rounded-[var(--radius-sm)] px-3 py-1.5 text-xs"
                    onClick={() =>
                      play("今天宜收敛锋芒，把力气留给真正重要的一件事。我在这儿陪你。")
                    }
                  >
                    播报
                  </button>
                  <button
                    type="button"
                    className="btn-ghost rounded-[var(--radius-sm)] px-3 py-1.5 text-xs"
                    onClick={() => patch({ proactiveDismissed: true })}
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}

          <header className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="mono-label">{COMPANY}</p>
              <h2 className="display-font mt-1 text-2xl tracking-tight">
                {CHARACTER}
                <span className="ml-2 text-base text-[var(--fg-dim)]">{PRODUCT}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="chip chip-active !text-[11px]"
                title="Web 先用熟，再装 App（即将推出）"
              >
                Download App · 即将推出
              </button>
              <button
                type="button"
                className="btn-ghost rounded-[var(--radius-sm)] px-3 py-2 text-xs"
                onClick={() => setSettingsOpen(true)}
              >
                设置
              </button>
            </div>
          </header>

          <div className="mb-3 grid grid-cols-2 gap-1 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg-elevated)] p-1">
            {(
              [
                ["chat", "聊天模式", "短预测 · 快"],
                ["analysis", "分析模式", "排盘图 · 详解"],
              ] as [ReplyMode, string, string][]
            ).map(([value, label, hint]) => (
              <button
                key={value}
                type="button"
                className={`rounded-[var(--radius-sm)] px-3 py-2.5 text-left transition ${
                  state.replyMode === value
                    ? "bg-[var(--accent-dim)] text-[var(--fg)]"
                    : "text-[var(--fg-dim)] hover:text-[var(--fg-muted)]"
                }`}
                onClick={() => patch({ replyMode: value })}
              >
                <div className="text-sm font-medium tracking-tight">{label}</div>
                <div className="mt-0.5 text-[10px] opacity-80">{hint}</div>
              </button>
            ))}
          </div>

          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {SHORTCUTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="chip shrink-0"
                onClick={() => sendPrompt(s.prompt)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="panel flex-1 space-y-3 overflow-y-auto scroll-thin rounded-[var(--radius)] p-4">
            {state.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-[var(--radius)] px-3.5 py-2.5 text-sm leading-6 ${
                    m.role === "user"
                      ? "bg-[var(--accent-dim)] text-[var(--fg)]"
                      : "bg-[var(--bg)] text-[var(--fg-muted)] border border-[var(--line)]"
                  }`}
                >
                  {m.role === "moon" ? (
                    <div className="mb-2 flex items-center gap-2">
                      <MoonPet size={24} glowing={false} />
                      <span className="mono-label !normal-case !tracking-[0.08em]">
                        {CHARACTER}
                      </span>
                    </div>
                  ) : null}
                  {m.role === "moon" && m.mode ? (
                    <div className="mb-2">
                      <span className="chip !px-2 !py-0.5 !text-[10px]">
                        {m.mode === "analysis" ? "分析模式" : "聊天模式"}
                      </span>
                    </div>
                  ) : null}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.role === "moon" && m.showTools && state.chart ? (
                    <BaziTools chart={state.chart} />
                  ) : null}
                  {m.role === "moon" ? (
                    <button
                      type="button"
                      className="mt-2 text-xs font-medium text-[var(--accent)]"
                      onClick={() =>
                        play(
                          m.text
                            .replace(/【演示解读】[\s\S]*$/g, "")
                            .replace(/【演示】[\s\S]*$/g, "")
                            .replace(/【分析模式】/g, "")
                            .trim(),
                        )
                      }
                    >
                      {speaking ? "朗读中…" : "播放"}
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
              placeholder={
                state.replyMode === "analysis"
                  ? "分析模式：展开天干地支与五行…"
                  : "聊天模式：直接要预测…"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-primary rounded-[var(--radius)] px-4 text-sm">
              发送
            </button>
          </form>

          <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2">
            {widgetOpen ? (
              <div className="panel w-52 rounded-[var(--radius)] p-3 text-xs shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <p className="display-font text-sm tracking-tight">{CHARACTER} · online</p>
                <p className="mt-1 text-[var(--fg-dim)]">
                  日主 {state.chart.dayMaster} · {state.voice === "female" ? "女声" : "男声"}
                </p>
                <button
                  type="button"
                  className="btn-ghost mt-2 w-full rounded-[var(--radius-sm)] py-1.5"
                  onClick={() => setWidgetOpen(false)}
                >
                  收起
                </button>
              </div>
            ) : null}
            <button
              type="button"
              aria-label={`打开${CHARACTER}挂件`}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              onClick={() => setWidgetOpen((v) => !v)}
            >
              <MoonPet size={58} />
            </button>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div className="panel w-full max-w-md rounded-[var(--radius)] p-5">
            <div className="flex items-center justify-between">
              <h3 className="display-font text-xl tracking-tight">设置</h3>
              <button
                type="button"
                className="btn-ghost rounded-[var(--radius-sm)] px-2 py-1 text-xs"
                onClick={() => setSettingsOpen(false)}
              >
                关闭
              </button>
            </div>
            <div className="mt-5 space-y-5 text-sm">
              <div>
                <p className="mono-label mb-2">Reply mode</p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["chat", "聊天"],
                      ["analysis", "分析"],
                    ] as [ReplyMode, string][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`rounded-[var(--radius-sm)] py-2 ${
                        state.replyMode === value ? "btn-primary" : "btn-ghost"
                      }`}
                      onClick={() => patch({ replyMode: value })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mono-label mb-2">Voice · {CHARACTER}</p>
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
                      className={`rounded-[var(--radius-sm)] py-2 ${
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
                <p className="mono-label mb-2">Accent</p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["honey", "Sage"],
                      ["silver", "Ink"],
                      ["jade", "Mist"],
                    ] as [MoonTint, string][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`rounded-[var(--radius-sm)] py-2 ${
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
                <p className="mono-label mb-2">Type weight</p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["classic", "Default"],
                      ["serif", "Tight"],
                      ["rounded", "Soft"],
                    ] as [FontMood, string][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`rounded-[var(--radius-sm)] py-2 ${
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
                <div className="rounded-[var(--radius-sm)] border border-[var(--line)] p-3 text-xs text-[var(--fg-dim)]">
                  <p className="mb-1 text-[var(--fg-muted)]">Memory</p>
                  {state.memory.career ? <p>事业：{state.memory.career}</p> : null}
                  {state.memory.cares ? <p>在意：{state.memory.cares}</p> : null}
                  {state.memory.identity ? <p>身份：{state.memory.identity}</p> : null}
                </div>
              )}
              <button
                type="button"
                className="btn-ghost w-full rounded-[var(--radius-sm)] py-2 text-xs text-[var(--danger)]"
                onClick={resetAll}
              >
                清除本地数据
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
