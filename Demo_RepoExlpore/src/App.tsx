import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GithubSpaceScene } from './components/GithubSpaceScene'
import { useGithubData } from './hooks/useGithubData'

const queryClient = new QueryClient()

function AppContent() {
  const { data: repos, loading } = useGithubData()

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#16171b', color: 'white' }}>
        LOADING DATA...
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GithubSpaceScene repos={repos} />
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
