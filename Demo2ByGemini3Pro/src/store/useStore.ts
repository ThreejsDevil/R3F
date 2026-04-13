import { create } from 'zustand';

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
}

interface AppState {
  username: string;
  setUsername: (name: string) => void;
  isTraveling: boolean;
  setIsTraveling: (traveling: boolean) => void;
  repos: GithubRepo[];
  setRepos: (repos: GithubRepo[]) => void;
  cameraPhase: 'input' | 'stage' | 'traveling' | 'universe';
  setCameraPhase: (phase: 'input' | 'stage' | 'traveling' | 'universe') => void;
  selectedPlanet: GithubRepo | null;
  setSelectedPlanet: (repo: GithubRepo | null) => void;
}

export const useStore = create<AppState>((set) => ({
  username: '',
  setUsername: (name) => set({ username: name }),
  isTraveling: false,
  setIsTraveling: (traveling) => set({ isTraveling: traveling }),
  repos: [],
  setRepos: (repos) => set({ repos }),
  cameraPhase: 'input',
  setCameraPhase: (phase) => set({ cameraPhase: phase }),
  selectedPlanet: null,
  setSelectedPlanet: (repo) => set({ selectedPlanet: repo }),
}));
