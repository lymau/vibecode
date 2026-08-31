import { describe, expect, it } from "bun:test";
import { app } from "./index";

describe("Elysia Server", () => {
  it("returns 200 OK on GET /", async () => {
    const response = await app.handle(new Request("http://localhost/"));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(data.message).toBe("Server is running with Bun and ElysiaJS");
  });

  it("returns healthy on GET /health", async () => {
    const response = await app.handle(new Request("http://localhost/health"));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("healthy");
  });
});

