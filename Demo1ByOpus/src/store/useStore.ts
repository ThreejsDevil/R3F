import { create } from 'zustand'

export type SceneState = 'DASHBOARD' | 'TRANSITIONING' | 'SPACE'

export interface RepoData {
  name: string
  language: string
  stargazers_count: number
  description: string
  commits: number
  forks: number
}

export interface ContributionDay {
  date: string
  count: number
  level: number // 0-4
}

export interface GitHubData {
  repos: RepoData[]
  contributions: ContributionDay[][]  // 52 weeks x 7 days
  username: string
  avatarUrl: string
}

interface AppState {
  // Scene
  currentScene: SceneState
  isLoaded: boolean
  loadingProgress: number

  // Data
  githubData: GitHubData | null
  selectedPlanet: RepoData | null

  // Camera targets (for GSAP)
  telescopePosition: [number, number, number]
  telescopeLookAt: [number, number, number]

  // Actions
  setScene: (scene: SceneState) => void
  triggerTransition: () => void
  completeTransition: () => void
  returnToDashboard: () => void
  setGitHubData: (data: GitHubData) => void
  setSelectedPlanet: (planet: RepoData | null) => void
  setLoaded: (loaded: boolean) => void
  setLoadingProgress: (progress: number) => void
  setTelescopePosition: (pos: [number, number, number], lookAt: [number, number, number]) => void
}

export const useStore = create<AppState>((set) => ({
  currentScene: 'DASHBOARD',
  isLoaded: false,
  loadingProgress: 0,

  githubData: null,
  selectedPlanet: null,

  telescopePosition: [2.5, 2.0, 1.5],
  telescopeLookAt: [2.5, 2.2, 0.5],

  setScene: (scene) => set({ currentScene: scene }),

  triggerTransition: () => set({ currentScene: 'TRANSITIONING' }),

  completeTransition: () => set({
    currentScene: 'SPACE',
    selectedPlanet: null,
  }),

  returnToDashboard: () => set({
    currentScene: 'DASHBOARD',
    selectedPlanet: null,
  }),

  setGitHubData: (data) => set({ githubData: data }),

  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),

  setLoaded: (loaded) => set({ isLoaded: loaded }),

  setLoadingProgress: (progress) => set({ loadingProgress: progress }),

  setTelescopePosition: (pos, lookAt) => set({
    telescopePosition: pos,
    telescopeLookAt: lookAt,
  }),
}))
