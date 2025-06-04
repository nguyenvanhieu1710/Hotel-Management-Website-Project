import request from "supertest";
import { executeMysqlQuery } from "../../config/db";
import { viteNodeApp } from "../../app";

jest.mock("../../config/db");

describe("User Controller", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = viteNodeApp;
  });

  describe("GET /api/user/get-all", () => {
    it("should get all users successfully", async () => {
      const mockUsers = [
        { UserId: 1, UserName: "Test User 1" },
        { UserId: 2, UserName: "Test User 2" },
      ];

      executeMysqlQuery.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get("/api/user/get-all")
        .set("Authorization", "Bearer mockToken");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    // Add more test cases...
  });
});
