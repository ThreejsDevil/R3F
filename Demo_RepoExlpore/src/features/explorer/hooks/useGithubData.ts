import { useQuery } from '@tanstack/react-query';

export interface RepoData {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  commits_count: number;
  contributors_count: number;
}

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
    contributors_count: 1500
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchMockData = async (_query: string): Promise<RepoData[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  // In a real scenario, this would filter or fetch based on `query`
  return MOCK_REPOS;
};

export function useGithubData(searchQuery: string) {
  const { data = [], isLoading, isFetching } = useQuery({
    queryKey: ['github-repos', searchQuery],
    queryFn: () => fetchMockData(searchQuery),
    enabled: !!searchQuery,
  });

  return { data, loading: isLoading || isFetching };
}
