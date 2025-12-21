// Export all services for easy importing
export { default as api } from "./api";
export { default as authService } from "./authService";
export { default as userService } from "./userService";
export { default as roomService } from "./roomService";
export { default as serviceService } from "./serviceService";
export { default as staffService } from "./staffService";
export { default as bookingService } from "./bookingService";
export { default as evaluationService } from "./evaluationService";
export { default as eventService } from "./eventService";

// Import services for re-export
import authService from "./authService";
import userService from "./userService";
import roomService from "./roomService";
import serviceService from "./serviceService";
import staffService from "./staffService";
import bookingService from "./bookingService";
import evaluationService from "./evaluationService";
import eventService from "./eventService";

// Named exports for convenience
export {
  authService as auth,
  userService as user,
  roomService as room,
  serviceService as service,
  staffService as staff,
  bookingService as booking,
  evaluationService as evaluation,
  eventService as event,
};

// Default export with all services
const services = {
  auth: authService,
  user: userService,
  room: roomService,
  service: serviceService,
  staff: staffService,
  booking: bookingService,
  evaluation: evaluationService,
  event: eventService,
};

export default services;
