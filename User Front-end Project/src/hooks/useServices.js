import { useState, useEffect, useCallback, useMemo } from "react";
import { serviceService } from "../services";

export const useServices = (params = {}, options = {}) => {
  const { autoFetch = true, isPublic = true } = options;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize params to prevent infinite loops
  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);

  const fetchServices = useCallback(
    async (fetchParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...memoizedParams, ...fetchParams };
        const response = isPublic
          ? await serviceService.getPublicServices(mergedParams)
          : await serviceService.getServices(mergedParams);

        setData(response.services || []);
        setPagination(response.pagination);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [memoizedParams, isPublic]
  );

  const refetch = useCallback(
    (newParams = {}) => {
      return fetchServices(newParams);
    },
    [fetchServices]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchServices();
    }
  }, [fetchServices, autoFetch]);

  return {
    services: data,
    pagination,
    loading,
    error,
    refetch,
    fetchServices,
  };
};

export const useService = (serviceId, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchService = useCallback(async () => {
    if (!serviceId) return;

    try {
      setLoading(true);
      setError(null);
      const service = await serviceService.getServiceById(serviceId);
      setData(service);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    if (autoFetch && serviceId) {
      fetchService();
    }
  }, [fetchService, autoFetch, serviceId]);

  return {
    service: data,
    loading,
    error,
    refetch: fetchService,
  };
};

export const useServiceTypes = (options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServiceTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const serviceTypes = await serviceService.getServiceTypes();
      setData(serviceTypes || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchServiceTypes();
    }
  }, [fetchServiceTypes, autoFetch]);

  return {
    serviceTypes: data,
    loading,
    error,
    refetch: fetchServiceTypes,
  };
};

export const useServiceMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createService = useCallback(async (serviceData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await serviceService.createService(serviceData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateService = useCallback(async (id, serviceData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await serviceService.updateService(id, serviceData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteService = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await serviceService.deleteService(id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createService,
    updateService,
    deleteService,
    loading,
    error,
  };
};

export default useServices;
