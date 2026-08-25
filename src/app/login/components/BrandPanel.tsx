import React, { useId } from "react";

const BrandPanel: React.FC<{ className?: string }> = ({ className = "" }) => {
  const uid = useId();
  const sweepId = `gc-sweep-${uid}`;
  const markId = `gc-mark-${uid}`;
  const bandId = `gc-band-${uid}`;

  return (
    <div
      className={`relative overflow-hidden bg-blue-100 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 1000"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <linearGradient id={sweepId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0A1F2E" stopOpacity="0" />
            <stop offset="45%" stopColor="#163F5C" stopOpacity="0.55" />
            <stop offset="72%" stopColor="#2E97A8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9CDBE4" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={markId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EAF5F8" />
            <stop offset="55%" stopColor="#9CDBE4" />
            <stop offset="100%" stopColor="#3E86B0" />
          </linearGradient>
          <linearGradient id={bandId} x1="0%" y1="0%" x2="100%" y2="60%">
            <stop offset="0%" stopColor="#0F2E44" />
            <stop offset="55%" stopColor="#2E97A8" />
            <stop offset="100%" stopColor="#9CDBE4" />
          </linearGradient>
        </defs>

        <rect width="800" height="1000" fill="#0A1F2E" />

        <path
          d="M -100 1100 L 950 -150 L 950 -20 L -100 1230 Z"
          fill={`url(#${sweepId})`}
        />
        <path
          d="M -100 950 L 800 -100"
          stroke="#58BECC"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M -100 700 L 800 -350"
          stroke="#3E86B0"
          strokeOpacity="0.18"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10 px-10 text-center">
        <svg
          width="184"
          height="184"
          viewBox="0 0 184 184"
          className="drop-shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
        >
          <circle
            cx="92"
            cy="92"
            r="90"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.14"
          />

          <text
            x="92"
            y="112"
            textAnchor="middle"
            fontFamily="var(--font-nulshock), sans-serif"
            fontSize="62"
            fontWeight="600"
            fill={`url(#${markId})`}
            letterSpacing="1"
          >
            GC
          </text>

          {/* signature band — the diagonal sweep from the mark, banking across the initials */}
          <path
            d="M20 100
               C58 84 126 84 164 100
               C168 102 166 109 161 107
               C124 92 60 92 23 107
               C18 109 16 102 20 100 Z"
            fill={`url(#${bandId})`}
          />
        </svg>

        <div className="flex flex-col items-center gap-3">
          <p className="text-[15px] font-semibold uppercase tracking-[0.46em] text-white">
            Grupo Cantabria
          </p>
          <p className="max-w-[280px] text-sm leading-6 text-white/60">
            Un solo acceso para todas las empresas del grupo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandPanel;
