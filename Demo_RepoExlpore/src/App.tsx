import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GithubSpaceScene } from './components/GithubSpaceScene'
import { useGithubData } from './hooks/useGithubData'
import { SearchBar } from './components/SearchBar'
import { useState } from 'react'

const queryClient = new QueryClient()

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const { data: repos, loading } = useGithubData(searchQuery)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setHasSearched(true)
  }

  // It's search mode if the user hasn't searched yet, or if we are currently loading the results
  const isSearchMode = !hasSearched || loading

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Search UI Layer */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 20, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          opacity: isSearchMode ? 1 : 0,
          pointerEvents: isSearchMode ? 'auto' : 'none',
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        {!hasSearched && (
          <SearchBar onSearch={handleSearch} isSearching={loading} />
        )}
        {hasSearched && loading && (
          <div style={{ color: 'white', fontSize: '1.5rem', fontFamily: 'Outfit' }}>
            Fetching Repository Data...
          </div>
        )}
      </div>

      <GithubSpaceScene repos={repos} isSearchMode={isSearchMode} />
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
