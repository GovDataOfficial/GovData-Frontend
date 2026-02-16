import { describe, expect, it } from "vitest";

import { isFeatureEnabled } from "@/app/_lib/features";
import { Feature } from "@/configuration/featureFlags/types";

describe("features", () => {
  it("should return false for unknown feature flags", () => {
    expect(isFeatureEnabled("unknown-feature" as Feature)).toBe(false);
  });
});
