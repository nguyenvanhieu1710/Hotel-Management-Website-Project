import { useState, useEffect, useCallback, useMemo } from "react";
import { evaluationService } from "../services";

export const useEvaluations = (params = {}, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize params to prevent infinite loops
  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);

  const fetchEvaluations = useCallback(
    async (fetchParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...memoizedParams, ...fetchParams };
        const response = await evaluationService.getEvaluations(mergedParams);

        setData(response.evaluations || []);
        setPagination(response.pagination);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [memoizedParams]
  );

  const refetch = useCallback(
    (newParams = {}) => {
      return fetchEvaluations(newParams);
    },
    [fetchEvaluations]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchEvaluations();
    }
  }, [fetchEvaluations, autoFetch]);

  return {
    evaluations: data,
    pagination,
    loading,
    error,
    refetch,
    fetchEvaluations,
  };
};

export const useEvaluation = (evaluationId, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvaluation = useCallback(async () => {
    if (!evaluationId) return;

    try {
      setLoading(true);
      setError(null);
      const evaluation = await evaluationService.getEvaluationById(
        evaluationId
      );
      setData(evaluation);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [evaluationId]);

  useEffect(() => {
    if (autoFetch && evaluationId) {
      fetchEvaluation();
    }
  }, [fetchEvaluation, autoFetch, evaluationId]);

  return {
    evaluation: data,
    loading,
    error,
    refetch: fetchEvaluation,
  };
};

export const useRoomEvaluations = (roomId, params = {}, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoomEvaluations = useCallback(
    async (fetchParams = {}) => {
      if (!roomId) return;

      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...params, ...fetchParams };
        const response = await evaluationService.getEvaluationsByRoom(
          roomId,
          mergedParams
        );

        setData(response.evaluations || []);
        setPagination(response.pagination);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [roomId, params]
  );

  const refetch = useCallback(
    (newParams = {}) => {
      return fetchRoomEvaluations(newParams);
    },
    [fetchRoomEvaluations]
  );

  useEffect(() => {
    if (autoFetch && roomId) {
      fetchRoomEvaluations();
    }
  }, [fetchRoomEvaluations, autoFetch, roomId]);

  return {
    roomEvaluations: data,
    pagination,
    loading,
    error,
    refetch,
    fetchRoomEvaluations,
  };
};

export const useRoomRatingStats = (roomId, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRatingStats = useCallback(async () => {
    if (!roomId) return;

    try {
      setLoading(true);
      setError(null);
      const stats = await evaluationService.getRoomRatingStats(roomId);
      setData(stats);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (autoFetch && roomId) {
      fetchRatingStats();
    }
  }, [fetchRatingStats, autoFetch, roomId]);

  return {
    ratingStats: data,
    loading,
    error,
    refetch: fetchRatingStats,
  };
};

export const useUserEvaluations = (userId, params = {}, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserEvaluations = useCallback(
    async (fetchParams = {}) => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...params, ...fetchParams };
        const response = await evaluationService.getUserEvaluations(
          userId,
          mergedParams
        );

        setData(response.evaluations || []);
        setPagination(response.pagination);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [userId, params]
  );

  const refetch = useCallback(
    (newParams = {}) => {
      return fetchUserEvaluations(newParams);
    },
    [fetchUserEvaluations]
  );

  useEffect(() => {
    if (autoFetch && userId) {
      fetchUserEvaluations();
    }
  }, [fetchUserEvaluations, autoFetch, userId]);

  return {
    userEvaluations: data,
    pagination,
    loading,
    error,
    refetch,
    fetchUserEvaluations,
  };
};

export const useRecentEvaluations = (limit = 10, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecentEvaluations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const evaluations = await evaluationService.getRecentEvaluations(limit);
      setData(evaluations || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchRecentEvaluations();
    }
  }, [fetchRecentEvaluations, autoFetch]);

  return {
    recentEvaluations: data,
    loading,
    error,
    refetch: fetchRecentEvaluations,
  };
};

export const useEvaluationMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEvaluation = useCallback(async (evaluationData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await evaluationService.createEvaluation(evaluationData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvaluation = useCallback(async (id, evaluationData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await evaluationService.updateEvaluation(
        id,
        evaluationData
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvaluation = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await evaluationService.deleteEvaluation(id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvaluationStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      const result = await evaluationService.updateEvaluationStatus(id, status);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    updateEvaluationStatus,
    loading,
    error,
  };
};

export default useEvaluations;
