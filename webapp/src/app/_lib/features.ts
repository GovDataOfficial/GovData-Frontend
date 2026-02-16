import { getFeatureFlags } from "@/configuration/featureFlags/featureFlags";
import { Feature } from "@/configuration/featureFlags/types";

export function isFeatureEnabled(feature: Feature): boolean {
  const features = getFeatureFlags();
  return !!features[feature];
}
