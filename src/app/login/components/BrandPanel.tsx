import React, { useId } from "react";

const BrandPanel: React.FC<{ className?: string }> = ({ className = "" }) => {
  const uid = useId();
  const sweepId = `gc-sweep-${uid}`;

  return (
    <div
      className={`relative overflow-hidden bg-[#0A1F2E] ${className}`}
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
            <stop offset="0%" stopColor="#0A1F2E" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#163F5C" stopOpacity="0.55" />
            <stop offset="72%" stopColor="#2E97A8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#9CDBE4" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="#0A1F2E" />
        <path
          d="M -100 1100 L 950 -150 L 950 -20 L -100 1230 Z"
          fill={`url(#${sweepId})`}
        />
        <path
          d="M -100 950 L 800 -100"
          stroke="#58BECC"
          strokeOpacity="0.15"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M -100 700 L 800 -350"
          stroke="#3E86B0"
          strokeOpacity="0.1"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      
      {/* Dynamic blurred orbs for premium modern look */}
      <div className="absolute left-[-10%] top-[-10%] h-[40vw] w-[40vw] min-h-[400px] min-w-[400px] rounded-full bg-[#2E97A8] opacity-20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] min-h-[500px] min-w-[500px] rounded-full bg-[#3E86B0] opacity-20 blur-[150px]" />
    </div>
  );
};

export default BrandPanel;
