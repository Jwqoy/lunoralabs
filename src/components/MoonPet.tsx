"use client";

type Props = {
  size?: number;
  className?: string;
  glowing?: boolean;
};

/** Minimal mark for 小弦 / Nox — geometric, fintech-clean */
export function MoonPet({ size = 160, className = "", glowing = true }: Props) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {glowing ? (
        <span
          className="glow-ring absolute inset-[-12%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent) 0%, transparent 70%)",
          }}
        />
      ) : null}
      <svg
        className="float-moon relative"
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
      >
        <defs>
          <linearGradient id="noxDisk" x1="30" y1="20" x2="170" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f7f8fa" />
            <stop offset="1" stopColor="#c5cad6" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="72" fill="url(#noxDisk)" />
        <circle cx="100" cy="100" r="72" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        {/* crescent cut for mark clarity */}
        <circle cx="128" cy="88" r="54" fill="var(--bg, #07080a)" opacity="0.08" />
        <circle cx="78" cy="92" r="5" fill="#12141a" />
        <circle cx="112" cy="92" r="5" fill="#12141a" />
        <path
          d="M86 118c7 7 21 7 28 0"
          stroke="#12141a"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="136" cy="62" r="10" fill="#aeb4c2" opacity="0.35" />
        <circle cx="64" cy="128" r="7" fill="#aeb4c2" opacity="0.25" />
      </svg>
    </div>
  );
}
