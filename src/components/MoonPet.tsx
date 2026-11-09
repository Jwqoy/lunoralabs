"use client";

type Props = {
  size?: number;
  className?: string;
  glowing?: boolean;
};

/** Flat contour crescent — journaling brand mark */
export function MoonPet({ size = 64, className = "" }: Props) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        className="float-moon relative"
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
      >
        <path
          d="M48 12c14 4 24 18 22 34-2 16-16 28-32 28-8 0-15-2-21-7 12 2 25-2 32-12 8-12 6-28-1-43z"
          fill="#F8F7F3"
          stroke="#7E8D7C"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M50 18c10 5 16 16 15 27"
          stroke="#7E8D7C"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M44 22c7 4 12 12 11 20"
          stroke="#A8B5A6"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M42 28c4 6 4 12 1 16"
          fill="#E5E9E1"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
