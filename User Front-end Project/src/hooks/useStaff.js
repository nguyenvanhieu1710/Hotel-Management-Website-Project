import { useState, useEffect, useCallback } from "react";
import { staffService } from "../services";

export const useStaff = (params = {}, options = {}) => {
  const { autoFetch = true, isPublic = true } = options;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStaff = useCallback(
    async (fetchParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...params, ...fetchParams };
        const response = isPublic
          ? await staffService.getPublicStaff(mergedParams)
          : await staffService.getStaff(mergedParams);

        setData(response.staff || []);
        setPagination(response.pagination);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [params, isPublic]
  );

  const refetch = useCallback(
    (newParams = {}) => {
      return fetchStaff(newParams);
    },
    [fetchStaff]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchStaff();
    }
  }, [fetchStaff, autoFetch]);

  return {
    staff: data,
    pagination,
    loading,
    error,
    refetch,
    fetchStaff,
  };
};

export const useStaffMember = (staffId, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStaffMember = useCallback(async () => {
    if (!staffId) return;

    try {
      setLoading(true);
      setError(null);
      const staff = await staffService.getStaffById(staffId);
      setData(staff);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    if (autoFetch && staffId) {
      fetchStaffMember();
    }
  }, [fetchStaffMember, autoFetch, staffId]);

  return {
    staffMember: data,
    loading,
    error,
    refetch: fetchStaffMember,
  };
};

export const useStaffStatistics = (options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await staffService.getStaffStatistics();
      setData(stats);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchStatistics();
    }
  }, [fetchStatistics, autoFetch]);

  return {
    statistics: data,
    loading,
    error,
    refetch: fetchStatistics,
  };
};

export const usePositions = (options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const positions = await staffService.getPositions();
      setData(positions || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchPositions();
    }
  }, [fetchPositions, autoFetch]);

  return {
    positions: data,
    loading,
    error,
    refetch: fetchPositions,
  };
};

export const useStaffMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createStaff = useCallback(async (staffData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await staffService.createStaff(staffData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStaff = useCallback(async (id, staffData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await staffService.updateStaff(id, staffData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStaff = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await staffService.deleteStaff(id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createStaff,
    updateStaff,
    deleteStaff,
    loading,
    error,
  };
};

export default useStaff;
