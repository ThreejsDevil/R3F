type FetchOptions = RequestInit;

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function githubFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const defaultHeaders = {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `GitHub API Error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // Ignore if body is not JSON
    }
    throw new ApiError(errorMessage, response.status);
  }

  return response.json() as Promise<T>;
}
