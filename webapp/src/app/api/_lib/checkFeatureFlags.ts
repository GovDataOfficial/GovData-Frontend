"server-only";

/**
 * Checks if all given feature flags are enabled.
 */
export function checkFeatureFlagForDataManagement(): boolean {
  return checkFeatureFlag(["data_management_active"]);
}

/**
 * Checks if all given feature flags are enabled.
 */
export function checkFeatureFlag(featureFlags: string[]): boolean {
  return featureFlags.every((flag) => process.env[flag] === "1");
}
