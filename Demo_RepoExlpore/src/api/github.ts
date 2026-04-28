import type { RepoData } from '../types/github';
// import { githubFetch } from './client'; // Uncomment to use real API

const MOCK_REPOS: RepoData[] = [
  {
    id: 1,
    name: 'react',
    full_name: 'facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    language: 'JavaScript',
    stargazers_count: 213000,
    forks_count: 45000,
    open_issues_count: 1200,
    commits_count: 35000,
    contributors_count: 1500,
    prs_count: 8500
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function searchRepositories(_query: string): Promise<RepoData[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Real API usage example:
  // interface SearchResponse { items: RepoData[] }
  // const data = await githubFetch<SearchResponse>(`https://api.github.com/search/repositories?q=${query}`);
  // return data.items;
  
  // Returning mock data as requested
  return MOCK_REPOS;
}
