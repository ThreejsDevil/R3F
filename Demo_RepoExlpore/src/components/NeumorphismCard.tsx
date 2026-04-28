import React, { useState, useEffect } from 'react';
import type { RepoData } from '../types/github';

interface NeumorphismCardProps {
  repo: RepoData | null;
  onClose?: () => void;
}

export function NeumorphismCard({ repo, onClose }: NeumorphismCardProps) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Reset page when repo changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(0);
  }, [repo]);

  if (!repo) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPage((p) => (p + 1) % 2); // 2 pages total
  };

  return (
    <div
      className={`w-[380px] bg-[#202125] rounded-[30px] p-[30px] shadow-[15px_15px_30px_rgba(0,0,0,0.4),-10px_-10px_20px_rgba(255,255,255,0.04)] font-sans text-white cursor-pointer transition-all duration-400 select-none relative hover:translate-y-[-5px] ${repo ? 'animate-slideIn' : ''}`}
      onClick={handleNext}
    >
      {onClose && (
        <button
          className="absolute top-5 right-5 bg-[#1a1b1f] border-none text-[24px] text-[#636672] rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-[3px_3px_6px_rgba(0,0,0,0.4),-3px_-3px_6px_rgba(255,255,255,0.03)] transition-all duration-200 z-10 hover:text-white hover:scale-105"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          &times;
        </button>
      )}

      {page === 0 ? (
        <div className="flex flex-col animate-fadeIn">
          <div className="flex items-center gap-[15px] mb-[25px]">
            <span className="bg-[#16171b] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.03)] py-1.5 px-[14px] rounded-[20px] text-[11px] tracking-[1.5px] text-[#a1dff0] font-bold">
              {repo.language?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>

          <h1 className="text-[30px] font-bold mb-[15px] tracking-[-0.5px] text-[#eff0f4]">{repo.full_name}</h1>
          <p className="text-[#9295a3] text-[15px] leading-normal mb-[35px] min-h-[45px]">
            {repo.description || 'No description available for this repository.'}
          </p>

          <div className="flex justify-between bg-[#1a1b1f] rounded-[20px] py-5 px-2.5 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.4),inset_-8px_-8px_16px_rgba(255,255,255,0.02)]">
            <div className="flex flex-col items-center w-[30%]">
              <div className="text-[20px] mb-2 text-[#8fa0e9]">★</div>
              <div className="text-[20px] font-extrabold mb-[5px] text-white">
                {repo.stargazers_count > 1000 ? (repo.stargazers_count / 1000).toFixed(1) + 'k' : repo.stargazers_count}
              </div>
              <div className="text-[10px] text-[#555865] tracking-[1.5px] font-bold">STARS</div>
            </div>
            <div className="w-px bg-[rgba(255,255,255,0.03)]" />
            <div className="flex flex-col items-center w-[30%]">
              <div className="text-[20px] mb-2 text-[#e491a6]">⑂</div>
              <div className="text-[20px] font-extrabold mb-[5px] text-white">
                {repo.forks_count > 1000 ? (repo.forks_count / 1000).toFixed(1) + 'k' : repo.forks_count}
              </div>
              <div className="text-[10px] text-[#555865] tracking-[1.5px] font-bold">FORKS</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col animate-fadeIn">
          <div className="flex items-center gap-[15px] mb-[25px]">
            <span className="bg-[#16171b] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.03)] py-1.5 px-[14px] rounded-[20px] text-[11px] tracking-[1.5px] text-[#a1dff0] font-bold">
              ACTIVITY & STATS
            </span>
          </div>
          <h1 className="text-[30px] font-bold mb-[15px] tracking-[-0.5px] text-[#eff0f4]">{repo.name}</h1>

          <div className="flex flex-col items-stretch gap-[15px] mt-5 bg-[#1a1b1f] rounded-[20px] py-5 px-2.5 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.4),inset_-8px_-8px_16px_rgba(255,255,255,0.02)]">
            <div className="flex justify-between px-[10px]">
              <span className="text-[#9295a3] font-bold">Total Commits</span>
              <span className="text-white font-bold">{repo.commits_count?.toLocaleString() || 0}</span>
            </div>
            <div className="w-full h-px bg-[rgba(255,255,255,0.03)]" />
            <div className="flex justify-between px-[10px]">
              <span className="text-[#9295a3] font-bold">Contributors</span>
              <span className="text-white font-bold">{repo.contributors_count?.toLocaleString() || 0}</span>
            </div>
            <div className="w-full h-px bg-[rgba(255,255,255,0.03)]" />
            <div className="flex justify-between px-[10px]">
              <span className="text-[#e07474] font-bold">Open Issues</span>
              <span className="text-white font-bold">{repo.open_issues_count?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-2 mt-[30px]">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${page === 0 ? 'bg-[#a1dff0] shadow-[0_0_10px_rgba(161,223,240,0.5)] scale-125' : 'bg-[#2b2e38]'}`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${page === 1 ? 'bg-[#a1dff0] shadow-[0_0_10px_rgba(161,223,240,0.5)] scale-125' : 'bg-[#2b2e38]'}`} />
      </div>
    </div>
  );
}
