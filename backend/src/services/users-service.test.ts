import { describe, expect, it, spyOn } from "bun:test";
import { registerUser } from "./users-service";
import { db } from "../db";

describe("Users Service", () => {
  it("throws 'Email sudah terdaftar' when user email already exists", async () => {
    const mockWhere = {
      limit: async () => [{ id: 1, email: "existing@localhost" }],
    };
    const mockFrom = {
      where: () => mockWhere,
    };
    const mockSelect = {
      from: () => mockFrom,
    };
    const selectSpy = spyOn(db, "select").mockReturnValue(mockSelect as any);

    await expect(
      registerUser({
        name: "Test",
        email: "existing@localhost",
        password: "secretpassword",
      })
    ).rejects.toThrow("Email sudah terdaftar");

    selectSpy.mockRestore();
  });

  it("hashes password with bcrypt and inserts user when email does not exist", async () => {
    const mockWhere = {
      limit: async () => [],
    };
    const mockFrom = {
      where: () => mockWhere,
    };
    const mockSelect = {
      from: () => mockFrom,
    };
    const selectSpy = spyOn(db, "select").mockReturnValue(mockSelect as any);

    let insertedData: any = null;
    const mockValues = async (data: any) => {
      insertedData = data;
      return [];
    };
    const mockInsertBuilder = { values: mockValues };
    const insertSpy = spyOn(db, "insert").mockReturnValue(mockInsertBuilder as any);

    const result = await registerUser({
      name: "Billy",
      email: "billy@localhost",
      password: "michelle",
    });

    expect(result).toEqual({ success: true });
    expect(insertedData).not.toBeNull();
    expect(insertedData.name).toBe("Billy");
    expect(insertedData.email).toBe("billy@localhost");
    expect(insertedData.password).not.toBe("michelle");

    // Verify the password was hashed using bcrypt
    const isValid = await Bun.password.verify("michelle", insertedData.password);
    expect(isValid).toBe(true);

    selectSpy.mockRestore();
    insertSpy.mockRestore();
  });
});

