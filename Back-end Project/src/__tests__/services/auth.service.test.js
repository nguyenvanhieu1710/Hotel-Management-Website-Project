import AuthService from "../../services/auth.service.js";
import { executeMysqlQuery } from "../../config/db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../../config/db.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        Email: "test@example.com",
        Password: "Test123456",
        FullName: "Test User",
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

      // Mock token generation
      jwt.sign.mockReturnValue("mockToken");

      const result = await AuthService.register(userData);

      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("user");
      expect(result.user.Email).toBe(userData.Email);
      expect(executeMysqlQuery).toHaveBeenCalledTimes(3);
    });

    it("should throw error if email already exists", async () => {
      const userData = {
        Email: "existing@example.com",
        Password: "Test123456",
      };

      // Mock existing user
      executeMysqlQuery.mockResolvedValueOnce([{ Email: userData.Email }]);

      await expect(AuthService.register(userData)).rejects.toThrow(
        "Email already exists"
      );
    });

    it("should throw error if password is too weak", async () => {
      const userData = {
        Email: "test@example.com",
        Password: "weak",
      };

      await expect(AuthService.register(userData)).rejects.toThrow(
        "Password must be at least 8 characters"
      );
    });
  });

  describe("login", () => {
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

      // Mock token generation
      jwt.sign.mockReturnValue("mockToken");

      const result = await AuthService.login(credentials);

      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("user");
      expect(result.user.Email).toBe(credentials.Email);
    });

    it("should throw error with invalid email", async () => {
      const credentials = {
        Email: "nonexistent@example.com",
        Password: "Test123456",
      };

      // Mock no account found
      executeMysqlQuery.mockResolvedValueOnce([]);

      await expect(AuthService.login(credentials)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should throw error with invalid password", async () => {
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

      await expect(AuthService.login(credentials)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should throw error if account is inactive", async () => {
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

      await expect(AuthService.login(credentials)).rejects.toThrow(
        "Account is inactive"
      );
    });
  });

  describe("verifyToken", () => {
    it("should verify valid token successfully", async () => {
      const mockDecoded = {
        id: 1,
        email: "test@example.com",
        role: "Customer",
      };

      jwt.verify.mockReturnValue(mockDecoded);

      const result = await AuthService.verifyToken("validToken");

      expect(result).toEqual(mockDecoded);
      expect(jwt.verify).toHaveBeenCalledWith(
        "validToken",
        process.env.JWT_SECRET
      );
    });

    it("should throw error with invalid token", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(AuthService.verifyToken("invalidToken")).rejects.toThrow(
        "Invalid token"
      );
    });
  });
});
