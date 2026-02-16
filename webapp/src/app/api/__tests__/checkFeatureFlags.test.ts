import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  checkEnvVarFeatureFlag,
  checkFeatureFlagForEnvVarDataManagement,
} from "@/app/api/_lib/checkEnvVarFeatureFlags";

describe("checkFeatureFlags", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  describe("checkFeatureFlag", () => {
    it("should return true when all feature flags are enabled", () => {
      vi.stubEnv("test_flag", "1");
      vi.stubEnv("another_flag", "1");

      const result = checkEnvVarFeatureFlag(["test_flag", "another_flag"]);

      expect(result).toBe(true);
    });

    it("should return false when some feature flags are disabled", () => {
      vi.stubEnv("test_flag", "1");
      vi.stubEnv("another_flag", "0");

      const result = checkEnvVarFeatureFlag(["test_flag", "another_flag"]);

      expect(result).toBe(false);
    });

    it("should return false when feature flags are undefined", () => {
      const result = checkEnvVarFeatureFlag(["undefined_flag"]);

      expect(result).toBe(false);
    });

    it("should return true when empty array is provided", () => {
      const result = checkEnvVarFeatureFlag([]);

      expect(result).toBe(true);
    });

    it('should return false when feature flag value is not "1"', () => {
      vi.stubEnv("test_flag", "true");

      const result = checkEnvVarFeatureFlag(["test_flag"]);

      expect(result).toBe(false);
    });
  });

  describe("checkFeatureFlagForDataManagement", () => {
    it("should return true when data_management_active is enabled", () => {
      vi.stubEnv("data_management_active", "1");

      const result = checkFeatureFlagForEnvVarDataManagement();

      expect(result).toBe(true);
    });

    it("should return false when data_management_active is disabled", () => {
      vi.stubEnv("data_management_active", "0");

      const result = checkFeatureFlagForEnvVarDataManagement();

      expect(result).toBe(false);
    });

    it("should return false when data_management_active is undefined", () => {
      const result = checkFeatureFlagForEnvVarDataManagement();

      expect(result).toBe(false);
    });
  });
});
