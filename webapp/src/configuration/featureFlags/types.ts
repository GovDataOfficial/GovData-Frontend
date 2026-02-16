export enum Feature {
  showSparql = "showSparql",
  showUmbrellaBrandHeader = "showUmbrellaBrandHeader",
  contributorIdIsRequired = "contributorIdIsRequired",
  showcasesEnabled = "showcasesEnabled",
  needsPrivacyPolicyConsent = "needsPrivacyPolicyConsent",
  privacyPolicyEnabled = "privacyPolicyEnabled",
  useBackgroundImage = "useBackgroundImage",
  showRegionSearch = "showRegionSearch",
  showMastodonTeaserBox = "showMastodonTeaserBox",
  useSocialMediaLinks = "useSocialMediaLinks",
}

export type FeatureConfig = Record<Feature, boolean>;
