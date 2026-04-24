import React, { useState } from 'react';
import { Search, TrendingUp, Star, History } from 'lucide-react';

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
        <div className="neumorph-extruded w-full p-6 rounded-4xl transition-all duration-500 ease-in-out group">
          <form
            className="neumorph-sunken flex items-center gap-x-4 px-6 py-5 h-12 rounded-3xl transition-all duration-300"
            onSubmit={handleSubmit}
          >
            <Search className="text-[#8a2be2] shrink-0 px-2 w-7 h-7" />
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
            <TrendingUp className="w-4 h-4" />
            Trending
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full neumorph-extruded font-['Inter'] text-[12px] font-medium text-[#cfc2d7] hover:text-[#00cdd0] transition-colors">
            <Star className="w-4 h-4" />
            Popular
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full neumorph-extruded font-['Inter'] text-[12px] font-medium text-[#cfc2d7] hover:text-[#00cdd0] transition-colors">
            <History className="w-4 h-4" />
            Recent
          </button>
        </div>
      </main>

    </>
  );
}
