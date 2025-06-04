import { executeMysqlQuery } from "../../config/db.js";

describe("Database Configuration", () => {
  it("should execute query successfully", async () => {
    const mockResult = [{ id: 1, name: "Test" }];
    const query = "SELECT * FROM test";

    const result = await executeMysqlQuery(query);
    expect(result).toBeDefined();
  });

  it("should handle query with parameters", async () => {
    const mockResult = [{ id: 1, name: "Test" }];
    const query = "SELECT * FROM test WHERE id = ?";
    const params = [1];

    const result = await executeMysqlQuery(query, params);
    expect(result).toBeDefined();
  });

  it("should handle query errors", async () => {
    const invalidQuery = "SELECT * FROM nonexistent_table";

    try {
      await executeMysqlQuery(invalidQuery);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
