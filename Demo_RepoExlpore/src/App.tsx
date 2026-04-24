import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GithubSpaceScene } from './components/GithubSpaceScene'
import { useGithubData } from './hooks/useGithubData'
import { RepoExplorerOverlay } from './components/RepoExplorerOverlay'
import { PlanetCard } from './components/PlanetCard'
import { CodexBook } from './components/CodexBook'
import { getMockPages } from './components/CodexPages'
import { useState } from 'react'

const queryClient = new QueryClient()

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [sceneVisible, setSceneVisible] = useState(false)
  const [isReturning, setIsReturning] = useState(false)

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
        }}
      />

      {/* R3F Scene */}
      <GithubSpaceScene repos={repos} isSearchMode={!sceneVisible} isSceneVisible={sceneVisible} />

      {/* Back to Search Button */}
      {sceneVisible && !isReturning && (
        <button 
          className="fixed top-10 right-10 z-30 flex items-center gap-2.5 py-2.5 pr-4.5 pl-3 whitespace-nowrap bg-linear-to-br from-[rgba(35,38,71,0.5)] to-[rgba(18,19,42,0.5)] backdrop-blur-md rounded-full text-text-dim cursor-pointer border-none font-jetbrains text-[11px] tracking-[0.15em] transition-colors hover:text-accent"
          style={{ boxShadow: '4px 4px 12px rgba(0,0,0,0.55), -2px -2px 8px rgba(120,140,200,0.08), inset 0 0 0 1px rgba(255,255,255,0.05)' }}
          onClick={() => {
            setIsReturning(true);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          우주로 돌아가기
        </button>
      )}

      {/* Planet Card */}
      {sceneVisible && repos && repos.length > 0 && (
        <PlanetCard
          owner={repos[0].full_name?.split('/')[0] || searchQuery.split('/')[0] || "nova"}
          name={repos[0].name || searchQuery.split('/')[1] || "renderer"}
          tagline={repos[0].description || "설명이 없습니다."}
          gravity={repos[0].stargazers_count > 1000 ? (repos[0].stargazers_count / 1000).toFixed(1) + 'k' : String(repos[0].stargazers_count || 0)}
          signal={repos[0].forks_count > 1000 ? (repos[0].forks_count / 1000).toFixed(1) + 'k' : String(repos[0].forks_count || 0)}
          orbiters={String(repos[0].open_issues_count || 0)}
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
