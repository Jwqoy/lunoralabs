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
 * Abstract round AI carrier (Siri-like vessel for 小弦 / Nox).
 * Not a moon character — fluid waveform sphere.
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
            <radialGradient id={`${uid}-glass`} cx="35%" cy="28%" r="75%">
              <stop offset="0%" stopColor="#3A433E" />
              <stop offset="45%" stopColor="#252B28" />
              <stop offset="100%" stopColor="#151916" />
            </radialGradient>
            <linearGradient id={`${uid}-w1`} x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#7E8D7C" stopOpacity="0" />
              <stop offset="35%" stopColor="#C9D4C6" stopOpacity="0.95" />
              <stop offset="65%" stopColor="#E8EEE4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#A08A5C" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${uid}-w2`} x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#A08A5C" stopOpacity="0" />
              <stop offset="40%" stopColor="#D4C4A8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#7E8D7C" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${uid}-w3`} x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#5A6E7A" stopOpacity="0" />
              <stop offset="50%" stopColor="#B7C4B4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#5A6E7A" stopOpacity="0" />
            </linearGradient>
            <filter id={`${uid}-blur`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
            <clipPath id={`${uid}-clip`}>
              <circle cx="50" cy="50" r="47.5" />
            </clipPath>
          </defs>

          {/* dark glass sphere — reads as device/AI, not moon */}
          <circle cx="50" cy="50" r="48" fill={`url(#${uid}-glass)`} />

          <g clipPath={`url(#${uid}-clip)`} filter={`url(#${uid}-blur)`}>
            {/* Siri-like horizontal waveform ribbons */}
            <g className="orb-wave orb-wave-1">
              <path
                d="M4 50 C 18 34, 32 66, 46 50 S 74 34, 96 50"
                stroke={`url(#${uid}-w1)`}
                strokeWidth="5.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            <g className="orb-wave orb-wave-2">
              <path
                d="M4 50 C 20 64, 34 36, 50 50 S 78 66, 96 50"
                stroke={`url(#${uid}-w2)`}
                strokeWidth="3.8"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            <g className="orb-wave orb-wave-3">
              <path
                d="M6 50 C 22 42, 38 58, 52 50 S 76 40, 94 50"
                stroke={`url(#${uid}-w3)`}
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            {/* soft vertical energy veil */}
            <ellipse className="orb-veil" cx="50" cy="50" rx="18" ry="36" fill="#E8EEE4" opacity="0.08" />
          </g>

          {/* glass edge + specular — product lens, not lunar crater */}
          <circle
            cx="50"
            cy="50"
            r="47.4"
            fill="none"
            stroke="#E8EEE4"
            strokeOpacity="0.18"
            strokeWidth="1.1"
          />
          <path
            d="M30 24 C 38 16, 54 15, 64 22"
            stroke="#FFFEFA"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.55"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

/** Preferred name going forward */
export const OrbCarrier = MoonPet;
