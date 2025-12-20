import api from "./api";

export const roomService = {
  // Public endpoints (no authentication required)
  async getPublicRooms(params = {}) {
    try {
      const response = await api.get("/rooms/public", { params });
      return {
        rooms: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch rooms");
    }
  },

  async getRoomTypes() {
    try {
      const response = await api.get("/room-type/get-all");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch room types");
    }
  },

  // Protected endpoints (authentication required)
  async getRooms(params = {}) {
    try {
      const response = await api.get("/room", { params });
      return {
        rooms: response.data,
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

  async searchRooms(searchParams) {
    try {
      const response = await api.get("/room", { params: searchParams });
      return {
        rooms: response.data,
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
        rooms: response.data,
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
        rooms: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch available rooms");
    }
  },
};

export default roomService;
