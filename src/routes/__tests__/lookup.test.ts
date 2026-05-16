import { env } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import app from "../../index";

describe("POST /lookup", () => {
  it("returns 400 for missing request body", async () => {
    const response = await app.request("/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
  });

  it("returns 404 for unknown card identifier", async () => {
    const response = await app.request("/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        setCode: "NONEXISTENT",
        collectorNumber: "999",
      }),
    });

    expect(response.status).toBe(404);
  });

  it("returns pricing data for a valid card", async () => {
    const response = await app.request("/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        setCode: "sv1",
        collectorNumber: "025",
      }),
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("cardName");
    expect(data).toHaveProperty("setName");
    expect(data).toHaveProperty("imageURL");
    expect(data).toHaveProperty("tcgplayerURL");
    expect(data).toHaveProperty("prices");
  });
});
