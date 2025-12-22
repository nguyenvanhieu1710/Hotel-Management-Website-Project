import { useState, useEffect, useCallback, useMemo } from "react";
import { userService } from "../services";

export const useUsers = (params = {}, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize params to prevent infinite loops
  const memoizedParams = useMemo(() => {
    // Create a stable reference for params
    const stableParams = {};
    if (params && typeof params === "object") {
      Object.keys(params).forEach((key) => {
        if (
          params[key] !== undefined &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          stableParams[key] = params[key];
        }
      });
    }
    return stableParams;
  }, [params]);

  const fetchUsers = useCallback(
    async (fetchParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...memoizedParams, ...fetchParams };
        const response = await userService.getAllUsers(mergedParams);

        setData(response || []);
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
      return fetchUsers(newParams);
    },
    [fetchUsers]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [fetchUsers, autoFetch]);

  return {
    users: data,
    loading,
    error,
    refetch,
    fetchUsers,
  };
};

export const useUser = (accountId, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    if (!accountId) return;

    try {
      setLoading(true);
      setError(null);
      const user = await userService.getUserProfileById(accountId);
      setData(user);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  const updateUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.updateUserProfile(userData);
      setData(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.changePassword(passwordData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(
    async (formData) => {
      try {
        setLoading(true);
        setError(null);
        const result = await userService.uploadAvatar(formData);
        // Refresh user data after avatar upload
        if (accountId) {
          await fetchUser();
        }
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [accountId, fetchUser]
  );

  useEffect(() => {
    if (autoFetch && accountId) {
      fetchUser();
    }
  }, [fetchUser, autoFetch, accountId]);

  return {
    user: data,
    loading,
    error,
    refetch: fetchUser,
    updateUser,
    changePassword,
    uploadAvatar,
  };
};

export const useCurrentUser = (options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await userService.getUserProfile();
      setData(user);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, autoFetch]);

  return {
    currentUser: data,
    loading,
    error,
    refetch: fetchCurrentUser,
  };
};

export const useUserMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.createUser(userData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.updateUserProfile(userData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.deleteUser(userId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeUserPassword = useCallback(async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.changePassword(passwordData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    loading,
    error,
  };
};

export default useUsers;
