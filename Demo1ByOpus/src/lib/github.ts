import type { GitHubData } from '../store/useStore'

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

const QUERY = `
query($username: String!) {
  user(login: $username) {
    login
    avatarUrl
    repositories(first: 20, orderBy: { field: STARGAZERS, direction: DESC }, ownerAffiliations: OWNER) {
      nodes {
        name
        primaryLanguage { name }
        stargazerCount
        description
        forkCount
        defaultBranchRef {
          target {
            ... on Commit {
              history { totalCount }
            }
          }
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}
`

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

export async function fetchGitHubData(username: string, token: string): Promise<GitHubData> {
  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
  })

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }

  const json = await res.json()
  const user = json.data.user

  const repos = user.repositories.nodes.map((repo: any) => ({
    name: repo.name,
    language: repo.primaryLanguage?.name || 'Unknown',
    stargazers_count: repo.stargazerCount,
    description: repo.description || '',
    commits: repo.defaultBranchRef?.target?.history?.totalCount || 0,
    forks: repo.forkCount,
  }))

  const contributions = user.contributionsCollection.contributionCalendar.weeks.map(
    (week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVEL_MAP[day.contributionLevel] || 0,
      }))
  )

  return {
    repos,
    contributions,
    username: user.login,
    avatarUrl: user.avatarUrl,
  }
}
