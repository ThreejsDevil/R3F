import React, { useState } from 'react';

export interface CodexBookProps {
  pages: React.ReactNode[];
}

export function CodexBook({ pages }: CodexBookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Ensure even number of pages
  const validPages = pages.length % 2 === 0 ? pages : [...pages, <div key="blank"></div>];
  const sheetCount = Math.max(0, (validPages.length - 2) / 2);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage < sheetCount) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  return (
    <>
      {/* Book Icon */}
      <div
        className="fixed bottom-10 right-10 z-20 w-[110px] h-[150px] cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
        style={{ perspective: '800px' }}
        onClick={() => setIsOpen(true)}
      >
        <div
          className="absolute inset-0 rounded-[6px_10px_10px_6px] bg-linear-to-r from-[oklch(0.22_0.05_260)] from-0% via-[oklch(0.22_0.05_260)] via-8% to-[oklch(0.32_0.07_250)] to-100%"
          style={{
            boxShadow: '6px 8px 20px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.05), inset -6px 0 12px rgba(0,0,0,0.4)'
          }}
        >
          <div
            className="absolute top-0 bottom-0 left-0 w-[10px] bg-linear-to-b from-[oklch(0.15_0.03_260)] to-[oklch(0.18_0.04_260)]"
            style={{ boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.6)' }}
          />
          <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full border border-[oklch(0.78_0.14_220/0.45)] flex items-center justify-center text-accent font-jetbrains text-[9px] tracking-[0.2em]">
            <span className="absolute top-[-7px] left-1/2 -translate-x-1/2 text-[10px] bg-[oklch(0.28_0.06_260)] px-1">◈</span>
            STAT
          </div>
          <div className="absolute bottom-[18px] left-1/2 -translate-x-1/2 font-jetbrains text-[8px] tracking-[0.3em] text-text-dim whitespace-nowrap">
            CODEX
          </div>
        </div>
      </div>

      {/* Book Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-[rgba(5,6,14,0.92)] backdrop-blur-md pointer-events-auto' : 'bg-transparent backdrop-blur-none pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`relative w-[min(900px,92vw)] h-[min(560px,78vh)] transition-all duration-700 ease-in-out ${isOpen ? 'opacity-100 scale-100 rotate-x-6' : 'opacity-0 scale-40 rotate-x-40'
            }`}
          style={{ perspective: '2400px' }}
          onClick={(e) => e.stopPropagation()} // Prevent modal close
        >
          <button
            className="absolute -top-3 -right-3 w-9 h-9 rounded-full border-none bg-linear-to-br from-surface-hi to-surface-lo text-text cursor-pointer z-10 flex items-center justify-center hover:brightness-110 transition-all"
            style={{ boxShadow: '4px 4px 10px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)' }}
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          <div className="absolute inset-0 flex" style={{ transformStyle: 'preserve-3d' }}>
            {/* Base Left */}
            <div
              className="flex-1 relative rounded-[16px_2px_2px_16px] overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, oklch(0.28 0.025 260), oklch(0.22 0.02 260))',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08), inset -20px 0 30px rgba(0,0,0,0.4), -10px 10px 40px rgba(0,0,0,0.7)'
              }}
            >
              <div className="absolute inset-0 p-10 overflow-hidden">
                {validPages[0]}
              </div>
            </div>

            {/* Base Right */}
            <div
              className="flex-1 relative rounded-[2px_16px_16px_2px] overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, oklch(0.28 0.025 260), oklch(0.22 0.02 260))',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08), inset 20px 0 30px rgba(0,0,0,0.4), 10px 10px 40px rgba(0,0,0,0.7)'
              }}
            >
              <div className="absolute inset-0 p-10 overflow-hidden">
                {validPages[validPages.length - 1]}
              </div>
            </div>

            {/* Sheets */}
            <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
              {Array.from({ length: sheetCount }).map((_, i) => {
                const isFlipped = i < currentPage;
                return (
                  <div
                    key={i}
                    className="absolute top-0 right-0 w-1/2 h-full pointer-events-auto"
                    style={{
                      transformOrigin: 'left center',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.9s cubic-bezier(0.55, 0.05, 0.25, 1)',
                      transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                      zIndex: isFlipped ? i + 1 : sheetCount - i + 100
                    }}
                  >
                    {/* Front Face */}
                    <div
                      className="absolute inset-0 rounded-[2px_16px_16px_2px] overflow-hidden p-10"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: 'linear-gradient(145deg, oklch(0.28 0.025 260), oklch(0.22 0.02 260))',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08), inset 20px 0 30px rgba(0,0,0,0.4)',
                      }}
                    >
                      {validPages[1 + i * 2]}
                      <div className="absolute inset-0 pointer-events-none rounded-[2px_16px_16px_2px] bg-linear-to-r from-[rgba(0,0,0,0.22)] from-0% via-[rgba(0,0,0,0)] via-95% to-[rgba(0,0,0,0.1)] to-100%" />
                    </div>

                    {/* Back Face */}
                    <div
                      className="absolute inset-0 rounded-[16px_2px_2px_16px] overflow-hidden p-10"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: 'linear-gradient(145deg, oklch(0.28 0.025 260), oklch(0.22 0.02 260))',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08), inset -20px 0 30px rgba(0,0,0,0.4)',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      {validPages[2 + i * 2]}
                      <div className="absolute inset-0 pointer-events-none rounded-[16px_2px_2px_16px] bg-linear-to-r from-[rgba(0,0,0,0.22)] from-0% via-[rgba(0,0,0,0)] via-95% to-[rgba(0,0,0,0.1)] to-100%" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Spine Shadow */}
            <div
              className="absolute top-0 bottom-0 left-1/2 w-10 -translate-x-1/2 pointer-events-none z-10"
              style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.55) 50%, rgba(0,0,0,0))' }}
            />
          </div>

          {/* Navigation */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3.5 z-20">
            <button
              className="w-9 h-9 rounded-full border-none bg-linear-to-br from-[rgba(35,38,71,0.7)] to-[rgba(18,19,42,0.7)] backdrop-blur-md text-text-dim flex items-center justify-center cursor-pointer transition-all hover:text-accent disabled:opacity-35 disabled:cursor-default"
              style={{ boxShadow: '4px 4px 10px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)' }}
              onClick={handlePrev}
              disabled={currentPage === 0}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div className="font-jetbrains text-[11px] tracking-[0.2em] text-text-dim min-w-[60px] text-center">
              {currentPage + 1} / {sheetCount + 1}
            </div>
            <button
              className="w-9 h-9 rounded-full border-none bg-linear-to-br from-[rgba(35,38,71,0.7)] to-[rgba(18,19,42,0.7)] backdrop-blur-md text-text-dim flex items-center justify-center cursor-pointer transition-all hover:text-accent disabled:opacity-35 disabled:cursor-default"
              style={{ boxShadow: '4px 4px 10px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)' }}
              onClick={handleNext}
              disabled={currentPage === sheetCount}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
