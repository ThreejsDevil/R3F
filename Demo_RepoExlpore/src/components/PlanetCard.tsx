import React, { useState } from 'react';

interface PlanetCardProps {
  owner: string;
  name: string;
  tagline?: string;
  sector?: string;
  gravity?: string;
  signal?: string;
  orbiters?: string;
  onLand?: () => void;
  onContinue?: () => void;
}

export function PlanetCard({
  owner,
  name,
  tagline = "대기권 밖에서도 부드럽게 동작하는 경량 리액티브 렌더링 코어.",
  sector = "구역 7G · 궤도 04",
  gravity = "14.2k",
  signal = "2,847",
  orbiters = "318",
  onLand,
  onContinue
}: PlanetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`fixed z-20 flex flex-col bg-linear-to-br from-[rgba(35,38,71,0.55)] to-[rgba(18,19,42,0.55)] backdrop-blur-md shadow-neumorph-box transition-all duration-500 ease-out overflow-hidden ${isExpanded
        ? "top-8 left-8 w-[420px] rounded-[24px] p-8 cursor-default"
        : "top-1/2 left-1/2 -translate-x-1/2 translate-y-[-240px] w-[300px] rounded-[20px] p-5 cursor-pointer animate-[card-float_6s_ease-in-out_infinite]"
        }`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {/* 닫기 버튼 */}
      <button
        className={`absolute top-5 right-5 w-8 h-8 rounded-full border-none bg-white/5 text-text-dim flex items-center justify-center transition-all duration-300 z-30 ${isExpanded
          ? "opacity-100 pointer-events-auto cursor-pointer hover:bg-white/10 hover:text-white"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(false);
        }}
      >
        ✕
      </button>

      <div className="relative w-full h-full">
        {/* ================= MINI VIEW ================= */}
        <div
          className={`w-full transition-opacity duration-300 ${isExpanded ? "absolute top-0 left-0 opacity-0 pointer-events-none" : "relative opacity-100 pointer-events-auto"
            }`}
        >
          <div className="font-jetbrains text-[10px] tracking-widest text-accent mb-2 opacity-90">
            관측 대상
          </div>
          <div className="text-2xl font-light tracking-tight leading-snug">
            <span className="opacity-70">{owner}</span> / <span className="font-medium">{name}</span>
          </div>
          <div className="mt-3 font-jetbrains text-[10px] text-text-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] animate-pulse"></span>
            탭하여 자세히 보기
          </div>
        </div>

        {/* ================= FULL VIEW ================= */}
        <div
          className={`w-full flex flex-col gap-6 transition-opacity duration-300 delay-100 ${isExpanded ? "relative opacity-100 pointer-events-auto" : "absolute top-0 left-0 opacity-0 pointer-events-none"
            }`}
        >
          {/* Breadcrumb */}
          <div className="font-jetbrains text-[11px] tracking-[0.2em] text-text-muted flex items-center">
            {sector}
          </div>

          {/* Repo Info */}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-light tracking-tight leading-tight m-0">
              <span className="text-text-muted">{owner}</span>
              <span className="text-text-muted"> / </span>
              <span className="font-medium">{name}</span>
            </h2>
            <p className="text-[13px] text-text-dim leading-relaxed m-0">
              {tagline}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-neumorph-mark flex flex-col justify-between">
              <div className="font-jetbrains text-[10px] tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                <span className="text-accent">◈</span>인력
              </div>
              <div className="text-2xl font-semibold tracking-tight">{gravity}</div>
              <div className="font-jetbrains text-[10px] text-accent mt-1">+218</div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-neumorph-mark flex flex-col justify-between">
              <div className="font-jetbrains text-[10px] tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                <span className="text-accent">◉</span>신호
              </div>
              <div className="text-2xl font-semibold tracking-tight">{signal}</div>
              <div className="font-jetbrains text-[10px] text-accent mt-1">+41</div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-neumorph-mark flex flex-col justify-between">
              <div className="font-jetbrains text-[10px] tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                <span className="text-accent">◐</span>공전체
              </div>
              <div className="text-2xl font-semibold tracking-tight">{orbiters}</div>
              <div className="font-jetbrains text-[10px] text-accent mt-1">12 활동</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              className="flex-1 border-none py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer font-medium text-[14px] bg-linear-to-br from-accent to-[oklch(0.6_0.14_220)] text-[#0a0b14] shadow-neumorph-btn transition-all hover:brightness-110 hover:shadow-neumorph-btn-hover active:scale-95"
              onClick={(e) => { e.stopPropagation(); onLand?.(); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14" /><path d="M5 12h14" />
              </svg>
              행성 착륙
            </button>
            <button
              className="flex-1 border-none py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer font-medium text-[14px] bg-white/5 backdrop-blur-md text-text shadow-neumorph-chip transition-all hover:bg-white/10 hover:text-accent active:scale-95"
              onClick={(e) => { e.stopPropagation(); onContinue?.(); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
              </svg>
              관측 계속
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
