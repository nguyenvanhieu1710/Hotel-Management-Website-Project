import jwt from "jsonwebtoken";
import { checkPermission } from "../../middleware/checkPermission.js";

jest.mock("jsonwebtoken");

describe("Check Permission Middleware", () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: "Bearer test-token",
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should return 401 if no token provided", () => {
    mockReq.headers.authorization = undefined;

    checkPermission(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "No token provided" });
  });

  it("should return 401 if token is invalid", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    checkPermission(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid token" });
  });

  it("should call next() if token is valid", () => {
    const mockUser = { email: "test@example.com", role: "Admin" };
    jwt.verify.mockReturnValue(mockUser);

    checkPermission(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toEqual(mockUser);
  });
});
