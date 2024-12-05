// Base API configuration and utilities
export const API_URL = 'http://localhost:5001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response;
}