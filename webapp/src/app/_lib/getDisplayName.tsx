import { fetchOrganizationSorted } from "@/app/_lib/getData";

export async function getOrganizationDisplayName(id: string) {
  const data = await fetchOrganizationSorted();

  if (data) {
    const foundOrg = data.find((org) => org.id === id);
    return foundOrg ? foundOrg.displayName : id;
  }

  return id;
}
