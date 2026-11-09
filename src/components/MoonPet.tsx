"use client";

type Props = {
  size?: number;
  className?: string;
  glowing?: boolean;
};

export function MoonPet({ size = 160, className = "", glowing = true }: Props) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {glowing ? (
        <span
          className="glow-ring absolute inset-[-18%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--tint-glow) 0%, transparent 68%)",
          }}
        />
      ) : null}
      <svg
        className="float-moon relative drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
      >
        <defs>
          <radialGradient id="moonFace" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#f7f4ec" />
            <stop offset="55%" stopColor="#e6ebf5" />
            <stop offset="100%" stopColor="#b7c2d8" />
          </radialGradient>
          <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e8b59a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#e8b59a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#moonFace)" />
        <ellipse cx="72" cy="88" rx="7" ry="9" fill="#3a4458" />
        <ellipse cx="118" cy="88" rx="7" ry="9" fill="#3a4458" />
        <circle cx="74" cy="86" r="2.2" fill="#f5f7fb" />
        <circle cx="120" cy="86" r="2.2" fill="#f5f7fb" />
        <path
          d="M86 112c6 8 22 8 28 0"
          stroke="#5a657a"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="62" cy="104" r="10" fill="url(#cheek)" />
        <circle cx="132" cy="104" r="10" fill="url(#cheek)" />
        <ellipse cx="128" cy="58" rx="14" ry="9" fill="#c5cddd" opacity="0.45" />
        <ellipse cx="70" cy="130" rx="11" ry="7" fill="#c5cddd" opacity="0.28" />
        {/* tiny ears / petal tips for pet feel */}
        <path
          d="M48 54c8-18 22-22 28-18-14 8-20 20-22 30-4-4-6-8-6-12z"
          fill="#dfe5f2"
          opacity="0.9"
        />
        <path
          d="M152 54c-8-18-22-22-28-18 14 8 20 20 22 30 4-4 6-8 6-12z"
          fill="#dfe5f2"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
