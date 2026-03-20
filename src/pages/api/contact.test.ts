import { describe, it, expect } from "vitest";
import { POST } from "./contact";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  it("accepts a valid inquiry and returns success", async () => {
    const request = makeRequest({
      name: "María García",
      email: "maria@example.com",
      eventType: "Wedding",
      message: "We'd love to host our wedding at the farm next spring.",
    });

    const response = await POST({ request } as Parameters<typeof POST>[0]);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
  });

  it("rejects submission with missing fields and tells user what's wrong", async () => {
    const request = makeRequest({ name: "", email: "bad", eventType: "", message: "" });

    const response = await POST({ request } as Parameters<typeof POST>[0]);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Name is required");
    expect(data.error).toContain("Invalid email format");
    expect(data.error).toContain("Event type is required");
    expect(data.error).toContain("Message is required");
  });

  it("rejects invalid JSON with a clear error", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });

    const response = await POST({ request } as Parameters<typeof POST>[0]);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid JSON." });
  });
});
