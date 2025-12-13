/**
 * Test Helper Functions
 * Utility functions for testing
 */

/**
 * Create mock user data
 */
export const createMockUser = (overrides = {}) => {
  return {
    UserId: 1,
    FullName: "Test User",
    Email: "test@example.com",
    PhoneNumber: "0123456789",
    DateOfBirth: "1990-01-01",
    Gender: "Male",
    Address: "Test Address",
    IdentificationNumber: "123456789",
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock account data
 */
export const createMockAccount = (overrides = {}) => {
  return {
    AccountId: 1,
    AccountName: "Test User",
    Email: "test@example.com",
    Password: "hashedPassword",
    Role: "Customer",
    Status: "Active",
    CreationDate: new Date().toISOString(),
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock room data
 */
export const createMockRoom = (overrides = {}) => {
  return {
    RoomId: 1,
    RoomNumber: "101",
    RoomTypeId: 1,
    RoomTypeName: "Deluxe",
    Price: 1000000,
    Status: "Available",
    Description: "Test room",
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock booking data
 */
export const createMockBooking = (overrides = {}) => {
  return {
    BookingVotesId: 1,
    UserId: 1,
    BookingDate: new Date().toISOString(),
    CheckinDate: "2025-12-15",
    CheckoutDate: "2025-12-20",
    TotalAmount: 5000000,
    Status: "Pending",
    Note: "Test booking",
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock booking detail data
 */
export const createMockBookingDetail = (overrides = {}) => {
  return {
    BookingVotesDetailId: 1,
    BookingVotesId: 1,
    RoomId: 1,
    RoomPrice: 2500000,
    Note: "Test detail",
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock evaluation data
 */
export const createMockEvaluation = (overrides = {}) => {
  return {
    EvaluationId: 1,
    UserId: 1,
    RoomId: 1,
    Rating: 5,
    Comment: "Great room!",
    Status: "Approved",
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock event data
 */
export const createMockEvent = (overrides = {}) => {
  return {
    EventId: 1,
    EventName: "Test Event",
    EventTypeId: 1,
    EventTypeName: "Conference",
    OrganizationDay: "2025-12-25",
    StartTime: "09:00:00",
    EndTime: "17:00:00",
    OrganizationLocation: "Hotel Conference Room",
    Price: 500000,
    Status: "Active",
    Description: "Test event description",
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock staff data
 */
export const createMockStaff = (overrides = {}) => {
  return {
    StaffId: 1,
    StaffName: "Test Staff",
    DateOfBirth: "1990-01-01",
    Gender: "Male",
    PhoneNumber: "0123456789",
    Address: "Test Address",
    Position: "Manager",
    Salary: 15000000,
    Status: "Active",
    WorkStartDate: "2020-01-01",
    Description: "Test staff",
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock device data
 */
export const createMockDevice = (overrides = {}) => {
  return {
    DeviceId: 1,
    DeviceName: "Test Device",
    DeviceTypeId: 1,
    DeviceTypeName: "Electronics",
    RoomId: null,
    Status: "Working",
    PurchaseDate: "2024-01-01",
    Price: 5000000,
    Description: "Test device",
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock bill data
 */
export const createMockBill = (overrides = {}) => {
  return {
    BillId: 1,
    UserId: 1,
    TotalAmount: 10000000,
    Status: "Pending",
    PaymentDate: null,
    Note: "Test bill",
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock service data
 */
export const createMockService = (overrides = {}) => {
  return {
    ServiceId: 1,
    ServiceName: "Test Service",
    ServiceTypeId: 1,
    ServiceTypeName: "Room Service",
    Price: 200000,
    Description: "Test service description",
    Deleted: 0,
    ...overrides,
  };
};

/**
 * Create mock JWT token
 */
export const createMockToken = (payload = {}) => {
  return `mock.jwt.token.${JSON.stringify(payload)}`;
};

/**
 * Create mock pagination result
 */
export const createMockPaginationResult = (data, options = {}) => {
  const { page = 1, limit = 10, total = data.length } = options;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Create mock statistics
 */
export const createMockStatistics = (overrides = {}) => {
  return {
    total: 100,
    active: 80,
    inactive: 20,
    ...overrides,
  };
};

/**
 * Simulate database query result
 */
export const mockQueryResult = (data, options = {}) => {
  const { affectedRows = 1, insertId = 1 } = options;

  if (Array.isArray(data)) {
    return data;
  }

  return {
    affectedRows,
    insertId,
    ...data,
  };
};

/**
 * Create date in future
 */
export const createFutureDate = (daysFromNow = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
};

/**
 * Create date in past
 */
export const createPastDate = (daysAgo = 7) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

/**
 * Wait for async operations
 */
export const waitFor = (ms = 100) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
