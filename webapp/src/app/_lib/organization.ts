import { isFeatureEnabled } from "@/app/_lib/features";
import { fetchOrganizationSorted } from "@/app/_lib/getData";
import { Feature } from "@/configuration/featureFlags/types";
import { OrganizationSorted } from "@/types/types";

export async function getOrganizationDisplayName(id: string) {
  const data = await fetchOrganizationSorted();

  if (data) {
    const foundOrg = data.find((org) => org.id === id);
    return foundOrg ? foundOrg.displayName : id;
  }

  return id;
}

/**
 * Check if the organization has a contributor ID
 */
export function hasContributorId(organizations?: OrganizationSorted): boolean {
  if (!organizations || organizations.length === 0) {
    return false;
  }

  if (isFeatureEnabled(Feature.contributorIdIsRequired)) {
    return organizations.some(
      (org) => org.contributorIds && org.contributorIds.length > 0,
    );
  }
  return true;
}
