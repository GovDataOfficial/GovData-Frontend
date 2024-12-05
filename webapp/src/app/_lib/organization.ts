import { fetchOrganizationSorted } from "@/app/_lib/getData";
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
  if (!organizations) {
    return false;
  }

  return organizations.some(
    (org) => org.contributorIds && org.contributorIds.length > 0,
  );
}
