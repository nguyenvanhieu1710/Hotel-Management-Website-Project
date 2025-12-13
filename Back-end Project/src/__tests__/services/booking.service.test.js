import BookingService from "../../services/booking.service.js";
import { executeMysqlQuery } from "../../config/db.js";

// Mock dependencies
jest.mock("../../config/db.js");

describe("BookingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllBookings", () => {
    it("should return paginated bookings", async () => {
      const mockBookings = [
        {
          BookingVotesId: 1,
          UserId: 1,
          UserName: "Test User",
          Status: "Pending",
        },
        {
          BookingVotesId: 2,
          UserId: 2,
          UserName: "Another User",
          Status: "Confirmed",
        },
      ];

      // Mock count query
      executeMysqlQuery.mockResolvedValueOnce([{ total: 2 }]);

      // Mock data query
      executeMysqlQuery.mockResolvedValueOnce(mockBookings);

      const result = await BookingService.getAllBookings({
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(executeMysqlQuery).toHaveBeenCalledTimes(2);
    });

    it("should filter bookings by status", async () => {
      const mockBookings = [
        {
          BookingVotesId: 1,
          Status: "Confirmed",
        },
      ];

      executeMysqlQuery.mockResolvedValueOnce([{ total: 1 }]);
      executeMysqlQuery.mockResolvedValueOnce(mockBookings);

      const result = await BookingService.getAllBookings({
        page: 1,
        limit: 10,
        status: "Confirmed",
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].Status).toBe("Confirmed");
    });
  });

  describe("getBookingById", () => {
    it("should return booking with details", async () => {
      const mockBooking = {
        BookingVotesId: 1,
        UserId: 1,
        UserName: "Test User",
        Status: "Pending",
      };

      const mockDetails = [
        { BookingVotesDetailId: 1, RoomId: 1, RoomNumber: "101" },
        { BookingVotesDetailId: 2, RoomId: 2, RoomNumber: "102" },
      ];

      // Mock booking query
      executeMysqlQuery.mockResolvedValueOnce([mockBooking]);

      // Mock details query
      executeMysqlQuery.mockResolvedValueOnce(mockDetails);

      const result = await BookingService.getBookingById(1);

      expect(result.BookingVotesId).toBe(1);
      expect(result.details).toHaveLength(2);
      expect(executeMysqlQuery).toHaveBeenCalledTimes(2);
    });

    it("should throw error if booking not found", async () => {
      executeMysqlQuery.mockResolvedValueOnce([]);

      await expect(BookingService.getBookingById(999)).rejects.toThrow(
        "Booking not found"
      );
    });
  });

  describe("createBooking", () => {
    it("should create booking successfully", async () => {
      const bookingData = {
        UserId: 1,
        BookingDate: "2025-12-10",
        CheckinDate: "2025-12-15",
        CheckoutDate: "2025-12-20",
        TotalAmount: 5000000,
      };

      const bookingDetails = [
        { RoomId: 1, RoomPrice: 2500000 },
        { RoomId: 2, RoomPrice: 2500000 },
      ];

      // Mock user validation
      executeMysqlQuery.mockResolvedValueOnce([{ UserId: 1 }]);

      // Mock room availability check for room 1
      executeMysqlQuery.mockResolvedValueOnce([{ count: 0 }]);

      // Mock room availability check for room 2
      executeMysqlQuery.mockResolvedValueOnce([{ count: 0 }]);

      // Mock booking insert
      executeMysqlQuery.mockResolvedValueOnce({ insertId: 1 });

      // Mock detail inserts
      executeMysqlQuery.mockResolvedValueOnce({ insertId: 1 });
      executeMysqlQuery.mockResolvedValueOnce({ insertId: 2 });

      // Mock getBookingById
      executeMysqlQuery.mockResolvedValueOnce([
        { BookingVotesId: 1, ...bookingData },
      ]);
      executeMysqlQuery.mockResolvedValueOnce(bookingDetails);

      const result = await BookingService.createBooking(
        bookingData,
        bookingDetails
      );

      expect(result.BookingVotesId).toBe(1);
      expect(executeMysqlQuery).toHaveBeenCalled();
    });

    it("should throw error if user does not exist", async () => {
      const bookingData = {
        UserId: 999,
        CheckinDate: "2025-12-15",
        CheckoutDate: "2025-12-20",
        TotalAmount: 5000000,
      };

      // Mock user validation - user not found
      executeMysqlQuery.mockResolvedValueOnce([]);

      await expect(
        BookingService.createBooking(bookingData, [])
      ).rejects.toThrow("User not found");
    });

    it("should throw error if checkout date is before checkin date", async () => {
      const bookingData = {
        UserId: 1,
        CheckinDate: "2025-12-20",
        CheckoutDate: "2025-12-15", // Before checkin
        TotalAmount: 5000000,
      };

      await expect(
        BookingService.createBooking(bookingData, [])
      ).rejects.toThrow("Check-out date must be after check-in date");
    });

    it("should throw error if total amount is invalid", async () => {
      const bookingData = {
        UserId: 1,
        CheckinDate: "2025-12-15",
        CheckoutDate: "2025-12-20",
        TotalAmount: 0, // Invalid amount
      };

      await expect(
        BookingService.createBooking(bookingData, [])
      ).rejects.toThrow("Total amount must be greater than 0");
    });

    it("should throw error if no rooms provided", async () => {
      const bookingData = {
        UserId: 1,
        CheckinDate: "2025-12-15",
        CheckoutDate: "2025-12-20",
        TotalAmount: 5000000,
      };

      // Mock user validation
      executeMysqlQuery.mockResolvedValueOnce([{ UserId: 1 }]);

      await expect(
        BookingService.createBooking(bookingData, [])
      ).rejects.toThrow("Booking must have at least one room");
    });
  });

  describe("updateBookingStatus", () => {
    it("should update booking status successfully", async () => {
      const mockBooking = {
        BookingVotesId: 1,
        Status: "Confirmed",
      };

      // Mock update query
      executeMysqlQuery.mockResolvedValueOnce({ affectedRows: 1 });

      // Mock getBookingById
      executeMysqlQuery.mockResolvedValueOnce([mockBooking]);
      executeMysqlQuery.mockResolvedValueOnce([]);

      const result = await BookingService.updateBookingStatus(1, "Confirmed");

      expect(result.Status).toBe("Confirmed");
    });

    it("should throw error with invalid status", async () => {
      await expect(
        BookingService.updateBookingStatus(1, "InvalidStatus")
      ).rejects.toThrow("Invalid status");
    });

    it("should throw error if booking not found", async () => {
      executeMysqlQuery.mockResolvedValueOnce({ affectedRows: 0 });

      await expect(
        BookingService.updateBookingStatus(999, "Confirmed")
      ).rejects.toThrow("Booking not found");
    });
  });

  describe("getBookingStatistics", () => {
    it("should return booking statistics", async () => {
      const mockStats = {
        totalBookings: 100,
        pendingBookings: 20,
        confirmedBookings: 50,
        completedBookings: 25,
        cancelledBookings: 5,
        totalRevenue: 500000000,
        averageBookingAmount: 5000000,
      };

      executeMysqlQuery.mockResolvedValueOnce([mockStats]);

      const result = await BookingService.getBookingStatistics();

      expect(result.totalBookings).toBe(100);
      expect(result.totalRevenue).toBe(500000000);
      expect(executeMysqlQuery).toHaveBeenCalledTimes(1);
    });
  });

  describe("validateBookingDates", () => {
    it("should throw error if checkin date is in the past", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      expect(() => {
        BookingService.validateBookingDates(
          pastDate.toISOString(),
          futureDate.toISOString()
        );
      }).toThrow("Check-in date cannot be in the past");
    });

    it("should throw error if checkout is before checkin", () => {
      const checkin = new Date();
      checkin.setDate(checkin.getDate() + 5);
      const checkout = new Date();
      checkout.setDate(checkout.getDate() + 3);

      expect(() => {
        BookingService.validateBookingDates(
          checkin.toISOString(),
          checkout.toISOString()
        );
      }).toThrow("Check-out date must be after check-in date");
    });
  });
});
