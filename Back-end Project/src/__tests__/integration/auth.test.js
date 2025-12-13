import request from "supertest";
import express from "express";
import authRoutes from "../../routes/auth.js";
import { executeMysqlQuery } from "../../config/db.js";
import bcryptjs from "bcryptjs";

// Mock dependencies
jest.mock("../../config/db.js");
jest.mock("bcryptjs");

// Create test app
const app = express();
app.use(express.json());
app.use("/api", authRoutes);

// Add error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
});

describe("Auth Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        Email: "newuser@example.com",
        Password: "Test123456",
        FullName: "New User",
        PhoneNumber: "0123456789",
      };

      // Mock email check - no existing user
      executeMysqlQuery.mockResolvedValueOnce([]);

      // Mock password hashing
      bcryptjs.genSalt.mockResolvedValue("salt");
      bcryptjs.hash.mockResolvedValue("hashedPassword");

      // Mock account creation
      executeMysqlQuery.mockResolvedValueOnce({ insertId: 1 });

      // Mock user profile creation
      executeMysqlQuery.mockResolvedValueOnce({ insertId: 1 });

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user.Email).toBe(userData.Email);
    });

    it("should return 400 if email already exists", async () => {
      const userData = {
        Email: "existing@example.com",
        Password: "Test123456",
      };

      // Mock existing user
      executeMysqlQuery.mockResolvedValueOnce([{ Email: userData.Email }]);

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });

    it("should return 400 if password is too weak", async () => {
      const userData = {
        Email: "test@example.com",
        Password: "weak",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should return 400 if email is missing", async () => {
      const userData = {
        Password: "Test123456",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const credentials = {
        Email: "test@example.com",
        Password: "Test123456",
      };

      const mockAccount = {
        AccountId: 1,
        Email: credentials.Email,
        Password: "hashedPassword",
        Role: "Customer",
        Status: "Active",
      };

      const mockUser = {
        UserId: 1,
        FullName: "Test User",
        Email: credentials.Email,
      };

      // Mock account lookup
      executeMysqlQuery.mockResolvedValueOnce([mockAccount]);

      // Mock password comparison
      bcryptjs.compare.mockResolvedValue(true);

      // Mock user lookup
      executeMysqlQuery.mockResolvedValueOnce([mockUser]);

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user.Email).toBe(credentials.Email);
    });

    it("should return 401 with invalid credentials", async () => {
      const credentials = {
        Email: "test@example.com",
        Password: "WrongPassword",
      };

      const mockAccount = {
        AccountId: 1,
        Email: credentials.Email,
        Password: "hashedPassword",
        Status: "Active",
      };

      // Mock account lookup
      executeMysqlQuery.mockResolvedValueOnce([mockAccount]);

      // Mock password comparison - returns false
      bcryptjs.compare.mockResolvedValue(false);

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should return 401 if account does not exist", async () => {
      const credentials = {
        Email: "nonexistent@example.com",
        Password: "Test123456",
      };

      // Mock no account found
      executeMysqlQuery.mockResolvedValueOnce([]);

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should return 403 if account is inactive", async () => {
      const credentials = {
        Email: "test@example.com",
        Password: "Test123456",
      };

      const mockAccount = {
        AccountId: 1,
        Email: credentials.Email,
        Password: "hashedPassword",
        Status: "Inactive",
      };

      // Mock account lookup
      executeMysqlQuery.mockResolvedValueOnce([mockAccount]);

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("inactive");
    });
  });
});
