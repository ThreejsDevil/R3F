import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { fetchGitHubData } from '../lib/github'
import { MOCK_GITHUB_DATA } from '../lib/mockData'

export function useGitHubData(username?: string) {
  const { githubData, setGitHubData } = useStore()

  useEffect(() => {
    async function load() {
      const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined

      if (token && username) {
        try {
          const data = await fetchGitHubData(username, token)
          setGitHubData(data)
          return
        } catch (err) {
          console.warn('GitHub API fetch failed, falling back to mock data:', err)
        }
      }

      // Use mock data
      setGitHubData(MOCK_GITHUB_DATA)
    }

    if (!githubData) {
      load()
    }
  }, [username, githubData, setGitHubData])

  return githubData
}
