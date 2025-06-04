import request from "supertest";
import { executeMysqlQuery } from "../../config/db.js";
import { viteNodeApp } from "../../app.js";

jest.mock("../../config/db.js");

describe("Event Controller", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = viteNodeApp;
  });

  describe("GET /api/event/get-all", () => {
    it("should get all events successfully", async () => {
      const mockEvents = [
        { EventId: 1, EventName: "Test Event 1" },
        { EventId: 2, EventName: "Test Event 2" },
      ];

      executeMysqlQuery.mockResolvedValue(mockEvents);

      const response = await request(app).get("/api/events");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
    });

    it("should return 404 when no events found", async () => {
      executeMysqlQuery.mockResolvedValue([]);

      const response = await request(app).get("/api/events");

      expect(response.status).toBe(404);
      expect(response.text).toBe("No events found");
    });
  });

  describe("GET /api/event/get--data-by-id/:id", () => {
    it("should get event by id successfully", async () => {
      const mockEvent = { EventId: 1, EventName: "Test Event" };
      executeMysqlQuery.mockResolvedValue([mockEvent]);

      const response = await request(app).get("/api/events/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
    });

    it("should return 404 when event not found", async () => {
      executeMysqlQuery.mockResolvedValue([]);

      const response = await request(app).get("/api/events/999");

      expect(response.status).toBe(404);
      expect(response.text).toBe("No event found");
    });
  });

  describe("POST /api/event/create", () => {
    const validEventData = {
      EventName: "New Event",
      EventTypeId: 1,
      EventImage: "image.jpg",
      OrganizationDay: "2024-03-20",
      StartTime: "10:00",
      EndTime: "12:00",
      OrganizationLocation: "Test Location",
      Price: 100,
      Status: "Active",
      Description: "Test Description",
      Deleted: false,
    };

    it("should create event successfully", async () => {
      executeMysqlQuery.mockResolvedValue([]);

      const response = await request(app)
        .post("/api/events")
        .send(validEventData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Create event successfully" });
    });

    it("should return 400 for invalid event data", async () => {
      const invalidData = {
        EventName: "", // Required field
        Price: "invalid", // Should be number
      };

      const response = await request(app).post("/api/events").send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });
});
