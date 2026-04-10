import { useState, useEffect, useCallback, useRef } from 'react';
import type { CancelTokenSource } from 'axios';
import axios from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

interface FetchOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  dependencies?: any[];
  cache?: boolean;
  cacheTime?: number;
  retries?: number;
  retryDelay?: number;
}

const cache = new Map<string, { data: any; timestamp: number }>();

export function useFetch<T = any>(
  url: string,
  options: FetchOptions = {}
) {
  const {
    immediate = true,
    onSuccess,
    onError,
    dependencies = [],
    cache: useCache = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retries = 0,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: immediate,
    error: null,
    status: immediate ? 'loading' : 'idle'
  });

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (skipCache = false) => {
    // Check cache first
    if (useCache && !skipCache) {
      const cached = cache.get(url);
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        setState({
          data: cached.data,
          loading: false,
          error: null,
          status: 'success'
        });
        onSuccess?.(cached.data);
        return;
      }
    }

    // Cancel previous request
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Operation canceled due to new request');
    }

    cancelTokenRef.current = axios.CancelToken.source();

    setState(prev => ({ ...prev, loading: true, status: 'loading' }));

    try {
      const response = await axios.get<T>(url, {
        cancelToken: cancelTokenRef.current.token
      });

      if (!mountedRef.current) return;

      // Cache response
      if (useCache) {
        cache.set(url, { data: response.data, timestamp: Date.now() });
      }

      setState({
        data: response.data,
        loading: false,
        error: null,
        status: 'success'
      });

      onSuccess?.(response.data);
      retryCountRef.current = 0;
    } catch (error) {
      if (!mountedRef.current) return;

      if (axios.isCancel(error)) {
        return;
      }

      // Handle retries
      if (retryCountRef.current < retries) {
        retryCountRef.current++;
        setTimeout(() => fetchData(skipCache), retryDelay * retryCountRef.current);
        return;
      }

      setState({
        data: null,
        loading: false,
        error: error as Error,
        status: 'error'
      });

      onError?.(error as Error);
    }
  }, [url, useCache, cacheTime, onSuccess, onError, retries, retryDelay]);

  const refetch = useCallback((skipCache = false) => {
    return fetchData(skipCache);
  }, [fetchData]);

  const clearCache = useCallback(() => {
    cache.delete(url);
  }, [url]);

  const abort = useCallback(() => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Operation aborted by user');
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (immediate) {
      fetchData();
    }

    return () => {
      mountedRef.current = false;
      abort();
    };
  }, [url, ...dependencies]);

  return {
    ...state,
    refetch,
    clearCache,
    abort
  };
}

// Hook for paginated data
export function usePaginatedFetch<T = any>(
  baseUrl: string,
  options: FetchOptions = {}
) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState<T[]>([]);

  const url = `${baseUrl}?page=${page}`;
  // Removed unused 'data' variable from destructuring
  const { loading, error, refetch } = useFetch<{ items: T[]; total: number }>(
    url,
    {
      ...options,
      onSuccess: (newData: { items: T[]; total: number }) => {
        setAllData(prev => [...prev, ...newData.items]);
        setHasMore(newData.items.length > 0);
        options.onSuccess?.(newData);
      }
    }
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
    refetch();
  }, [refetch]);

  return {
    data: allData,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    page
  };
}

// Hook for mutation (POST, PUT, DELETE)
export function useMutation<T = any, R = any>(
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post'
) {
  const [state, setState] = useState<FetchState<R>>({
    data: null,
    loading: false,
    error: null,
    status: 'idle'
  });

  const mutate = useCallback(async (data?: T): Promise<R> => {
    setState(prev => ({ ...prev, loading: true, status: 'loading' }));

    try {
      let response;
      if (method === 'delete') {
        response = await axios.delete<R>(url);
      } else {
        response = await axios[method]<R>(url, data);
      }
      
      setState({
        data: response.data,
        loading: false,
        error: null,
        status: 'success'
      });

      return response.data;
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as Error,
        status: 'error'
      });

      throw error;
    }
  }, [url, method]);

  return {
    ...state,
    mutate
  };
}