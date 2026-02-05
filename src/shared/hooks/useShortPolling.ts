import { useState, useEffect, useRef, useCallback } from 'react';

interface UseShortPollingOptions<T> {
  fetchFn: () => Promise<T>;
  interval?: number;
  enabled?: boolean;
  deps?: any[];
}

interface UseShortPollingResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

export function useShortPolling<T>({
  fetchFn,
  interval = 5000,
  enabled = true,
  deps = [],
}: UseShortPollingOptions<T>): UseShortPollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      console.log('[useShortPolling] Fetching data...');
      const result = await fetchFn();
      setData(result);
      setError(null);
      console.log('[useShortPolling] Data fetched successfully');
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      setError(errorObj);
      console.error('[useShortPolling] Error fetching data:', errorObj);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  const startPolling = useCallback(() => {
    if (isPollingRef.current) {
      console.log('[useShortPolling] Polling already active');
      return;
    }

    console.log(`[useShortPolling] Starting polling with interval ${interval}ms`);
    isPollingRef.current = true;

    const poll = async () => {
      await fetchData();

      if (isPollingRef.current && enabled) {
        timerIdRef.current = setTimeout(poll, interval);
      }
    };

    poll();
  }, [fetchData, interval, enabled]);

  const stopPolling = useCallback(() => {
    console.log('[useShortPolling] Stopping polling');
    isPollingRef.current = false;

    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const refetch = useCallback(async () => {
    console.log('[useShortPolling] Manual refetch triggered');
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling, ...deps]);

  return {
    data,
    error,
    isLoading,
    refetch,
    startPolling,
    stopPolling,
  };
}
