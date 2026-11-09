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
 * Siri-style round AI carrier for 小弦 — soft orb, not crescent.
 * Palette stays Lunora journaling (cream / sage / warm ink), no neon purple.
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
      <span className={`orb-aura absolute inset-[-18%] rounded-full ${glowing || mode === "speak" ? "is-on" : ""}`} />
      <div className="orb-shell relative h-full w-full overflow-hidden rounded-full">
        <svg className="orb-body absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id={`${uid}-core`} cx="38%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#FFFEFA" />
              <stop offset="42%" stopColor="#E8EEE4" />
              <stop offset="78%" stopColor="#C5D0C2" />
              <stop offset="100%" stopColor="#8A9A88" />
            </radialGradient>
            <linearGradient id={`${uid}-ribbon-a`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F8F7F3" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#A8B5A6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#7E8D7C" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id={`${uid}-ribbon-b`} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D8C7B4" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#E5E9E1" stopOpacity="0.15" />
            </linearGradient>
            <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
            <clipPath id={`${uid}-clip`}>
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>

          <circle cx="50" cy="50" r="48" fill={`url(#${uid}-core)`} />

          <g clipPath={`url(#${uid}-clip)`}>
            <g className="orb-swirl orb-swirl-a" filter={`url(#${uid}-soft)`}>
              <path
                d="M8 62 C 22 28, 48 18, 72 34 C 90 48, 88 78, 58 86 C 34 92, 12 80, 8 62 Z"
                fill={`url(#${uid}-ribbon-a)`}
                opacity="0.85"
              />
            </g>
            <g className="orb-swirl orb-swirl-b" filter={`url(#${uid}-soft)`}>
              <path
                d="M78 22 C 96 40, 92 70, 68 82 C 44 94, 18 78, 24 52 C 30 28, 56 10, 78 22 Z"
                fill={`url(#${uid}-ribbon-b)`}
                opacity="0.7"
              />
            </g>
            <g className="orb-swirl orb-swirl-c">
              <ellipse cx="34" cy="30" rx="16" ry="10" fill="#FFFEFA" opacity="0.55" />
            </g>
          </g>

          {/* glass rim + specular */}
          <circle
            cx="50"
            cy="50"
            r="47.2"
            stroke="#7E8D7C"
            strokeOpacity="0.28"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M28 22 C 36 14, 52 12, 62 18"
            stroke="#FFFEFA"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.75"
          />
          <circle className="orb-core-dot" cx="50" cy="50" r="3.2" fill="#5C655F" opacity="0.35" />
        </svg>
      </div>
    </div>
  );
}
