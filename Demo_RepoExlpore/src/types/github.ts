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
  prs_count?: number;
}
