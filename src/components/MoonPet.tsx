"use client";

type Props = {
  size?: number;
  className?: string;
  glowing?: boolean;
  /** When true: speak-pulse, soft bob, eyes focus */
  speaking?: boolean;
  /** idle | listen | speak moods */
  mood?: "idle" | "listen" | "speak";
};

/** Soft journaling crescent with livelier motion — still brand-safe (sage/cream). */
export function MoonPet({
  size = 64,
  className = "",
  glowing = false,
  speaking = false,
  mood,
}: Props) {
  const mode = mood ?? (speaking ? "speak" : "idle");

  return (
    <div
      className={`moon-stage relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      data-mood={mode}
      aria-hidden
    >
      {(glowing || mode === "speak") && (
        <span className="moon-halo absolute inset-[-12%] rounded-full" />
      )}
      <svg
        className="moon-body relative"
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
      >
        {/* crescent body */}
        <path
          className="moon-crescent"
          d="M48 12c14 4 24 18 22 34-2 16-16 28-32 28-8 0-15-2-21-7 12 2 25-2 32-12 8-12 6-28-1-43z"
          fill="#F8F7F3"
          stroke="#7E8D7C"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* soft ridges */}
        <path
          d="M50 18c10 5 16 16 15 27"
          stroke="#7E8D7C"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M44 22c7 4 12 12 11 20"
          stroke="#A8B5A6"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.65"
        />
        {/* face — slight offset toward lit side */}
        <g className="moon-face" transform="translate(46 34)">
          <ellipse className="moon-eye moon-eye-l" cx="-5.2" cy="-1" rx="1.55" ry="1.9" fill="#5C655F" />
          <ellipse className="moon-eye moon-eye-r" cx="3.4" cy="-1.2" rx="1.55" ry="1.9" fill="#5C655F" />
          <path
            className="moon-blush moon-blush-l"
            d="M-8.2 2.2a2.2 1.2 0 1 0 0.1 0"
            fill="#C9B8A8"
            opacity="0.35"
          />
          <path
            className="moon-blush moon-blush-r"
            d="M6.2 2a2.2 1.2 0 1 0 0.1 0"
            fill="#C9B8A8"
            opacity="0.35"
          />
          <path
            className="moon-mouth"
            d="M-2.2 4.6c1.2 1.6 3.4 1.6 4.6 0"
            stroke="#7E8D7C"
            strokeWidth="1.15"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        {/* highlight fleck */}
        <circle className="moon-fleck" cx="54" cy="26" r="1.4" fill="#E5E9E1" opacity="0.9" />
      </svg>
    </div>
  );
}
