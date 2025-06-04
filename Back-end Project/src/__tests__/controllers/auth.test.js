import request from "supertest";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { executeMysqlQuery } from "../../config/db";
import { viteNodeApp } from "../../app";

// Mock dependencies
jest.mock("../../config/db");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  let app;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    app = viteNodeApp;
  });

  describe("Register", () => {
    const validUserData = {
      email: "test@example.com",
      password: "password123",
      role: "User",
      gender: "Male",
      phoneNumber: "1234567890",
      address: "Test Address",
    };

    it("should register a new user successfully", async () => {
      // Mock database queries
      executeMysqlQuery.mockImplementation((query, params) => {
        if (query.includes("SELECT * FROM Account")) {
          return []; // No existing account
        }
        if (query.includes("SELECT AccountId FROM Account")) {
          return [{ AccountId: 1 }];
        }
        return [];
      });

      // Mock bcrypt
      bcryptjs.genSalt.mockResolvedValue("salt");
      bcryptjs.hash.mockResolvedValue("hashedPassword");

      const response = await request(app)
        .post("/api/auth/register")
        .send(validUserData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Register successfully" });
      expect(executeMysqlQuery).toHaveBeenCalledTimes(4); // Verify database calls
    });

    it("should return 400 if email already exists", async () => {
      executeMysqlQuery.mockImplementation((query, params) => {
        if (query.includes("SELECT * FROM Account")) {
          return [{ email: "test@example.com" }]; // Existing account
        }
        return [];
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send(validUserData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Email already exists" });
    });

    it("should return 400 for invalid input data", async () => {
      const invalidData = {
        email: "invalid-email",
        password: "123", // Too short
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("Login", () => {
    const validLoginData = {
      email: "test@example.com",
      password: "password123",
    };

    it("should login successfully with valid credentials", async () => {
      const mockAccount = {
        Email: "test@example.com",
        Password: "hashedPassword",
        Role: "User",
      };

      executeMysqlQuery.mockImplementation((query, params) => {
        if (query.includes("SELECT * FROM Account")) {
          return [mockAccount];
        }
        return [];
      });

      bcryptjs.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mockToken");

      const response = await request(app)
        .post("/api/auth/login")
        .send(validLoginData);

      expect(response.status).toBe(200);
      expect(response.body.account).toHaveProperty("token");
      expect(jwt.sign).toHaveBeenCalledWith(
        { email: validLoginData.email, role: "User" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    });

    it("should return 400 if email does not exist", async () => {
      executeMysqlQuery.mockImplementation((query, params) => {
        if (query.includes("SELECT * FROM Account")) {
          return []; // No account found
        }
        return [];
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send(validLoginData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Email is not exists" });
    });

    it("should return 400 if password is incorrect", async () => {
      const mockAccount = {
        Email: "test@example.com",
        Password: "hashedPassword",
        Role: "User",
      };

      executeMysqlQuery.mockImplementation((query, params) => {
        if (query.includes("SELECT * FROM Account")) {
          return [mockAccount];
        }
        return [];
      });

      bcryptjs.compare.mockResolvedValue(false);

      const response = await request(app)
        .post("/api/auth/login")
        .send(validLoginData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Invalid credentials" });
    });
  });
});
