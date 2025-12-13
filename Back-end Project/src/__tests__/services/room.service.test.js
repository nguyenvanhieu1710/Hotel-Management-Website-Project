import RoomService from "../../services/room.service.js";
import { executeMysqlQuery } from "../../config/db.js";

// Mock dependencies
jest.mock("../../config/db.js");

describe("RoomService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllRooms", () => {
    it("should return paginated rooms", async () => {
      const mockRooms = [
        {
          RoomId: 1,
          RoomNumber: "101",
          Status: "Available",
          Price: 1000000,
        },
        {
          RoomId: 2,
          RoomNumber: "102",
          Status: "Available",
          Price: 1500000,
        },
      ];

      // Mock count query
      executeMysqlQuery.mockResolvedValueOnce([{ total: 2 }]);

      // Mock data query
      executeMysqlQuery.mockResolvedValueOnce(mockRooms);

      const result = await RoomService.getAllRooms({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(executeMysqlQuery).toHaveBeenCalledTimes(2);
    });

    it("should filter rooms by status", async () => {
      const mockRooms = [
        {
          RoomId: 1,
          RoomNumber: "101",
          Status: "Available",
        },
      ];

      executeMysqlQuery.mockResolvedValueOnce([{ total: 1 }]);
      executeMysqlQuery.mockResolvedValueOnce(mockRooms);

      const result = await RoomService.getAllRooms({
        page: 1,
        limit: 10,
        status: "Available",
      });

      expect(result.data[0].Status).toBe("Available");
    });
  });

  describe("getRoomById", () => {
    it("should return room with room type info", async () => {
      const mockRoom = {
        RoomId: 1,
        RoomNumber: "101",
        RoomTypeName: "Deluxe",
        Status: "Available",
      };

      executeMysqlQuery.mockResolvedValueOnce([mockRoom]);

      const result = await RoomService.getRoomById(1);

      expect(result.RoomId).toBe(1);
      expect(result.RoomTypeName).toBe("Deluxe");
    });

    it("should throw error if room not found", async () => {
      executeMysqlQuery.mockResolvedValueOnce([]);

      await expect(RoomService.getRoomById(999)).rejects.toThrow(
        "Room not found"
      );
    });
  });

  describe("createRoom", () => {
    it("should create room successfully", async () => {
      const roomData = {
        RoomNumber: "103",
        RoomTypeId: 1,
        Price: 2000000,
        Status: "Available",
      };

      // Mock room type validation
      executeMysqlQuery.mockResolvedValueOnce([{ RoomTypeId: 1 }]);

      // Mock room number check
      executeMysqlQuery.mockResolvedValueOnce([]);

      // Mock room insert
      executeMysqlQuery.mockResolvedValueOnce({ insertId: 3 });

      // Mock getRoomById
      executeMysqlQuery.mockResolvedValueOnce([
        { RoomId: 3, ...roomData, RoomTypeName: "Deluxe" },
      ]);

      const result = await RoomService.createRoom(roomData);

      expect(result.RoomId).toBe(3);
      expect(result.RoomNumber).toBe("103");
    });

    it("should throw error if room type does not exist", async () => {
      const roomData = {
        RoomNumber: "103",
        RoomTypeId: 999,
        Price: 2000000,
      };

      // Mock room type validation - not found
      executeMysqlQuery.mockResolvedValueOnce([]);

      await expect(RoomService.createRoom(roomData)).rejects.toThrow(
        "Room Type not found"
      );
    });

    it("should throw error if room number already exists", async () => {
      const roomData = {
        RoomNumber: "101",
        RoomTypeId: 1,
        Price: 2000000,
      };

      // Mock room type validation
      executeMysqlQuery.mockResolvedValueOnce([{ RoomTypeId: 1 }]);

      // Mock room number check - already exists
      executeMysqlQuery.mockResolvedValueOnce([{ RoomNumber: "101" }]);

      await expect(RoomService.createRoom(roomData)).rejects.toThrow(
        "Room number already exists"
      );
    });

    it("should throw error if price is invalid", async () => {
      const roomData = {
        RoomNumber: "103",
        RoomTypeId: 1,
        Price: -1000, // Invalid price
      };

      await expect(RoomService.createRoom(roomData)).rejects.toThrow(
        "Price must be greater than 0"
      );
    });
  });

  describe("updateRoomStatus", () => {
    it("should update room status successfully", async () => {
      const mockRoom = {
        RoomId: 1,
        Status: "Maintenance",
      };

      // Mock update query
      executeMysqlQuery.mockResolvedValueOnce({ affectedRows: 1 });

      // Mock getRoomById
      executeMysqlQuery.mockResolvedValueOnce([mockRoom]);

      const result = await RoomService.updateRoomStatus(1, "Maintenance");

      expect(result.Status).toBe("Maintenance");
    });

    it("should throw error with invalid status", async () => {
      await expect(
        RoomService.updateRoomStatus(1, "InvalidStatus")
      ).rejects.toThrow("Invalid status");
    });
  });

  describe("deleteRoom", () => {
    it("should delete room successfully", async () => {
      const mockRoom = {
        RoomId: 1,
        RoomNumber: "101",
      };

      // Mock getRoomById
      executeMysqlQuery.mockResolvedValueOnce([mockRoom]);

      // Mock active bookings check
      executeMysqlQuery.mockResolvedValueOnce([{ count: 0 }]);

      // Mock delete query
      executeMysqlQuery.mockResolvedValueOnce({ affectedRows: 1 });

      await expect(RoomService.deleteRoom(1)).resolves.not.toThrow();
    });

    it("should throw error if room has active bookings", async () => {
      const mockRoom = {
        RoomId: 1,
        RoomNumber: "101",
      };

      // Mock getRoomById
      executeMysqlQuery.mockResolvedValueOnce([mockRoom]);

      // Mock active bookings check - has bookings
      executeMysqlQuery.mockResolvedValueOnce([{ count: 5 }]);

      await expect(RoomService.deleteRoom(1)).rejects.toThrow(
        "Cannot delete room with active bookings"
      );
    });
  });

  describe("getRoomStatistics", () => {
    it("should return room statistics", async () => {
      const mockStats = {
        totalRooms: 50,
        availableRooms: 30,
        occupiedRooms: 15,
        maintenanceRooms: 5,
        averagePrice: 1500000,
        minPrice: 500000,
        maxPrice: 5000000,
      };

      executeMysqlQuery.mockResolvedValueOnce([mockStats]);

      const result = await RoomService.getRoomStatistics();

      expect(result.totalRooms).toBe(50);
      expect(result.availableRooms).toBe(30);
      expect(result.averagePrice).toBe(1500000);
    });
  });

  describe("getAvailableRooms", () => {
    it("should return available rooms for date range", async () => {
      const mockRooms = [
        { RoomId: 1, RoomNumber: "101", Status: "Available" },
        { RoomId: 2, RoomNumber: "102", Status: "Available" },
      ];

      executeMysqlQuery.mockResolvedValueOnce(mockRooms);

      const result = await RoomService.getAvailableRooms({
        checkinDate: "2025-12-15",
        checkoutDate: "2025-12-20",
      });

      expect(result).toHaveLength(2);
      expect(result[0].Status).toBe("Available");
    });
  });
});
