"server-only";

/**
 * Checks if all given feature flags are enabled.
 */
export function checkFeatureFlagForEnvVarDataManagement(): boolean {
  return checkEnvVarFeatureFlag(["data_management_active"]);
}

/**
 * Checks if all given feature flags are enabled.
 */
export function checkEnvVarFeatureFlag(featureFlags: string[]): boolean {
  return featureFlags.every((flag) => process.env[flag] === "1");
}
