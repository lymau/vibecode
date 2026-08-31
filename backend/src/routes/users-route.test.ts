import { describe, expect, it, spyOn } from "bun:test";
import { Elysia } from "elysia";
import { usersRoute } from "./users-route";
import * as usersService from "../services/users-service";

describe("Users Route", () => {
  it("returns 200 and { data: 'OK' } when registration succeeds", async () => {
    const registerSpy = spyOn(usersService, "registerUser").mockResolvedValueOnce({
      success: true,
    });

    const app = new Elysia().use(usersRoute);

    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Billy",
          email: "billy@localhost",
          password: "michelle",
        }),
      })
    );

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result).toEqual({ data: "OK" });
    expect(registerSpy).toHaveBeenCalledWith({
      name: "Billy",
      email: "billy@localhost",
      password: "michelle",
    });
    registerSpy.mockRestore();
  });

  it("returns 400 and { error: 'Email sudah terdaftar' } when email already exists", async () => {
    const registerSpy = spyOn(usersService, "registerUser").mockRejectedValueOnce(
      new Error("Email sudah terdaftar")
    );

    const app = new Elysia().use(usersRoute);

    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Billy",
          email: "billy@localhost",
          password: "michelle",
        }),
      })
    );

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result).toEqual({ error: "Email sudah terdaftar" });
    registerSpy.mockRestore();
  });

  it("returns 422 Unprocessable Entity when request body is invalid", async () => {
    const app = new Elysia().use(usersRoute);

    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Billy",
          // email and password missing
        }),
      })
    );

    expect(response.status).toBe(422);
  });
});

