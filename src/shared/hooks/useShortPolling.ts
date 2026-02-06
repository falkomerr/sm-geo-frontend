import { useState, useEffect, useRef, useCallback } from 'react';

interface UseShortPollingOptions<T> {
  fetchFn: () => Promise<T>;
  interval?: number;
  enabled?: boolean;
  deps?: any[];
  compareFn?: (prev: T | null, next: T) => boolean;
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
  compareFn,
}: UseShortPollingOptions<T>): UseShortPollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);
  const isFirstLoadRef = useRef<boolean>(true);
  const dataRef = useRef<T | null>(null);

  // Храним актуальные значения в refs
  const fetchFnRef = useRef(fetchFn);
  const compareFnRef = useRef(compareFn);
  const intervalRef = useRef(interval);
  const enabledRef = useRef(enabled);

  dataRef.current = data;
  fetchFnRef.current = fetchFn;
  compareFnRef.current = compareFn;
  intervalRef.current = interval;
  enabledRef.current = enabled;

  const fetchData = useCallback(async () => {
    try {
      console.log('[useShortPolling] Fetching data...');
      const result = await fetchFnRef.current();

      const hasDataChanged = !compareFnRef.current || !compareFnRef.current(dataRef.current, result);

      if (hasDataChanged) {
        console.log('[useShortPolling] Data changed, updating...');
        setData(result);
      } else {
        console.log('[useShortPolling] Data unchanged, skipping update');
      }
      setError(null);
      console.log('[useShortPolling] Data fetched successfully');
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      setError(errorObj);
      console.error('[useShortPolling] Error fetching data:', errorObj);
    } finally {
      if (isFirstLoadRef.current) {
        setIsLoading(false);
        isFirstLoadRef.current = false;
      }
    }
  }, []);

  // Используем useRef для хранения стабильных ссылок на функции
  const startPollingRef = useRef<(() => void) | null>(null);
  const stopPollingRef = useRef<(() => void) | null>(null);

  // Функция запуска polling
  startPollingRef.current = () => {
    if (isPollingRef.current) {
      console.log('[useShortPolling] Polling already active');
      return;
    }

    console.log(`[useShortPolling] Starting polling with interval ${intervalRef.current}ms`);
    isPollingRef.current = true;

    const poll = async () => {
      await fetchData();

      if (isPollingRef.current && enabledRef.current) {
        timerIdRef.current = setTimeout(poll, intervalRef.current);
      }
    };

    poll();
  };

  // Функция остановки polling
  stopPollingRef.current = () => {
    console.log('[useShortPolling] Stopping polling');
    isPollingRef.current = false;

    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
  };

  const refetch = useCallback(async () => {
    console.log('[useShortPolling] Manual refetch triggered');
    await fetchData();
  }, [fetchData, dataRef]);

  useEffect(() => {
    if (enabled) {
      startPollingRef.current?.();
    } else {
      stopPollingRef.current?.();
    }

    return () => {
      stopPollingRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const startPolling = useCallback(() => {
    startPollingRef.current?.();
  }, []);

  const stopPolling = useCallback(() => {
    stopPollingRef.current?.();
  }, []);

  return {
    data,
    error,
    isLoading,
    refetch,
    startPolling,
    stopPolling,
  };
}
