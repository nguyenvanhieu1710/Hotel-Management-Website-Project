import { useState, useEffect, useCallback } from "react";
import { eventService } from "../services";

export const useEvents = (params = {}, options = {}) => {
  const { autoFetch = true, isPublic = true } = options;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(
    async (fetchParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...params, ...fetchParams };
        const response = isPublic
          ? await eventService.getPublicEvents(mergedParams)
          : await eventService.getEvents(mergedParams);

        setData(response.events || []);
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
      return fetchEvents(newParams);
    },
    [fetchEvents]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [fetchEvents, autoFetch]);

  return {
    events: data,
    pagination,
    loading,
    error,
    refetch,
    fetchEvents,
  };
};

export const useEvent = (eventId, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      setError(null);
      const event = await eventService.getEventById(eventId);
      setData(event);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (autoFetch && eventId) {
      fetchEvent();
    }
  }, [fetchEvent, autoFetch, eventId]);

  return {
    event: data,
    loading,
    error,
    refetch: fetchEvent,
  };
};

export const useEventTypes = (options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEventTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const eventTypes = await eventService.getEventTypes();
      setData(eventTypes || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchEventTypes();
    }
  }, [fetchEventTypes, autoFetch]);

  return {
    eventTypes: data,
    loading,
    error,
    refetch: fetchEventTypes,
  };
};

export const useUpcomingEvents = (limit = 10, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUpcomingEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await eventService.getUpcomingEvents(limit);
      setData(events || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchUpcomingEvents();
    }
  }, [fetchUpcomingEvents, autoFetch]);

  return {
    upcomingEvents: data,
    loading,
    error,
    refetch: fetchUpcomingEvents,
  };
};

export const useFeaturedEvents = (limit = 5, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeaturedEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await eventService.getFeaturedEvents(limit);
      setData(events || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchFeaturedEvents();
    }
  }, [fetchFeaturedEvents, autoFetch]);

  return {
    featuredEvents: data,
    loading,
    error,
    refetch: fetchFeaturedEvents,
  };
};

export const useEventVotes = (params = {}, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEventVotes = useCallback(
    async (fetchParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...params, ...fetchParams };
        const response = await eventService.getEventVotes(mergedParams);

        setData(response.eventVotes || []);
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
      return fetchEventVotes(newParams);
    },
    [fetchEventVotes]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchEventVotes();
    }
  }, [fetchEventVotes, autoFetch]);

  return {
    eventVotes: data,
    pagination,
    loading,
    error,
    refetch,
    fetchEventVotes,
  };
};

export const useUserEventVotes = (userId, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserEventVotes = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const eventVotes = await eventService.getUserEventVotes(userId);
      setData(eventVotes || []);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (autoFetch && userId) {
      fetchUserEventVotes();
    }
  }, [fetchUserEventVotes, autoFetch, userId]);

  return {
    userEventVotes: data,
    loading,
    error,
    refetch: fetchUserEventVotes,
  };
};

export const useEventMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEvent = useCallback(async (eventData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await eventService.createEvent(eventData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (id, eventData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await eventService.updateEvent(id, eventData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await eventService.deleteEvent(id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEventVote = useCallback(async (voteData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await eventService.createEventVote(voteData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    createEventVote,
    loading,
    error,
  };
};

export default useEvents;
