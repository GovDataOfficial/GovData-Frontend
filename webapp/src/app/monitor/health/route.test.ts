// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("next/headers");

describe("monitor/health", () => {
  it("should correctly respond", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "UP" });
  });
});
