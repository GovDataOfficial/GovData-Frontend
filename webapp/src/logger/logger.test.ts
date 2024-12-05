import { beforeEach, describe, expect, it, vi } from "vitest";

describe("logger", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_RUNTIME", "edge");
  });

  it("should call process write with necessary fields", async () => {
    const writeMock = vi.fn();
    process.stdout.write = writeMock;

    const { logger } = await import("./logger.js");
    logger("mylogger").info("test");

    const mockCall = writeMock.mock.calls[0][0];
    const mockCallJson = JSON.parse(mockCall.toString());

    expect(mockCallJson.msg).toBe("test");
    expect(mockCallJson.name).toBe("mylogger");
    expect(mockCallJson.levelLabel).toBeDefined();
  });
});
