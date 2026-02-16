import { customFeatures } from "@/configuration/featureFlags/featureFlags.custom";

import { defaultFeatures } from "./featureFlags.default";
import { FeatureConfig } from "./types";

let cachedFeatureFlags: FeatureConfig | null = null;

export function getFeatureFlags(): FeatureConfig {
  if (cachedFeatureFlags) {
    return cachedFeatureFlags;
  }
  cachedFeatureFlags = { ...defaultFeatures, ...customFeatures };
  return cachedFeatureFlags;
}
