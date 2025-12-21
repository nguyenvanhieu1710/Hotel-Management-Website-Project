import api from "./api";

export const roomService = {
  // Public endpoints (no authentication required)
  async getPublicRooms(params = {}) {
    try {
      const response = await api.get("/rooms/public", { params });
      return {
        rooms: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch rooms");
    }
  },

  async getRoomTypes() {
    try {
      const response = await api.get("/room-type/get-all");
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch room types");
    }
  },

  async getAvailableRoomsPublic(checkinDate, checkoutDate, params = {}) {
    try {
      const response = await api.get("/rooms/public", {
        params: {
          ...params,
          checkinDate,
          checkoutDate,
          status: "Available",
        },
      });
      return {
        rooms: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch available rooms");
    }
  },

  // Protected endpoints (authentication required)
  async getRooms(params = {}) {
    try {
      const response = await api.get("/room", { params });
      return {
        rooms: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch rooms");
    }
  },

  async getRoomById(id) {
    try {
      const response = await api.get(`/room/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch room details");
    }
  },

  async createRoom(roomData) {
    try {
      const response = await api.post("/room", roomData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to create room");
    }
  },

  async updateRoom(id, roomData) {
    try {
      const response = await api.put(`/room/${id}`, roomData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to update room");
    }
  },

  async deleteRoom(id) {
    try {
      const response = await api.delete(`/room/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to delete room");
    }
  },

  async searchRooms(searchParams) {
    try {
      const response = await api.get("/room", { params: searchParams });
      return {
        rooms: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to search rooms");
    }
  },

  async getRoomsByType(roomTypeId, params = {}) {
    try {
      const response = await api.get("/room", {
        params: { ...params, roomTypeId },
      });
      return {
        rooms: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch rooms by type");
    }
  },

  async getAvailableRooms(checkinDate, checkoutDate, params = {}) {
    try {
      const response = await api.get("/room", {
        params: {
          ...params,
          checkinDate,
          checkoutDate,
          status: "Available",
        },
      });
      return {
        rooms: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch available rooms");
    }
  },

  // Room management (legacy endpoints for backward compatibility)
  async updateRoomLegacy(roomData) {
    try {
      const response = await api.put("/rooms/update", roomData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to update room");
    }
  },

  // Helper methods
  async getFeaturedRooms(limit = 6) {
    try {
      const response = await api.get("/rooms/public", {
        params: {
          limit,
          featured: true,
          status: "Available",
        },
      });
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch featured rooms");
    }
  },

  async getRoomsByPriceRange(minPrice, maxPrice, params = {}) {
    try {
      const response = await api.get("/rooms/public", {
        params: {
          ...params,
          minPrice,
          maxPrice,
        },
      });
      return {
        rooms: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch rooms by price range");
    }
  },
};

export default roomService;
