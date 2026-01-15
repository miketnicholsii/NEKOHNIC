import { useState, useEffect, useCallback, useRef } from "react";

interface UseAsyncWithTimeoutOptions<T> {
  /** Timeout in milliseconds (default: 30000 = 30 seconds) */
  timeout?: number;
  /** Callback when timeout occurs */
  onTimeout?: () => void;
  /** Initial data value */
  initialData?: T;
}

interface UseAsyncWithTimeoutResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isTimedOut: boolean;
  retry: () => void;
  reset: () => void;
}

/**
 * Hook for async operations with timeout to prevent infinite spinners
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, isTimedOut, retry } = useAsyncWithTimeout(
 *   () => fetchData(),
 *   { timeout: 15000, onTimeout: () => console.log('Timed out!') }
 * );
 * 
 * if (isTimedOut) return <TimeoutUI onRetry={retry} />;
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorUI error={error} onRetry={retry} />;
 * return <DataView data={data} />;
 * ```
 */
export function useAsyncWithTimeout<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncWithTimeoutOptions<T> = {}
): UseAsyncWithTimeoutResult<T> {
  const { timeout = 30000, onTimeout, initialData } = options;

  const [data, setData] = useState<T | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const hasTimedOutRef = useRef(false);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  const execute = useCallback(async () => {
    if (!isMountedRef.current) return;

    setIsLoading(true);
    setError(null);
    setIsTimedOut(false);
    hasTimedOutRef.current = false;
    clearTimeoutRef();

    // Set up timeout
    timeoutIdRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsTimedOut(true);
        setIsLoading(false);
        hasTimedOutRef.current = true;
        onTimeout?.();
      }
    }, timeout);

    try {
      const result = await asyncFn();
      if (isMountedRef.current && !hasTimedOutRef.current) {
        clearTimeoutRef();
        setData(result);
        setIsLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current && !hasTimedOutRef.current) {
        clearTimeoutRef();
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    }
  }, [asyncFn, timeout, onTimeout, clearTimeoutRef]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  const reset = useCallback(() => {
    setData(initialData ?? null);
    setIsLoading(false);
    setError(null);
    setIsTimedOut(false);
    clearTimeoutRef();
  }, [initialData, clearTimeoutRef]);

  useEffect(() => {
    isMountedRef.current = true;
    execute();

    return () => {
      isMountedRef.current = false;
      clearTimeoutRef();
    };
  }, [retryCount, execute, clearTimeoutRef]); // Re-execute on retry

  return { data, isLoading, error, isTimedOut, retry, reset };
}

/**
 * Simple timeout wrapper for promises
 * 
 * @example
 * ```ts
 * try {
 *   const result = await withTimeout(fetchData(), 10000);
 * } catch (error) {
 *   if (error.message.includes('timed out')) {
 *     // Handle timeout
 *   }
 * }
 * ```
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export default useAsyncWithTimeout;
