import type { GitHubData, RepoData, ContributionDay } from '../store/useStore'

// ===== Mock Repositories =====
export const MOCK_REPOS: RepoData[] = [
  {
    name: 'neural-engine',
    language: 'Python',
    stargazers_count: 2340,
    description: 'A high-performance neural network inference engine with CUDA acceleration',
    commits: 847,
    forks: 312,
  },
  {
    name: 'cloud-orchestrator',
    language: 'Go',
    stargazers_count: 1856,
    description: 'Kubernetes-native cloud orchestration framework for microservices',
    commits: 623,
    forks: 198,
  },
  {
    name: 'react-cosmos',
    language: 'TypeScript',
    stargazers_count: 4521,
    description: 'A stunning React component library with cosmic design patterns',
    commits: 1203,
    forks: 567,
  },
  {
    name: 'rustify-core',
    language: 'Rust',
    stargazers_count: 967,
    description: 'Memory-safe systems programming toolkit with zero-cost abstractions',
    commits: 445,
    forks: 89,
  },
  {
    name: 'data-forge',
    language: 'Java',
    stargazers_count: 1234,
    description: 'Real-time data processing pipeline with Apache Kafka integration',
    commits: 356,
    forks: 154,
  },
  {
    name: 'pixel-shader',
    language: 'C++',
    stargazers_count: 789,
    description: 'Real-time GPU shader playground with live GLSL editing',
    commits: 234,
    forks: 67,
  },
  {
    name: 'swift-ui-kit',
    language: 'Swift',
    stargazers_count: 3102,
    description: 'Modern SwiftUI component library for iOS and macOS applications',
    commits: 890,
    forks: 423,
  },
  {
    name: 'quantum-sim',
    language: 'Python',
    stargazers_count: 567,
    description: 'Quantum computing simulator with Qiskit integration',
    commits: 178,
    forks: 45,
  },
  {
    name: 'web-vitals-dash',
    language: 'JavaScript',
    stargazers_count: 1456,
    description: 'Real-time web performance monitoring dashboard',
    commits: 534,
    forks: 210,
  },
  {
    name: 'ml-pipeline',
    language: 'Kotlin',
    stargazers_count: 432,
    description: 'End-to-end machine learning pipeline with MLflow tracking',
    commits: 267,
    forks: 56,
  },
]

// ===== Generate Mock Contribution Grid =====
function generateMockContributions(): ContributionDay[][] {
  const weeks: ContributionDay[][] = []
  const now = new Date()

  for (let week = 51; week >= 0; week--) {
    const days: ContributionDay[] = []
    for (let day = 0; day < 7; day++) {
      const date = new Date(now)
      date.setDate(date.getDate() - (week * 7 + (6 - day)))

      // Generate realistic contribution patterns
      const isWeekend = day === 0 || day === 6
      const baseChance = isWeekend ? 0.3 : 0.7
      const hasContribution = Math.random() < baseChance

      let count = 0
      let level = 0

      if (hasContribution) {
        const rand = Math.random()
        if (rand < 0.4) {
          count = Math.floor(Math.random() * 3) + 1
          level = 1
        } else if (rand < 0.7) {
          count = Math.floor(Math.random() * 5) + 3
          level = 2
        } else if (rand < 0.9) {
          count = Math.floor(Math.random() * 8) + 5
          level = 3
        } else {
          count = Math.floor(Math.random() * 15) + 10
          level = 4
        }
      }

      days.push({
        date: date.toISOString().split('T')[0],
        count,
        level,
      })
    }
    weeks.push(days)
  }

  return weeks
}

export const MOCK_CONTRIBUTIONS = generateMockContributions()

export const MOCK_GITHUB_DATA: GitHubData = {
  repos: MOCK_REPOS,
  contributions: MOCK_CONTRIBUTIONS,
  username: 'CosmicDev',
  avatarUrl: '',
}
