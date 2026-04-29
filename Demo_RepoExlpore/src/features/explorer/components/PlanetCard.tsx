import { useState, useEffect } from 'react';
import type { RepoData } from '../../../types/github';

type SelectedPart = 'planet' | 'commits' | 'prs' | 'issues' | null;

interface PlanetCardProps {
  repo: RepoData;
  selectedPart: SelectedPart;
  onSelectPart: (part: SelectedPart) => void;
  onLand?: () => void;
  onContinue?: () => void;
}

export function PlanetCard({
  repo,
  selectedPart,
  onSelectPart,
  onLand,
  onContinue
}: PlanetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If a part is selected from 3D scene, ensure card is expanded
  useEffect(() => {
    if (selectedPart && !isExpanded) {
      setIsExpanded(true);
    }
  }, [selectedPart]);

  const owner = repo.full_name?.split('/')[0] || "nova";
  const name = repo.name || "renderer";
  const tagline = repo.description || "설명이 없습니다.";
  
  const formatNum = (num: number) => num > 1000 ? (num / 1000).toFixed(1) + 'k' : String(num || 0);

  const parts = [
    { id: 'planet', label: 'Core', value: formatNum(repo.stargazers_count), icon: '◈', desc: '행성 코어 (Stars / Forks)' },
    { id: 'commits', label: 'Commits', value: formatNum(repo.commits_count), icon: '◎', desc: '토성의 고리 (Commits)' },
    { id: 'prs', label: 'Pull Requests', value: formatNum(repo.prs_count || 0), icon: '☄', desc: '소행성대 (Pull Requests)' },
    { id: 'issues', label: 'Issues', value: formatNum(repo.open_issues_count), icon: '◐', desc: '붉은 소행성 (Issues)' },
  ] as const;

  const renderDetail = () => {
    switch (selectedPart) {
      case 'planet':
        return (
          <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 animate-[fade-in_0.3s_ease-out]">
            <h3 className="text-accent text-sm font-jetbrains mb-2">◈ 코어 분석</h3>
            <p className="text-[13px] text-text-dim leading-relaxed mb-2">이 행성의 중심핵은 {repo.stargazers_count}개의 별과 {repo.forks_count}번의 분기로 구성되어 있습니다. 주 사용 언어는 {repo.language || '알 수 없음'}입니다.</p>
          </div>
        );
      case 'commits':
        return (
          <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 animate-[fade-in_0.3s_ease-out]">
            <h3 className="text-accent text-sm font-jetbrains mb-2">◎ 고리 분석</h3>
            <p className="text-[13px] text-text-dim leading-relaxed mb-2">행성을 둘러싼 거대한 고리는 {repo.commits_count}번의 커밋 기록이 쌓여 형성되었습니다. 오랫동안 축적된 지층을 보여줍니다.</p>
          </div>
        );
      case 'prs':
        return (
          <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 animate-[fade-in_0.3s_ease-out]">
            <h3 className="text-accent text-sm font-jetbrains mb-2">☄ 소행성대 분석</h3>
            <p className="text-[13px] text-text-dim leading-relaxed mb-2">{repo.prs_count || 0}개의 Pull Request들이 소행성대를 이루며 공전하고 있습니다. 행성의 질량을 키우는 주요 자원입니다.</p>
          </div>
        );
      case 'issues':
        return (
          <div className="mt-4 p-4 bg-[rgba(255,50,50,0.05)] rounded-2xl border border-[rgba(255,50,50,0.2)] animate-[fade-in_0.3s_ease-out]">
            <h3 className="text-[#ff5555] text-sm font-jetbrains mb-2">◐ 붉은 소행성 군락</h3>
            <p className="text-[13px] text-text-dim leading-relaxed mb-2">{repo.open_issues_count}개의 미해결 Issue들이 붉은 빛을 내며 궤도를 돌고 있습니다. 행성의 안정성을 위해 처리가 필요합니다.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed z-20 flex flex-col bg-linear-to-br from-[rgba(35,38,71,0.55)] to-[rgba(18,19,42,0.55)] backdrop-blur-md shadow-neumorph-box transition-all duration-500 ease-out overflow-hidden ${isExpanded
        ? "top-8 left-8 w-[420px] max-h-[85vh] rounded-[24px] p-8 cursor-default overflow-y-auto custom-scrollbar"
        : "top-1/2 left-1/2 -translate-x-1/2 translate-y-[-240px] w-[300px] h-[auto] rounded-[20px] p-5 cursor-pointer animate-[card-float_6s_ease-in-out_infinite]"
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
          onSelectPart(null); // Deselect when closing
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
            구역 7G · 궤도 04
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

          {/* Stats Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            {parts.map((p) => {
              const isSelected = selectedPart === p.id;
              return (
                <div 
                  key={p.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart(isSelected ? null : p.id);
                  }}
                  className={`backdrop-blur-md rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between
                    ${isSelected 
                      ? "bg-white/10 shadow-[inset_0_0_0_1px_var(--color-accent)] transform scale-[1.02]" 
                      : "bg-white/5 shadow-neumorph-mark hover:bg-white/10 hover:-translate-y-0.5"
                    }`}
                >
                  <div className={`font-jetbrains text-[10px] tracking-widest mb-2 flex items-center gap-1.5 transition-colors ${isSelected ? 'text-white' : 'text-text-muted'}`}>
                    <span className={p.id === 'issues' ? 'text-[#ff5555]' : 'text-accent'}>{p.icon}</span> {p.label}
                  </div>
                  <div className="text-2xl font-semibold tracking-tight">{p.value}</div>
                </div>
              );
            })}
          </div>

          {/* Detailed Info Section based on selection */}
          <div className="min-h-[120px] transition-all duration-300">
            {selectedPart ? renderDetail() : (
              <div className="mt-4 p-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center h-full opacity-50">
                <span className="text-[12px] font-jetbrains text-text-muted tracking-wide text-center">
                  위의 항목을 선택하거나<br/>우주 공간의 천체를 클릭하여<br/>자세한 정보를 확인하세요.
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2 shrink-0">
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
