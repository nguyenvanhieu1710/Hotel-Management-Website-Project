import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchData = useCallback(
    async (customUrl = url, customOptions = options) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(customUrl, customOptions);

        if (response.success) {
          setData(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [fetchData, url]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const mutate = useCallback((newData) => {
    setData(newData);
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
