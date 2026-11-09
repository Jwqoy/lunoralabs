"use client";

import { useId } from "react";

type Props = {
  size?: number;
  className?: string;
  glowing?: boolean;
  speaking?: boolean;
  mood?: "idle" | "listen" | "speak";
};

/**
 * Light Siri-like AI orb for 小弦 — soft glass + clean waveform ribbons only.
 */
export function MoonPet({
  size = 64,
  className = "",
  glowing = false,
  speaking = false,
  mood,
}: Props) {
  const mode = mood ?? (speaking ? "speak" : "idle");
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className={`orb-stage relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      data-mood={mode}
      aria-hidden
    >
      <span className={`orb-ring orb-ring-1 ${glowing || mode !== "idle" ? "is-on" : ""}`} />
      <span className={`orb-ring orb-ring-2 ${mode === "speak" ? "is-on" : ""}`} />
      <span className={`orb-aura absolute inset-[-10%] rounded-full ${glowing || mode === "speak" ? "is-on" : ""}`} />

      <div className="orb-shell relative h-full w-full overflow-hidden rounded-full">
        <svg className="orb-body absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          <defs>
            <radialGradient id={`${uid}-glass`} cx="32%" cy="28%" r="78%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="38%" stopColor="#F4F6F1" />
              <stop offset="72%" stopColor="#DEE4D8" />
              <stop offset="100%" stopColor="#B7C4B4" />
            </radialGradient>
            <linearGradient id={`${uid}-w1`} x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#7E8D7C" stopOpacity="0" />
              <stop offset="30%" stopColor="#6E7F6C" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#5C655F" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#8A9A88" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#7E8D7C" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${uid}-w2`} x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#A08A5C" stopOpacity="0" />
              <stop offset="45%" stopColor="#A08A5C" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#A08A5C" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${uid}-w3`} x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#5A6E7A" stopOpacity="0" />
              <stop offset="50%" stopColor="#7E8D7C" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#5A6E7A" stopOpacity="0" />
            </linearGradient>
            <filter id={`${uid}-blur`} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="1.1" />
            </filter>
            <clipPath id={`${uid}-clip`}>
              <circle cx="50" cy="50" r="47.5" />
            </clipPath>
          </defs>

          <circle cx="50" cy="50" r="48" fill={`url(#${uid}-glass)`} />

          <g clipPath={`url(#${uid}-clip)`} filter={`url(#${uid}-blur)`}>
            <g className="orb-wave orb-wave-1">
              <path
                d="M6 50 C 20 36, 34 64, 50 50 S 78 36, 94 50"
                stroke={`url(#${uid}-w1)`}
                strokeWidth="4.2"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            <g className="orb-wave orb-wave-2">
              <path
                d="M8 50 C 24 62, 38 38, 52 50 S 76 62, 92 50"
                stroke={`url(#${uid}-w2)`}
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            <g className="orb-wave orb-wave-3">
              <path
                d="M10 50 C 26 44, 40 56, 54 50 S 74 42, 90 50"
                stroke={`url(#${uid}-w3)`}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </g>

          <circle
            cx="50"
            cy="50"
            r="47.4"
            fill="none"
            stroke="#7E8D7C"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          <path
            d="M30 24 C 38 16, 54 15, 64 22"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

export const OrbCarrier = MoonPet;
