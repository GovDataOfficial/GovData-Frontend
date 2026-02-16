import { Feature, type FeatureConfig } from "./types";

export const defaultFeatures: FeatureConfig = {
  [Feature.showSparql]: true,
  [Feature.showUmbrellaBrandHeader]: true,
  [Feature.contributorIdIsRequired]: true,
  [Feature.showcasesEnabled]: true,
  [Feature.needsPrivacyPolicyConsent]: false,
  [Feature.privacyPolicyEnabled]: false,
  [Feature.useBackgroundImage]: true,
  [Feature.showRegionSearch]: true,
  [Feature.showMastodonTeaserBox]: true,
  [Feature.useSocialMediaLinks]: true,
};
