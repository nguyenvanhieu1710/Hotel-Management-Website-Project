import { useState, useEffect, useCallback } from "react";
import { bookingService } from "../services";

export const useBookings = (params = {}, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(
    async (fetchParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...params, ...fetchParams };
        const response = await bookingService.getBookings(mergedParams);

        setData(response.bookings || []);
        setPagination(response.pagination);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  const refetch = useCallback(
    (newParams = {}) => {
      return fetchBookings(newParams);
    },
    [fetchBookings]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [fetchBookings, autoFetch]);

  return {
    bookings: data,
    pagination,
    loading,
    error,
    refetch,
    fetchBookings,
  };
};

export const useBooking = (bookingId, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooking = useCallback(async () => {
    if (!bookingId) return;

    try {
      setLoading(true);
      setError(null);
      const booking = await bookingService.getBookingById(bookingId);
      setData(booking);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (autoFetch && bookingId) {
      fetchBooking();
    }
  }, [fetchBooking, autoFetch, bookingId]);

  return {
    booking: data,
    loading,
    error,
    refetch: fetchBooking,
  };
};

export const useUserBookings = (userId, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserBookings = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const bookings = await bookingService.getUserBookings(userId);
      setData(bookings || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (autoFetch && userId) {
      fetchUserBookings();
    }
  }, [fetchUserBookings, autoFetch, userId]);

  return {
    userBookings: data,
    loading,
    error,
    refetch: fetchUserBookings,
  };
};

export const useRoomAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAvailability = useCallback(
    async (roomId, checkinDate, checkoutDate) => {
      try {
        setLoading(true);
        setError(null);
        const result = await bookingService.checkRoomAvailability(
          roomId,
          checkinDate,
          checkoutDate
        );
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    checkAvailability,
    loading,
    error,
  };
};

export const useBookingMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingService.createBooking(bookingData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingService.updateBooking(bookingData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBooking = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingService.deleteBooking(id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const processPayment = useCallback(async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingService.processPayment(paymentData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createBooking,
    updateBooking,
    deleteBooking,
    processPayment,
    loading,
    error,
  };
};

export default useBookings;
