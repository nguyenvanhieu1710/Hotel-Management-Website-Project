export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  ROOMS: "/room",
  BOOKINGS: "/booking-votes",
  EVENTS: "/event",
  EVENT_VOTES: "/event-votes",
  SERVICES: "/service",
  USERS: "/user",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  BOOKING: "/booking",
  CHECKOUT: "/checkout",
  ROOMS: "/room",
  ROOM_DETAIL: "/room-detail",
  EVENTS: "/event",
  EVENT_DETAIL: "/event-detail",
  SERVICES: "/service",
  ABOUT: "/about",
  CONTACT: "/contact",
  SEARCH: "/search",
  NOTIFICATION: "/notification",
  FAVOURITE: "/favourite",
  REVIEW: "/review",
  PROMOTION: "/promotion",
  BLOG: "/blog",
  TRANSPORTATION: "/transportation",
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  FAVORITES: "favorites",
};

export const USER_ROLES = {
  ADMIN: "Admin",
  STAFF: "Staff",
  USER: "User",
};

export const BOOKING_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const ROOM_STATUS = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
  RESERVED: "Reserved",
};
