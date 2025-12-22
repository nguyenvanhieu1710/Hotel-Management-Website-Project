import { useState, useEffect, useCallback, useRef } from "react";

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const mountedRef = useRef(true);
  const lastCallRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!apiFunction || !mountedRef.current) return;

    // Prevent duplicate calls
    const currentCall = Date.now();
    lastCallRef.current = currentCall;

    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction();

      // Check if this is still the latest call
      if (!mountedRef.current || lastCallRef.current !== currentCall) return;

      if (response?.success !== false) {
        setData(response?.data || response);
        if (response?.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      if (!mountedRef.current || lastCallRef.current !== currentCall) return;
      setError(err.message || "An error occurred");
      setData(null);
    } finally {
      if (mountedRef.current && lastCallRef.current === currentCall) {
        setLoading(false);
      }
    }
  }, [apiFunction]);

  useEffect(() => {
    mountedRef.current = true;

    // Add small delay to prevent rapid successive calls
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchData();
      }
    }, 10);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const mutate = useCallback((newData) => {
    if (mountedRef.current) {
      setData(newData);
    }
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    refetch,
    mutate,
  };
};

export default useApi;
