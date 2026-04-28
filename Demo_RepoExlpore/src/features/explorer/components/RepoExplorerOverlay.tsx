import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface RepoExplorerOverlayProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  searchComplete: boolean; // Tells us when data is ready and we can reveal the planet
  onReveal: () => void;
  isReturning?: boolean;
  onReturnComplete?: () => void;
}

export function RepoExplorerOverlay({ onSearch, searchComplete, onReveal, isReturning, onReturnComplete }: RepoExplorerOverlayProps) {
  const [query, setQuery] = useState('');
  const [uiState, setUiState] = useState<'search' | 'loading' | 'wiping-in' | 'wiping-out' | 'hidden' | 'preparing-return'>('search');
  const [loadingName, setLoadingName] = useState('');

  // Duration in ms for the simulated/actual loading
  const loadingDuration = 2400;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // 1. Trigger the search
    setLoadingName(query.trim());
    setUiState('loading');
    onSearch(query.trim()); // this sets isSearching = true in parent
  };

  const handleChipClick = (q: string) => {
    setQuery(q);
    setLoadingName(q);
    setUiState('loading');
    onSearch(q);
  };

  // When parent finishes fetching data and we have been loading
  useEffect(() => {
    if (uiState === 'loading' && searchComplete) {
      // Simulate at least `loadingDuration` of loading animation
      const timer = setTimeout(() => {
        setUiState('wiping-in');

        // Wait for wipe to cover the screen, then wipe out to reveal
        setTimeout(() => {
          onReveal();
          setUiState('wiping-out');

          setTimeout(() => {
            setUiState('hidden');
          }, 400); // Wait for fade out
        }, 400); // Wipe in duration
      }, loadingDuration);

      return () => clearTimeout(timer);
    }
  }, [uiState, searchComplete, onReveal]);

  const returnSequenceRef = useRef(false);

  // Handle returning to search screen via circle wipe
  useEffect(() => {
    if (isReturning && !returnSequenceRef.current) {
      returnSequenceRef.current = true;
      setUiState('preparing-return'); // Mount the DOM elements first

      setTimeout(() => {
        setUiState('wiping-in'); // Cover screen

        setTimeout(() => {
          if (onReturnComplete) onReturnComplete();
          setUiState('wiping-out'); // Clear screen to reveal search UI

          setTimeout(() => {
            setUiState('search');
            setQuery('');
            returnSequenceRef.current = false;
          }, 400);
        }, 400);
      }, 20); // Small delay to let browser process the mount before animating
    }
  }, [isReturning, onReturnComplete]);


  // Derived states for CSS classes
  const isSearchVisible = uiState === 'search';
  const isLoadingVisible = uiState === 'loading';
  const isWipeIn = uiState === 'wiping-in';
  const isWipeOut = uiState === 'wiping-out';
  const isHidden = uiState === 'hidden';

  if (isHidden) return null; // Fully removed from DOM when done

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">

      {/* Nebulae Backgrounds */}
      <div className={`nebula-glow nebula-1 ${!isSearchVisible && !isLoadingVisible ? 'clearing' : ''}`} />
      <div className={`nebula-glow nebula-2 ${!isSearchVisible && !isLoadingVisible ? 'clearing' : ''}`} />
      <div className={`nebula-glow nebula-3 ${!isSearchVisible && !isLoadingVisible ? 'clearing' : ''}`} />

      {/* Circle Wipe Overlay */}
      <div className={`circle-wipe ${isWipeIn || isWipeOut ? 'in' : ''} ${isWipeOut ? 'out' : ''}`} />

      {/* Search Scene */}
      <div className={`ui-scene transition-opacity duration-300 ${!isSearchVisible ? 'opacity-0 pointer-events-none' : 'pointer-events-auto'}`}>
        <div className="w-[min(620px,90vw)] flex flex-col items-center gap-8 py-10">

          {/* Brand */}
          <div className="flex flex-col items-center gap-3 mb-1">
            <div className="w-[52px] h-[52px] rounded-full bg-linear-to-br from-(--surface-hi) to-(--surface-lo) shadow-neumorph-mark flex items-center justify-center relative">
              <div className="w-[18px] h-[18px] rounded-full bg-(--accent) shadow-[0_0_14px_var(--accent-glow),inset_-2px_-2px_3px_rgba(0,0,0,0.3)] z-10" />
              <div className="absolute w-[34px] h-[34px] rounded-full border border-[oklch(0.78_0.14_220/0.3)] animate-[orbit-ring_10s_linear_infinite]" />
            </div>
            <div className="text-[13px] tracking-[0.35em] font-medium text-(--text-dim) pl-[0.35em]">
              GITHUBBLE
            </div>
          </div>

          {/* Headline */}
          <div className="text-center">
            <div className="font-jetbrains text-[11px] tracking-[0.25em] text-(--accent) mb-3.5 opacity-85">
              레포 탐험 · v1.0
            </div>
            <h1 className="text-[40px] font-light tracking-[-0.02em] leading-[1.15] text-balance">
              깃허브 <em className="not-italic font-semibold text-gradient">우주</em>를<br />탐험해보세요
            </h1>
            <p className="mt-3 text-[14px] text-(--text-dim) tracking-[0.01em]">
              모든 프로젝트는 하나의 행성이에요.
            </p>
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleFormSubmit}
            className="w-full bg-linear-to-br from-[rgba(35,38,71,0.25)] to-[rgba(18,19,42,0.25)] backdrop-blur-[14px] rounded-[26px] p-2 shadow-neumorph-box flex items-center gap-1 transition-shadow duration-300 focus-within:shadow-neumorph-focus"
          >
            <div className="w-12 h-12 flex items-center justify-center text-(--text-dim) shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none font-inherit text-[16px] text-(--text) py-3.5 px-1 tracking-[0.01em] placeholder:text-(--text-muted) focus:ring-0"
              placeholder="탐험할 레포를 검색하세요   예) nova/renderer"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!isSearchVisible}
              spellCheck="false"
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-[54px] h-[54px] rounded-[18px] border-none bg-linear-to-br from-[rgba(35,38,71,0.8)] to-[rgba(18,19,42,0.8)] shadow-neumorph-btn text-(--accent) cursor-pointer flex items-center justify-center transition-all duration-150 shrink-0 hover:text-white hover:shadow-neumorph-btn-hover active:shadow-neumorph-btn-active"
              aria-label="관측 시작"
              disabled={!isSearchVisible}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </form>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2.5 justify-center max-w-[560px]">
            {['nova/renderer', 'lumen/grid-engine', 'kite/orbit-db', 'solace/hyperline'].map((repo) => (
              <button
                key={repo}
                type="button"
                className="bg-linear-to-br from-[rgba(35,38,71,0.2)] to-[rgba(18,19,42,0.2)] backdrop-blur-[10px] border-none rounded-full py-[9px] px-4 font-jetbrains text-[12px] text-(--text-dim) cursor-pointer shadow-neumorph-chip transition-all duration-200 flex items-center gap-2 hover:text-(--text) hover:-translate-y-px active:shadow-neumorph-chip-active"
                onClick={() => handleChipClick(repo)}
                disabled={!isSearchVisible}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-(--accent) shadow-[0_0_6px_var(--accent-glow)]" />
                {repo}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Loading Scene */}
      <div className={`ui-scene transition-opacity duration-300 ${!isLoadingVisible ? 'opacity-0 pointer-events-none' : 'pointer-events-auto'}`}>
        {/* Circle is centered because ui-scene is flex items-center justify-center */}
        <div className="relative w-[280px] h-[280px] flex items-center justify-center shrink-0">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full shadow-neumorph-loading bg-linear-to-br from-[rgba(35,38,71,0.35)] to-[rgba(18,19,42,0.35)] backdrop-blur-sm" />

          {/* Halo */}
          {isLoadingVisible && (
            <div className="absolute inset-0 rounded-full border border-[oklch(0.78_0.14_220/0.15)] animate-[halo-pulse_2.4s_ease-out_infinite]" />
          )}

          {/* Rotating Ring */}
          {isLoadingVisible && (
            <div className="absolute inset-4 rounded-full border border-dashed border-[oklch(0.78_0.14_220/0.4)] animate-[ring-spin_8s_linear_infinite]">
              <div className="absolute -top-1 left-1/2 w-[7px] h-[7px] rounded-full bg-(--accent) shadow-[0_0_10px_var(--accent-glow)] -translate-x-1/2" />
            </div>
          )}

          {/* Growing Orb */}
          {isLoadingVisible && (
            <div className="w-[12px] h-[12px] rounded-full bg-[radial-gradient(circle_at_35%_35%,oklch(0.85_0.12_220),oklch(0.55_0.16_240))] shadow-[0_0_18px_var(--accent-glow)] animate-[orb-grow_2.4s_ease-in-out_forwards]" />
          )}

          {/* Loading Label - Positioned below the centered circle */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-16 text-center w-[400px]">
            <div className="font-jetbrains text-[11px] tracking-[0.3em] text-(--accent) mb-2.5 opacity-85">
              · 레포 탐색 중 ·
            </div>
            <div className="text-[18px] font-medium tracking-[0.01em] mb-5 text-(--text)">
              {loadingName}
            </div>
            <div className="mx-auto w-full h-[2px] bg-[rgba(255,255,255,0.08)] rounded-[2px] overflow-hidden flex justify-center">
              {isLoadingVisible && (
                <div className="w-0 h-full bg-(--accent) shadow-[0_0_10px_var(--accent-glow)] animate-[progress_2.4s_ease-in_forwards]" />
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
