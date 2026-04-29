import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GithubSpaceScene } from './features/explorer/components/GithubSpaceScene'
import { useGithubData } from './features/explorer/hooks/useGithubData'
import { RepoExplorerOverlay } from './features/explorer/components/RepoExplorerOverlay'
import { PlanetCard } from './features/explorer/components/PlanetCard'
import { CodexBook } from './features/explorer/components/CodexBook'
import { getMockPages } from './utils/mockData'
import { useState } from 'react'

const queryClient = new QueryClient()

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [sceneVisible, setSceneVisible] = useState(false)
  const [isReturning, setIsReturning] = useState(false)
  const [selectedPart, setSelectedPart] = useState<'planet' | 'commits' | 'prs' | 'issues' | null>(null)

  const { data: repos, loading } = useGithubData(searchQuery)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setHasSearched(true)
    setSceneVisible(false)
  }

  // It's search mode if the user hasn't searched yet, or if we are currently loading the results
  const searchComplete = hasSearched && !loading

  return (
    <div className="w-screen h-screen relative bg-[#0a0b14] overflow-hidden">
      <RepoExplorerOverlay
        onSearch={handleSearch}
        isSearching={loading}
        searchComplete={searchComplete}
        onReveal={() => setSceneVisible(true)}
        isReturning={isReturning}
        onReturnComplete={() => {
          setSceneVisible(false);
          setHasSearched(false);
          setSearchQuery('');
          setIsReturning(false);
          setSelectedPart(null);
        }}
      />

      {/* R3F Scene */}
      <GithubSpaceScene 
        repos={repos} 
        isSearchMode={!sceneVisible} 
        isSceneVisible={sceneVisible}
        selectedPart={selectedPart}
        onSelectPart={setSelectedPart}
      />

      {/* Back to Search Button */}
      {sceneVisible && !isReturning && (
        <button 
          className="fixed top-10 right-10 z-30 flex items-center gap-2.5 py-2.5 pr-4.5 pl-3 whitespace-nowrap bg-linear-to-br from-[rgba(35,38,71,0.5)] to-[rgba(18,19,42,0.5)] backdrop-blur-md rounded-full text-text-dim cursor-pointer border-none font-jetbrains text-[11px] tracking-[0.15em] transition-colors hover:text-accent"
          style={{ boxShadow: '4px 4px 12px rgba(0,0,0,0.55), -2px -2px 8px rgba(120,140,200,0.08), inset 0 0 0 1px rgba(255,255,255,0.05)' }}
          onClick={() => {
            setIsReturning(true);
            setSelectedPart(null);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          우주로 돌아가기
        </button>
      )}

      {/* Planet Card */}
      {sceneVisible && repos && repos.length > 0 && (
        <PlanetCard
          repo={repos[0]}
          selectedPart={selectedPart}
          onSelectPart={setSelectedPart}
        />
      )}

      {/* Codex Book */}
      {sceneVisible && repos && repos.length > 0 && (
        <CodexBook 
          pages={getMockPages(repos[0].full_name || searchQuery || "nova / renderer")}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}
