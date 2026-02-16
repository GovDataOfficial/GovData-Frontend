import { beforeEach, describe, expect, it, vi } from "vitest";

import { defaultFeatures } from "@/configuration/featureFlags/featureFlags.default";

vi.mock("@/configuration/featureFlags/featureFlags.custom", () => ({
  customFeatures: {},
}));

describe("featureFlags", () => {
  beforeEach(() => {
    // Clear module cache to ensure fresh imports
    vi.resetModules();
  });

  it("should load default features when custom features are empty", async () => {
    // Mock empty custom features
    vi.doMock("@/configuration/featureFlags/featureFlags.custom", () => ({
      customFeatures: {},
    }));

    const { getFeatureFlags } = await import(
      "@/configuration/featureFlags/featureFlags"
    );
    expect(getFeatureFlags()).toEqual(defaultFeatures);
  });

  it("should load merged features when custom features exist", async () => {
    const mockCustomFeatures = { someFeature: true };

    // Mock custom features with values
    vi.doMock("@/configuration/featureFlags/featureFlags.custom", () => ({
      customFeatures: mockCustomFeatures,
    }));

    const { getFeatureFlags } = await import(
      "@/configuration/featureFlags/featureFlags"
    );
    expect(getFeatureFlags()).toEqual({
      ...defaultFeatures,
      ...mockCustomFeatures,
    });
  });
});
