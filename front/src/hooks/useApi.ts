import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { fetchWithAuth, ApiResponse } from '@/lib/api/base';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(options: UseApiOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { accessToken } = useAuth();

  const execute = useCallback(
    async (
      endpoint: string,
      fetchOptions: RequestInit = {}
    ): Promise<ApiResponse<T>> => {
      if (!accessToken) {
        throw new Error('No access token available');
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(endpoint, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        options.onSuccess?.(data);
        return { data };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        setError(error);
        options.onError?.(error);
        return { error: error.message };
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, options]
  );

  return {
    isLoading,
    error,
    execute,
  };
}