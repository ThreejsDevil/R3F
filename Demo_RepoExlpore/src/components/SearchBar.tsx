import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <>
      {/* Background Ambience */}
      <div className="cosmic-void"></div>

      <main className="w-full max-w-2xl px-6 flex flex-col items-center gap-12 z-10">
        {/* Branding Header */}
        <div className="text-center">
          <h1 className="font-['Inter'] text-[48px] font-bold text-[#e1e2eb] tracking-tighter mb-2 leading-[56px]">Cosmic Repo</h1>
          <p className="font-['Inter'] text-[16px] text-[#cfc2d7] opacity-60">Discover the universe of code.</p>
        </div>

        {/* Neumorphic Search Container */}
        <div className="neumorph-extruded w-full p-6 rounded-[2rem] transition-all duration-500 ease-in-out group">
          <form
            className="neumorph-sunken flex items-center px-6 py-5 rounded-[1.5rem] transition-all duration-300"
            onSubmit={handleSubmit}
          >
            <span
              className="material-symbols-outlined text-[#8a2be2] mr-4 text-[28px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              search
            </span>
            <input
              className="bg-transparent border-none outline-none w-full text-[#e1e2eb] font-['Inter'] text-[16px] placeholder:text-[#4c4354] focus:ring-0"
              placeholder="Search repositories..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isSearching}
            />
            <button type="submit" className="hidden" disabled={isSearching || !query.trim()}>Search</button>
          </form>
        </div>

        {/* Subtle Quick Actions/Tags */}
        <div className="flex flex-wrap justify-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full neumorph-extruded font-['Inter'] text-[12px] font-medium text-[#cfc2d7] hover:text-[#00cdd0] transition-colors">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            Trending
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full neumorph-extruded font-['Inter'] text-[12px] font-medium text-[#cfc2d7] hover:text-[#00cdd0] transition-colors">
            <span className="material-symbols-outlined text-[16px]">star</span>
            Popular
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full neumorph-extruded font-['Inter'] text-[12px] font-medium text-[#cfc2d7] hover:text-[#00cdd0] transition-colors">
            <span className="material-symbols-outlined text-[16px]">history</span>
            Recent
          </button>
        </div>
      </main>

    </>
  );
}
