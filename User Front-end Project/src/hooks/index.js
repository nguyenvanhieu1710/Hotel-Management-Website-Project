// Export all hooks for easy importing
export { default as useApi } from "./useApi";
export { default as usePagination } from "./usePagination";
export { default as useDebounce } from "./useDebounce";
export { default as useFavorites } from "./useFavorites";
export { default as useLocalStorage } from "./useLocalStorage";
export { default as useUsers, useUser, useCurrentUser } from "./useUsers";

// New service-based hooks
export {
  default as useRooms,
  useRoom,
  useRoomTypes,
  useFeaturedRooms,
} from "./useRooms";
export {
  default as useServices,
  useService,
  useServiceTypes,
  useServiceMutations,
} from "./useServices";
export {
  default as useStaff,
  useStaffMember,
  useStaffStatistics,
  usePositions,
  useStaffMutations,
} from "./useStaff";
export {
  default as useBookings,
  useBooking,
  useUserBookings,
  useRoomAvailability,
  useBookingMutations,
} from "./useBooking";
export {
  default as useEvaluations,
  useEvaluation,
  useRoomEvaluations,
  useRoomRatingStats,
  useUserEvaluations,
  useRecentEvaluations,
  useEvaluationMutations,
} from "./useEvaluations";
export {
  default as useEvents,
  useEvent,
  useEventTypes,
  useUpcomingEvents,
  useFeaturedEvents,
  useEventVotes,
  useUserEventVotes,
  useEventMutations,
} from "./useEvents";

// Import hooks for re-export
import useRooms, { useRoom, useRoomTypes, useFeaturedRooms } from "./useRooms";
import useServices, {
  useService,
  useServiceTypes,
  useServiceMutations,
} from "./useServices";
import useStaff, {
  useStaffMember,
  useStaffStatistics,
  usePositions,
  useStaffMutations,
} from "./useStaff";
import useBookings, {
  useBooking,
  useUserBookings,
  useRoomAvailability,
  useBookingMutations,
} from "./useBooking";
import useEvaluations, {
  useEvaluation,
  useRoomEvaluations,
  useRoomRatingStats,
  useUserEvaluations,
  useRecentEvaluations,
  useEvaluationMutations,
} from "./useEvaluations";
import useEvents, {
  useEvent,
  useEventTypes,
  useUpcomingEvents,
  useFeaturedEvents,
  useEventVotes,
  useUserEventVotes,
  useEventMutations,
} from "./useEvents";

import useUsers, { useUser, useCurrentUser } from "./useUsers";

// Named exports for convenience
export {
  useRooms as rooms,
  useServices as services,
  useStaff as staff,
  useBookings as bookings,
  useEvaluations as evaluations,
  useEvents as events,
  useUsers as users,
};

// Grouped exports
export const roomHooks = {
  useRooms,
  useRoom,
  useRoomTypes,
  useFeaturedRooms,
};

export const serviceHooks = {
  useServices,
  useService,
  useServiceTypes,
  useServiceMutations,
};

export const staffHooks = {
  useStaff,
  useStaffMember,
  useStaffStatistics,
  usePositions,
  useStaffMutations,
};

export const bookingHooks = {
  useBookings,
  useBooking,
  useUserBookings,
  useRoomAvailability,
  useBookingMutations,
};

export const evaluationHooks = {
  useEvaluations,
  useEvaluation,
  useRoomEvaluations,
  useRoomRatingStats,
  useUserEvaluations,
  useRecentEvaluations,
  useEvaluationMutations,
};

export const userHooks = {
  useUsers,
  useUser,
  useCurrentUser,
};

export const eventHooks = {
  useEvents,
  useEvent,
  useEventTypes,
  useUpcomingEvents,
  useFeaturedEvents,
  useEventVotes,
  useUserEventVotes,
  useEventMutations,
};
