import { useState, useEffect, useCallback, useMemo } from "react";
import { roomService } from "../services";

export const useRooms = (params = {}, options = {}) => {
  const { autoFetch = true, isPublic = true } = options;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize params to prevent infinite loops - use deep comparison
  const memoizedParams = useMemo(() => {
    // Create a stable reference for params
    const stableParams = {};
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        stableParams[key] = params[key];
      }
    });
    return stableParams;
  }, [
    params.limit,
    params.page,
    params.status,
    params.minPrice,
    params.maxPrice,
    params.roomTypeId,
    params.search,
    params.Price,
    params.RoomTypeId,
    params.MaximumNumberOfGuests,
    params.Status,
    params.RoomArea,
    params.Amenities,
    params.NumberOfFloor,
    params.Description,
    params.checkIn,
    params.checkOut,
    params.adults,
    params.children,
  ]);

  const fetchRooms = useCallback(
    async (fetchParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...memoizedParams, ...fetchParams };
        const response = isPublic
          ? await roomService.getPublicRooms(mergedParams)
          : await roomService.getRooms(mergedParams);

        setData(response.rooms || []);
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
      return fetchRooms(newParams);
    },
    [fetchRooms]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchRooms();
    }
  }, [fetchRooms, autoFetch]);

  return {
    rooms: data,
    pagination,
    loading,
    error,
    refetch,
    fetchRooms,
  };
};

export const useRoom = (roomId, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoom = useCallback(async () => {
    if (!roomId) return;

    try {
      setLoading(true);
      setError(null);
      const room = await roomService.getRoomById(roomId);
      setData(room);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (autoFetch && roomId) {
      fetchRoom();
    }
  }, [fetchRoom, autoFetch, roomId]);

  return {
    room: data,
    loading,
    error,
    refetch: fetchRoom,
  };
};

export const useRoomTypes = (options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoomTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const roomTypes = await roomService.getRoomTypes();
      setData(roomTypes || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchRoomTypes();
    }
  }, [fetchRoomTypes, autoFetch]);

  return {
    roomTypes: data,
    loading,
    error,
    refetch: fetchRoomTypes,
  };
};

export const useFeaturedRooms = (limit = 6, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeaturedRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rooms = await roomService.getFeaturedRooms(limit);
      setData(rooms || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchFeaturedRooms();
    }
  }, [fetchFeaturedRooms, autoFetch]);

  return {
    featuredRooms: data,
    loading,
    error,
    refetch: fetchFeaturedRooms,
  };
};

export default useRooms;
